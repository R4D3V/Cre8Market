"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Toast {
  id: number;
  title: string;
  body: string;
  url: string;
}

export default function InAppNotificationToast() {
  const router = useRouter();
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const handler = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.type !== "push") return;
      const toast: Toast = {
        id: Date.now() + Math.random(),
        title: data.title || "CRE8MARKET ENTEBBE",
        body: data.body || "",
        url: data.url || "/",
      };
      setToasts((prev) => [...prev, toast]);
      // Auto-dismiss after 6 seconds.
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 6000);
    };

    navigator.serviceWorker.addEventListener("message", handler);
    return () => navigator.serviceWorker.removeEventListener("message", handler);
  }, []);

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
          className="pointer-events-auto neu-card p-4 shadow-lg animate-slide-up cursor-pointer"
          onClick={() => open(t)}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0 leading-none">🔔</span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm text-foreground">{t.title}</p>
              {t.body && (
                <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">
                  {t.body}
                </p>
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