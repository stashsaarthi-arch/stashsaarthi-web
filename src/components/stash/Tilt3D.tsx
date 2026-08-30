import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

type Props = {
  children: ReactNode;
  className?: string;
  /** max rotation in degrees */
  max?: number;
  /** lift on hover in px */
  lift?: number;
  glare?: boolean;
};

export function Tilt3D({ children, className, max = 10, lift = 8, glare = true }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useMotionValue(0);

  const spring = { stiffness: 220, damping: 20, mass: 0.5 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const sh = useSpring(hover, spring);

  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const z = useTransform(sh, [0, 1], [0, lift]);
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);
  const glareOpacity = useTransform(sh, [0, 1], [0, 0.18]);

  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const dynamicStyle = {
    rotateX: isMobile ? 0 : rotateX,
    rotateY: isMobile ? 0 : rotateY,
    translateZ: isMobile ? 0 : z,
    position: "relative" as const,
    ...(isMobile
      ? {}
      : {
          transformPerspective: 1000,
          transformStyle: "preserve-3d" as const,
        }),
  };

  const rectRef = useRef<DOMRect | null>(null);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={dynamicStyle}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || isMobile) return;
        const r = rectRef.current || ref.current?.getBoundingClientRect();
        if (!r) return;
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse" || isMobile) return;
        if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
        hover.set(1);
      }}
      onPointerLeave={() => {
        if (isMobile) return;
        rectRef.current = null;
        hover.set(0);
        px.set(0.5);
        py.set(0.5);
      }}
    >
      {children}
      {glare ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            opacity: glareOpacity,
            background: `radial-gradient(circle at ${"var(--gx)"} ${"var(--gy)"}, oklch(1 0 0 / 90%), transparent 55%)`,
            // @ts-expect-error custom props
            "--gx": glareX,
            "--gy": glareY,
          }}
        />
      ) : null}
    </motion.div>
  );
}
