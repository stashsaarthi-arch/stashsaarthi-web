import React from "react";
import { cn } from "@/lib/utils";
import {
  type FluidTypographyLevel,
  getCalibratedTypographySpec,
  getHindiTypographyClasses,
} from "@/lib/designTokens";
import { useLanguage } from "@/context/LanguageContext";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: FluidTypographyLevel;
  as?: React.ElementType;
  gradient?: "mint" | "amber" | "persona" | "none";
  lang?: "en" | "hi";
  children: React.ReactNode;
}

const variantElementMap: Record<FluidTypographyLevel, React.ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  caption: "span",
  overline: "span",
};

const variantUtilityMap: Record<FluidTypographyLevel, string> = {
  display: "text-fluid-display font-extrabold tracking-tight",
  h1: "text-fluid-h1 font-extrabold tracking-tight",
  h2: "text-fluid-h2 font-bold tracking-tight",
  h3: "text-fluid-h3 font-bold tracking-tight",
  h4: "text-fluid-h4 font-semibold",
  body: "text-fluid-body font-normal leading-relaxed",
  caption: "text-fluid-caption font-medium text-muted-foreground",
  overline: "text-fluid-overline font-semibold text-muted-foreground uppercase",
};

const gradientUtilityMap: Record<"mint" | "amber" | "persona" | "none", string> = {
  mint: "text-gradient-mint",
  amber: "text-gradient-amber",
  persona: "text-gradient-persona",
  none: "",
};

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ variant = "body", as, gradient = "none", lang: customLang, className, children, ...props }, ref) => {
    const { language: contextLang } = useLanguage();
    const activeLang = customLang || contextLang || "en";
    const isHindi = activeLang === "hi";

    const Component = as || variantElementMap[variant];
    const variantClasses = variantUtilityMap[variant];
    const gradientClasses = gradientUtilityMap[gradient];

    const calibratedSpec = getCalibratedTypographySpec(variant, activeLang);

    const isHeading = ["display", "h1", "h2", "h3", "h4"].includes(variant);
    const devanagariClasses = getHindiTypographyClasses(isHindi, isHeading);

    return (
      <Component
        ref={ref as any}
        lang={activeLang}
        data-lang={activeLang}
        data-calibrated-line-height={calibratedSpec.lineHeight}
        data-calibrated-letter-spacing={calibratedSpec.letterSpacing}
        className={cn(variantClasses, devanagariClasses, gradientClasses, className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Typography.displayName = "Typography";

