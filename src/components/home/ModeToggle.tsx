import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const ModeToggle = memo(function ModeToggle({ 
  mode, 
  setMode 
}: { 
  mode: "student" | "host"; 
  setMode: (mode: "student" | "host") => void;
}) {
  return (
    <div className="flex items-center justify-center py-6 w-full bg-transparent">
      <div className="relative flex items-center p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-2xl">
        
        {/* Student Toggle Button */}
        <button
          onClick={() => setMode("student")}
          className={`relative px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-colors duration-300 z-10 ${
            mode === "student" ? "text-student-primary" : "text-white/50 hover:text-white/80"
          }`}
          style={{ fontFamily: 'GTA6-Heading' }}
        >
          {mode === "student" && (
            <motion.div
              layoutId="active-mode-pill"
              className="absolute inset-0 bg-student-primary/10 border border-student-primary/30 rounded-full -z-10"
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          STUDENT
        </button>

        {/* Host Toggle Button */}
        <button
          onClick={() => setMode("host")}
          className={`relative px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-colors duration-300 z-10 ${
            mode === "host" ? "text-host-primary" : "text-white/50 hover:text-white/80"
          }`}
          style={{ fontFamily: 'GTA6-Heading' }}
        >
          {mode === "host" && (
            <motion.div
              layoutId="active-mode-pill"
              className="absolute inset-0 bg-host-primary/10 border border-host-primary/30 rounded-full -z-10"
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          HOST
        </button>
      </div>
    </div>
  );
});
