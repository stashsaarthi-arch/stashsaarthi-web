import React from "react";

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
  className = "",
  style = {},
  ...rest
}: AnimatedContentProps) {
  return (
    <div
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
