import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";

export type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Global Theme Provider — manages dark/light mode state,
 * applies smooth color-palette transitions to `document.documentElement`,
 * and syncs with `localStorage` and `theme-color` meta tags.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("ss-theme") as Theme;
        if (saved === "dark" || saved === "light") {
          setThemeState(saved);
          applyTheme(saved, false);
        } else {
          setThemeState("dark");
          applyTheme("dark", false);
        }
      } catch {
        applyTheme("dark", false);
      }
    }
  }, []);

  const applyTheme = (t: Theme, triggerTransition = true) => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    if (triggerTransition) {
      root.classList.add("theme-transitioning");
    }

    root.dataset["theme"] = t;
    if (t === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }

    // Update meta theme-color tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", t === "dark" ? "#0A0D0F" : "#FAFAFA");
    }

    if (triggerTransition) {
      window.setTimeout(() => {
        root.classList.remove("theme-transitioning");
      }, 400);
    }
  };

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t, true);
    try {
      localStorage.setItem("ss-theme", t);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  }, [theme, setTheme]);

  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme,
      isDark: theme === "dark",
    }),
    [theme, toggleTheme, setTheme],
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

const defaultContextValue: ThemeContextType = {
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
  isDark: true,
};

/**
 * Hook to access the global theme state.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  return context || defaultContextValue;
}
