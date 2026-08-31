import React, { useRef, useEffect } from "react";
import gsap from "gsap";

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
  distance = 30,
  direction = "vertical",
  reverse = false,
  duration = 0.8,
  ease = "power3.out",
  delay = 0,
  scale = 1,
  threshold = 0.12,
  initialOpacity = 0,
  animateOpacity = true,
  parallax = false,
  yPercent = 0,
  scrub = false,
  className = "",
  style = {},
  viewportOnce = true,
  ...rest
}: AnimatedContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Use GSAP context for clean cleanup
    let ctx = gsap.context(() => {
      if (parallax && yPercent) {
        gsap.to(el, {
          yPercent: yPercent,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: scrub === true ? 1 : scrub,
          },
        });
      } else {
        const xOffset = direction === "horizontal" ? (reverse ? -distance : distance) : 0;
        const yOffset = direction === "vertical" ? (reverse ? -distance : distance) : 0;

        // Apply initial state immediately
        gsap.set(el, {
          x: xOffset,
          y: yOffset,
          opacity: animateOpacity ? initialOpacity : 1,
          scale: scale,
          willChange: "transform, opacity"
        });

        // Animate on scroll trigger
        gsap.to(el, {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          duration: duration,
          ease: ease,
          delay: delay,
          clearProps: "willChange", // Hardware acceleration cleanup
          scrollTrigger: {
            trigger: el,
            start: `top ${100 - threshold * 100}%`,
            once: viewportOnce,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
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
      ref={containerRef}
      className={`gpu-accelerated ${className}`}
      style={{
        ...style,
        transform: "translate3d(0, 0, 0)", // Ensure 3D composite layer
        backfaceVisibility: "hidden",
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default AnimatedContent;
