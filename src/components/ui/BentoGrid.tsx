import React, { memo, ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  BentoSpanType,
  BentoAspectRatioType,
  getBentoSpanClasses,
  BENTO_GRID_TOKENS,
  LineClampTier,
} from "@/lib/designTokens";
import { Tilt3D } from "@/components/stash/Tilt3D";
import { TruncatedText } from "./TruncatedText";

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  autoFlow?: "dense" | "row" | "column";
}

/**
 * BentoGrid - Asymmetric layout container for modern feature showcases.
 */
export const BentoGrid = memo(function BentoGrid({
  children,
  columns = 4,
  className,
  autoFlow = "dense",
  ...props
}: BentoGridProps) {
  return (
    <div
      className={cn(
        "bento-grid grid w-full gap-4 sm:gap-6 lg:gap-8 grid-flow-dense",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-3",
        columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        autoFlow === "dense" && "grid-flow-dense",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  span?: BentoSpanType;
  aspectRatio?: BentoAspectRatioType;
  accentColor?: string;
  enableTilt?: boolean;
  className?: string;
  variant?: "glass" | "surface1" | "surface2" | "elevated";
}

/**
 * BentoCard - Individual bento item with asymmetric span and dynamic glassmorphism aesthetics.
 */
export const BentoCard = memo(function BentoCard({
  children,
  span = "normal",
  aspectRatio = "auto",
  accentColor,
  enableTilt = false,
  className,
  variant = "glass",
  ...props
}: BentoCardProps) {
  const spanClasses = getBentoSpanClasses(span);
  const aspectClass = BENTO_GRID_TOKENS.aspectRatios[aspectRatio];

  const cardContent = (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-5 sm:p-6 transition-all duration-300 gpu-accelerated",
        variant === "glass" && "glass glass-hover",
        variant === "surface1" && "surface-1-card hover:border-white/20",
        variant === "surface2" && "surface-2-card hover:border-white/25",
        variant === "elevated" && "surface-elevated-card hover:shadow-glow",
        spanClasses,
        aspectClass,
        className
      )}
      style={{
        ...(accentColor
          ? {
              boxShadow: `0 14px 36px -10px oklch(0 0 0 / 55%), inset 0 1px 0 oklch(1 0 0 / 12%)`,
            }
          : {}),
      }}
      {...props}
    >
      {/* Background Accent Glow Highlight */}
      {accentColor && (
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 transition-opacity duration-500 group-hover:opacity-40"
          style={{
            background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
            filter: "blur(30px)",
          }}
        />
      )}

      {children}
    </div>
  );

  if (enableTilt) {
    return (
      <Tilt3D max={3} lift={6} className={spanClasses}>
        {cardContent}
      </Tilt3D>
    );
  }

  return cardContent;
});

export interface BentoHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType;
  accentColor?: string;
  badge?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const BentoHeader = memo(function BentoHeader({
  icon: Icon,
  accentColor,
  badge,
  children,
  className,
  ...props
}: BentoHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-3 mb-3", className)} {...props}>
      <div className="flex items-center gap-3">
        {Icon && (
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/12 transition-transform duration-300 group-hover:scale-105"
            style={{
              background: accentColor
                ? `color-mix(in oklab, ${accentColor} 18%, transparent)`
                : "rgba(255, 255, 255, 0.08)",
            }}
          >
            <Icon
              className="h-5 w-5"
              style={{ color: accentColor || "var(--persona-accent)" }}
            />
          </span>
        )}
        {children}
      </div>
      {badge}
    </div>
  );
});

export interface BentoTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  className?: string;
  lines?: LineClampTier;
}

export const BentoTitle = memo(function BentoTitle({
  children,
  className,
  lines = 2,
  ...props
}: BentoTitleProps) {
  return (
    <TruncatedText
      as="h3"
      lines={lines}
      className={cn(
        "heading-h3 text-fluid-h3 font-bold tracking-tight text-foreground transition-colors group-hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </TruncatedText>
  );
});

export interface BentoDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  className?: string;
  lines?: LineClampTier;
}

export const BentoDescription = memo(function BentoDescription({
  children,
  className,
  lines = 3,
  ...props
}: BentoDescriptionProps) {
  return (
    <TruncatedText
      as="p"
      lines={lines}
      className={cn("mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    >
      {children}
    </TruncatedText>
  );
});
