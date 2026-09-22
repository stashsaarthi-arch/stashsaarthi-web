import { useState, useEffect, useRef, memo } from "react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { GraduationCap, HeartHandshake } from "lucide-react";
import { playPop } from "@/lib/audio";
import { motion, AnimatePresence } from "motion/react";

export const FloatingPersonaToggle = memo(function FloatingPersonaToggle() {
  const { role, setRole } = usePersona();
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 350;
      if (shouldShow !== visibleRef.current) {
        visibleRef.current = shouldShow;
        setVisible(shouldShow);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
          role="radiogroup"
          aria-label={isHi ? "यूज़र पर्सोना चुनें" : "Select User Persona"}
          className="sticky top-[64px] sm:top-[80px] z-[150] w-full hidden sm:flex items-center justify-center gap-2 bg-[#0A0D0F]/95 backdrop-blur-md p-2 border-b border-white/[0.08] shadow-[0_12px_36px_-6px_rgba(0,0,0,0.8)] pointer-events-auto"
        >
          <motion.button
            type="button"
            role="radio"
            aria-checked={role === "student"}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              playPop();
              setRole("student");
            }}
            className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-[0.02em] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0A0D0F] z-10 ${
              role === "student" ? "text-black font-extrabold" : "text-slate-400 hover:text-white"
            }`}
          >
            {role === "student" && (
              <motion.span
                layoutId="activeFloatingPersona"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                className="absolute inset-0 rounded-full bg-emerald-500 shadow-md -z-10"
              />
            )}
            <GraduationCap
              className="h-3.5 w-3.5 shrink-0 translate-y-[-0.5px]"
              aria-hidden="true"
            />
            <span>{isHi ? "छात्र मोड" : "Student Mode"}</span>
          </motion.button>

          <motion.button
            type="button"
            role="radio"
            aria-checked={role === "host"}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              playPop();
              setRole("host");
            }}
            className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-[0.02em] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/80 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0A0D0F] z-10 ${
              role === "host" ? "text-black font-extrabold" : "text-slate-400 hover:text-white"
            }`}
          >
            {role === "host" && (
              <motion.span
                layoutId="activeFloatingPersona"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                className="absolute inset-0 rounded-full bg-amber-500 shadow-md -z-10"
              />
            )}
            <HeartHandshake
              className="h-3.5 w-3.5 shrink-0 translate-y-[-0.5px]"
              aria-hidden="true"
            />
            <span>{isHi ? "सीनियर होस्ट" : "Verified PG Owner Host"}</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
