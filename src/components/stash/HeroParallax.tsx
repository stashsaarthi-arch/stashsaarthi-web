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
    className: "left-[6%] top-[18%] h-56 w-56 rounded-full blur-[90px] opacity-30",
    bg: "radial-gradient(circle, var(--emerald), transparent 70%)",
  },
  {
    depth: 1.8,
    className: "right-[4%] top-[8%] h-64 w-64 rounded-full blur-[100px] opacity-25",
    bg: "radial-gradient(circle, var(--amber), transparent 70%)",
  },
  {
    depth: 2.6,
    className: "left-[22%] bottom-[6%] h-40 w-40 rounded-full blur-[70px] opacity-20",
    bg: "radial-gradient(circle, var(--cyan), transparent 70%)",
  },
  {
    depth: 3.4,
    className:
      "left-1/2 top-[26%] h-[300px] w-[min(620px,90vw)] -translate-x-1/2 rounded-[40%] border border-white/5 opacity-40",
    bg: "transparent",
  },
  {
    depth: 4.6,
    className:
      "left-1/2 top-[34%] h-[180px] w-[min(380px,60vw)] -translate-x-1/2 rotate-45 rounded-3xl border border-white/5 opacity-30",
    bg: "transparent",
  },
];

/** Cursor-driven parallax depth layers. Purely decorative, non-interactive. */
export function HeroParallax() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const y = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
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
