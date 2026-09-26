"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import { isLowDataModeEnabled } from "@/context/LowDataContext";

export const FadeUp = ({ 
  children, 
  stagger = 0.15,
  className = "" 
}: { 
  children: React.ReactNode; 
  stagger?: number;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLowData, setIsLowData] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsLowData(isLowDataModeEnabled());
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Continuous viewport scroll-tracker (100% synced with Lenis virtual scroll)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Inertial spring curve for butter-smooth 120 FPS momentum
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 24,
    mass: 0.35,
    restDelta: 0.001,
  });

  // ── 3D SPATIAL ANCHOR TRANSFORMATIONS (E-Summit 3D Trajectory) ──
  // Entry: Arriving from deep 3D background (scale 0.88 -> 1, rotateX 14deg -> 0deg, y 60px -> 0px, opacity 0 -> 1)
  // Viewport Focus: Locked at scale: 1, rotateX: 0deg, y: 0px, opacity: 1 (fully crisp & interactive)
  // Exit: Flying past and receding into horizon (scale 1 -> 0.88, rotateX 0deg -> -10deg, y 0px -> -50px, opacity 1 -> 0)
  const scale = useTransform(smoothProgress, [0, 0.28, 0.72, 1], [0.88, 1, 1, 0.88]);
  const opacity = useTransform(smoothProgress, [0, 0.22, 0.78, 1], [0, 1, 1, 0]);
  const rotateXDesktop = useTransform(smoothProgress, [0, 0.28, 0.72, 1], [14, 0, 0, -10]);
  const rotateXMobile = useTransform(smoothProgress, [0, 0.28, 0.72, 1], [0, 0, 0, 0]);
  const rotateX = isMobile ? rotateXMobile : rotateXDesktop;
  const y = useTransform(smoothProgress, [0, 0.28, 0.72, 1], [60, 0, 0, -50]);

  return (
    <div
      ref={containerRef}
      className={`relative z-10 w-full max-w-full overflow-x-clip flex flex-col py-10 sm:py-16 md:py-32 max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 md:[perspective:1200px] ${className}`}
    >
      {/* ── SPATIAL CYBER ANCHOR CONDUITS (Binds foreground visually to 3D background grid) ── */}
      <div 
        className="absolute inset-y-8 left-2 sm:left-4 w-[1px] bg-gradient-to-b from-transparent via-emerald-400/35 to-transparent pointer-events-none hidden md:block" 
        aria-hidden 
      />
      <div 
        className="absolute inset-y-8 right-2 sm:right-4 w-[1px] bg-gradient-to-b from-transparent via-teal-400/35 to-transparent pointer-events-none hidden md:block" 
        aria-hidden 
      />

      {/* Floating Spatial Depth Nodes on flanks */}
      <div 
        className="absolute top-6 left-1 hidden xl:flex items-center gap-2 font-mono text-[9px] tracking-widest text-emerald-400/50 select-none pointer-events-none"
        aria-hidden
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        <span>┌─ [NODE // SPATIAL_DOCK]</span>
      </div>
      <div 
        className="absolute bottom-6 right-1 hidden xl:flex items-center gap-2 font-mono text-[9px] tracking-widest text-teal-400/50 select-none pointer-events-none"
        aria-hidden
      >
        <span>[TRAJECTORY: 26.4°N] ─┘</span>
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
      </div>

      <motion.div
        style={
          isLowData
            ? {}
            : {
                scale,
                opacity,
                rotateX,
                y,
                transformStyle: isMobile ? "flat" : "preserve-3d",
                willChange: "transform, opacity",
              }
        }
        className="w-full max-w-full flex flex-col items-stretch overflow-hidden"
      >
        {children}
      </motion.div>
    </div>
  );
};

