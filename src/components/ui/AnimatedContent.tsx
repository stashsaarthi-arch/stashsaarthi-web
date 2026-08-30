import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  ease = "power2.out",
  delay = 0,
  scale = 1,
  threshold = 0.08,
  initialOpacity = 0,
  animateOpacity = true,
  parallax = false,
  yPercent = -15,
  scrub = 1,
  className = "",
  style = {},
  viewportOnce = true,
  ...rest
}: AnimatedContentProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || typeof window === "undefined") return;

    // Check for user reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      if (parallax) {
        // Parallax depth motion linked to scroll position
        gsap.fromTo(
          el,
          { yPercent: 0 },
          {
            yPercent,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: typeof scrub === "boolean" ? (scrub ? 1 : false) : scrub,
            },
          },
        );
      } else {
        // Section reveal transition
        let x = 0;
        let y = 0;

        if (direction === "vertical") {
          y = reverse ? -distance : distance;
        } else if (direction === "horizontal") {
          x = reverse ? distance : -distance;
        }

        gsap.fromTo(
          el,
          {
            opacity: animateOpacity ? initialOpacity : 1,
            x,
            y,
            scale: scale !== 1 ? scale : 1,
            willChange: "transform, opacity",
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration,
            ease,
            delay,
            clearProps: "willChange",
            scrollTrigger: {
              trigger: el,
              start: `top ${Math.min(95, Math.max(50, 100 - threshold * 100))}%`,
              toggleActions: viewportOnce ? "play none none none" : "play reverse play reverse",
              once: viewportOnce,
            },
          },
        );
      }
    }, elementRef);

    return () => {
      ctx.revert();
    };
  }, [
    distance,
    direction,
    reverse,
    duration,
    ease,
    delay,
    scale,
    threshold,
    initialOpacity,
    animateOpacity,
    parallax,
    yPercent,
    scrub,
    viewportOnce,
  ]);

  return (
    <div
      ref={elementRef}
      className={`gpu-accelerated ${className}`}
      style={{
        ...style,
        transform: "translate3d(0, 0, 0)",
        backfaceVisibility: "hidden",
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default AnimatedContent;
