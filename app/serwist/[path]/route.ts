import crypto from "node:crypto";
import { createSerwistRoute } from "@serwist/turbopack";

// Revision for precached public files: changes on every deploy so they refresh.
const revision = process.env.VERCEL_GIT_COMMIT_SHA ?? crypto.randomUUID();

// Builds app/sw.ts and serves it at /serwist/sw.js (see SerwistProvider in
// components/Providers.tsx). Works with Next's default Turbopack build.
export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    additionalPrecacheEntries: [
      { url: "/offline.html", revision },
      { url: "/brand/cre8-market-logo-transparent.svg", revision },
      { url: "/icons/icon-192.png", revision },
    ],
    swSrc: "app/sw.ts",
    useNativeEsbuild: true,
  });
