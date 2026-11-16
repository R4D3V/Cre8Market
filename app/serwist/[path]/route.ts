import { createSerwistRoute } from "@serwist/turbopack";

// Builds app/sw.ts and serves it at /serwist/sw.js (see SerwistProvider in
// components/Providers.tsx). Works with Next's default Turbopack build.
export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    swSrc: "app/sw.ts",
    useNativeEsbuild: true,
  });
