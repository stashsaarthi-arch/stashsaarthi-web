"use client";
import { motion } from "framer-motion";

export default function SpatialBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#030303]">
      
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-900/20 blur-[120px] rounded-full mix-blend-screen"
      />

      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.25, 0.1] }} 
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-teal-800/10 blur-[150px] rounded-full mix-blend-screen"
      />
      
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
