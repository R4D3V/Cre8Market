"use client";

import { useCallback, useEffect, useState } from "react";

export type PushStatus = "idle" | "loading" | "granted" | "denied" | "unsupported";

export function pushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

// The server holds the authoritative key, so a missing build-time
// NEXT_PUBLIC_VAPID_PUBLIC_KEY doesn't silently break subscriptions.
async function getVapidKey(): Promise<string | undefined> {
  if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch("/api/push/notify", { cache: "no-store", signal: controller.signal });
    const data = await res.json();
    return data?.vapidPublicKey ?? undefined;
  } catch {
    return undefined;
  } finally {
    clearTimeout(timer);
  }
}

async function saveToServer(subscription: PushSubscription): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription.toJSON()),
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/** Create (or reuse) this device's subscription and make sure the server has it. */
async function waitForServiceWorker(timeoutMs = 8000): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), timeoutMs);
    navigator.serviceWorker.ready
      .then((reg) => {
        clearTimeout(timer);
        resolve(reg);
      })
      .catch(() => {
        clearTimeout(timer);
        resolve(null);
      });
  });
}

async function ensureSubscribed(): Promise<boolean> {
  const registration = await waitForServiceWorker();
  if (!registration) return false;
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    const vapidKey = await getVapidKey();
    if (!vapidKey) return false;
    try {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
    } catch {
      return false;
    }
  }
  return saveToServer(subscription);
}

export function usePushSubscription() {
  const [status, setStatus] = useState<PushStatus>("idle");

  // Reflect the browser's current permission (and whether a subscription exists).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let next: PushStatus = "idle";
      if (!pushSupported()) next = "unsupported";
      else if (Notification.permission === "denied") next = "denied";
      else if (Notification.permission === "granted") {
        const registration = await waitForServiceWorker();
        next = registration && (await registration.pushManager.getSubscription()) ? "granted" : "idle";
      }
      if (!cancelled) setStatus(next);
    })().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  /** Must be called from a tap/click: iOS refuses permission prompts otherwise. */
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!pushSupported()) {
      setStatus("unsupported");
      return false;
    }
    setStatus("loading");
    try {
      const permission =
        Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
      if (permission !== "granted") {
        // "default" means the prompt was closed without choosing: not a block.
        setStatus(permission === "denied" ? "denied" : "idle");
        return false;
      }
      const readyReg = await waitForServiceWorker(5000);
      if (!readyReg) {
        setStatus("unsupported");
        return false;
      }
      const ok = await ensureSubscribed();
      setStatus(ok ? "granted" : "idle");
      return ok;
    } catch (err) {
      console.error("Push subscription failed:", err);
      setStatus("idle");
      return false;
    }
  }, []);

  const unsubscribe = useCallback(async (): Promise<void> => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        }).catch(() => {});
        await subscription.unsubscribe();
      }
      setStatus("idle");
    } catch (err) {
      console.error("Push unsubscribe failed:", err);
    }
  }, []);

  return { status, setStatus, subscribe, unsubscribe };
}

/**
 * Quietly re-register this device with the server when permission was already
 * granted (covers a cleared database or a rotated subscription). Never prompts.
 */
export async function resyncPushSubscription(): Promise<void> {
  if (!pushSupported() || Notification.permission !== "granted") return;
  try {
    await ensureSubscribed();
  } catch {
    // Best effort only.
  }
}
