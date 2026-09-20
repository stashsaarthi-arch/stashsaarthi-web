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
 * Global Theme Provider — modified to enforce dark mode only.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useState<Theme>("dark");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      root.dataset["theme"] = "dark";
      root.classList.add("dark");
      root.classList.remove("light");

      // Update meta theme-color tag
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", "#0A0D0F");
      }
    }
  }, []);

  const setTheme = useCallback((t: Theme) => {}, []);
  const toggleTheme = useCallback(() => {}, []);

  const contextValue = useMemo(
    () => ({
      theme: "dark" as Theme,
      toggleTheme,
      setTheme,
      isDark: true,
    }),
    [toggleTheme, setTheme],
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
