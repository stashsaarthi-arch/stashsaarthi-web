import React, { useRef, useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { getTruncationClasses, getHindiTruncationClasses, LineClampTier } from "../../lib/designTokens";
import { useLanguage } from "../../context/LanguageContext";

export interface TruncatedTextProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  text?: string;
  lines?: LineClampTier;
  showTooltip?: boolean;
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4";
  className?: string;
  isHindiOverride?: boolean;
}

export const TruncatedText: React.FC<TruncatedTextProps> = ({
  children,
  text,
  lines = 2,
  showTooltip = true,
  as: Component = "p",
  className,
  isHindiOverride,
  ...props
}) => {
  const { language } = useLanguage();
  const isHindi = isHindiOverride ?? (language === "hi");
  const textRef = useRef<HTMLElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const rawText = text || (typeof children === "string" ? children : undefined);

  useEffect(() => {
    const el = textRef.current;
    if (el && lines !== "none") {
      const hasOverflow =
        el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
      setIsTruncated(hasOverflow);
    } else {
      setIsTruncated(false);
    }
  }, [children, text, lines]);

  const truncationClass = getTruncationClasses(lines);
  const hindiClass = getHindiTruncationClasses(isHindi, lines);

  const titleAttribute = showTooltip && (isTruncated || rawText) ? rawText : undefined;

  return (
    <Component
      ref={textRef as any}
      title={titleAttribute}
      className={cn(
        truncationClass,
        hindiClass,
        isTruncated && "clamp-with-tooltip cursor-help",
        className
      )}
      {...props}
    >
      {children || text}
    </Component>
  );
};

export default TruncatedText;
