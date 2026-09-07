import React, { useState, useEffect } from "react";
import { playPop } from "@/lib/audio";
import { Sparkles, Check, RefreshCw } from "lucide-react";

interface PeacockFeatherMatkiDustingProps {
  isAutoTriggered?: boolean;
  onDustComplete?: () => void;
  className?: string;
  compact?: boolean;
}

export const PeacockFeatherMatkiDusting: React.FC<PeacockFeatherMatkiDustingProps> = ({
  isAutoTriggered = false,
  onDustComplete,
  className = "",
  compact = false,
}) => {
  const [isDusting, setIsDusting] = useState<boolean>(false);
  const [dustCount, setDustCount] = useState<number>(1);
  const [showSparkles, setShowSparkles] = useState<boolean>(false);

  const triggerDusting = () => {
    if (isDusting) return;
    setIsDusting(true);
    setShowSparkles(true);
    playPop();

    // Reset animation state after feather sweep
    setTimeout(() => {
      setIsDusting(false);
      setDustCount((prev) => prev + 1);
      if (onDustComplete) onDustComplete();
    }, 1200);

    setTimeout(() => {
      setShowSparkles(false);
    }, 2000);
  };

  useEffect(() => {
    if (isAutoTriggered) {
      triggerDusting();
    }
  }, [isAutoTriggered]);

  if (compact) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          triggerDusting();
        }}
        className={`relative z-10 group cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 transition-all ${className}`}
        title="Click to dust fresh white butter on thali"
      >
        {/* Animated Feather Icon */}
        <div className={`relative transition-transform duration-700 pointer-events-none ${isDusting ? "animate-bounce scale-110" : "group-hover:scale-110"}`}>
          <svg className="w-5 h-5 text-emerald-400 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C12 2 17 6 17 11C17 14 15 16 12 22C9 16 7 14 7 11C7 6 12 2 12 2Z"
              fill="url(#peacockGradientCompact)"
              stroke="#10B981"
              strokeWidth="1.5"
            />
            <ellipse cx="12" cy="10" rx="2.5" ry="3.5" fill="#1E3A8A" stroke="#06B6D4" strokeWidth="1" />
            <circle cx="12" cy="10" r="1.2" fill="#F59E0B" />
            <defs>
              <linearGradient id="peacockGradientCompact" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#059669" />
                <stop offset="0.5" stopColor="#0D9488" />
                <stop offset="1" stopColor="#1E3A8A" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <span className="text-xs font-bold text-emerald-300 pointer-events-none">
          {isDusting ? "🪶 Dusting Makhan..." : "🪶 Fresh Makhan Dusted"}
        </span>

        {showSparkles && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 pointer-events-none" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300 pointer-events-none" />
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 border border-amber-500/30 p-4 shadow-lg transition-all ${className}`}
    >
      {/* Background Ghee Glow */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Matki & Feather Visual Stage */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center bg-slate-900/90 rounded-2xl border border-amber-500/40 p-2 shadow-inner">
            {/* Matki Pot SVG */}
            <svg className="w-12 h-12 text-amber-600" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Pot Body */}
              <path
                d="M16 28C16 18 20 14 32 14C44 14 48 18 48 28C48 42 44 54 32 54C20 54 16 42 16 28Z"
                fill="url(#matkiClay)"
                stroke="#B45309"
                strokeWidth="2"
              />
              {/* Pot Rim */}
              <ellipse cx="32" cy="16" rx="14" ry="4" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
              {/* White Butter / Makhan Mound */}
              <path
                d="M20 16C20 12 24 10 32 10C40 10 44 12 44 16C44 18 38 21 32 21C26 21 20 18 20 16Z"
                fill="#FFFBEB"
                stroke="#FEF3C7"
                strokeWidth="1"
              />
              <circle cx="28" cy="14" r="2" fill="#FEF08A" />
              <circle cx="34" cy="13" r="1.5" fill="#FEF08A" />

              <defs>
                <linearGradient id="matkiClay" x1="32" y1="14" x2="32" y2="54" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#D97706" />
                  <stop offset="0.7" stopColor="#B45309" />
                  <stop offset="1" stopColor="#78350F" />
                </linearGradient>
              </defs>
            </svg>

            {/* Peacock Feather Overlay with Micro Sweep Motion */}
            <div
              className={`absolute top-0 right-0 transform transition-all duration-700 origin-bottom-left pointer-events-none ${
                isDusting
                  ? "rotate-[25deg] translate-x-1 -translate-y-2 scale-125"
                  : "rotate-[-10deg] translate-x-2 -translate-y-1 hover:rotate-[5deg]"
              }`}
            >
              <svg className="w-10 h-10 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] pointer-events-none" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 2C16 2 24 8 24 16C24 21 21 24 16 30C11 24 8 21 8 16C8 8 16 2 16 2Z"
                  fill="url(#featherGradient)"
                  stroke="#10B981"
                  strokeWidth="1"
                />
                <ellipse cx="16" cy="14" rx="4" ry="5" fill="#1E3A8A" stroke="#06B6D4" strokeWidth="1" />
                <circle cx="16" cy="14" r="2" fill="#F59E0B" />
                <path d="M16 22V30" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
                <defs>
                  <linearGradient id="featherGradient" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#10B981" />
                    <stop offset="0.5" stopColor="#06B6D4" />
                    <stop offset="1" stopColor="#1E3A8A" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Floating Sparkle Particles */}
            {showSparkles && (
              <>
                <span className="absolute -top-2 left-2 text-xs animate-ping pointer-events-none">✨</span>
                <span className="absolute top-1 -right-2 text-xs animate-bounce pointer-events-none">🧈</span>
                <span className="absolute -bottom-1 left-4 text-xs animate-pulse pointer-events-none">💛</span>
              </>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Satvik Micro-Interaction
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded-md border border-amber-500/30">
                Fresh Makhan #{dustCount}
              </span>
            </div>
            <h4 className="text-sm font-black text-white mt-0.5">
              Peacock Feather <span className="text-amber-300">Desi Makhan Dusting</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Selecting <strong className="text-emerald-400">Standard Thali</strong> triggers our signature Mor-Pankh dusting, topping your phulke with authentic home-crafted white butter.
            </p>
          </div>
        </div>

        {/* Action Trigger Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerDusting();
          }}
          disabled={isDusting}
          className={`relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md ${
            isDusting
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 hover:scale-105"
          }`}
        >
          {isDusting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Dusting Matki...</span>
            </>
          ) : (
            <>
              <span>🪶 Re-dust Fresh Butter</span>
              <Check className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
