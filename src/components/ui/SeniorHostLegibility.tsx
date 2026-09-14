import React, { memo } from "react";
import { motion } from "motion/react";
import { Eye, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { SENIOR_HOST_LEGIBILITY_TOKENS } from "@/lib/designTokens";
import { playPersonaSwitch, playPop } from "@/lib/audio";

export interface HostLegibilityBadgeProps {
  className?: string;
  showIcon?: boolean;
}

/**
 * HostLegibilityBadge — Accessible badge indicating Senior Host Legibility Mode is active (18px+ text & high-contrast borders)
 */
export const HostLegibilityBadge = memo(function HostLegibilityBadge({
  className = "",
  showIcon = true,
}: HostLegibilityBadgeProps) {
  const { isHost } = usePersona();
  const { language } = useLanguage();
  const isHindi = language === "hi";

  if (!isHost) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center gap-2 rounded-full border-2 border-amber-400/60 bg-amber-950/80 px-3.5 py-1.5 text-xs font-bold text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.3)] backdrop-blur-md ${className}`}
      title={SENIOR_HOST_LEGIBILITY_TOKENS.activeBadgeText}
    >
      {showIcon && (
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-slate-950">
          <Eye className="h-2.5 w-2.5 font-bold" />
        </span>
      )}
      <span className="font-semibold tracking-wide">
        {isHindi ? "वरिष्ठ स्पष्टता मोड सक्रिय (18px+ पाठ)" : "Senior Legibility Mode (18px+ Contrast)"}
      </span>
      <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
    </motion.div>
  );
});

export interface SeniorHostActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  icon?: React.ElementType;
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * SeniorHostActionButton — Accessible action button primitive tuned specifically for senior hosts
 * Features 18px+ base typography, 52px+ minimum touch height, high-contrast borders, and tactile audio feedback.
 */
export const SeniorHostActionButton = memo(function SeniorHostActionButton({
  variant = "primary",
  icon: Icon,
  fullWidth = false,
  children,
  className = "",
  onClick,
  ...props
}: SeniorHostActionButtonProps) {
  const { isHost } = usePersona();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isHost) {
      playPersonaSwitch("host");
    } else {
      playPop();
    }
    if (onClick) onClick(e);
  };

  const baseStyles =
    "senior-host-btn-accessible relative inline-flex items-center justify-center gap-3 min-h-[52px] rounded-xl px-6 py-3 text-lg font-bold tracking-wide transition-all duration-200 active:scale-98 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 cursor-pointer";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 border-2 border-amber-300 shadow-[0_6px_24px_-3px_rgba(245,158,11,0.5)] hover:brightness-110 hover:shadow-[0_8px_30px_-2px_rgba(245,158,11,0.65)]",
    secondary:
      "bg-amber-950/90 text-amber-100 border-2 border-amber-400/70 shadow-[0_4px_16px_rgba(245,158,11,0.25)] hover:bg-amber-900/90 hover:border-amber-300",
    outline:
      "bg-slate-950/80 text-amber-200 border-2 border-amber-400/80 hover:bg-amber-950/50 hover:text-amber-100 hover:border-amber-300",
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseStyles} ${variantStyles[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {Icon && <Icon className="h-5 w-5 shrink-0 text-current stroke-[2.5]" />}
      <span className="font-extrabold">{children}</span>
    </button>
  );
});
