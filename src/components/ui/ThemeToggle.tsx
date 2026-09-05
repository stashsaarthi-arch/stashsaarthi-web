import { memo } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = memo(function ThemeToggle({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-1.5 text-xs font-medium transition-all hover:bg-white/15 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 cursor-pointer ${
        compact ? "h-7 w-7 sm:h-8 sm:w-8" : "px-2.5 py-1.5 gap-1.5"
      } ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="relative flex items-center justify-center">
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <Moon className="h-4 w-4 text-cyan-400 transition-transform duration-300 rotate-0 scale-100" />
        )}
      </div>
      {!compact && (
        <span className="hidden sm:inline font-semibold text-xs text-foreground">
          {isDark ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
});
