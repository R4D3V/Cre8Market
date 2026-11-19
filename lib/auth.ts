import "server-only";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { betterAuth } from "better-auth";
import { toNextJsHandler } from "better-auth/next-js";
import { PostgresDialect } from "kysely";
import { headers } from "next/headers";
import { pool } from "./db/pool";
import { getAdminUserByEmail, getUserByPhone } from "./db/queries";
import { APP_URL } from "./env";
import type { PartyRole } from "./types";

async function verifyPasswordHash(hash: string, password: string): Promise<boolean> {
  if (!hash) return false;

  if (hash.startsWith("$2")) {
    try {
      return await bcrypt.compare(password, hash);
    } catch {
      return false;
    }
  }

  const [salt, key] = hash.split(":");
  if (!salt || !key) return false;

  try {
    const cryptoKey = crypto.scryptSync(password.normalize("NFKC"), salt, 64, {
      N: 16384,
      r: 16,
      p: 1,
      maxmem: 128 * 16384 * 16 * 2,
    });
    return cryptoKey.toString("hex") === key;
  } catch {
    return false;
  }
}

const trustedOrigins = Array.from(
  new Set(
    [
      APP_URL,
      // Local dev aliases so sessions work on either Next.js default port or
      // the legacy 3005 port used by earlier scripts.
      "http://localhost:3000",
      "http://localhost:3005",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3005",
      // Vercel production and preview hosts (set automatically by Vercel).
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : undefined,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
      process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : undefined,
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.APP_URL,
      process.env.AUTH_URL,
      process.env.BETTER_AUTH_URL,
    ]
      .filter(Boolean)
      .map((origin) => (origin as string).trim().replace(/\/+$/, "")),
  ),
);

const appAuth = betterAuth({
  appName: "Cre8Market",
  secret: process.env.AUTH_SECRET ?? process.env.BETTER_AUTH_SECRET ?? "dev-secret-key",
  baseURL: APP_URL,
  trustedOrigins,
  database: new PostgresDialect({ pool }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
    password: {
      hash: async (password: string) => bcrypt.hash(password, 10),
      verify: async ({ hash, password }: { hash: string; password: string }) =>
        verifyPasswordHash(hash, password),
    },
  },
  user: {
    additionalFields: {
      phone: { type: "string", required: false, input: false },
      whatsapp: { type: "string", required: false, input: false },
      role: { type: "string", required: false, input: false },
    },
  },
  databaseHooks: {
    session: {
      create: {
        // A session row is created on every successful sign-in. Stamping the
        // legacy users row here means the dormant-account cleanup only counts
        // real logins, not failed password attempts (legacy-sync runs on those).
        after: async (session) => {
          try {
            await pool.query("UPDATE users SET last_login_at = now() WHERE id = $1", [
              session.userId,
            ]);
          } catch (error) {
            // Never block a sign-in if the migration hasn't been applied yet.
            console.error("Could not record last_login_at:", error);
          }
        },
      },
    },
  },
});

export const authHandler = toNextJsHandler(appAuth);

export async function syncLegacyUserToBetterAuth(phone: string) {
  const user = await getUserByPhone(phone);
  if (!user) return null;

  const email = `${user.phone.replace(/\D/g, "")}@cre8market.local`;

  // The `users` table is the source of truth. If this phone number was deleted
  // and registered again, an orphan mirror row can still hold this email
  // (unique) under the old id, which would make every sign-in fail with an
  // "invalid credentials" error. Clear it — sessions and the credential row
  // cascade away with it — then insert the authoritative row below.
  await pool.query('DELETE FROM "user" WHERE email = $1 AND id <> $2', [email, user.id]);

  await pool.query(
    `INSERT INTO "user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt", phone, whatsapp, role)
     VALUES ($1, $2, $3, true, $4, NOW(), NOW(), $5, $6, $7)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       email = EXCLUDED.email,
       "emailVerified" = EXCLUDED."emailVerified",
       image = EXCLUDED.image,
       phone = EXCLUDED.phone,
       whatsapp = EXCLUDED.whatsapp,
       role = EXCLUDED.role,
       "updatedAt" = NOW()`,
    [
      user.id,
      user.name,
      email,
      user.avatar ?? null,
      user.phone,
      user.whatsapp ?? user.phone,
      // Three parties: admins stay 'admin', accounts flagged as buyers become
      // 'buyer', everyone else is a seller ('user').
      user.is_admin ? "admin" : user.account_type === "buyer" ? "buyer" : "user",
    ],
  );

  const accountId = user.id;
  await pool.query(
    `DELETE FROM "account"
     WHERE "providerId" = 'credential'
       AND "userId" = $1
       AND "accountId" = $2`,
    [user.id, accountId],
  );

  await pool.query(
    `INSERT INTO "account" (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
     VALUES ($1, $2, 'credential', $3, $4, NOW(), NOW())
     ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password, "updatedAt" = NOW()`,
    [accountId, accountId, user.id, user.password_hash],
  );

  return user;
}

export async function syncLegacyAdminToBetterAuth(email: string) {
  const admin = await getAdminUserByEmail(email);
  if (!admin) return null;

  const normalizedEmail = admin.email.trim().toLowerCase();

  // Same reconciliation as the buyer/seller sync: an orphan mirror holding
  // this email under another id would block the insert below.
  await pool.query('DELETE FROM "user" WHERE email = $1 AND id <> $2', [normalizedEmail, admin.id]);

  await pool.query(
    `INSERT INTO "user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt", role)
     VALUES ($1, $2, $3, true, $4, NOW(), NOW(), 'admin')
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       email = EXCLUDED.email,
       "emailVerified" = EXCLUDED."emailVerified",
       image = EXCLUDED.image,
       role = EXCLUDED.role,
       "updatedAt" = NOW()`,
    [admin.id, admin.name ?? "Admin", normalizedEmail, admin.avatar ?? null],
  );

  const accountId = admin.id;
  await pool.query(
    `DELETE FROM "account"
     WHERE "providerId" = 'credential'
       AND "userId" = $1
       AND "accountId" = $2`,
    [admin.id, accountId],
  );

  await pool.query(
    `INSERT INTO "account" (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
     VALUES ($1, $2, 'credential', $3, $4, NOW(), NOW())
     ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password, "updatedAt" = NOW()`,
    [accountId, accountId, admin.id, admin.password_hash],
  );

  return admin;
}

async function authSessionFromHeaders() {
  const session = await appAuth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const user = session.user as Record<string, unknown>;
  const email = typeof user.email === "string" ? user.email : null;
  const adminLookup = email ? await getAdminUserByEmail(email) : null;

  return {
    user: {
      id: String(user.id ?? ""),
      name: String(user.name ?? ""),
      email,
      phone: typeof user.phone === "string" ? user.phone : null,
      whatsapp: typeof user.whatsapp === "string" ? user.whatsapp : null,
      role: (user.role as PartyRole) ?? (adminLookup ? "admin" : "user"),
    },
  };
}

export async function auth() {
  return authSessionFromHeaders();
}
