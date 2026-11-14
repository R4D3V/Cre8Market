"use client";

import { SerwistProvider } from "@serwist/turbopack/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SerwistProvider
      swUrl="/serwist/sw.js"
      // Offline caching is production-only; in dev the worker would only get in the way.
      disable={process.env.NODE_ENV !== "production"}
      // The default reloads the page whenever the connection returns, which
      // would wipe a half-filled listing form. OfflineBanner handles this instead.
      reloadOnOnline={false}
    >
      {children}
    </SerwistProvider>
  );
}
