import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { playHeroCtaClick } from "@/lib/audio";
import { getHeroCtaGlowClasses, type HeroCtaVariantTier } from "@/lib/designTokens";
import { cn } from "@/lib/utils";

export interface HeroCtaButtonProps extends ButtonProps {
  heroVariant?: HeroCtaVariantTier;
  showBorderGlow?: boolean;
  wrapperClassName?: string;
}

export const HeroCtaButton = React.forwardRef<HTMLButtonElement, HeroCtaButtonProps>(
  (
    {
      heroVariant = "mint",
      showBorderGlow = true,
      wrapperClassName,
      className,
      variant,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const glowSpec = getHeroCtaGlowClasses(heroVariant);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playHeroCtaClick();
      if (onClick) onClick(e);
    };

    const resolvedVariant = variant || (heroVariant === "amber" || heroVariant === "warm" ? "warm" : heroVariant === "emerald" || heroVariant === "heroEmerald" ? "heroEmerald" : heroVariant === "cyan" || heroVariant === "heroCyan" ? "heroCyan" : "heroMint");

    if (!showBorderGlow) {
      return (
        <Button
          ref={ref}
          variant={resolvedVariant}
          onClick={handleClick}
          className={cn(glowSpec.buttonClasses, className)}
          {...props}
        >
          {children}
        </Button>
      );
    }

    return (
      <div className={cn(glowSpec.wrapperClasses, wrapperClassName)}>
        <div className={glowSpec.borderClasses} aria-hidden="true" />
        <Button
          ref={ref}
          variant={resolvedVariant}
          onClick={handleClick}
          className={cn(glowSpec.buttonClasses, className)}
          {...props}
        >
          {children}
        </Button>
      </div>
    );
  }
);

HeroCtaButton.displayName = "HeroCtaButton";
