import React, { useEffect, useState, useRef } from "react";
import {
  SCROLL_REVEAL_TOKENS,
  getScrollRevealInlineStyles,
  getScrollRevealTokens,
  type ScrollRevealDirection,
} from "@/lib/designTokens";
import { usePersona } from "@/context/PersonaContext";

export interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number; // Delay in ms
  duration?: number; // Duration in ms
  translateY?: number; // Distance in px for translateY (default 24)
  direction?: ScrollRevealDirection;
  staggerIndex?: number;
  staggerDelay?: number; // Per-item stagger delay in ms (default 120)
  threshold?: number; // IntersectionObserver threshold (0.0 to 1.0)
  once?: boolean; // Trigger once or re-trigger on enter/leave
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
  showPersonaGlow?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  duration = SCROLL_REVEAL_TOKENS.durationMs,
  translateY = SCROLL_REVEAL_TOKENS.translateYPx,
  direction = "up",
  staggerIndex = 0,
  staggerDelay = SCROLL_REVEAL_TOKENS.staggerDelayMs,
  threshold = SCROLL_REVEAL_TOKENS.threshold,
  once = true,
  className = "",
  style = {},
  as: Component = "div",
  showPersonaGlow = false,
}) => {
  const { role } = usePersona();
  const tokens = getScrollRevealTokens(role);
  const elementRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Accessibility check for reduced motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const target = elementRef.current;
    if (!target) {
      setIsVisible(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once && observer && target) {
              observer.unobserve(target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(target);

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [threshold, once]);

  // Total delay = explicit delay + (staggerIndex * staggerDelay)
  const totalDelayMs = delay + staggerIndex * staggerDelay;

  const dynamicStyles = getScrollRevealInlineStyles(isVisible, totalDelayMs, direction, translateY);

  // Custom duration override if specified differently than default
  if (duration !== SCROLL_REVEAL_TOKENS.durationMs) {
    dynamicStyles["transitionDuration"] = `${duration}ms`;
  }


  const personaGlowStyles: React.CSSProperties =
    showPersonaGlow && isVisible
      ? {
          boxShadow: `0 0 28px -4px ${tokens.personaSpec.glowColor}`,
          borderColor: tokens.personaSpec.borderColor,
        }
      : {};

  return (
    <Component
      ref={elementRef}
      className={`scroll-reveal-stage ${isVisible ? "scroll-reveal-active" : "scroll-reveal-initial"} ${className}`}
      style={{
        ...dynamicStyles,
        ...personaGlowStyles,
        ...style,
      }}
      data-visible={isVisible}
      data-direction={direction}
      data-persona={role}
      data-glow={showPersonaGlow ? "true" : "false"}
    >
      {children}
    </Component>
  );
};

export interface ScrollRevealContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  baseDelay?: number;
  direction?: ScrollRevealDirection;
  threshold?: number;
  className?: string;
  as?: React.ElementType;
}

export const ScrollRevealContainer: React.FC<ScrollRevealContainerProps> = ({
  children,
  staggerDelay = SCROLL_REVEAL_TOKENS.staggerDelayMs,
  baseDelay = 0,
  direction = "up",
  threshold = SCROLL_REVEAL_TOKENS.threshold,
  className = "",
  as: Component = "div",
}) => {
  return (
    <Component className={`scroll-reveal-container w-full ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        // If the child is already a ScrollReveal or ScrollRevealItem, pass staggerIndex
        return (
          <ScrollReveal
            staggerIndex={index}
            staggerDelay={staggerDelay}
            delay={baseDelay}
            direction={direction}
            threshold={threshold}
          >
            {child}
          </ScrollReveal>
        );
      })}
    </Component>
  );
};

export interface ScrollRevealItemProps extends ScrollRevealProps {}

export const ScrollRevealItem: React.FC<ScrollRevealItemProps> = (props) => {
  return <ScrollReveal {...props} />;
};

export default ScrollReveal;
