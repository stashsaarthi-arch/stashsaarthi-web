import { useEffect, useState, useCallback } from "react";
import { getMobileKeyboardCollisionTokens } from "./designTokens";

export interface MobileKeyboardState {
  isKeyboardOpen: boolean;
  keyboardHeight: number;
  activeElement: HTMLElement | null;
  scrollToActiveElement: (customHeadroomPx?: number) => void;
}

/**
 * Custom hook to prevent mobile virtual keyboard collision with input fields.
 * Ensures active inputs automatically scroll into view with comfortable headroom (100px)
 * when virtual keyboard expands on iOS Safari, Android Chrome, and mobile browsers.
 */
export function useMobileKeyboardCollision(): MobileKeyboardState {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);

  const tokens = getMobileKeyboardCollisionTokens("student");

  const scrollToActiveElement = useCallback((customHeadroomPx?: number) => {
    if (typeof window === "undefined" || !document.activeElement) return;

    const el = document.activeElement as HTMLElement;
    const tagName = el.tagName?.toLowerCase();
    const isInput =
      tagName === "input" ||
      tagName === "textarea" ||
      tagName === "select" ||
      el.isContentEditable ||
      el.classList.contains("keyboard-collision-target");

    if (!isInput) return;

    const headroom = customHeadroomPx ?? tokens.headroomPx;

    // Use a slight delay to allow iOS / Android virtual keyboard animation to settle
    setTimeout(() => {
      if (typeof window.visualViewport !== "undefined" && window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const rect = el.getBoundingClientRect();
        
        // Element's position relative to visual viewport
        const relativeTop = rect.top - window.visualViewport.offsetTop;
        const relativeBottom = rect.bottom - window.visualViewport.offsetTop;

        // Check if element is cut off or within headroom boundary
        if (relativeBottom > viewportHeight - headroom || relativeTop < headroom) {
          el.scrollIntoView({
            behavior: tokens.scrollBehavior,
            block: tokens.scrollBlock,
          });
        }
      } else {
        el.scrollIntoView({
          behavior: tokens.scrollBehavior,
          block: tokens.scrollBlock,
        });
      }
    }, 150);
  }, [tokens.headroomPx, tokens.scrollBehavior, tokens.scrollBlock]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let initialViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const tagName = target.tagName?.toLowerCase();
      const isInteractive =
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        target.isContentEditable ||
        target.classList.contains("keyboard-collision-target");

      if (isInteractive) {
        setActiveElement(target);
        scrollToActiveElement();
      }
    };

    const handleFocusOut = () => {
      setActiveElement(null);
      setIsKeyboardOpen(false);
      setKeyboardHeight(0);
    };

    const handleViewportResize = () => {
      if (typeof window.visualViewport === "undefined" || !window.visualViewport) return;

      const currentHeight = window.visualViewport.height;
      const heightDiff = initialViewportHeight - currentHeight;

      if (heightDiff > tokens.keyboardOpenThresholdPx) {
        setIsKeyboardOpen(true);
        setKeyboardHeight(heightDiff);
        if (document.activeElement) {
          scrollToActiveElement();
        }
      } else {
        setIsKeyboardOpen(false);
        setKeyboardHeight(0);
      }
    };

    window.addEventListener("focusin", handleFocusIn, { passive: true });
    window.addEventListener("focusout", handleFocusOut, { passive: true });

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportResize, { passive: true });
    }

    return () => {
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleViewportResize);
      }
    };
  }, [scrollToActiveElement, tokens.keyboardOpenThresholdPx]);

  return {
    isKeyboardOpen,
    keyboardHeight,
    activeElement,
    scrollToActiveElement,
  };
}
