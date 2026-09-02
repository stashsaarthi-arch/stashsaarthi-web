import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, IndianRupee } from "lucide-react";
import type { OpenBooking } from "./types";

export function MobileStickyCTA({ onBook }: { onBook: OpenBooking }) {
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
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-3 sm:hidden pointer-events-none"
        >
          <div className="glass rounded-xl p-2 bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-between gap-3 pointer-events-auto">
            <div className="flex-1 flex flex-col justify-center px-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                {student ? "Vacation Storage" : "Spare Space"}
              </span>
              <span className={`text-sm font-extrabold ${student ? "text-emerald-400" : "text-amber-400"} flex items-center gap-0.5 mt-0.5`}>
                <IndianRupee className="w-3.5 h-3.5" />
                {student ? "300/mo" : "11,500/mo"}
              </span>
            </div>
            <Button
              variant={student ? "hero" : "warm"}
              size="default"
              className="px-6 shadow-xl w-[140px] whitespace-nowrap h-11"
              onClick={() => onBook({ service: student ? "stash" : "spaces" })}
            >
              <span className="font-bold">{student ? "Book Now" : "List Free"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
