import React, { memo, useId } from "react";
import { motion } from "motion/react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { playPop, playToggleSwitch } from "@/lib/audio";
import { isLowDataModeEnabled } from "@/context/LowDataContext";
import { TAB_GLIDER_TOKENS, getTabGliderTokens } from "@/lib/designTokens";

export interface TabOption {
  id: string;
  labelEn: string;
  labelHi?: string;
  icon?: React.ReactNode;
  count?: number;
  badge?: string;
  disabled?: boolean;
}

export interface GlidingTabsProps {
  tabs: TabOption[];
  activeTab: string;
  onChange: (tabId: string) => void;
  layoutId?: string;
  variant?: "pills" | "segmented" | "underline" | "contained";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  ariaLabel?: string;
  id?: string;
}

export const GlidingTabs = memo(function GlidingTabs({
  tabs,
  activeTab,
  onChange,
  layoutId,
  variant = "pills",
  size = "md",
  fullWidth = false,
  className = "",
  ariaLabel,
  id,
}: GlidingTabsProps) {
  const personaContext = usePersona();
  const persona = personaContext?.role || "student";
  const { language } = useLanguage();
  const generatedId = useId();
  const instanceId = id || `gliding-tabs-${generatedId}`;
  const activeLayoutId = layoutId || `gliding-pill-${instanceId}`;

  const isHost = persona === "host";
  const isHi = language === "hi";
  const lowData = isLowDataModeEnabled();

  const tokens = getTabGliderTokens(persona);

  const handleSelectTab = (tabId: string, disabled?: boolean) => {
    if (disabled || tabId === activeTab) return;
    try {
      playToggleSwitch(true);
    } catch {
      playPop();
    }
    onChange(tabId);
  };

  // Size styling tokens
  const sizeStyles = {
    sm: "px-3 py-1 text-xs gap-1.5 min-h-[32px]",
    md: "px-4 py-2 text-sm gap-2 min-h-[40px]",
    lg: "px-5 py-2.5 text-base gap-2.5 min-h-[48px]",
  }[size];

  // Variant container styling
  const containerStyles = {
    pills: "bg-[#0A0D0F]/80 backdrop-blur-md border border-slate-800/80 p-1 rounded-full",
    segmented: "bg-slate-950/90 backdrop-blur-xl border border-slate-800 p-1.5 rounded-2xl shadow-xl",
    underline: "border-b border-slate-800/80 bg-transparent p-0 gap-6 rounded-none",
    contained: "bg-surface-2 border border-slate-700/60 p-1.5 rounded-xl",
  }[variant];

  // Pill active indicator background styles
  const activePillStyle = isHost
    ? "bg-gradient-to-r from-amber-500/20 via-amber-400/25 to-gold-400/20 border border-amber-500/40 text-amber-300 shadow-[0_0_16px_-2px_oklch(0.809_0.165_76_/_35%)]"
    : "bg-gradient-to-r from-emerald-500/20 via-mint-400/25 to-cyan-400/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_16px_-2px_oklch(0.72_0.19_160_/_35%)]";

  const underlineStyle = isHost
    ? "bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_2px_10px_oklch(0.809_0.165_76_/_60%)]"
    : "bg-gradient-to-r from-emerald-400 to-mint-400 shadow-[0_2px_10px_oklch(0.72_0.19_160_/_60%)]";

  return (
    <div
      id={instanceId}
      role="tablist"
      aria-label={ariaLabel || (isHi ? "नेविगेशन टैब" : "Navigation Tabs")}
      className={`relative inline-flex items-center ${
        fullWidth ? "w-full justify-between" : "w-auto"
      } ${containerStyles} ${className}`}
      data-persona={persona}
      data-tab-count={tabs.length}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const label = isHi && tab.labelHi ? tab.labelHi : tab.labelEn;

        return (
          <button
            key={tab.id}
            id={`tab-${instanceId}-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${instanceId}-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => handleSelectTab(tab.id, tab.disabled)}
            className={`relative z-10 flex items-center justify-center font-bold tracking-tight rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${
              isHost ? "focus-visible:ring-amber-400" : "focus-visible:ring-emerald-400"
            } ${sizeStyles} ${fullWidth ? "flex-1" : ""} ${
              tab.disabled
                ? "opacity-40 cursor-not-allowed text-slate-500"
                : isActive
                ? isHost
                  ? "text-amber-200"
                  : "text-emerald-200"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {/* Sliding Pill Indicator for Pills & Segmented & Contained */}
            {isActive && variant !== "underline" && (
              <motion.div
                layoutId={activeLayoutId}
                className={`absolute inset-0 ${
                  variant === "segmented" ? "rounded-xl" : "rounded-full"
                } ${activePillStyle}`}
                transition={
                  lowData
                    ? { duration: 0.1 }
                    : { type: "spring", stiffness: 450, damping: 32, mass: 0.8 }
                }
              />
            )}

            {/* Sliding Underline Indicator for Underline Variant */}
            {isActive && variant === "underline" && (
              <motion.div
                layoutId={activeLayoutId}
                className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${underlineStyle}`}
                transition={
                  lowData
                    ? { duration: 0.1 }
                    : { type: "spring", stiffness: 450, damping: 32, mass: 0.8 }
                }
              />
            )}

            {/* Content Label, Icon, and Badges */}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon && (
                <span className={`transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                  {tab.icon}
                </span>
              )}
              <span>{label}</span>

              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-extrabold ${
                    isActive
                      ? isHost
                        ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                        : "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              )}

              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold uppercase tracking-wider ${
                    isActive
                      ? isHost
                        ? "bg-amber-500 text-black font-extrabold"
                        : "bg-emerald-400 text-black font-extrabold"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
});
