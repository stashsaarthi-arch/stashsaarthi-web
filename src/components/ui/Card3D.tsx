import React, { useRef, useState, useEffect } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

export interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  tiltCoefficient?: number;
  maxTilt?: number;
}

export function Card3D({
  children,
  className,
  tiltCoefficient = 0.06,
  maxTilt = 15,
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Motion values for X/Y relative to center
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for tilt
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // Transform X/Y to Rotate Y/X
  const rotateX = useTransform(smoothY, (val) =>
    isMobile ? 0 : Math.max(Math.min(val * -tiltCoefficient, maxTilt), -maxTilt)
  );
  const rotateY = useTransform(smoothX, (val) =>
    isMobile ? 0 : Math.max(Math.min(val * tiltCoefficient, maxTilt), -maxTilt)
  );

  // Motion values for specular shine position
  const shineRawX = useMotionValue(50);
  const shineRawY = useMotionValue(50);
  const shineX = useSpring(shineRawX, springConfig);
  const shineY = useSpring(shineRawY, springConfig);

  // Shine background transform
  const shineBg = useTransform(
    [shineX, shineY],
    ([sx, sy]) =>
      `radial-gradient(circle at ${sx}% ${sy}%, rgba(16,185,129,0.15), transparent 70%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = width / 2;
    const centerY = height / 2;

    x.set(mouseX - centerX);
    y.set(mouseY - centerY);

    shineRawX.set((mouseX / width) * 100);
    shineRawY.set((mouseY / height) * 100);
  };

  const handleMouseEnter = () => {
    if (!isMobile) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsHovered(false);
    x.set(0);
    y.set(0);
    shineRawX.set(50);
    shineRawY.set(50);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: isMobile ? undefined : 1200,
        transformStyle: isMobile ? undefined : "preserve-3d",
      }}
      className={cn("relative z-10 w-full group", className)}
    >
      <motion.div
        className="h-full w-full transform-gpu relative"
        style={{
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          transformStyle: isMobile ? undefined : "preserve-3d",
        }}
        whileHover={!isMobile ? { scale: 1.02 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {children}

        {/* Specular Shine Overlay on Desktop */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[100] rounded-[inherit] transition-opacity duration-300 hidden md:block"
          style={{
            opacity: isHovered ? 1 : 0,
            background: shineBg,
          }}
        />
      </motion.div>
    </div>
  );
}
