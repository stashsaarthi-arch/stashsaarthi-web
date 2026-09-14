import React, { memo } from "react";
import { motion } from "motion/react";
import { Sparkles, ShieldCheck } from "lucide-react";
import { playPop } from "@/lib/audio";
import { getStudentCyberpunkCardClasses, getStudentEdgeHighlightClasses } from "@/lib/designTokens";

export interface StudentCyberpunkCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowVariant?: "mint" | "cyan" | "dual";
  badgeText?: string;
  isHoverable?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  ariaLabel?: string;
}

/**
 * Reusable Cyberpunk-inspired Student Persona Card Primitive (Task 133)
 * Features mint/cyan edge highlights, frosted glass depth, and neon ambient glows.
 */
export const StudentCyberpunkCard = memo(function StudentCyberpunkCard({
  children,
  glowVariant = "dual",
  badgeText,
  isHoverable = true,
  className = "",
  onClick,
  ariaLabel,
  ...props
}: StudentCyberpunkCardProps) {
  const baseCardClasses = getStudentCyberpunkCardClasses(isHoverable);
  const edgeClasses = getStudentEdgeHighlightClasses(glowVariant);

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
      whileHover={isHoverable ? { y: -4, scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handleClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      className={`relative overflow-hidden rounded-2xl p-5 ${baseCardClasses} ${edgeClasses} ${className}`}
      {...(props as any)}
    >
      {/* Top Ambient Neon Glow Corner Spotlight */}
      <div
        className={`absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl pointer-events-none transition-opacity ${
          glowVariant === "mint"
            ? "bg-emerald-500/20"
            : glowVariant === "cyan"
            ? "bg-cyan-400/20"
            : "bg-emerald-400/15 text-cyan-400"
        }`}
      />

      {/* Cyberpunk Top Neon Line Accent */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

      {/* Optional Badge Header */}
      {badgeText && (
        <div className="mb-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10.5px] font-extrabold text-emerald-300 border border-emerald-400/30 font-mono tracking-wider uppercase">
            <Sparkles className="h-3 w-3 text-cyan-300" />
            {badgeText}
          </span>
          <ShieldCheck className="h-4 w-4 text-emerald-400/70" />
        </div>
      )}

      {/* Card Content Container */}
      <div className="relative z-10">{children}</div>

      {/* Bottom Corner Accent Notch */}
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-cyan-400/40 pointer-events-none" />
    </motion.div>
  );
});
