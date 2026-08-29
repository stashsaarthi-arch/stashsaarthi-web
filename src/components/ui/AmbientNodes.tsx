import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";

export function AmbientNodes() {
  const { scrollY } = useScroll();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Background Layer: translateZ(-100px) translateY(scroll * 0.2)
  const bgY1 = useTransform(scrollY, (y) => (isMobile ? 0 : y * 0.2));
  // Foreground Accents: translateZ(50px) translateY(scroll * -0.15)
  const fgY1 = useTransform(scrollY, (y) => (isMobile ? 0 : y * -0.15));
  
  if (isMobile) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={{ perspective: 1000, transformStyle: "preserve-3d" }}>
      {/* Background Nodes */}
      <motion.div
        className="absolute left-[10%] top-[20%] h-32 w-32 rounded-full border border-emerald-500/10 bg-emerald-500/5 backdrop-blur-3xl"
        style={{ y: bgY1, z: -100, rotateX: 20, rotateY: 30 }}
      />
      <motion.div
        className="absolute right-[15%] top-[60%] h-48 w-48 rounded-full border border-cyan-500/10 bg-cyan-500/5 backdrop-blur-3xl"
        style={{ y: bgY1, z: -150, rotateX: -20, rotateY: 45 }}
      />
      <motion.div
        className="absolute left-[20%] top-[80%] h-24 w-24 rounded-full border border-amber-500/10 bg-amber-500/5 backdrop-blur-3xl"
        style={{ y: bgY1, z: -80, rotateX: 10, rotateY: 15 }}
      />

      {/* Foreground Nodes */}
      <motion.div
        className="absolute right-[5%] top-[30%] h-16 w-16 rounded-full border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-md"
        style={{ y: fgY1, z: 50, rotateX: 45, rotateY: 10 }}
      />
      <motion.div
        className="absolute left-[5%] top-[50%] h-20 w-20 rounded-full border border-cyan-500/20 bg-cyan-500/10 backdrop-blur-md"
        style={{ y: fgY1, z: 80, rotateX: -30, rotateY: 60 }}
      />
    </div>
  );
}
