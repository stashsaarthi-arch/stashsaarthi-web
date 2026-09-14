import React, { memo } from "react";
import { motion } from "motion/react";
import { HeartHandshake, ShieldCheck } from "lucide-react";
import { playPop } from "@/lib/audio";
import { getHostWarmHearthCardClasses, getHostHearthAccentClasses } from "@/lib/designTokens";

export interface HostWarmHearthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowVariant?: "amber" | "terracotta" | "brass" | "trio";
  badgeText?: string;
  isHoverable?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  ariaLabel?: string;
}

/**
 * Reusable Warm Hearth Senior Host Persona Card Primitive (Task 134)
 * Features comforting amber, terracotta, and warm brass accents conveying dignity and warmth.
 */
export const HostWarmHearthCard = memo(function HostWarmHearthCard({
  children,
  glowVariant = "trio",
  badgeText,
  isHoverable = true,
  className = "",
  onClick,
  ariaLabel,
  ...props
}: HostWarmHearthCardProps) {
  const baseCardClasses = getHostWarmHearthCardClasses(isHoverable);
  const edgeClasses = getHostHearthAccentClasses(glowVariant);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      try {
        playPop();
      } catch {
        // Audio fallback
      }
      onClick(e);
    }
  };

  return (
    <motion.div
      whileHover={isHoverable ? { y: -4, scale: 1.015 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handleClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      className={`relative overflow-hidden rounded-2xl p-5 ${baseCardClasses} ${edgeClasses} ${className}`}
      {...(props as any)}
    >
      {/* Top Ambient Warm Hearth Corner Spotlight Glow */}
      <div
        className={`absolute -right-12 -top-12 h-36 w-36 rounded-full blur-2xl pointer-events-none transition-opacity ${
          glowVariant === "amber"
            ? "bg-amber-500/25"
            : glowVariant === "terracotta"
            ? "bg-orange-600/25"
            : glowVariant === "brass"
            ? "bg-yellow-500/25"
            : "bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-yellow-400/20"
        }`}
      />

      {/* Warm Hearth Top Brass Line Accent */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />

      {/* Optional Badge Header */}
      {badgeText && (
        <div className="mb-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-bold text-amber-200 border border-amber-400/35 font-mono tracking-wide">
            <HeartHandshake className="h-3.5 w-3.5 text-amber-300" />
            {badgeText}
          </span>
          <ShieldCheck className="h-4 w-4 text-amber-400/80" />
        </div>
      )}

      {/* Card Content Container */}
      <div className="relative z-10">{children}</div>

      {/* Bottom Corner Brass Accent Notch */}
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-amber-400/50 pointer-events-none" />
    </motion.div>
  );
});
