import React from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

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
  
  // Brutalist spring physics - stiff and explosive
  const springConfig = { stiffness: 400, damping: 20, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * 0.4); 
      y.set((e.clientY - centerY) * 0.4);
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`gpu-layer relative inline-flex items-center justify-center transition-all duration-300 ${className}`}
    >
      {children}
    </motion.button>
  );
};

const Particles = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(25)].map((_, i) => (
        <div 
          key={i}
          className="ember"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            animationDuration: `${Math.random() * 10 + 8}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.6 + 0.2
          }}
        />
      ))}
    </div>
  );
};

export const PremiumHero = ({ role, onBook, onRefer }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Deep Parallax transforms for brutalist spatial depth
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const scaleText = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="group relative min-h-[90vh] w-full bg-[#0A0D0F] overflow-hidden flex flex-col items-center justify-center px-6 selection:bg-[#10B981]/30 selection:text-[#00F5A0] gpu-layer">
      
      {/* Brutalist spatial grid background */}
      <motion.div 
        style={{ y: yBg }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" 
      />

      <Particles />

      {/* Dynamic Mouse Tracking Spotlight */}
      <motion.div 
        style={{ 
          background: useMotionTemplate`radial-gradient(1200px circle at ${smoothX}px ${smoothY}px, rgba(16,185,129,0.12), transparent 50%)`
        }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 z-0 mix-blend-screen" 
      />

      <motion.div 
        style={{ y: yText, scale: scaleText, opacity: opacityContent }}
        className="z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center pt-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-none border-l-4 border-l-[#10B981] bg-[#10B981]/5 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.1)] gpu-layer mb-10"
        >
          <span className="w-2.5 h-2.5 bg-[#00F5A0] shadow-[0_0_15px_#00F5A0] animate-pulse" />
          <span className="text-sm font-bold text-[#00F5A0] uppercase tracking-[0.2em]">
            {role === 'student' ? 'Next-Gen Micro-Storage' : 'Premium Host Program'}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.2 }}
          className="text-5xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-[#10B981]/40 leading-[0.85] pb-4 gpu-layer"
        >
          {role === 'student' ? 'Secure Your' : 'Unlock Passive'} <br />
          <motion.span 
            animate={{ backgroundPosition: ["0% center", "200% center"] }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="bg-clip-text text-transparent bg-[linear-gradient(to_right,#10B981,#00F5A0,#ffffff,#10B981)] bg-[length:200%_auto] block mt-4"
          >
            {role === 'student' ? 'Space.' : 'Income.'}
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
          className="max-w-3xl mt-12 text-xl md:text-2xl text-zinc-400 font-medium tracking-wide leading-relaxed gpu-layer"
        >
          {role === 'student' 
            ? 'Experience zero-brokerage rooms and verified community living. The ultimate intergenerational platform engineered for zero-friction.'
            : 'Turn your spare rooms into a secure, verified income stream. Fully insured and tailored for intergenerational harmony.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-6 mt-16 gpu-layer"
        >
          <HoverButton 
            onClick={() => onBook({ service: role === 'student' ? 'stash' : 'spaces' })}
            className="px-10 py-5 rounded-none bg-[#10B981] text-black font-black text-xl uppercase tracking-widest shadow-[8px_8px_0px_rgba(0,245,160,0.4)] border-2 border-[#00F5A0] hover:shadow-[12px_12px_0px_rgba(0,245,160,0.6)] hover:-translate-y-1 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-3">
              {role === 'student' ? 'Explore Inventory' : 'List Your Space'}
              <motion.span
                className="inline-block font-black"
                initial={{ x: 0 }}
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                →
              </motion.span>
            </span>
          </HoverButton>
          
          <HoverButton 
            onClick={onRefer}
            className="px-10 py-5 rounded-none bg-transparent border-2 border-zinc-700 text-zinc-300 font-bold text-xl uppercase tracking-widest hover:border-white hover:text-white hover:bg-white/5 transition-all duration-300 shadow-[8px_8px_0px_rgba(255,255,255,0.05)]"
          >
            {role === 'student' ? 'Refer & Share' : 'View Pricing Model'}
          </HoverButton>
        </motion.div>
      </motion.div>

      {/* Extreme ambient glows for depth */}
      <motion.div style={{ y: yBg }} className="absolute top-[0%] -left-64 w-[600px] h-[600px] bg-[#10B981] opacity-[0.15] blur-[160px] rounded-full pointer-events-none mix-blend-screen z-0 gpu-layer" />
      <motion.div style={{ y: yBg }} className="absolute bottom-[-10%] -right-32 w-[700px] h-[700px] bg-[#00F5A0] opacity-[0.1] blur-[180px] rounded-full pointer-events-none mix-blend-screen z-0 gpu-layer" />
    </div>
  );
};
