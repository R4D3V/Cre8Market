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

function normalizeSession(session: unknown): { user: AppSessionUser } | null {
  const s = session as { user?: AppSessionUser & { role?: string; email?: string | null } } | null;
  if (!s?.user) return null;

  return {
    user: {
      ...s.user,
      role: (s.user.role as "admin" | "user" | undefined) ?? inferRoleFromEmail(s.user.email ?? null),
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
  const result = authClient.useSession() as {
    data?: { user?: AppSessionUser } | null;
    isPending?: boolean;
    isRefetching?: boolean;
    error?: unknown;
    refetch?: () => Promise<void>;
  };
  const status = result.isPending
    ? "loading"
    : result.data?.user
      ? "authenticated"
      : "unauthenticated";

  return {
    ...result,
    status,
    isPending: result.isPending ?? false,
    isRefetching: result.isRefetching ?? false,
    error: result.error ?? null,
    refetch: result.refetch ?? (async () => {}),
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

export type SignInError = {
  message: string;
  status?: number;
  code?: string;
};

export type SignInResult = {
  data?: unknown;
  error?: SignInError;
};

export async function signIn(input: {
  email?: string;
  phone?: string;
  password: string;
  redirect?: boolean;
}): Promise<SignInResult> {
  const rawEmail = input.email ?? toLegacyEmail(input.phone);
  const email = rawEmail.trim().toLowerCase();
  if (!email) {
    return { error: { message: "Missing credentials" } };
  }

  try {
    const syncResponse = await fetch("/api/auth/legacy-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: input.phone,
        email: input.email,
      }),
    });

    if (!syncResponse.ok) {
      const body = (await syncResponse.json().catch(() => null)) as {
        error?: string;
      } | null;
      return {
        error: {
          message:
            body?.error ?? "Could not prepare your account for sign-in.",
          status: syncResponse.status,
        },
      };
    }

    const result = await authClient.signIn.email({
      email,
      password: input.password,
      rememberMe: true,
    });

    if (result?.error) {
      const err = result.error as {
        message?: string;
        status?: number;
        code?: string;
      };
      return {
        error: {
          message: err?.message ?? "Invalid email or password",
          status: err?.status,
          code: err?.code,
        },
      };
    }

    return { data: result?.data };
  } catch (error) {
    return {
      error: {
        message:
          error instanceof Error ? error.message : "Invalid email or password",
      },
    };
  }
}

export async function signOut() {
  return authClient.signOut();
}
