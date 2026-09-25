import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";

export interface LowDataContextType {
  isLowData: boolean;
  toggleLowData: () => void;
  setLowData: (enabled: boolean) => void;
  isAutoDetected: boolean;
  effectiveType: string;
}

const LowDataContext = createContext<LowDataContextType | undefined>(undefined);

/**
 * Checks if the browser is currently running under a low-bandwidth connection (2G/3G/Save-Data).
 */
export function detectLowDataConnection(): { isSlow: boolean; type: string; saveData: boolean } {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return { isSlow: false, type: "unknown", saveData: false };
  }

  const nav = navigator as any;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

  if (!connection) {
    return { isSlow: false, type: "unknown", saveData: false };
  }

  const saveData = Boolean(connection.saveData);
  const type = connection.effectiveType || "unknown";
  const isSlow = saveData || type === "2g" || type === "slow-2g" || type === "3g";

  return { isSlow, type, saveData };
}

/**
 * Global Low-Data Mode Provider.
 * Automatically detects weak 2G/3G/save-data connections,
 * syncs state with `localStorage` (`ss_low_data_mode`),
 * and updates DOM attributes on `document.documentElement` to disable GSAP/WebGL animations.
 */
export function LowDataProvider({ children }: { children: React.ReactNode }) {
  const [isLowData, setIsLowDataState] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("ss_low_data_mode");
        if (saved !== null) return saved === "true";
        return detectLowDataConnection().isSlow;
      } catch {}
    }
    return false;
  });
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        if (localStorage.getItem("ss_low_data_mode") === null) {
          return detectLowDataConnection().isSlow;
        }
      } catch {}
    }
    return false;
  });
  const [effectiveType, setEffectiveType] = useState<string>(() => {
    return detectLowDataConnection().type;
  });

  const applyLowDataDOM = useCallback((enabled: boolean) => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.setAttribute("data-low-data-mode", enabled ? "true" : "false");

    if (enabled) {
      root.classList.add("low-data-mode");
      root.classList.add("legacy-android-fallback");
      root.setAttribute("data-webgl-supported", "false");
    } else {
      root.classList.remove("low-data-mode");
      // Only remove fallback if legacy android guard didn't set it
      if (root.getAttribute("data-legacy-android") !== "true") {
        root.classList.remove("legacy-android-fallback");
        root.setAttribute("data-webgl-supported", "true");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const detection = detectLowDataConnection();
    setEffectiveType(detection.type);

    try {
      const saved = localStorage.getItem("ss_low_data_mode");
      if (saved !== null) {
        const enabled = saved === "true";
        setIsLowDataState(enabled);
        setIsAutoDetected(false);
        applyLowDataDOM(enabled);
      } else {
        // Auto-detect based on connection
        if (detection.isSlow) {
          setIsLowDataState(true);
          setIsAutoDetected(true);
          applyLowDataDOM(true);
          toast.info("Low-Data Mode Auto-Enabled", {
            description: `Detected weak network (${detection.type.toUpperCase()}). Animations disabled & static images enabled to conserve cellular data.`,
            duration: 5000,
          });
        } else {
          setIsLowDataState(false);
          setIsAutoDetected(false);
          applyLowDataDOM(false);
        }
      }
    } catch {
      applyLowDataDOM(false);
    }

    // Listen to connection changes if supported
    const nav = typeof navigator !== "undefined" ? (navigator as any) : null;
    const connection = nav ? nav.connection || nav.mozConnection || nav.webkitConnection : null;

    if (!connection) return;

    const handleConnectionChange = () => {
      const updated = detectLowDataConnection();
      setEffectiveType(updated.type);
      const saved = localStorage.getItem("ss_low_data_mode");
      if (saved === null && updated.isSlow) {
        setIsLowDataState(true);
        setIsAutoDetected(true);
        applyLowDataDOM(true);
      }
    };

    connection.addEventListener("change", handleConnectionChange);
    return () => {
      connection.removeEventListener("change", handleConnectionChange);
    };
  }, [applyLowDataDOM]);

  const setLowData = useCallback(
    (enabled: boolean) => {
      setIsLowDataState(enabled);
      setIsAutoDetected(false);
      applyLowDataDOM(enabled);

      try {
        localStorage.setItem("ss_low_data_mode", enabled ? "true" : "false");
      } catch {
        // Ignore storage error
      }

      if (enabled) {
        toast.success("Low-Data Mode Activated", {
          description:
            "GSAP & WebGL animations disabled, lightweight static images enabled for maximum performance.",
          duration: 3500,
        });
      } else {
        toast.info("Standard Performance Mode Restored", {
          description: "Full kinetic 120 FPS animations & 3D WebGL canvases re-enabled.",
          duration: 3000,
        });
      }
    },
    [applyLowDataDOM],
  );

  const toggleLowData = useCallback(() => {
    setLowData(!isLowData);
  }, [isLowData, setLowData]);

  const contextValue = useMemo(
    () => ({
      isLowData,
      toggleLowData,
      setLowData,
      isAutoDetected,
      effectiveType,
    }),
    [isLowData, toggleLowData, setLowData, isAutoDetected, effectiveType],
  );

  return <LowDataContext.Provider value={contextValue}>{children}</LowDataContext.Provider>;
}

const defaultContext: LowDataContextType = {
  isLowData: false,
  toggleLowData: () => {},
  setLowData: () => {},
  isAutoDetected: false,
  effectiveType: "unknown",
};

/**
 * Hook to access the global low-data mode state.
 */
export function useLowData(): LowDataContextType {
  const context = useContext(LowDataContext);
  return context || defaultContext;
}

/**
 * Direct non-react checker for utility functions and non-react modules.
 */
export function isLowDataModeEnabled(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-low-data-mode") === "true";
}
