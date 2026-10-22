"use client";

import { useEffect, useState } from "react";

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  // iOS Safari
  if ((window.navigator as { standalone?: boolean }).standalone === true) return true;
  // Standard
  if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) return true;
  return false;
}

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export default function EnableNotificationsButton() {
  const [standalone, setStandalone] = useState<boolean | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "granted" | "denied" | "unsupported">("idle");

  useEffect(() => {
    setStandalone(isStandalone());
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") setStatus("granted");
      else if (Notification.permission === "denied") setStatus("denied");
    } else {
      setStatus("unsupported");
    }
  }, []);

  async function turnOn() {
    if (!("Notification" in window) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    setStatus("loading");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setStatus("denied");
      return;
    }
    try {
      const registration = await navigator.serviceWorker.ready;
      let vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        const res = await fetch("/api/push/notify", { cache: "no-store" });
        const data = await res.json();
        vapidKey = data?.vapidPublicKey;
      }
      if (!vapidKey) {
        setStatus("denied");
        return;
      }
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
      const saveRes = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });
      if (!saveRes.ok) {
        setStatus("denied");
        return;
      }
      setStatus("granted");
    } catch (err) {
      console.error("Push subscription failed:", err);
      setStatus("denied");
    }
  }

  // Avoid hydration mismatch: render nothing until client knows standalone state.
  if (standalone === null) return null;

  if (!standalone) {
    return (
      <div className="neu-card p-4 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">Enable notifications</p>
        <p>
          To receive push notifications on iPhone, first install this app: tap the
          <span className="font-semibold"> Share </span> button, then
          <span className="font-semibold"> Add to Home Screen</span>. Open the app from
          your Home Screen, then come back here to turn on notifications.
        </p>
      </div>
    );
  }

  return (
    <div className="neu-card p-4">
      <p className="font-semibold text-foreground mb-2">Enable notifications</p>
      {status === "granted" ? (
        <p className="text-sm text-primary font-semibold">✓ Notifications enabled</p>
      ) : status === "denied" ? (
        <p className="text-sm text-secondary">
          Notifications blocked — enable them in your browser settings.
        </p>
      ) : status === "unsupported" ? (
        <p className="text-sm text-muted-foreground">
          Push notifications are not supported in this browser.
        </p>
      ) : (
        <button
          onClick={turnOn}
          disabled={status === "loading"}
          className="neu-pill bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-5 py-2.5 text-sm transition-all disabled:opacity-60"
        >
          {status === "loading" ? "Enabling…" : "Turn on notifications"}
        </button>
      )}
    </div>
  );
}