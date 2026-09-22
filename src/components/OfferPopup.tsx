import React, { useState, useEffect } from "react";
import { Star, Timer, X, Copy, CheckCircle2, Zap } from "lucide-react";

interface OfferPopupProps {
  onClaimDiscount: (code: string, service: string) => void;
}

export function OfferPopup({ onClaimDiscount }: OfferPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(294); // 4 minutes 54 seconds
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Show popup after 15 seconds
    const timer = setTimeout(() => {
      // Basic check if they haven't seen it yet (for real usage we'd use localStorage)
      const hasSeen = localStorage.getItem("stashsaarthi_offer_seen");
      if (!hasSeen) {
        setIsOpen(true);
      }
    }, 15000);

    return () => clearTimeout(timer);
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
    localStorage.setItem("stashsaarthi_offer_seen", "true");
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" onClick={handleClose} />

      {/* Modal Container strictly centered to avoid scrolling bugs */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[90%] max-w-md bg-[#0A0D0F] border border-emerald-900/30 rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full text-xs font-bold tracking-wider">
            <Star className="w-3.5 h-3.5 fill-current" />
            EXCLUSIVE STUDENT OFFER
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-orange-500 text-sm font-bold font-mono">
              <Timer className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title & Subtext */}
        <div className="text-center mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
            Wait! Don't Leave Without Saving ₹50 on Your Vacation Stash 🧳
          </h2>
          <p className="text-sm text-slate-400">
            Why pay thousands in dead-rent for an empty PG room during breaks? Lock in micro-storage
            or zero-brokerage rooms today with an instant discount.
          </p>
        </div>

        {/* Coupon Box */}
        <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-800/50 rounded-lg p-3 mb-5">
          <div>
            <div className="text-xs text-emerald-400/80 mb-0.5">Instant Coupon Code</div>
            <div className="text-lg font-bold text-emerald-400 tracking-wider">STASH50</div>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 transition-colors text-sm font-semibold flex items-center gap-2"
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>

        {/* Bullet Points */}
        <ul className="space-y-2.5 mb-6">
          <li className="flex items-start gap-2.5 text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Flat ₹50 OFF applied instantly on your first booking</span>
          </li>
          <li className="flex items-start gap-2.5 text-sm text-slate-300">
            <Zap className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Free ₹10,000 Micro-Insurance & Laser Tamper Seal</span>
          </li>
          <li className="flex items-start gap-2.5 text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Zero Cancellation Fee & 100% Refund SLA Warranty</span>
          </li>
        </ul>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => {
              handleClose();
              onClaimDiscount("STASH50", "stash");
            }}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            Claim ₹50 Discount & Book Now →
          </button>

          <a
            href="https://wa.me/919369454350"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="w-full py-3 bg-transparent border border-white/10 hover:bg-white/5 text-white rounded-xl font-semibold transition-colors flex items-center justify-center text-sm"
          >
            Ask Founder Advik via Direct WhatsApp (+91 9369454350)
          </a>
        </div>

        {/* Bottom Text Link */}
        <div className="mt-5 text-center">
          <button
            onClick={handleClose}
            className="text-xs text-slate-500 hover:text-slate-400 underline underline-offset-2 transition-colors"
          >
            No thanks, I'll pay full price later
          </button>
        </div>
      </div>
    </>
  );
}
