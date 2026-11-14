"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, X } from "lucide-react";
import { pushSupported, resyncPushSubscription, usePushSubscription } from "@/hooks/usePushSubscription";
import { haptic } from "@/lib/haptics";
import { DAY_MS, isStandalone, readNumber, writeStorage } from "@/lib/pwa";

const LAUNCHES_KEY = "cre8-app-launches";
const LAUNCH_FLAG = "cre8-launch-counted";
const SNOOZE_KEY = "cre8-notif-snooze-until";
const DISMISSALS_KEY = "cre8-notif-dismissals";
const SNOOZE_DAYS = 30;
const MAX_DISMISSALS = 2;

const QUIET_ROUTES = /^\/(admin|dashboard|login|register|reset-password|install|offline)(\/|$)/;

/**
 * Asks for notification permission the way iOS requires: only inside the
 * installed app, only after a few launches, and only from a tap on this card
 * (never automatically, never as a side effect of closing another prompt).
 */
export default function NotificationPrompt() {
  const pathname = usePathname();
  const { status, subscribe } = usePushSubscription();
  const [eligible, setEligible] = useState(false);

  useEffect(() => {
    if (!isStandalone() || !pushSupported()) return;

    // Already allowed: just make sure the server still has this device.
    if (Notification.permission === "granted") {
      void resyncPushSubscription();
      return;
    }
    if (Notification.permission !== "default") return;

    try {
      if (!sessionStorage.getItem(LAUNCH_FLAG)) {
        sessionStorage.setItem(LAUNCH_FLAG, "1");
        writeStorage(LAUNCHES_KEY, String(readNumber(LAUNCHES_KEY) + 1));
      }
    } catch {
      // ignore
    }

    if (readNumber(LAUNCHES_KEY) < 2) return;
    if (readNumber(DISMISSALS_KEY) >= MAX_DISMISSALS) return;
    if (Date.now() < readNumber(SNOOZE_KEY)) return;

    const timer = setTimeout(() => setEligible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const show = eligible && status === "idle" && !QUIET_ROUTES.test(pathname);
  if (!show) return null;

  function later() {
    writeStorage(DISMISSALS_KEY, String(readNumber(DISMISSALS_KEY) + 1));
    writeStorage(SNOOZE_KEY, String(Date.now() + SNOOZE_DAYS * DAY_MS));
    setEligible(false);
  }

  async function turnOn() {
    haptic(10);
    const ok = await subscribe();
    if (ok) setEligible(false);
  }

  return (
    <section
      aria-label="Turn on notifications"
      className="fixed inset-x-3 z-[100] animate-slide-up bottom-[calc(env(safe-area-inset-bottom,0px)+5.25rem)] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-96"
    >
      <div className="neu-dark-card flex items-center gap-3 p-3.5 shadow-2xl">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Bell className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-foreground">Never miss a deal</p>
          <p className="text-xs text-muted-foreground">Get alerts for new deals and seller replies.</p>
        </div>
        <button
          type="button"
          onClick={turnOn}
          className="press inline-flex min-h-11 shrink-0 items-center rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground"
        >
          Turn on
        </button>
        <button
          type="button"
          onClick={later}
          aria-label="Not now"
          className="press -mr-1 grid size-11 shrink-0 place-items-center text-muted-foreground"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
