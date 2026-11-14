"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

// Slim banner under the status bar. Replaces the library's reload-on-reconnect
// so a half-filled form isn't thrown away when the connection comes back.
export default function NetworkStatus() {
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
  const [showBack, setShowBack] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!online) {
      wasOffline.current = true;
      return;
    }
    if (!wasOffline.current) return;
    wasOffline.current = false;
    const show = setTimeout(() => setShowBack(true), 0);
    const hide = setTimeout(() => setShowBack(false), 2600);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [online]);

  if (online && !showBack) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-x-0 top-0 z-[250] text-center text-xs font-semibold ${
        online ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="py-1.5">
        {online ? "Back online" : "You're offline — showing saved pages"}
      </div>
    </div>
  );
}
