import "server-only";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { betterAuth } from "better-auth";
import { toNextJsHandler } from "better-auth/next-js";
import { PostgresDialect } from "kysely";
import { headers } from "next/headers";
import { pool } from "./db/pool";
import { getAdminUserByEmail, getUserByPhone } from "./db/queries";

async function verifyPasswordHash(
  hash: string,
  password: string,
): Promise<boolean> {
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

const appBaseUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.APP_URL ??
  process.env.AUTH_URL ??
  "http://localhost:3005";

const trustedOrigins = Array.from(
  new Set(
    [
      appBaseUrl,
      "http://localhost:3000",
      "http://localhost:3005",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3005",
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.APP_URL,
      process.env.AUTH_URL,
    ].filter(Boolean) as string[],
  ),
);

const appAuth = betterAuth({
  appName: "Cre8Market",
  secret:
    process.env.AUTH_SECRET ??
    process.env.BETTER_AUTH_SECRET ??
    "dev-secret-key",
  baseURL: appBaseUrl,
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
});

export const authHandler = toNextJsHandler(appAuth);

export async function syncLegacyUserToBetterAuth(phone: string) {
  const user = await getUserByPhone(phone);
  if (!user) return null;

  const email = `${user.phone.replace(/\D/g, "")}@cre8market.local`;
  await pool.query(
    `INSERT INTO "user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt", phone, whatsapp, role)
     VALUES ($1, $2, $3, true, NULL, NOW(), NOW(), $4, $5, $6)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       email = EXCLUDED.email,
       "emailVerified" = EXCLUDED."emailVerified",
       phone = EXCLUDED.phone,
       whatsapp = EXCLUDED.whatsapp,
       role = EXCLUDED.role,
       "updatedAt" = NOW()`,
    [
      user.id,
      user.name,
      email,
      user.phone,
      user.whatsapp ?? user.phone,
      user.is_admin ? "admin" : "user",
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
    [admin.id, admin.name ?? "Admin", admin.email, admin.avatar ?? null],
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

export async function authSessionFromHeaders() {
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
      role: (user.role as "admin" | "user") ?? (adminLookup ? "admin" : "user"),
    },
  };
}

export async function auth() {
  return authSessionFromHeaders();
}
