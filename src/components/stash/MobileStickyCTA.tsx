import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, IndianRupee } from "lucide-react";
import type { OpenBooking } from "./types";

export const MobileStickyCTA = React.memo(function MobileStickyCTA({ onBook }: { onBook: OpenBooking }) {
  const [isVisible, setIsVisible] = useState(false);
  const { role } = usePersona();
  const { t } = useLanguage();
  const student = role === "student";

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA when scrolled past 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-3 left-3 right-3 z-[100] sm:hidden pointer-events-none pb-[env(safe-area-inset-bottom)]"
        >
          <div className="rounded-2xl p-2.5 bg-[#0A0D0F]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_12px_36px_-6px_rgba(0,0,0,0.85)] flex items-center justify-between gap-3 pointer-events-auto">
            <div className="flex-1 flex flex-col justify-center px-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                {student ? "Vacation Storage" : "Spare Space"}
              </span>
              <span
                className={`text-sm font-extrabold ${student ? "text-emerald-400" : "text-amber-400"} flex items-center gap-0.5 mt-0.5`}
              >
                <IndianRupee className="w-3.5 h-3.5" />
                {student ? "300/mo" : "11,500/mo"}
              </span>
            </div>
            <Button
              variant={student ? "hero" : "warm"}
              size="default"
              className="px-4 sm:px-6 shadow-xl w-auto min-w-[110px] max-w-[140px] shrink-0 whitespace-nowrap h-11"
              onClick={() => onBook({ service: student ? "stash" : "spaces" })}
            >
              <span className="font-bold truncate">{student ? "Book Now" : "List Free"}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
