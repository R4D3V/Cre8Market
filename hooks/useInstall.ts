"use client";

import { useSyncExternalStore } from "react";
import { isIOS, isStandalone, readStorage, writeStorage } from "@/lib/pwa";

// Chrome/Edge/Samsung Internet fire `beforeinstallprompt` once, often before
// React has hydrated. A module-level listener catches it no matter when a
// component mounts, then hands it to whichever button wants it.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallState {
  /** The browser has offered a native install prompt we can trigger. */
  canInstall: boolean;
  /** Running as an installed app, or the user installed it earlier. */
  installed: boolean;
  /** iPhone/iPad: no install API, so we show manual instructions instead. */
  ios: boolean;
}

const INSTALLED_KEY = "cre8-app-installed";
const SERVER_STATE: InstallState = { canInstall: false, installed: false, ios: false };

let deferred: BeforeInstallPromptEvent | null = null;
let state: InstallState = SERVER_STATE;
const listeners = new Set<() => void>();

function recompute() {
  state = {
    canInstall: deferred !== null,
    installed: isStandalone() || readStorage(INSTALLED_KEY) === "1",
    ios: isIOS(),
  };
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  state = {
    canInstall: false,
    installed: isStandalone() || readStorage(INSTALLED_KEY) === "1",
    ios: isIOS(),
  };
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // we show our own, better-timed prompt
    deferred = e as BeforeInstallPromptEvent;
    recompute();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    writeStorage(INSTALLED_KEY, "1");
    recompute();
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function promptInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
  const event = deferred;
  if (!event) return "unavailable";
  await event.prompt();
  const { outcome } = await event.userChoice;
  deferred = null; // a prompt event can only be used once
  recompute();
  return outcome;
}

export function useInstall(): InstallState & { promptInstall: typeof promptInstall } {
  const current = useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER_STATE,
  );
  return { ...current, promptInstall };
}
