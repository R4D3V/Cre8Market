"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface Toast {
  id: number;
  title: string;
  body: string;
  url: string;
}

interface NewProductEvent {
  slug: string;
  title: string;
  price: string;
  createdAt: string;
}

const CURSOR_KEY = "cre8:product-toast-cursor";
const POLL_MS = 30_000;
// Web push and the poller can both announce the same listing; remember toast
// URLs briefly so the user never sees the same product twice.
const DEDUPE_MS = 2 * 60_000;

export default function InAppNotificationToast() {
  const router = useRouter();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const recentUrls = useRef(new Map<string, number>());

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    // Never surface in-app toasts while the browser is offline.
    if (typeof navigator !== "undefined" && !navigator.onLine) return;
    const now = Date.now();
    if ((recentUrls.current.get(toast.url) ?? 0) > now) return;
    recentUrls.current.set(toast.url, now + DEDUPE_MS);
    const id = now + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
    // Auto-dismiss after 6 seconds.
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const handler = (event: MessageEvent) => {
      const data = event.data;
      if (data?.type !== "push") return;
      addToast({
        title: data.title || "CRE8MARKET ENTEBBE",
        body: data.body || "",
        url: data.url || "/",
      });
    };

    navigator.serviceWorker.addEventListener("message", handler);
    return () => navigator.serviceWorker.removeEventListener("message", handler);
  }, [addToast]);

  // Poll for newly listed products so every open browser sees a toast even
  // without web-push permission (and in dev, where the service worker is off).
  useEffect(() => {
    let cancelled = false;

    async function poll() {
      // Skip polling while offline; the browser will retry when back online.
      if (typeof navigator !== "undefined" && !navigator.onLine) return;
      let cursor: string | null = null;
      try {
        cursor = window.localStorage.getItem(CURSOR_KEY);
      } catch {
        // Storage can be unavailable (private mode); fall back to session-only.
      }
      try {
        const res = await fetch(
          cursor ? `/api/new-products?after=${encodeURIComponent(cursor)}` : "/api/new-products",
          { cache: "no-store" },
        );
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { products: NewProductEvent[]; cursor: string };
        if (cancelled) return;
        try {
          window.localStorage.setItem(CURSOR_KEY, data.cursor);
        } catch {
          // Ignore persistence failures; toasts still work this session.
        }
        // First visit: only initialize the cursor, never toast history.
        if (!cursor) return;
        for (const p of data.products) {
          addToast({
            title: "New Product Added!",
            body: `${p.title} — UGX ${Number(p.price).toLocaleString()}`,
            url: `/products/${p.slug}`,
          });
        }
      } catch {
        // Offline or server hiccup — try again on the next tick.
      }
    }

    function pollIfVisible() {
      if (document.visibilityState === "visible" && navigator.onLine) poll();
    }

    poll();
    const interval = setInterval(pollIfVisible, POLL_MS);
    document.addEventListener("visibilitychange", pollIfVisible);
    const clearOnOffline = () => setToasts([]);
    // Resume polling as soon as connectivity returns.
    window.addEventListener("online", pollIfVisible);
    window.addEventListener("offline", clearOnOffline);
    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", pollIfVisible);
      window.removeEventListener("online", pollIfVisible);
      window.removeEventListener("offline", clearOnOffline);
    };
  }, [addToast]);

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function open(toast: Toast) {
    dismiss(toast.id);
    router.push(toast.url);
  }

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="button"
          tabIndex={0}
          className="pointer-events-auto neu-card p-4 shadow-lg animate-slide-up cursor-pointer"
          onClick={() => open(t)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              open(t);
            }
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0 leading-none">🔔</span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm text-foreground">{t.title}</p>
              {t.body && (
                <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{t.body}</p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismiss(t.id);
              }}
              className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none shrink-0"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
