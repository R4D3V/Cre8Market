"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUnreadMessageCountAction } from "@/lib/actions/chats";

/** Fired by the chat panel after a thread is read, so badges drop immediately. */
export const UNREAD_CHANGED_EVENT = "cre8:unread-changed";

const POLL_MS = 30_000;

// Shared state: the navbar, bottom nav and dashboards all consume the same
// count, so they only cause one request per refresh.
let currentCount = 0;
const listeners = new Set<(count: number) => void>();
let inflight: Promise<void> | null = null;

function publish(count: number) {
  currentCount = count;
  for (const listener of listeners) listener(count);
}

function refresh() {
  if (inflight) return inflight;
  inflight = fetchUnreadMessageCountAction()
    .then((count) => publish(count))
    .catch(() => {
      // Not signed in yet or offline — keep the last known count.
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/**
 * Live unread-message count for the signed-in party. Returns 0 while signed
 * out, and refreshes on navigation, every 30s (when the tab is visible), and
 * whenever the chat panel marks a thread as read.
 */
export function useUnreadMessageCount(enabled: boolean): number {
  const pathname = usePathname();
  const [count, setCount] = useState(currentCount);

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname intentionally refreshes the count after navigation
  useEffect(() => {
    if (!enabled) {
      setCount(0);
      return;
    }

    listeners.add(setCount);
    setCount(currentCount);
    refresh();

    function onVisible() {
      if (document.visibilityState === "visible") refresh();
    }
    function onChanged() {
      refresh();
    }

    const timer = setInterval(onVisible, POLL_MS);
    window.addEventListener(UNREAD_CHANGED_EVENT, onChanged);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      listeners.delete(setCount);
      clearInterval(timer);
      window.removeEventListener(UNREAD_CHANGED_EVENT, onChanged);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled, pathname]);

  return enabled ? count : 0;
}
