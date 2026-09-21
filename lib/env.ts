export const DEFAULT_APP_URL = "http://localhost:3000";

// Central resolution of the app's public base URL. `NEXT_PUBLIC_APP_URL` is the
// only variant inlined into client bundles; the others are server-only.
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.APP_URL ??
  process.env.AUTH_URL ??
  DEFAULT_APP_URL;