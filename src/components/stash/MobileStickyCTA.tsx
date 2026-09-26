import React from "react";
import { Utensils, Package, Home, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { dispatchNavTab, smoothScrollTo } from "./legal";
import { playTab, playPop } from "@/lib/audio";
import { ArrowRight, Zap } from "lucide-react";
import type { OpenBooking } from "./types";
import { useState, useEffect, useRef } from "react";
import { usePersona } from "@/context/PersonaContext";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";

type ServiceId = "kitchen" | "stash" | "rooms";

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
];

export const MobileStickyCTA = React.memo(function MobileStickyCTA({
  onBook,
}: {
  onBook: OpenBooking;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const visibleRef = useRef(false);
  const [activeService, setActiveService] = useState<ServiceId>("stash");
  const { role } = usePersona();
  const { language } = useLanguage();
  const isHi = language === "hi";
  const student = role === "student";

  useEffect(() => {
    const handleScroll = () => {
      const shouldBeVisible = window.scrollY > 250;
      if (shouldBeVisible !== visibleRef.current) {
        visibleRef.current = shouldBeVisible;
        setIsVisible(shouldBeVisible);
      }
    };

    const handleTabEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (["stash", "rooms", "kitchen"].includes(detail)) {
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
          className="fixed bottom-0 w-full z-50 sm:hidden pointer-events-none pb-[env(safe-area-inset-bottom)]"
        >
          {/* Floating Dock: height <= 64px */}
          <div className="h-[64px] w-full px-4 py-2 bg-[#0A0D0F]/90 backdrop-blur-md border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] flex items-center justify-between gap-2 pointer-events-auto">
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
