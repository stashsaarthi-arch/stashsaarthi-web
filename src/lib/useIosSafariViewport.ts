import { useEffect, useState } from "react";
import { IOS_SAFARI_VIEWPORT_TOKENS, getIosSafariViewportTokens } from "./designTokens";

export interface IosSafariViewportState {
  isIosSafari: boolean;
  vhInPx: number;
  dvhHeight: string;
  pbSafeClass: string;
  tokens: ReturnType<typeof getIosSafariViewportTokens>;
}

/**
 * Custom hook to calculate and inject dynamic viewport height (--vh, --dvh) and safe area variables
 * specifically fixing iOS Safari URL bar expand/collapse viewport height jitter.
 */
export function useIosSafariViewport(): IosSafariViewportState {
  const [state, setState] = useState<IosSafariViewportState>(() => ({
    isIosSafari: false,
    vhInPx: typeof window !== "undefined" ? window.innerHeight * 0.01 : 8,
    dvhHeight: "100dvh",
    pbSafeClass: "pb-safe",
    tokens: getIosSafariViewportTokens("student"),
  }));

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect iOS and Safari browser environment
    const ua = window.navigator.userAgent;
    const isIos = /iPhone|iPad|iPod/i.test(ua) || (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
    const isSafari = /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/i.test(ua);
    const isIosSafari = isIos || isSafari;

    const updateViewportVars = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      document.documentElement.style.setProperty("--dvh", `${window.innerHeight}px`);
      
      setState((prev) => ({
        ...prev,
        isIosSafari,
        vhInPx: vh,
        dvhHeight: `${window.innerHeight}px`,
      }));
    };

    updateViewportVars();

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateViewportVars, IOS_SAFARI_VIEWPORT_TOKENS.safariFixConfig.resizeListenerThrottleMs);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", updateViewportVars, { passive: true });

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", updateViewportVars);
    };
  }, []);

  return state;
}
