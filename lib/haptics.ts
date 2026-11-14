// Light tap feedback on devices that support it (Android Chrome; iOS Safari
// has no Vibration API, so this is a silent no-op there).
export function haptic(ms = 10): void {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(ms);
    }
  } catch {
    // Not supported or blocked.
  }
}
