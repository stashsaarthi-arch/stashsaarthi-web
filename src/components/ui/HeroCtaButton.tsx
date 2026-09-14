import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { playHeroCtaClick } from "@/lib/audio";
import { getHeroCtaGlowClasses, type HeroCtaVariantTier } from "@/lib/designTokens";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/MagneticButton";

export interface HeroCtaButtonProps extends ButtonProps {
  heroVariant?: HeroCtaVariantTier;
  showBorderGlow?: boolean;
  wrapperClassName?: string;
  enableMagnetic?: boolean;
  magneticStrength?: number;
}

export const HeroCtaButton = React.forwardRef<HTMLButtonElement, HeroCtaButtonProps>(
  (
    {
      heroVariant = "mint",
      showBorderGlow = true,
      wrapperClassName,
      enableMagnetic = true,
      magneticStrength = 0.35,
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

    const innerButton = (
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

    const buttonWithGlow = showBorderGlow ? (
      <div className={cn(glowSpec.wrapperClasses, wrapperClassName)}>
        <div className={glowSpec.borderClasses} aria-hidden="true" />
        {innerButton}
      </div>
    ) : (
      innerButton
    );

    if (enableMagnetic) {
      return (
        <MagneticButton strength={magneticStrength} showGlow={false} soundEffect={false}>
          {buttonWithGlow}
        </MagneticButton>
      );
    }

    return buttonWithGlow;
  }
);

HeroCtaButton.displayName = "HeroCtaButton";

