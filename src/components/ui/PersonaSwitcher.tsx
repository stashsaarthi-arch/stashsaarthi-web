import { memo } from "react";
import { motion } from "motion/react";
import { GraduationCap, HeartHandshake, Sparkles, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { playPersonaSwitch } from "@/lib/audio";
import type { Role } from "@/components/stash/types";

export interface PersonaSwitcherProps {
  role: Role;
  onRoleChange: (role: Role) => void;
  variant?: "compact" | "standard" | "hero";
  showBadges?: boolean;
  className?: string;
  id?: string;
}

export const PersonaSwitcher = memo(function PersonaSwitcher({
  role,
  onRoleChange,
  variant = "standard",
  showBadges = false,
  className = "",
  id = "global-persona-switcher",
}: PersonaSwitcherProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const handleSelect = (targetRole: Role) => {
    if (role !== targetRole) {
      playPersonaSwitch(targetRole);
      onRoleChange(targetRole);
    }
  };

  const isCompact = variant === "compact";
  const isHero = variant === "hero";

  const containerPadding = isCompact ? "p-0.5" : isHero ? "p-2" : "p-1.5";
  const containerRadius = "rounded-full";
  const containerBg = "bg-[#0A0D0F]/90 border border-slate-700/60 shadow-2xl backdrop-blur-xl";

  const buttonPadding = isCompact
    ? "px-2.5 py-1 text-xs"
    : isHero
      ? "px-5 py-2.5 text-sm"
      : "px-3.5 py-1.5 text-xs";

  const iconSize = isCompact ? "h-3.5 w-3.5" : isHero ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <div
      id={id}
      role="radiogroup"
      aria-label={isHi ? "यूज़र पर्सोना चुनें" : "Select User Persona"}
      className={`relative inline-flex items-center gap-1 ${containerRadius} ${containerBg} ${containerPadding} ${className}`}
    >
      {/* 1. Student Persona Button */}
      <button
        type="button"
        role="radio"
        aria-checked={role === "student"}
        onClick={() => handleSelect("student")}
        className={`relative z-10 flex items-center justify-center gap-1.5 ${buttonPadding} font-bold rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
          role === "student" ? "text-black" : "text-slate-400 hover:text-white"
        }`}
      >
        {role === "student" && (
          <motion.div
            layoutId={`active-persona-pill-${id}`}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-mint-400 shadow-lg shadow-emerald-500/30"
            transition={{ type: "spring", stiffness: 450, damping: 35 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          {isHero ? (
            <Sparkles className={`${iconSize} animate-pulse`} aria-hidden="true" />
          ) : (
            <GraduationCap className={iconSize} aria-hidden="true" />
          )}
          <span>{isHi ? "छात्र मोड" : "Student Mode"}</span>
          {showBadges && (
            <span className={`text-[10px] opacity-80 ${role === "student" ? "text-black/80 font-extrabold" : "text-emerald-400"}`}>
              ({isHi ? "₹6.4k बचत" : "Save ₹6.4k"})
            </span>
          )}
        </span>
      </button>

      {/* 2. Senior Host Persona Button */}
      <button
        type="button"
        role="radio"
        aria-checked={role === "host"}
        onClick={() => handleSelect("host")}
        className={`relative z-10 flex items-center justify-center gap-1.5 ${buttonPadding} font-bold rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
          role === "host" ? "text-black" : "text-slate-400 hover:text-white"
        }`}
      >
        {role === "host" && (
          <motion.div
            layoutId={`active-persona-pill-${id}`}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg shadow-amber-500/30"
            transition={{ type: "spring", stiffness: 450, damping: 35 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          {isHero ? (
            <ShieldCheck className={iconSize} aria-hidden="true" />
          ) : (
            <HeartHandshake className={iconSize} aria-hidden="true" />
          )}
          <span>{isHi ? "सीनियर होस्ट" : "Senior Host"}</span>
          {showBadges && (
            <span className={`text-[10px] opacity-80 ${role === "host" ? "text-black/80 font-extrabold" : "text-amber-400"}`}>
              ({isHi ? "₹11.5k आय" : "Earn ₹11.5k"})
            </span>
          )}
        </span>
      </button>
    </div>
  );
});
