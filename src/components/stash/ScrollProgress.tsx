import { motion, useScroll, useSpring } from "motion/react";
import { usePersona } from "@/context/PersonaContext";

/**
 * Thin gradient progress bar fixed at the very top of the viewport.
 * Adapts color to active persona (Mint for student, Amber for host).
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const { role } = usePersona();

  const gradient =
    role === "host"
      ? "linear-gradient(90deg, #F59E0B, #FBBF24, #D97706)"
      : "linear-gradient(90deg, #10B981, #00F5A0, #06B6D4)";

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[2.5px] origin-left pointer-events-none gpu-accelerated"
      style={{
        scaleX,
        background: gradient,
        transform: "translate3d(0, 0, 0)",
        backfaceVisibility: "hidden",
        boxShadow:
          role === "host"
            ? "0 0 14px 2px rgba(245,158,11,0.55)"
            : "0 0 14px 2px rgba(16,185,129,0.55)",
      }}
    />
  );
}
