/**
 * Haptic & Audio Feedback Utilities
 * Re-exports Web Audio feedback functions and provides navigator.vibrate integration.
 */
import { playPop, playClick, playHeroCtaClick, playPersonaSwitch } from "@/lib/audio";

export { playPop, playClick, playHeroCtaClick, playPersonaSwitch };

export const playSuccess = playHeroCtaClick;
export const playError = playClick;
export const playSubtleClick = playClick;

export function triggerHapticFeedback(pattern: number | number[] = 10): void {
  if (typeof window !== "undefined" && "navigator" in window && typeof window.navigator.vibrate === "function") {
    try {
      window.navigator.vibrate(pattern);
    } catch {
      // Ignore vibration errors on unsupported environments
    }
  }
}
