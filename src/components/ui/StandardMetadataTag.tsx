import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { METADATA_TAG_TOKENS } from "@/lib/designTokens";

const standardTagVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide transition-all duration-200 select-none badge-align-baseline micro-copy-baseline",
  {
    variants: {
      preset: {
        verifiedHost: "metadata-tag-verified-host",
        campusProximity: "metadata-tag-campus-proximity",
        lifestyle: "metadata-tag-lifestyle",
        amenity: "metadata-tag-amenity",
        pricingSave: "metadata-tag-pricing-save",
        statusLive: "metadata-tag-status-live",
        default: "bg-primary/10 border-primary/20 text-primary",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-2.5 py-0.5 text-[11px]",
        lg: "px-3 py-1 text-xs",
      },
    },
    defaultVariants: {
      preset: "default",
      size: "default",
    },
  }
);

export interface StandardMetadataTagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof standardTagVariants> {
  preset?: keyof typeof METADATA_TAG_TOKENS.presets | "default";
  icon?: React.ReactNode;
  pulseDot?: boolean;
  pulseColor?: "mint" | "amber" | "cyan" | "emerald" | "red";
  labelEn?: string;
  labelHi?: string;
}

export function StandardMetadataTag({
  className,
  preset = "default",
  size = "default",
  icon,
  pulseDot = false,
  pulseColor = "mint",
  labelEn,
  labelHi,
  children,
  ...props
}: StandardMetadataTagProps) {
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHi = language === "hi";

  // Derive preset data if available
  const presetSpec = preset !== "default" ? METADATA_TAG_TOKENS.presets[preset] : null;
  const displayLabel = children || (isHi ? labelHi || presetSpec?.labelHi : labelEn || presetSpec?.labelEn);
  const displayIcon = icon !== undefined ? icon : presetSpec?.icon;

  const pulseClasses = {
    mint: "bg-emerald-400 shadow-[0_0_8px_#10b981]",
    amber: "bg-amber-400 shadow-[0_0_8px_#f59e0b]",
    cyan: "bg-cyan-400 shadow-[0_0_8px_#06b6d4]",
    emerald: "bg-emerald-500 shadow-[0_0_8px_#10b981]",
    red: "bg-rose-500 shadow-[0_0_8px_#f43f5e]",
  };

  return (
    <div
      data-persona={role}
      className={cn(standardTagVariants({ preset, size, className }))}
      {...props}
    >
      {pulseDot && (
        <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              pulseClasses[pulseColor]
            )}
          />
          <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", pulseClasses[pulseColor])} />
        </span>
      )}
      {displayIcon && typeof displayIcon === "string" ? (
        <span className="shrink-0 text-[11px] leading-none">{displayIcon}</span>
      ) : displayIcon ? (
        <span className="shrink-0 [&_svg]:size-3.5 icon-align-baseline">{displayIcon}</span>
      ) : null}
      <span className="truncate">{displayLabel}</span>
    </div>
  );
}

export const MetadataTag = StandardMetadataTag;
