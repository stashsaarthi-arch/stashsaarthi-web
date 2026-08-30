import React, { useRef, useState, useEffect } from "react";

export interface AnimatedContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  duration?: number;
  ease?: string;
  delay?: number;
  scale?: number;
  threshold?: number;
  initialOpacity?: number;
  animateOpacity?: boolean;
  parallax?: boolean;
  yPercent?: number;
  scrub?: boolean | number;
  className?: string;
  style?: React.CSSProperties;
  viewportOnce?: boolean;
}

export function AnimatedContent({
  children,
  distance = 25,
  direction = "vertical",
  reverse = false,
  duration = 0.5,
  delay = 0,
  scale = 1,
  threshold = 0.08,
  initialOpacity = 0,
  animateOpacity = true,
  className = "",
  style = {},
  viewportOnce = true,
  ...rest
}: AnimatedContentProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || typeof window === "undefined") return;

    // Immediate show if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          if (viewportOnce) {
            observer.unobserve(el);
          }
        } else if (!viewportOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold: Math.min(Math.max(threshold, 0.01), 0.5),
        rootMargin: "0px 0px -30px 0px",
      },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, viewportOnce]);

  const x = direction === "horizontal" ? (reverse ? distance : -distance) : 0;
  const y = direction === "vertical" ? (reverse ? -distance : distance) : 0;

  return (
    <div
      ref={elementRef}
      className={`gpu-accelerated ${className}`}
      style={{
        ...style,
        opacity: isVisible ? 1 : animateOpacity ? initialOpacity : 1,
        transform: isVisible
          ? "translate3d(0, 0, 0) scale(1)"
          : `translate3d(${x}px, ${y}px, 0) scale(${scale !== 1 ? scale : 1})`,
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: isVisible ? "auto" : "transform, opacity",
        backfaceVisibility: "hidden",
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default AnimatedContent;
