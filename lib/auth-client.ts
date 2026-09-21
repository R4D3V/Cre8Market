"use client";

import { createAuthClient } from "better-auth/react";
import { APP_URL } from "./env";

const baseURL =
  typeof window !== "undefined" ? window.location.origin : APP_URL;

export const authClient = createAuthClient({ baseURL });

type AppSessionUser = {
  id?: string;
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  role?: "admin" | "user";
};

function inferRoleFromEmail(email?: string | null): "admin" | "user" {
  if (!email) return "user";
  return email.endsWith("@cre8market.local") ? "user" : "admin";
}

function normalizeSession(session: any): { user: AppSessionUser } | null {
  if (!session?.user) return null;

  return {
    user: {
      ...session.user,
      role: session.user.role ?? inferRoleFromEmail(session.user.email ?? null),
    },
  };
}

export function useSession(): {
  data: { user: AppSessionUser } | null;
  status: "loading" | "authenticated" | "unauthenticated";
  isPending: boolean;
  isRefetching: boolean;
  error: unknown;
  refetch: () => Promise<void>;
} {
  const result = authClient.useSession() as any;
  const status = result.isPending
    ? "loading"
    : result.data?.user
      ? "authenticated"
      : "unauthenticated";

  return {
    ...result,
    status,
    data: normalizeSession(result.data),
  };
}

export async function getSession() {
  const result = await authClient.getSession();
  return normalizeSession(result?.data ?? null);
}

function toLegacyEmail(phone?: string) {
  const digits = (phone ?? "").replace(/\D/g, "");
  return digits ? `${digits}@cre8market.local` : "";
}

export async function signIn(input: {
  email?: string;
  phone?: string;
  password: string;
  redirect?: boolean;
}) {
  const email = input.email ?? toLegacyEmail(input.phone);
  if (!email) {
    return { error: "Missing credentials" };
  }

  try {
    await fetch("/api/auth/legacy-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: input.phone,
        email: input.email,
      }),
    });

    const result = await authClient.signIn.email({
      email,
      password: input.password,
      rememberMe: true,
    });
    return result;
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Invalid email or password",
    };
  }
}

export async function signOut() {
  return authClient.signOut();
}
