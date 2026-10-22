import { z } from "zod";

export const DEFAULT_APP_URL = "http://localhost:3000";

// Central resolution of the app's public base URL. `NEXT_PUBLIC_APP_URL` is the
// only variant inlined into client bundles; the others are server-only.
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.APP_URL ??
  process.env.AUTH_URL ??
  DEFAULT_APP_URL;

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