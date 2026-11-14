// Small browser helpers for PWA behaviour. Client-only: every function guards
// for the server so it is safe to import anywhere.

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if ((window.navigator as Navigator & { standalone?: boolean }).standalone === true) return true;
  return window.matchMedia?.("(display-mode: standalone)").matches ?? false;
}

export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  // iPadOS 13+ reports itself as a Mac.
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked (private mode); the feature just won't remember.
  }
}

export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function readNumber(key: string, fallback = 0): number {
  const raw = readStorage(key);
  const n = raw == null ? NaN : Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

export const DAY_MS = 24 * 60 * 60 * 1000;
