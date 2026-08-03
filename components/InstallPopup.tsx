"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LS_KEY = "cre8market-pwa-dismissed";
const NOTIF_KEY = "cre8market-notif-enabled";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export default function InstallPopup() {
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [notifStatus, setNotifStatus] = useState<"idle" | "granted" | "denied" | "loading">("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(LS_KEY)) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const timer = setTimeout(() => setVisible(true), 2000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, []);

  async function subscribeToPush() {
    if (!("Notification" in window) || !("PushManager" in window)) return;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setNotifStatus("denied");
      return;
    }

    setNotifStatus("loading");

    try {
      const registration = await navigator.serviceWorker.ready;
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        setNotifStatus("denied");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });

      localStorage.setItem(NOTIF_KEY, "1");
      setNotifStatus("granted");
    } catch {
      setNotifStatus("denied");
    }
  }

  async function handleInstall() {
    setInstalling(true);

    if (deferredPrompt) {
      const prompt = deferredPrompt as Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
      prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === "accepted") {
        localStorage.setItem(LS_KEY, "1");
      }
      setDeferredPrompt(null);
      setVisible(false);
      setInstalling(false);
      // Ask for notifications after install
      setTimeout(() => subscribeToPush(), 500);
    } else {
      localStorage.setItem(LS_KEY, "1");
      setVisible(false);
      setInstalling(false);
      router.push("/install");
    }
  }

  function handleDismiss() {
    setVisible(false);
    localStorage.setItem(LS_KEY, "1");
    // Ask for notifications on dismiss too
    setTimeout(() => subscribeToPush(), 500);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
      <div
        className="absolute inset-0 bg-black/30 pointer-events-auto"
        onClick={handleDismiss}
      />
      <div className="relative pointer-events-auto neu-dark-card text-white mx-3 sm:mx-auto sm:max-w-md w-full p-5 rounded-2xl mb-4 sm:mb-0 animate-slide-up">
        <div className="flex items-start gap-3">
          <span className="text-3xl shrink-0 leading-none">📲</span>
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-sm">Install CRE8MARKET ENTEBBE</p>
            <p className="text-white/55 text-xs mt-0.5">
              Get faster access, offline browsing, and notifications.
            </p>
            {notifStatus === "granted" && (
              <p className="text-accent text-xs mt-1 font-semibold">
                ✓ Notifications enabled
              </p>
            )}
            {notifStatus === "denied" && (
              <p className="text-amber-400 text-xs mt-1">
                Notifications blocked — enable in browser settings
              </p>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/40 hover:text-white transition-colors text-lg leading-none shrink-0"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleInstall}
            disabled={installing}
            className="neu-dark-pill bg-accent hover:bg-accent-dark text-navy font-bold text-sm px-5 py-2.5 transition-all flex-1 disabled:opacity-60"
          >
            {installing ? "Installing…" : "📲 Install App"}
          </button>
          <button
            onClick={handleDismiss}
            className="text-white/50 hover:text-white text-xs font-medium transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
