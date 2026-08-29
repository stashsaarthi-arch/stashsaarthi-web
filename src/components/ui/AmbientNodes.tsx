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
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Background Nodes */}
      <motion.div
        className="absolute left-[10%] top-[20%] h-32 w-32 rounded-full border border-emerald-500/10 bg-emerald-500/5 blur-xl pointer-events-none"
        style={{ y: bgY1 }}
      />
      <motion.div
        className="absolute right-[15%] top-[60%] h-48 w-48 rounded-full border border-cyan-500/10 bg-cyan-500/5 blur-xl pointer-events-none"
        style={{ y: bgY1 }}
      />
      <motion.div
        className="absolute left-[20%] top-[80%] h-24 w-24 rounded-full border border-amber-500/10 bg-amber-500/5 blur-xl pointer-events-none"
        style={{ y: bgY1 }}
      />

      {/* Foreground Accent Nodes */}
      <motion.div
        className="absolute right-[5%] top-[30%] h-16 w-16 rounded-full border border-emerald-500/15 bg-emerald-500/10 blur-lg pointer-events-none"
        style={{ y: fgY1 }}
      />
      <motion.div
        className="absolute left-[5%] top-[50%] h-20 w-20 rounded-full border border-cyan-500/15 bg-cyan-500/10 blur-lg pointer-events-none"
        style={{ y: fgY1 }}
      />
    </div>
  );
}
