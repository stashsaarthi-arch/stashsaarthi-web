import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 320, damping: 28, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 320, damping: 28, mass: 0.4 });
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      const magEl = el?.closest("[data-magnetic]") as HTMLElement | null;
      setActive(!!el?.closest("button, a, [data-magnetic]"));

      // Subtle physical magnetic attraction on desktop
      if (magEl) {
        const rect = magEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = (e.clientX - centerX) * 0.25;
        const dy = (e.clientY - centerY) * 0.25;
        magEl.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        magEl.style.transition = "transform 0.1s ease-out";
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      const magEl = el?.closest("[data-magnetic]") as HTMLElement | null;
      if (magEl) {
        magEl.style.transform = "translate3d(0, 0, 0)";
        magEl.style.transition = "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)";
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseout", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        animate={{ scale: active ? 2.4 : 1, opacity: active ? 0.9 : 0.55 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="-translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 22,
          height: 22,
          background: "radial-gradient(circle, var(--cyan) 0%, transparent 70%)",
          boxShadow: "var(--glow-cyan)",
        }}
      />
    </motion.div>
  );
}
