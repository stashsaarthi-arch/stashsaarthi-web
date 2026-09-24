"use client";
import { motion } from "framer-motion";

export default function SpatialBackground() {
  return (
    // Z-INDEX AUR RED COLOR ADD KIYA HAI TEST KE LIYE
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden bg-red-900/50">
      
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-500 blur-[120px] rounded-full mix-blend-screen"
      />
      
      <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-5xl font-black">
        TEST: BACKGROUND IS ALIVE!
      </h1>

    </div>
  );
}
