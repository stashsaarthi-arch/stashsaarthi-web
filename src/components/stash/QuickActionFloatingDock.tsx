import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Boxes, Home, Soup, HandHeart, Sparkles, ArrowRight } from "lucide-react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { playPop, playClick } from "@/lib/audio";
import { smoothScrollTo } from "./legal";
import type { OpenBooking } from "./types";

export interface QuickActionFloatingDockProps {
  onBook?: OpenBooking | undefined;
  onListRoom?: (() => void) | undefined;
}

type TabKey = "stash" | "rooms" | "kitchen" | "connect";

interface DockTabItem {
  id: TabKey;
  icon: typeof Boxes;
  labelEn: string;
  labelHi: string;
  badgeEn: string;
  badgeHi: string;
  priceEn: string;
  priceHi: string;
}

const DOCK_TABS: DockTabItem[] = [
  {
    id: "stash",
    icon: Boxes,
    labelEn: "Stash",
    labelHi: "स्टैश",
    badgeEn: "Storage",
    badgeHi: "स्टोरेज",
    priceEn: "₹300/mo",
    priceHi: "₹300/माह",
  },
  {
    id: "rooms",
    icon: Home,
    labelEn: "Spaces",
    labelHi: "स्पेसेस",
    badgeEn: "0% Broker",
    badgeHi: "0% दलाली",
    priceEn: "₹5.5k",
    priceHi: "₹5.5k",
  },
  {
    id: "kitchen",
    icon: Soup,
    labelEn: "Kitchen",
    labelHi: "किचन",
    badgeEn: "Homestyle",
    badgeHi: "घर का खाना",
    priceEn: "₹90",
    priceHi: "₹90",
  },
  {
    id: "connect",
    icon: HandHeart,
    labelEn: "Connect",
    labelHi: "कनेक्ट",
    badgeEn: "Senior Care",
    badgeHi: "सीनियर केयर",
    priceEn: "Verified",
    priceHi: "सत्यापित",
  },
];

export const QuickActionFloatingDock = memo(function QuickActionFloatingDock({
  onBook,
  onListRoom,
}: QuickActionFloatingDockProps) {
  const [isVisible, setIsVisible] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState<TabKey>("stash");
  const { role } = usePersona();
  const { language } = useLanguage();
  const isStudent = role === "student";
  const isHi = language === "hi";

  // Track scroll position to trigger floating dock visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768 || window.scrollY > 220) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Sync active tab with solution tab custom events
  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (["stash", "rooms", "kitchen", "connect"].includes(detail)) {
        setActiveTab(detail as TabKey);
      }
    };

    window.addEventListener("stashsaarthi-solution-tab", handleTabChange);
    return () => window.removeEventListener("stashsaarthi-solution-tab", handleTabChange);
  }, []);

  // Handle tab click: switch tab, scroll to solutions section, play audio feedback
  const handleTabClick = useCallback(
    (tabId: TabKey) => {
      setActiveTab(tabId);
      playPop();

      // Dispatch global tab switch event so SolutionsHub updates immediately
      window.dispatchEvent(
        new CustomEvent("stashsaarthi-solution-tab", { detail: tabId })
      );

      // Smooth scroll to solutions hub
      smoothScrollTo("solutions")();
    },
    []
  );

  // Quick primary CTA trigger
  const handleCtaClick = useCallback(() => {
    playClick();
    if (isStudent) {
      if (onBook) {
        onBook({ service: activeTab });
      } else {
        window.dispatchEvent(
          new CustomEvent("stashsaarthi:open-booking", {
            detail: { service: activeTab },
          })
        );
      }
    } else {
      if (onListRoom) {
        onListRoom();
      } else {
        smoothScrollTo("solutions")();
      }
    }
  }, [isStudent, activeTab, onBook, onListRoom]);

  const activeColorClass = isStudent
    ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/15"
    : "text-amber-400 border-amber-500/40 bg-amber-500/15";

  const dockGlowClass = isStudent
    ? "shadow-[0_12px_40px_rgba(16,185,129,0.22)] border-emerald-500/30"
    : "shadow-[0_12px_40px_rgba(245,158,11,0.22)] border-amber-500/30";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 90, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 90, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="fixed bottom-3 left-3 right-3 md:hidden z-[90] max-w-md mx-auto pointer-events-none"
        >
          <nav
            aria-label={isHi ? "त्वरित मोबाइल 1-टैप नेविगेशन डौक" : "Quick Action Mobile Navigation Dock"}
            className={`glass relative flex items-center justify-between gap-1 rounded-full p-1.5 bg-[#0A0D0F]/90 backdrop-blur-2xl border ${dockGlowClass} transition-all duration-300 pointer-events-auto`}
          >
            {/* Ambient inner glow ring */}
            <div
              className={`absolute inset-0 rounded-full opacity-30 pointer-events-none ${
                isStudent ? "bg-emerald-500/10" : "bg-amber-500/10"
              }`}
            />

            {/* 4 Quick Action Tabs */}
            <div className="flex-1 flex items-center justify-around gap-0.5">
              {DOCK_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const label = isHi ? tab.labelHi : tab.labelEn;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={label}
                    onClick={() => handleTabClick(tab.id)}
                    className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-full transition-all duration-200 cursor-pointer min-h-[48px] focus-visible:outline-none focus-visible:ring-2 ${
                      isStudent ? "focus-visible:ring-emerald-400" : "focus-visible:ring-amber-400"
                    } ${
                      isActive
                        ? `${activeColorClass} shadow-md scale-105 font-bold`
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className={`h-4 w-4 transition-transform ${isActive ? "scale-110" : ""}`} />
                    <span className="text-[10px] tracking-tight mt-0.5 leading-none font-semibold">
                      {label}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="activeDockDot"
                        className={`absolute -bottom-0.5 h-1 w-1 rounded-full ${
                          isStudent ? "bg-emerald-400 shadow-[0_0_6px_#10B981]" : "bg-amber-400 shadow-[0_0_6px_#F59E0B]"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Divider */}
            <div className="h-7 w-[1px] bg-white/15 mx-0.5 shrink-0" />

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handleCtaClick}
              className={`shrink-0 h-11 px-3.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 ${
                isStudent
                  ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/25"
                  : "bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/25"
              }`}
            >
              <span>{isStudent ? (isHi ? "बुक करें" : "Book") : isHi ? "लिस्ट" : "List"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
