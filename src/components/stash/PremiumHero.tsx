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

  // 3D Fly-Through Zoom Departure (User flies THROUGH the hero into the 3D space)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.7], [1, 1.14]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.7], [0, -90]);
  const heroRotateX = useTransform(scrollYProgress, [0, 0.7], [0, -10]);

  return (
    <div ref={containerRef} className="group relative min-h-screen w-full max-w-full bg-transparent overflow-hidden flex flex-col items-center justify-center px-3 sm:px-6 gpu-accelerated py-20 md:py-40 md:[perspective:1200px]">
      
      <motion.div 
        style={{
          scale: heroScale,
          opacity: heroOpacity,
          y: heroY,
          rotateX: heroRotateX,
          transformStyle: "preserve-3d",
        }}
        className="z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 flex flex-col items-center text-center transform-style-3d will-change-transform [transform:translateZ(0)]"
      >
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", ...ELITE_SPRING, delay: 0.1 }}
          className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-1.5 sm:py-2 border border-[#10B981]/20 bg-[#10B981]/10 backdrop-blur-xl mb-6 sm:mb-8 rounded-full gpu-accelerated shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_15px_#10B981] animate-pulse" />
          <span className="text-xs md:text-sm font-bold text-[#00F5A0] tracking-wider sm:tracking-[0.3em] uppercase">
            {role === 'student' ? 'StashSaarthi Engine v2' : 'Host Matrix v2'}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, type: "spring", stiffness: 100, damping: 20 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_35px_rgba(16,185,129,0.4)] uppercase pb-4 sm:pb-6"
        >
          {role === 'student' ? 'STASH' : 'SPACE'} <br />
          <span className="inline-block mt-2 sm:mt-4 md:mt-0 will-change-transform [transform:translateZ(0)]">
            {role === 'student' ? 'SAARTHI' : 'HOSTING'}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
          className="max-w-2xl mt-6 sm:mt-12 text-sm sm:text-lg md:text-xl text-zinc-300 font-medium tracking-normal sm:tracking-widest leading-relaxed gpu-accelerated px-2 sm:px-4 drop-shadow-md will-change-transform [transform:translateZ(0)]"
        >
          {role === 'student' 
            ? 'Zero-brokerage inventory engineered for intergenerational friction-less living.'
            : 'Secure, zero-hassle passive income engineered for premium hosts.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center w-full max-w-md sm:max-w-none gap-3 sm:gap-6 mt-8 sm:mt-16 px-2 sm:px-4 gpu-accelerated will-change-transform [transform:translateZ(0)]"
        >
          <MagneticButton 
            onClick={() => onBook({ service: role === 'student' ? 'stash' : 'spaces' })}
            className="w-full sm:w-auto px-6 sm:px-14 py-3.5 sm:py-6 rounded-xl text-sm sm:text-xl uppercase tracking-wider sm:tracking-[0.2em] relative overflow-hidden bg-emerald-600 text-white font-bold border border-emerald-400/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-shadow duration-300"
          >
            {role === 'student' ? 'ACCESS VAULT' : 'INITIATE LISTING'}
          </MagneticButton>
          
          <MagneticButton 
            onClick={onRefer}
            className="w-full sm:w-auto px-6 sm:px-14 py-3.5 sm:py-6 rounded-xl sm:rounded-none bg-black border border-white/20 text-white font-bold text-sm sm:text-xl uppercase tracking-wider sm:tracking-[0.2em] hover:bg-white/10 hover:border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            {role === 'student' ? 'REFERRAL' : 'PRICING'}
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Top-Glow Cards Matrix with strict E-Summit grid architecture */}
      <div className="z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-14 mt-20 sm:mt-32 py-16 md:py-40">
        <FeatureCard 
          icon={role === 'student' ? "🔒" : "💰"}
          title={role === 'student' ? "Zero Friction" : "High Yield"}
          desc={role === 'student' ? "Military-grade inventory management with absolute zero brokerage fees." : "Earn ₹3,000–₹12,000 monthly passive income with zero capital expenditure."}
        />
        <FeatureCard 
          icon={role === 'student' ? "⚡" : "🛡️"}
          title={role === 'student' ? "Spatial Control" : "Zero Intrusion"}
          desc={role === 'student' ? "Manage your dead-rent or empty spaces with pure geometric precision." : "100% control over house norms with guaranteed 24-hour SLA relocation if violated."}
        />
        <FeatureCard 
          icon={role === 'student' ? "💎" : "🤝"}
          title={role === 'student' ? "Premium Matrix" : "Verified Tenants"}
          desc={role === 'student' ? "Enter the exclusive host network. High yield, zero operational drag." : "3-tier background verification. We only place respectful, disciplined students."}
        />
      </div>
    </div>
  );
};
