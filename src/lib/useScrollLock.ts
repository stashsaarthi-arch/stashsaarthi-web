import { useEffect } from "react";

// Global reference count for active modals to handle nested modals safely
let activeScrollLockCount = 0;
let originalOverflow = "";
let originalPaddingRight = "";

/**
 * Helper to calculate scrollbar width to prevent layout shift when body scrollbar disappears
 */
export function getScrollbarWidth(): number {
  if (typeof window === "undefined") return 0;
  return window.innerWidth - document.documentElement.clientWidth;
}

/**
 * Custom hook to lock body scrolling when a modal or drawer is open.
 * Features:
 * - Dynamic scrollbar width calculation & CSS variable `--scrollbar-width`
 * - Nested modal safety using active lock count ref
 * - `modal-scroll-lock-active` class toggling
 * - Clean cleanup on unmount or close
 */
export function useScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    if (activeScrollLockCount === 0) {
      originalOverflow = document.body.style.overflow;
      originalPaddingRight = document.body.style.paddingRight;

      const scrollbarWidth = getScrollbarWidth();
      if (scrollbarWidth > 0) {
        document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("modal-scroll-lock-active");
      document.body.classList.add("modal-scroll-lock-active");
    }

    activeScrollLockCount++;

    return () => {
      activeScrollLockCount = Math.max(0, activeScrollLockCount - 1);

      if (activeScrollLockCount === 0) {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
        document.documentElement.style.removeProperty("--scrollbar-width");
        document.documentElement.classList.remove("modal-scroll-lock-active");
        document.body.classList.remove("modal-scroll-lock-active");
      }
    };
  }, [isOpen]);
}
