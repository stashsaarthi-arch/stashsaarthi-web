import React from "react";
import { motion } from "framer-motion";

export interface AnimatedContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  duration?: number;
  ease?: any;
  delay?: number;
  scale?: number;
  threshold?: number;
  initialOpacity?: number;
  animateOpacity?: boolean;
  parallax?: boolean; // Parallax is unsupported under performance rules, will fallback to entrance
  yPercent?: number;
  scrub?: boolean | number;
  staggerChildren?: boolean;
  staggerDelay?: number;
  className?: string;
  style?: React.CSSProperties;
  viewportOnce?: boolean;
}

export const AnimatedContent = React.memo(function AnimatedContent({
  children,
  distance = 30,
  direction = "vertical",
  reverse = false,
  duration = 0.5, // slightly faster to feel snappier without GSAP
  ease = [0.16, 1, 0.3, 1], // approximate cubic-bezier
  delay = 0,
  scale = 1,
  threshold = 0.12,
  initialOpacity = 0,
  animateOpacity = true,
  parallax = false,
  yPercent = 0,
  scrub = false,
  staggerChildren = false,
  staggerDelay = 0.1,
  className = "",
  style = {},
  viewportOnce = true,
  ...rest
}: AnimatedContentProps) {
  const xOffset = direction === "horizontal" ? (reverse ? -distance : distance) : 0;
  const yOffset = direction === "vertical" ? (reverse ? -distance : distance) : 0;

  const initial = {
    x: xOffset,
    y: yOffset,
    opacity: animateOpacity ? initialOpacity : 1,
    scale: scale,
  };

  const animate = {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
  };

  const transition = {
    duration,
    ease,
    delay,
  };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: viewportOnce, amount: threshold }}
      transition={transition}
      className={`gpu-layer ${className}`}
      style={style}
      {...rest as any}
    >
      {children}
    </motion.div>
  );
});

export default AnimatedContent;
