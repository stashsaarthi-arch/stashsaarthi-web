import React from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { useRef } from 'react';

export const HoverButton = ({ 
  children, 
  className = '', 
  onClick 
}: { 
  children: React.ReactNode; 
  className?: string; 
  onClick?: () => void; 
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * 0.15); 
      y.set((e.clientY - centerY) * 0.15);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`gpu-layer relative inline-flex items-center justify-center transition-shadow duration-300 ${className}`}
    >
      {children}
    </motion.button>
  );
};

export const PremiumHero = ({ role, onBook, onRefer }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 25 });

  const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms based on scroll depth
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="group relative min-h-[85vh] w-full bg-[#0A0D0F] overflow-hidden flex flex-col items-center justify-center px-6 selection:bg-[#10B981]/30 selection:text-[#00F5A0] gpu-layer">
      
      {/* Dynamic Mouse Tracking Spotlight */}
      <motion.div 
        style={{ 
          y: yBg,
          background: useMotionTemplate`radial-gradient(800px circle at ${smoothX}px ${smoothY}px, rgba(16,185,129,0.08), transparent 40%)`
        }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-0" 
      />

      <motion.div 
        style={{ y: yBg }}
        className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none z-0 mix-blend-overlay" 
      />

      <motion.div 
        style={{ y: yContent, opacity: opacityContent }}
        className="z-10 max-w-5xl mx-auto flex flex-col items-center text-center space-y-10 pt-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] shadow-2xl gpu-layer"
        >
          <span className="w-2 h-2 rounded-full bg-[#00F5A0] shadow-[0_0_12px_#00F5A0]" />
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">
            {role === 'student' ? 'Next-Gen Micro-Storage' : 'Premium Host Program'}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 tracking-tight leading-[1.1] pb-2 gpu-layer"
        >
          {role === 'student' ? 'Secure Your Space.' : 'Unlock Passive Income.'} <br />
          <motion.span 
            animate={{ backgroundPosition: ["0% center", "200% center"] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="bg-clip-text text-transparent bg-[linear-gradient(to_right,#10B981,#00F5A0,#ffffff,#10B981)] bg-[length:200%_auto]"
          >
            {role === 'student' ? 'Without Limits.' : 'With Zero Hassle.'}
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
          className="max-w-2xl text-lg md:text-xl text-zinc-400 font-light leading-relaxed gpu-layer"
        >
          {role === 'student' 
            ? 'Experience zero-brokerage rooms and verified community living. The ultimate intergenerational platform engineered for zero-friction.'
            : 'Turn your spare rooms into a secure, verified income stream. Fully insured and tailored for intergenerational harmony.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-6 pt-8 gpu-layer"
        >
          <HoverButton 
            onClick={() => onBook({ service: role === 'student' ? 'stash' : 'spaces' })}
            className="px-8 py-4 rounded-2xl bg-gradient-to-b from-[#10B981] to-[#047857] text-white font-semibold text-lg shadow-[0_0_40px_rgba(16,185,129,0.25)] border border-[#00F5A0]/30 hover:shadow-[0_0_60px_rgba(16,185,129,0.4)] transition-shadow duration-500"
          >
            <span className="relative z-10 flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
              {role === 'student' ? 'Explore Inventory' : 'List Your Space'}
              <motion.span
                className="inline-block"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                →
              </motion.span>
            </span>
          </HoverButton>
          
          <HoverButton 
            onClick={onRefer}
            className="px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-zinc-300 font-medium text-lg hover:bg-white/[0.08] hover:border-white/10 hover:text-white transition-all duration-300 shadow-xl"
          >
            {role === 'student' ? 'Refer & Share' : 'View Pricing Model'}
          </HoverButton>
        </motion.div>
      </motion.div>

      <motion.div style={{ y: yBg }} className="absolute top-[10%] -left-64 w-[500px] h-[500px] bg-[#10B981] opacity-[0.08] blur-[140px] rounded-full pointer-events-none mix-blend-screen z-0 gpu-layer" />
      <motion.div style={{ y: yBg }} className="absolute bottom-[10%] -right-64 w-[500px] h-[500px] bg-[#00F5A0] opacity-[0.06] blur-[140px] rounded-full pointer-events-none mix-blend-screen z-0 gpu-layer" />
    </div>
  );
};
