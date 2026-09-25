"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const CinematicPreLoader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Unmount the pre-loader after 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ 
            y: "-100%", 
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 bg-[#030303] z-[99999] flex flex-col items-center justify-center pointer-events-auto"
        >
          <svg viewBox="0 0 600 100" className="w-full max-w-2xl px-4">
            <motion.text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-bold tracking-[0.2em]"
              style={{ fontSize: "40px", fontFamily: 'GTA6-Heading' }}
              initial={{ 
                strokeDasharray: "0 1000",
                stroke: "rgba(16, 185, 129, 1)", 
                strokeWidth: 1,
                fill: "rgba(16, 185, 129, 0)" 
              }}
              animate={{ 
                strokeDasharray: "1000 0",
                fill: "rgba(16, 185, 129, 1)" 
              }}
              transition={{
                strokeDasharray: { duration: 1.5, ease: "easeInOut" },
                fill: { duration: 0.8, ease: "easeIn", delay: 1.2 }
              }}
            >
              STASH SAARTHI
            </motion.text>
          </svg>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="mt-8 text-emerald-500/50 tracking-[0.4em] text-sm font-medium"
            style={{ fontFamily: 'GTA6-Heading' }}
          >
            INITIALIZING ENGINE
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
