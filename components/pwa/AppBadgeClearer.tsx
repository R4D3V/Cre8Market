"use client";

import { useEffect } from "react";

type BadgeNavigator = Navigator & { clearAppBadge?: () => Promise<void> };

// The service worker puts a dot on the app icon when a push arrives.
// Clear it whenever the app is opened or brought back to the foreground.
export default function AppBadgeClearer() {
  useEffect(() => {
    const clear = () => {
      if (document.visibilityState !== "visible") return;
      (navigator as BadgeNavigator).clearAppBadge?.().catch(() => {});
    };
    clear();
    document.addEventListener("visibilitychange", clear);
    return () => document.removeEventListener("visibilitychange", clear);
  }, []);
  return null;
}
