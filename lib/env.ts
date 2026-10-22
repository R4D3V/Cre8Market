import { z } from "zod";

export const DEFAULT_APP_URL = "http://localhost:3000";

function deployedUrl(): string | undefined {
  // Vercel exposes the deployment host and the stable production domain without
  // a protocol. On preview deployments use the preview host; in production
  // prefer the stable production domain.
  const host =
    process.env.VERCEL_ENV === "production"
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
      : process.env.VERCEL_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return host ? `https://${host}` : undefined;
}

function firstUrl(...values: (string | undefined)[]): string | undefined {
  return values
    .map((value) => value?.trim())
    .find((value) => Boolean(value))
    ?.replace(/\/+$/, "");
}

// Central resolution of the app's public base URL. `NEXT_PUBLIC_APP_URL` is the
// only variant inlined into client bundles; the others are server-only.
export const APP_URL =
  firstUrl(
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.APP_URL,
    process.env.AUTH_URL,
    process.env.BETTER_AUTH_URL,
    deployedUrl(),
  ) ?? DEFAULT_APP_URL;

const serverSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  OPENAI_API_KEY: z.string().optional(),
  VAPID_PUBLIC_KEY: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string().optional(),
  ADMIN_RESET_PIN: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

// Validate server env only on the server (never in the browser bundle).
if (typeof window === "undefined") {
  try {
    serverSchema.parse(process.env);
  } catch (err) {
    console.error("Environment validation failed:", err);
  }
}