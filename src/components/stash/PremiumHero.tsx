"use client";

import React from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// Elite Spring Physics configuration (NO linear easing)
const ELITE_SPRING = { stiffness: 300, damping: 20, mass: 0.8 };

// Cinematic Magnetic Button
export const MagneticButton = ({ 
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
  
  const springX = useSpring(x, ELITE_SPRING);
  const springY = useSpring(y, ELITE_SPRING);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * 0.3);
      y.set((e.clientY - centerY) * 0.3);
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
      style={{ x: springX, y: springY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={`gpu-accelerated relative inline-flex items-center justify-center transition-colors duration-500 ${className}`}
    >
      {children}
    </motion.button>
  );
};

const PlasmaStreaks = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="perspective-grid" />
      <div className="cinematic-noise" />
      {[...Array(15)].map((_, i) => (
        <div 
          key={`streak-${i}`}
          className="plasma-streak"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * -50}%`,
            animationDuration: `${Math.random() * 10 + 5}s`,
            animationDelay: `${Math.random() * 8}s`,
          }}
        />
      ))}
      {[...Array(20)].map((_, i) => (
        <div 
          key={`ember-${i}`}
          className="ember"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            animationDuration: `${Math.random() * 15 + 10}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.6 + 0.2
          }}
        />
      ))}
    </div>
  );
};

const FeatureCard = ({ title, desc, icon }: { title: string, desc: string, icon: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      whileHover={{ y: -5 }}
      className="relative overflow-hidden bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-3xl group p-8 flex flex-col gap-4 cursor-pointer"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-emerald-500/10 blur-[30px] rounded-full pointer-events-none" />
      <div className="relative z-10 text-4xl filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 will-change-transform [transform:translateZ(0)]">
        {icon}
      </div>
      <h3 className="relative z-10 text-2xl font-bold text-white tracking-tight will-change-transform [transform:translateZ(0)]">{title}</h3>
      <p className="relative z-10 text-zinc-500 font-medium leading-relaxed will-change-transform [transform:translateZ(0)]">{desc}</p>
    </motion.div>
  );
};

export const PremiumHero = ({ role, onBook, onRefer }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Extreme Cinematic scroll physics
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "120%"]);
  const scaleText = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotateXText = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const yCards = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Spring physics wrapper for scroll
  const smoothYText = useSpring(yText, ELITE_SPRING);
  const smoothScaleText = useSpring(scaleText, ELITE_SPRING);
  const smoothRotateXText = useSpring(rotateXText, ELITE_SPRING);

  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"]
  });
  const heroY = useTransform(heroProgress, [0, 0.5], [100, 0]);
  const heroOpacity = useTransform(heroProgress, [0, 0.3], [0, 1]);

  return (
    <div ref={containerRef} className="group relative min-h-screen w-full bg-transparent overflow-hidden flex flex-col items-center justify-center px-4 md:px-6 gpu-accelerated py-24 md:py-40 perspective-[1000px]">
      
      <motion.div 
        ref={heroRef}
        style={{ 
          y: heroY, 
          opacity: heroOpacity 
        }}
        className="z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center text-center transform-style-3d will-change-transform [transform:translateZ(0)]"
      >
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", ...ELITE_SPRING, delay: 0.1 }}
          className="inline-flex items-center gap-3 px-6 py-2 border border-[#10B981]/20 bg-[#10B981]/10 backdrop-blur-xl mb-8 rounded-full gpu-accelerated shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_15px_#10B981] animate-pulse" />
          <span className="text-xs md:text-sm font-bold text-[#00F5A0] tracking-[0.3em] uppercase">
            {role === 'student' ? 'StashSaarthi Engine v2' : 'Host Matrix v2'}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, type: "spring", stiffness: 100, damping: 20 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_35px_rgba(16,185,129,0.4)] uppercase pb-6"
        >
          {role === 'student' ? 'STASH' : 'SPACE'} <br />
          <span className="inline-block mt-4 md:mt-0 will-change-transform [transform:translateZ(0)]">
            {role === 'student' ? 'SAARTHI' : 'HOSTING'}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
          className="max-w-2xl mt-8 md:mt-12 text-base sm:text-lg md:text-xl text-zinc-300 font-medium tracking-widest leading-relaxed gpu-accelerated px-4 drop-shadow-md will-change-transform [transform:translateZ(0)]"
        >
          {role === 'student' 
            ? 'Zero-brokerage inventory engineered for intergenerational friction-less living.'
            : 'Secure, zero-hassle passive income engineered for premium hosts.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center w-full sm:w-auto gap-4 sm:gap-6 mt-12 md:mt-16 px-4 gpu-accelerated will-change-transform [transform:translateZ(0)]"
        >
          <MagneticButton 
            onClick={() => onBook({ service: role === 'student' ? 'stash' : 'spaces' })}
            className="w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-6 rounded-xl text-lg sm:text-xl uppercase tracking-[0.2em] relative overflow-hidden bg-emerald-600 text-white font-bold border border-emerald-400/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-shadow duration-300"
          >
            {role === 'student' ? 'ACCESS VAULT' : 'INITIATE LISTING'}
          </MagneticButton>
          
          <MagneticButton 
            onClick={onRefer}
            className="w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-6 rounded-none bg-black border border-white/20 text-white font-bold text-lg sm:text-xl uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            {role === 'student' ? 'REFERRAL' : 'PRICING'}
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Top-Glow Cards Matrix with strict E-Summit grid architecture */}
      <div className="z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-32 py-24 md:py-40">
        <FeatureCard 
          icon="🔒"
          title="Zero Friction"
          desc="Military-grade inventory management with absolute zero brokerage fees."
        />
        <FeatureCard 
          icon="⚡"
          title="Spatial Control"
          desc="Manage your dead-rent or empty spaces with pure geometric precision."
        />
        <FeatureCard 
          icon="💎"
          title="Premium Matrix"
          desc="Enter the exclusive host network. High yield, zero operational drag."
        />
      </div>
    </div>
  );
};
