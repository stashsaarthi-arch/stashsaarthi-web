import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Timer, X, Copy, CheckCircle2, Zap } from "lucide-react";

interface OfferPopupProps {
  onClaimDiscount: (code: string, service: string) => void;
}

export function OfferPopup({ onClaimDiscount }: OfferPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(294); // 4 minutes 54 seconds
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasSeen = sessionStorage.getItem("stashsaarthi_exit_intent_seen");
    if (hasSeen) return;

    // Desktop Exit Intent
    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger if mouse moves up towards the tab bar
      if (e.clientY < 10) {
        if (!sessionStorage.getItem("stashsaarthi_exit_intent_seen")) {
          setIsOpen(true);
          sessionStorage.setItem("stashsaarthi_exit_intent_seen", "true");
        }
      }
    };

    // Mobile & Desktop Idle Timeout
    let idleTimer: NodeJS.Timeout;
    const resetIdle = () => {
      clearTimeout(idleTimer);
      if (!sessionStorage.getItem("stashsaarthi_exit_intent_seen")) {
        idleTimer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem("stashsaarthi_exit_intent_seen", "true");
        }, 30000); // 30 seconds idle timeout
      }
    };

    // Attach exit intent
    window.addEventListener("mouseout", handleMouseLeave);
    
    // Attach activity listeners for idle timeout
    const events = ["touchstart", "scroll", "mousemove", "keydown"];
    events.forEach(evt => window.addEventListener(evt, resetIdle, { passive: true }));
    
    resetIdle(); // Initialize the timer

    return () => {
      window.removeEventListener("mouseout", handleMouseLeave);
      events.forEach(evt => window.removeEventListener(evt, resetIdle));
      clearTimeout(idleTimer);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("STASH50");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `0${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Ensure SSR safety before using createPortal
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="offer-popup"
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Glass Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-md" 
            onClick={handleClose} 
          />

          {/* iOS Liquid Glass Modal Box */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-[100000] w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl p-6 sm:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider border border-emerald-500/30">
                <Star className="w-3.5 h-3.5 fill-current" />
                EXCLUSIVE OFFER
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-orange-400 text-sm font-bold font-mono bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/20 shadow-inner">
                  <Timer className="w-4 h-4" />
                  {formatTime(timeLeft)}
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all border border-transparent hover:border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Title & Subtext */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight tracking-tight">
                Wait! Save ₹50 on Your Vacation Stash 🧳
              </h2>
              <p className="text-sm text-white/80 font-medium">
                Why pay thousands in dead-rent? Lock in micro-storage or zero-brokerage rooms today with an instant discount.
              </p>
            </div>

            {/* Coupon Box */}
            <div className="flex items-center justify-between bg-black/30 border border-white/10 rounded-2xl p-4 mb-7 shadow-inner backdrop-blur-lg">
              <div>
                <div className="text-xs text-white/60 mb-1 font-semibold tracking-widest uppercase">Coupon Code</div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 tracking-wider font-mono drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">STASH50</div>
              </div>
              <button
                onClick={handleCopy}
                className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 active:scale-95 transition-all text-sm font-bold flex items-center gap-2"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Bullet Points */}
            <ul className="space-y-3.5 mb-8">
              <li className="flex items-start gap-3 text-sm font-semibold text-white/90">
                <div className="bg-emerald-500/20 p-1.5 rounded-full mt-0.5 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
                <span>Flat ₹50 OFF applied instantly</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-semibold text-white/90">
                <div className="bg-emerald-500/20 p-1.5 rounded-full mt-0.5 border border-emerald-500/20">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
                <span>Free ₹10,000 Micro-Insurance & Laser Seal</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-semibold text-white/90">
                <div className="bg-emerald-500/20 p-1.5 rounded-full mt-0.5 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
                <span>Zero Cancellation Fee & 100% Refund SLA</span>
              </li>
            </ul>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={() => {
                  handleClose();
                  onClaimDiscount("STASH50", "stash");
                }}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-2xl font-black text-base transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Claim ₹50 Discount & Book →
              </button>

              <button
                onClick={handleClose}
                className="w-full py-2 text-xs font-bold text-white/50 hover:text-white/90 transition-colors uppercase tracking-widest"
              >
                No thanks, I'll pay full price later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
