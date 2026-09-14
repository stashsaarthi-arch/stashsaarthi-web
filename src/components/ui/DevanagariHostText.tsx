import React from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import {
  DEVANAGARI_HOST_TYPOGRAPHY_TOKENS,
  getDevanagariHostTypographyClasses,
  getDevanagariHostStyles,
} from "@/lib/designTokens";

export interface DevanagariHostTextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  isHeading?: boolean;
  forceHostMode?: boolean;
  children: React.ReactNode;
}

/**
 * DevanagariHostText Primitive (Task 139)
 * Generous letter-spacing (0.035em), expanded line height (1.75), matra padding, and Devanagari font fallbacks tuned for Senior Hosts reading Hindi copy.
 */
export const DevanagariHostText = React.forwardRef<HTMLElement, DevanagariHostTextProps>(
  ({ as = "span", isHeading = false, forceHostMode = false, className, style, children, ...props }, ref) => {
    const { language } = useLanguage();
    const { isHost } = usePersona();
    const isHindi = language === "hi";
    const activeHost = isHost || forceHostMode;

    const Component = as;
    const typographyClasses = getDevanagariHostTypographyClasses(isHindi, activeHost, isHeading);
    const dynamicStyles = getDevanagariHostStyles(isHindi, activeHost, isHeading);

    return (
      <Component
        ref={ref as any}
        lang={isHindi ? "hi" : "en"}
        data-devanagari-host-tuned={isHindi && activeHost ? "true" : "false"}
        data-matra-cleared="true"
        className={cn("devanagari-host-wrapper", typographyClasses, className)}
        style={{ ...dynamicStyles, ...style }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

DevanagariHostText.displayName = "DevanagariHostText";
