import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";

type Layer = {
  depth: number;
  className: string;
  bg: string;
};

const LAYERS: Layer[] = [
  {
    depth: 1,
    className: "left-[6%] top-[18%] h-56 w-56 rounded-full opacity-40 gpu-accelerated pointer-events-none",
    bg: "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.08) 40%, transparent 70%)",
  },
  {
    depth: 1.8,
    className: "right-[4%] top-[8%] h-64 w-64 rounded-full opacity-35 gpu-accelerated pointer-events-none",
    bg: "radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(245, 158, 11, 0.06) 40%, transparent 70%)",
  },
  {
    depth: 2.6,
    className: "left-[22%] bottom-[6%] h-40 w-40 rounded-full opacity-30 gpu-accelerated pointer-events-none",
    bg: "radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, rgba(6, 182, 212, 0.06) 40%, transparent 70%)",
  },
  {
    depth: 3.4,
    className:
      "left-1/2 top-[26%] h-[300px] w-[min(620px,90vw)] -translate-x-1/2 rounded-[40%] border border-white/5 opacity-40 gpu-accelerated pointer-events-none",
    bg: "transparent",
  },
  {
    depth: 4.6,
    className:
      "left-1/2 top-[34%] h-[180px] w-[min(380px,60vw)] -translate-x-1/2 rotate-45 rounded-3xl border border-white/5 opacity-30 gpu-accelerated pointer-events-none",
    bg: "transparent",
  },
];

/** Cursor-driven parallax depth layers. Purely decorative, non-interactive. */
export function HeroParallax() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 70, damping: 24, mass: 0.5 });
  const y = useSpring(my, { stiffness: 70, damping: 24, mass: 0.5 });

  useEffect(() => {
    if (reduce) return;
    let ticking = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
        ticking = false;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduce]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden [perspective:1000px]"
    >
      {LAYERS.map((layer, i) => (
        <ParallaxLayer key={i} layer={layer} x={x} y={y} />
      ))}
    </div>
  );
}

function ParallaxLayer({
  layer,
  x,
  y,
}: {
  layer: Layer;
  x: ReturnType<typeof useSpring>;
  y: ReturnType<typeof useSpring>;
}) {
  const amp = layer.depth * 9;
  const tx = useTransform(x, (v) => v * amp);
  const ty = useTransform(y, (v) => v * amp * 0.6);
  const rotY = useTransform(x, (v) => v * layer.depth * 1.6);
  const rotX = useTransform(y, (v) => -v * layer.depth * 1.2);

  return (
    <motion.div
      className={`absolute ${layer.className}`}
      style={{ x: tx, y: ty, rotateY: rotY, rotateX: rotX, background: layer.bg }}
    />
  );
}
