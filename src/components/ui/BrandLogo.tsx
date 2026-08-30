import React from "react";

export interface BrandLogoProps {
  className?: string;
  height?: number | string;
  alt?: string;
}

export function BrandLogo({ className = "", height = 36, alt = "StashSaarthi" }: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/stashsaarthi-logo.png"
        alt={alt}
        className="h-7 sm:h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        style={{ height: typeof height === "number" ? `${height}px` : height }}
        loading="eager"
      />
    </div>
  );
}
