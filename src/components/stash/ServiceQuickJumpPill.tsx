import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Soup, Boxes, Home, HandHeart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { dispatchNavTab, smoothScrollTo } from "./legal";
import { playTab } from "@/lib/audio";

type ServiceId = "kitchen" | "stash" | "rooms" | "connect";

interface ServiceChip {
  id: ServiceId;
  labelEn: string;
  labelHi: string;
  icon: typeof Boxes;
  emoji: string;
}

const SERVICE_CHIPS: ServiceChip[] = [
  { id: "kitchen", labelEn: "Kitchen", labelHi: "किचन", icon: Soup, emoji: "🍱" },
  { id: "stash", labelEn: "Stash", labelHi: "स्टैश", icon: Boxes, emoji: "🧳" },
  { id: "rooms", labelEn: "Spaces", labelHi: "स्पेसेस", icon: Home, emoji: "🏠" },
  { id: "connect", labelEn: "Connect", labelHi: "कनेक्ट", icon: HandHeart, emoji: "🤝" },
];

export const ServiceQuickJumpPill = memo(function ServiceQuickJumpPill() {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<ServiceId>("stash");
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHi = language === "hi";
  const isStudent = role === "student";

  useEffect(() => {
    const handleScroll = () => {
      // Becomes visible once scrolled past the hero section (~450px)
      const shouldShow = window.scrollY > 420;
      setVisible(shouldShow);
    };

    const handleTabEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (["stash", "rooms", "kitchen", "connect"].includes(detail)) {
        setActiveTab(detail as ServiceId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("stashsaarthi-solution-tab", handleTabEvent);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("stashsaarthi-solution-tab", handleTabEvent);
    };
  }, []);

  const handleSelect = (serviceId: ServiceId) => {
    playTab();
    setActiveTab(serviceId);
    dispatchNavTab("solution", serviceId);
    smoothScrollTo("solutions", -90)();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="navigation"
          aria-label={isHi ? "त्वरित सेवा जंप बार" : "Quick Service Navigation Pill"}
          initial={{ opacity: 0, y: -20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.94 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-16 sm:top-18 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-1.5rem)] sm:max-w-md pointer-events-auto select-none"
        >
          <div className="flex items-center gap-1 rounded-full border border-white/12 bg-[#0A0D0F]/90 px-1.5 py-1 shadow-2xl backdrop-blur-2xl ring-1 ring-white/5">
            {SERVICE_CHIPS.map((chip) => {
              const isActive = activeTab === chip.id;
              const label = isHi ? chip.labelHi : chip.labelEn;

              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleSelect(chip.id)}
                  className={`relative flex items-center justify-center gap-1 sm:gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer min-h-[38px] sm:min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    isActive
                      ? "text-black font-extrabold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeServiceQuickJumpPill"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      className={`absolute inset-0 rounded-full shadow-md -z-10 ${
                        isStudent
                          ? "bg-gradient-to-r from-emerald-400 to-teal-300"
                          : "bg-gradient-to-r from-amber-400 to-amber-300"
                      }`}
                    />
                  )}
                  <span className="text-xs shrink-0" aria-hidden="true">
                    {chip.emoji}
                  </span>
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
