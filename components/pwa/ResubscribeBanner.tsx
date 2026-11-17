"use client";

import { Bell, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  pushSupported,
  resyncPushSubscription,
  usePushSubscription,
} from "@/hooks/usePushSubscription";
import { haptic } from "@/lib/haptics";

const DISMISS_KEY = "cre8-resubscribe-banner-dismissed";
const QUIET_ROUTES = /^\/(admin|dashboard|login|register|reset-password|install|offline)(\/|$)/;

/**
 * One-click banner that helps visitors (re)enable push notifications on the
 * current domain. This matters after a domain change: subscriptions created on
 * the old origin do not deliver to the new one, so users must resubscribe.
 */
export default function ResubscribeBanner() {
  const pathname = usePathname();
  const { status, subscribe } = usePushSubscription();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!pushSupported() || typeof window === "undefined") return;
    if (QUIET_ROUTES.test(pathname)) return;

    // Silently re-register an existing permission (covers domain migration).
    if (Notification.permission === "granted") {
      void resyncPushSubscription();
    }
    if (Notification.permission === "denied") return;

    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      dismissed = false;
    }
    if (dismissed) return;

    const timer = setTimeout(() => {
      // Show when permission is still undecided, or granted but no subscription.
      if (Notification.permission !== "granted" || status === "idle") {
        setShow(true);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [pathname, status]);

  if (!show) return null;

  async function enable() {
    haptic(10);
    const ok = await subscribe();
    if (ok) setShow(false);
  }

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
    setShow(false);
  }

  return (
    <section
      aria-label="Enable notifications"
      className="fixed inset-x-3 z-[90] animate-slide-up top-[calc(env(safe-area-inset-top,0px)+4.5rem)] sm:inset-x-auto sm:right-4 sm:top-20 sm:w-96"
    >
      <div className="neu-dark-card flex items-center gap-3 p-3.5 shadow-2xl">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Bell className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-foreground">Stay in the loop</p>
          <p className="text-xs text-muted-foreground">
            Enable notifications on this device to get new listing alerts.
          </p>
        </div>
        <button
          type="button"
          onClick={enable}
          className="press inline-flex min-h-11 shrink-0 items-center rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground"
        >
          Enable
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Not now"
          className="press -mr-1 grid size-11 shrink-0 place-items-center text-muted-foreground"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
