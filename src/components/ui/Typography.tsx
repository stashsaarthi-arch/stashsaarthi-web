import React from "react";
import { cn } from "@/lib/utils";
import {
  type FluidTypographyLevel,
  getCalibratedTypographySpec,
  getHindiTypographyClasses,
  getHeadingHierarchyClasses,
} from "@/lib/designTokens";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";

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

const gradientUtilityMap: Record<"mint" | "amber" | "persona" | "none", string> = {
  mint: "text-gradient-mint",
  amber: "text-gradient-amber",
  persona: "text-gradient-persona",
  none: "",
};

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ variant = "body", as, gradient = "none", lang: customLang, className, children, ...props }, ref) => {
    const { language: contextLang } = useLanguage();
    const { isHost } = usePersona();
    const activeLang = customLang || contextLang || "en";
    const isHindi = activeLang === "hi";

    const Component = as || variantElementMap[variant];
    const variantClasses = getHeadingHierarchyClasses(variant);
    const gradientClasses = gradientUtilityMap[gradient];

    const calibratedSpec = getCalibratedTypographySpec(variant, activeLang);

    const isHeading = ["display", "h1", "h2", "h3", "h4"].includes(variant);
    const devanagariClasses = getHindiTypographyClasses(isHindi, isHeading, isHost);

    return (
      <Component
        ref={ref as any}
        lang={activeLang}
        data-lang={activeLang}
        data-typography-level={variant}
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

export interface SectionHeaderProps {
  overline?: React.ReactNode;
  heading: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left" | "right";
  gradient?: "mint" | "amber" | "persona" | "none";
  className?: string;
  headingAs?: "h1" | "h2" | "h3" | "h4";
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  overline,
  heading,
  description,
  align = "center",
  gradient = "none",
  className,
  headingAs = "h2",
}) => {
  const alignClass =
    align === "left" ? "text-left items-start" : align === "right" ? "text-right items-end" : "text-center items-center";

  return (
    <header className={cn("section-header-wrapper flex flex-col space-y-3", alignClass, className)}>
      {overline && (
        <Typography variant="overline" className="tracking-widest font-semibold">
          {overline}
        </Typography>
      )}
      <Typography variant={headingAs} gradient={gradient} className="font-extrabold tracking-tight">
        {heading}
      </Typography>
      {description && (
        <Typography variant="body" className="text-muted-foreground max-w-2xl text-balance">
          {description}
        </Typography>
      )}
    </header>
  );
};
