import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";

export function AmbientNodes() {
  const { scrollY } = useScroll();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const bgY1 = useTransform(scrollY, (y) => (isMobile ? 0 : y * 0.15));
  const fgY1 = useTransform(scrollY, (y) => (isMobile ? 0 : y * -0.1));

  if (isMobile) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden gpu-accelerated">
      {/* Background Nodes */}
      <motion.div
        className="absolute left-[10%] top-[20%] h-48 w-48 rounded-full pointer-events-none"
        style={{
          y: bgY1,
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
          willChange: "transform",
        }}
      />
      <motion.div
        className="absolute right-[15%] top-[60%] h-64 w-64 rounded-full pointer-events-none"
        style={{
          y: bgY1,
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)",
          willChange: "transform",
        }}
      />
      <motion.div
        className="absolute left-[20%] top-[80%] h-36 w-36 rounded-full pointer-events-none"
        style={{
          y: bgY1,
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.07) 0%, transparent 70%)",
          willChange: "transform",
        }}
      />

      {/* Foreground Accent Nodes */}
      <motion.div
        className="absolute right-[5%] top-[30%] h-28 w-28 rounded-full pointer-events-none"
        style={{
          y: fgY1,
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
          willChange: "transform",
        }}
      />
      <motion.div
        className="absolute left-[5%] top-[50%] h-32 w-32 rounded-full pointer-events-none"
        style={{
          y: fgY1,
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
