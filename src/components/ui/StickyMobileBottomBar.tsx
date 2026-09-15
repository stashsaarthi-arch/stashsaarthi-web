import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ShieldCheck, Zap, Lock, Sparkles } from "lucide-react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { getStickyMobileBottomBarTokens } from "@/lib/designTokens";
import { playClick, playPop, playSuccessChime } from "@/lib/audio";

export interface StickyMobileBottomBarProps {
  onBook?: ((prefill?: { service?: string; note?: string }) => void) | undefined;
  onListRoom?: (() => void) | undefined;
  className?: string;
  forceVisible?: boolean;
}

export const StickyMobileBottomBar = memo(function StickyMobileBottomBar({
  onBook,
  onListRoom,
  className = "",
  forceVisible = false,
}: StickyMobileBottomBarProps) {
  const { role } = usePersona();
  const { language } = useLanguage();
  const isStudent = role === "student";
  const isHi = language === "hi";

  const tokens = getStickyMobileBottomBarTokens(role);
  const persona = tokens.persona;

  const [isVisible, setIsVisible] = useState(() => forceVisible || (typeof window !== "undefined" && window.innerWidth < 768));

  useEffect(() => {
    if (forceVisible) {
      setIsVisible(true);
      return;
    }

    const handleScrollOrResize = () => {
      if (window.innerWidth < 768 || window.scrollY > 150) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    handleScrollOrResize();
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [forceVisible]);

  const handlePrimaryClick = useCallback(() => {
    playSuccessChime();
    if (isStudent) {
      if (onBook) {
        onBook({ service: "stash", note: "Instant Mobile Sticky CTA @ ₹300/mo" });
      } else {
        window.dispatchEvent(
          new CustomEvent("stashsaarthi:open-booking", {
            detail: { service: "stash", note: "Instant Mobile Sticky CTA @ ₹300/mo" },
          })
        );
      }
    } else {
      if (onListRoom) {
        onListRoom();
      } else {
        window.dispatchEvent(new CustomEvent("stashsaarthi-solution-tab", { detail: "rooms" }));
      }
    }
  }, [isStudent, onBook, onListRoom]);

  const handleSecondaryClick = useCallback(() => {
    playPop();
    const whatsappUrl = "https://wa.me/919369454350?text=" + encodeURIComponent("Hi StashSaarthi, I want to book vacation storage @ ₹300/mo!");
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`sticky-mobile-bottom-bar-container md:hidden ${className}`}
        >
          <div
            role="region"
            aria-label={isHi ? "मोबाइल त्वरित स्टोरेज एक्शन बार" : "Sticky Mobile Storage Action Bar"}
            className={`sticky-mobile-bottom-bar-panel ${persona.barBg} relative overflow-hidden`}
          >
            {/* Ambient accent pulse ring */}
            <div
              className="absolute -left-10 -top-10 w-24 h-24 rounded-full opacity-20 pointer-events-none blur-xl"
              style={{ backgroundColor: persona.accentColor }}
            />

            {/* Left Content Column: Price Tag & Trust Badges */}
            <div className="flex flex-col justify-center min-w-0 flex-1 pl-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-black text-white tracking-tight leading-none">
                  {tokens.primaryAction.priceTag}
                </span>
                <span className={`sticky-mobile-bottom-bar-badge-pill ${persona.badgeBg}`}>
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  {isHi ? tokens.primaryAction.badgeHi : tokens.primaryAction.badgeEn}
                </span>
              </div>

              <div className="flex items-center gap-1 mt-0.5 text-[11px] font-medium text-slate-300 truncate">
                <Zap className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">
                  {isHi ? tokens.header.titleHi : tokens.header.titleEn}
                </span>
              </div>
            </div>

            {/* Right Primary Action Button */}
            <button
              type="button"
              onClick={handlePrimaryClick}
              aria-label={isHi ? tokens.primaryAction.labelHi : tokens.primaryAction.labelEn}
              className={`sticky-mobile-bottom-bar-primary-cta ${persona.ctaBg} ${persona.ctaGlow} shrink-0`}
            >
              <span>
                {isStudent
                  ? isHi
                    ? tokens.primaryAction.labelHi
                    : tokens.primaryAction.labelEn
                  : isHi
                  ? tokens.secondaryAction.labelHi
                  : tokens.secondaryAction.labelEn}
              </span>
              <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
