"use client";

import { useSyncExternalStore, useState, useEffect } from "react";
import { usePushSubscription } from "@/hooks/usePushSubscription";
import { isIOS, isStandalone } from "@/lib/pwa";

const noopSubscribe = () => () => {};

export default function EnableNotificationsButton() {
  const { status, subscribe, unsubscribe } = usePushSubscription();
  const [successToast, setSuccessToast] = useState(false);

  // null on the server and during hydration, so the markup always matches.
  const env = useSyncExternalStore(
    noopSubscribe,
    () => (isStandalone() ? "standalone" : isIOS() ? "ios" : "browser"),
    () => null,
  );

  // Auto-hide the success toast.
  useEffect(() => {
    if (!successToast) return;
    const timer = setTimeout(() => setSuccessToast(false), 4000);
    return () => clearTimeout(timer);
  }, [successToast]);

  if (env === null) return null;

  // iPhone/iPad only allow push for apps added to the Home Screen.
  if (env === "ios") {
    return (
      <div className="neu-card p-4 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">Enable notifications</p>
        <p>
          On iPhone, notifications need the installed app: tap the
          <span className="font-semibold"> Share </span> button, then
          <span className="font-semibold"> Add to Home Screen</span>. Open the app from
          your Home Screen, then come back here to turn on notifications.
        </p>
      </div>
    );
  }

  async function handleSubscribe() {
    const ok = await subscribe();
    if (ok) setSuccessToast(true);
  }

  return (
    <div className="neu-card p-4 w-full text-center">
      <p className="font-semibold text-foreground mb-2">Enable notifications</p>
      {status === "granted" ? (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <p className="text-sm text-primary font-semibold">✓ Notifications enabled</p>
          <button
            type="button"
            onClick={unsubscribe}
            className="press min-h-11 text-sm font-semibold text-muted-foreground underline underline-offset-4"
          >
            Turn off
          </button>
        </div>
      ) : status === "denied" ? (
        <p className="text-sm text-secondary">
          Notifications are blocked — allow them in your browser or phone settings, then come back.
        </p>
      ) : status === "unsupported" ? (
        <p className="text-sm text-muted-foreground">
          Push notifications are not supported in this browser or environment.
        </p>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={status === "loading"}
          className="neu-pill press bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-5 py-3 text-sm transition-all disabled:opacity-60 w-full sm:w-auto"
        >
          {status === "loading" ? "Enabling…" : "Turn on notifications"}
        </button>
      )}

      {successToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] neu-card px-4 py-3 shadow-lg animate-slide-up pointer-events-auto max-w-sm w-[calc(100%-2rem)]"
        >
          <p className="text-sm font-semibold text-primary text-center">
            ✓ Notifications enabled successfully
          </p>
        </div>
      )}
    </div>
  );
}