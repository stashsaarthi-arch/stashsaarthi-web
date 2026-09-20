import React from "react";
import { Utensils, Package, Home, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { dispatchNavTab, smoothScrollTo } from "./legal";
import { playTab, playPop } from "@/lib/audio";
import { ArrowRight, Zap } from "lucide-react";
import type { OpenBooking } from "./types";
import { useState, useEffect } from "react";
import { usePersona } from "@/context/PersonaContext";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";

type ServiceId = "kitchen" | "stash" | "rooms" | "connect";

interface QuickChip {
  id: ServiceId;
  emoji: string;
  labelEn: string;
  labelHi: string;
}

const CHIPS: QuickChip[] = [
  { id: "kitchen", emoji: "🍱", labelEn: "Food", labelHi: "किचन" },
  { id: "stash", emoji: "🧳", labelEn: "Stash", labelHi: "स्टैश" },
  { id: "rooms", emoji: "🏠", labelEn: "Rooms", labelHi: "कमरे" },
  { id: "connect", emoji: "🤝", labelEn: "Connect", labelHi: "कनेक्ट" },
];

export const MobileStickyCTA = React.memo(function MobileStickyCTA({ onBook }: { onBook: OpenBooking }) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeService, setActiveService] = useState<ServiceId>("stash");
  const { role } = usePersona();
  const { language } = useLanguage();
  const isHi = language === "hi";
  const student = role === "student";

  useEffect(() => {
    const handleScroll = () => {
      // Show dock when scrolled past 250px
      setIsVisible(window.scrollY > 250);
    };

    const handleTabEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (["stash", "rooms", "kitchen", "connect"].includes(detail)) {
        setActiveService(detail as ServiceId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("stashsaarthi-solution-tab", handleTabEvent);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("stashsaarthi-solution-tab", handleTabEvent);
    };
  }, []);

  const handleServiceSelect = (serviceId: ServiceId) => {
    playTab();
    setActiveService(serviceId);
    dispatchNavTab("solution", serviceId);
    smoothScrollTo("solutions", -80)();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-2.5 left-2 right-2 z-[100] sm:hidden pointer-events-none pb-[env(safe-area-inset-bottom)]"
        >
          {/* Floating Dock: height <= 56px */}
          <div className="h-[52px] max-h-[56px] rounded-2xl px-2 py-1 bg-[#0A0D0F]/95 backdrop-blur-2xl border border-white/[0.14] shadow-[0_12px_36px_-6px_rgba(0,0,0,0.9)] flex items-center justify-between gap-1 pointer-events-auto ring-1 ring-white/5">
            {/* 4 Compact Icon Chips */}
            <div className="flex items-center gap-1 flex-1 justify-around">
              {CHIPS.map((chip) => {
                const isActive = activeService === chip.id;
                const label = isHi ? chip.labelHi : chip.labelEn;

                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleServiceSelect(chip.id)}
                    className={`relative flex items-center gap-1 rounded-xl px-2 py-1.5 text-xs font-extrabold transition-all cursor-pointer h-9 focus-visible:outline-none ${
                      isActive
                        ? "text-black font-black"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeMobileDockChip"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        className={`absolute inset-0 rounded-xl shadow-md -z-10 ${
                          student
                            ? "bg-gradient-to-r from-emerald-400 to-teal-300"
                            : "bg-gradient-to-r from-amber-400 to-amber-300"
                        }`}
                      />
                    )}
                    <span className="text-sm leading-none">{chip.emoji}</span>
                    <span className="text-[11px] leading-none">{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Action Button */}
            <Button
              variant={student ? "hero" : "warm"}
              size="sm"
              className="h-9 px-3 shrink-0 rounded-xl font-black text-xs shadow-md cursor-pointer ml-1"
              onClick={() => {
                playPop();
                onBook({ service: activeService === "rooms" ? "spaces" : activeService });
              }}
            >
              <Zap className="h-3.5 w-3.5 mr-0.5 fill-current" />
              <span>{student ? "Book" : "List"}</span>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
