import React from "react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

export interface BrandLogoProps {
  className?: string;
  height?: number | string;
  alt?: string;
}

export const BrandLogo = React.memo(function BrandLogo({ className = "", height = 36, alt = "StashSaarthi" }: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center select-none rounded-xl dark:bg-transparent bg-[#0A0D0F] px-2.5 py-1 dark:px-0 dark:py-0 border border-white/10 dark:border-transparent transition-all shadow-sm dark:shadow-none ${className}`}>
      <OptimizedImage
        src="/stashsaarthi-logo.png"
        alt={alt}
        width={142}
        height={28}
        webpSrc="/stashsaarthi-logo.webp"
        className="h-7 sm:h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        style={{ height: typeof height === "number" ? `${height}px` : height }}
        loading="eager"
      />
    </div>
  );
});

