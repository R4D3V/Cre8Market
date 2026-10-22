"use client";

import { useCallback, useState } from "react";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export type PushStatus = "idle" | "loading" | "granted" | "denied" | "unsupported";

export function usePushSubscription() {
  const [status, setStatus] = useState<PushStatus>("idle");

  const subscribe = useCallback(async () => {
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
  }, []);

  return { status, setStatus, subscribe };
}