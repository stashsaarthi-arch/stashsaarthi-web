import { useEffect, useState, useCallback } from "react";

/**
 * Custom hook to enforce 0px horizontal scroll quarantine across root viewports.
 * Detects horizontal micro-wobbles (window.scrollX > 0) and instantly resets scroll position to left: 0.
 */
export function useHorizontalScrollQuarantine() {
  const [scrollXState, setScrollXState] = useState<number>(0);
  const [isQuarantined, setIsQuarantined] = useState<boolean>(true);

  const resetHorizontalScroll = useCallback(() => {
    if (typeof window !== "undefined" && window.scrollX !== 0) {
      window.scrollTo({ left: 0 });
      setScrollXState(0);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Apply strict overflow containment on html and body elements
    const rootHtml = document.documentElement;
    const rootBody = document.body;

    rootHtml.style.maxWidth = "100vw";
    rootHtml.style.overflowX = "hidden";
    rootHtml.style.overscrollBehaviorX = "none";

    rootBody.style.maxWidth = "100vw";
    rootBody.style.overflowX = "hidden";
    rootBody.style.overscrollBehaviorX = "none";

    const handleScroll = () => {
      if (window.scrollX > 0) {
        window.scrollTo({ left: 0, top: window.scrollY });
        setScrollXState(0);
      } else {
        setScrollXState(window.scrollX);
      }
    };

    const handleResize = () => {
      if (window.scrollX > 0) {
        window.scrollTo({ left: 0, top: window.scrollY });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return {
    scrollX: scrollXState,
    isQuarantined,
    resetHorizontalScroll,
  };
}
