"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Download, Share, SquarePlus, X } from "lucide-react";
import BottomSheet from "@/components/BottomSheet";
import { useInstall } from "@/hooks/useInstall";
import { haptic } from "@/lib/haptics";
import { DAY_MS, readNumber, writeStorage } from "@/lib/pwa";

const SESSIONS_KEY = "cre8-visit-sessions";
const SESSION_FLAG = "cre8-session-counted";
const SNOOZE_KEY = "cre8-install-snooze-until";
const DISMISSALS_KEY = "cre8-install-dismissals";

const SNOOZE_DAYS = 14;
const MAX_DISMISSALS = 3;
const SHOW_DELAY_MS = 4000;

// Never interrupt forms, sign-in, or the pages that already explain installing.
const QUIET_ROUTES = /^\/(admin|dashboard|login|register|reset-password|install|offline)(\/|$)/;

function countSessionOnce() {
  try {
    if (sessionStorage.getItem(SESSION_FLAG)) return;
    sessionStorage.setItem(SESSION_FLAG, "1");
    writeStorage(SESSIONS_KEY, String(readNumber(SESSIONS_KEY) + 1));
  } catch {
    // Storage unavailable: treat every visit as a first visit.
  }
}

/**
 * A polite install nudge. It waits until the visitor has shown interest
 * (a return visit, or three pages viewed), stays quiet on forms, and backs off
 * for two weeks after each "Not now".
 */
export default function InstallPrompt() {
  const pathname = usePathname();
  const { canInstall, installed, ios, promptInstall } = useInstall();
  const [visible, setVisible] = useState(false);
  const [iosHelpOpen, setIosHelpOpen] = useState(false);
  const pageViews = useRef(0);

  useEffect(() => {
    countSessionOnce();
  }, []);

  useEffect(() => {
    pageViews.current += 1;
  }, [pathname]);

  useEffect(() => {
    if (installed || visible) return;
    if (!canInstall && !ios) return;
    if (QUIET_ROUTES.test(pathname)) return;
    if (readNumber(DISMISSALS_KEY) >= MAX_DISMISSALS) return;
    if (Date.now() < readNumber(SNOOZE_KEY)) return;

    const engaged = readNumber(SESSIONS_KEY) >= 2 || pageViews.current >= 3;
    if (!engaged) return;

    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname, canInstall, ios, installed, visible]);

  function snooze() {
    writeStorage(DISMISSALS_KEY, String(readNumber(DISMISSALS_KEY) + 1));
    writeStorage(SNOOZE_KEY, String(Date.now() + SNOOZE_DAYS * DAY_MS));
    setVisible(false);
  }

  async function handleInstall() {
    haptic(10);
    if (ios && !canInstall) {
      setIosHelpOpen(true);
      return;
    }
    const outcome = await promptInstall();
    if (outcome === "dismissed") snooze();
    else setVisible(false);
  }

  const show = visible && !installed && !QUIET_ROUTES.test(pathname) && (canInstall || ios);

  return (
    <>
      {show && (
        <section
          aria-label="Install the app"
          className="fixed inset-x-3 z-[100] animate-slide-up bottom-[calc(env(safe-area-inset-bottom,0px)+5.25rem)] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-96"
        >
          <div className="neu-dark-card flex items-center gap-3 p-3.5 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon-192.png" alt="" className="size-12 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-foreground">Get the Cre8Market app</p>
              <p className="text-xs text-muted-foreground">Faster, full-screen, and works offline.</p>
            </div>
            <button
              type="button"
              onClick={handleInstall}
              className="press inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground"
            >
              <Download className="size-4" aria-hidden="true" />
              {ios && !canInstall ? "How" : "Install"}
            </button>
            <button
              type="button"
              onClick={snooze}
              aria-label="Not now"
              className="press -mr-1 grid size-11 shrink-0 place-items-center text-muted-foreground"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        </section>
      )}

      <BottomSheet open={iosHelpOpen} onClose={() => setIosHelpOpen(false)} title="Add to Home Screen">
        <ol className="space-y-4 pt-1 text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <Share className="size-5" aria-hidden="true" />
            </span>
            <span>
              Tap the <strong className="text-foreground">Share</strong> button in your browser&apos;s toolbar.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <SquarePlus className="size-5" aria-hidden="true" />
            </span>
            <span>
              Scroll down and choose <strong className="text-foreground">Add to Home Screen</strong>, then tap{" "}
              <strong className="text-foreground">Add</strong>.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <Download className="size-5" aria-hidden="true" />
            </span>
            <span>
              Open <strong className="text-foreground">Cre8Market</strong> from your Home Screen. You can then turn on
              notifications for deals and seller replies.
            </span>
          </li>
        </ol>
      </BottomSheet>
    </>
  );
}
