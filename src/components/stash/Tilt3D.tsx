import { memo, type ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  max?: number;
  lift?: number;
  glare?: boolean;
};

export const Tilt3D = memo(function Tilt3D({ children, className, max = 10, lift = 10, glare = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  
  const springConfig = { stiffness: 300, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);
  const glareOpacity = useSpring(useMotionValue(0), springConfig);
  const glareX = useSpring(useMotionValue(50), springConfig);
  const glareY = useSpring(useMotionValue(50), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    rotateX.set(yPct * -max);
    rotateY.set(xPct * max);
    
    if (glare) {
      glareOpacity.set(0.06);
      glareX.set((mouseX / width) * 100);
      glareY.set((mouseY / height) * 100);
    }
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    if (glare) {
      glareOpacity.set(0);
    }
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative transform-gpu transition-shadow duration-300",
        className
      )}
    >
      {glare && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 rounded-[inherit] mix-blend-overlay"
          style={{
            opacity: glareOpacity,
            background: useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,1) 0%, transparent 40%)`
          }}
        />
      )}
      <div 
        className="relative z-10 w-full h-full rounded-[inherit] transform-gpu"
        style={{ transform: "translateZ(30px)" }}
      >
        {children}
      </div>
    </motion.div>
  );
});
