import React from "react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

export interface BrandLogoProps {
  className?: string;
  height?: number | string;
  alt?: string;
}

export const BrandLogo = React.memo(function BrandLogo({ className = "", height = 36, alt = "StashSaarthi" }: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <OptimizedImage
        src="/stashsaarthi-logo.png"
        alt={alt}
        webpSrc="/stashsaarthi-logo.webp"
        className="h-7 sm:h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        style={{ height: typeof height === "number" ? `${height}px` : height }}
        loading="eager"
      />
    </div>
  );
});

