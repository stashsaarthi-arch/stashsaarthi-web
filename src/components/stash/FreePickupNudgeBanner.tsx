import React from "react";
import { motion } from "motion/react";
import { Truck, Sparkles, Plus, CheckCircle2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { calculateFreePickupStatus, STANDARD_PICKUP_FEE } from "@/lib/freePickupThreshold";

interface FreePickupNudgeBannerProps {
  boxCount: number;
  onAddBox?: () => void;
  className?: string;
  compact?: boolean;
}

export const FreePickupNudgeBanner: React.FC<FreePickupNudgeBannerProps> = ({
  boxCount,
  onAddBox,
  className = "",
  compact = false,
}) => {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const status = calculateFreePickupStatus(boxCount);

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all duration-300 ${
          status.unlocked
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
        } ${className}`}
      >
        <Truck className={`w-3.5 h-3.5 ${status.unlocked ? "text-emerald-400" : "text-amber-400 animate-pulse"}`} />
        <span>
          {status.unlocked
            ? isHi
              ? "100% मुफ़्त डोरस्टेप पिकअप"
              : "100% Free Doorstep Pickup"
            : isHi
            ? `1 और बॉक्स जोड़ें = मुफ़्त पिकअप (₹${STANDARD_PICKUP_FEE} बचाएं)`
            : `Add 1 box to unlock FREE pickup (Save ₹${STANDARD_PICKUP_FEE})`}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-300 ${
        status.unlocked
          ? "bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-teal-950/40 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          : "bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-orange-950/40 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
      } ${className}`}
    >
      {/* Background Accent Glow */}
      <div
        className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-20 ${
          status.unlocked ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left Side: Icon & Dynamic Message */}
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-lg border shrink-0 mt-0.5 sm:mt-0 ${
              status.unlocked
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            }`}
          >
            {status.unlocked ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Truck className="w-5 h-5 text-amber-400 animate-bounce" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                  status.unlocked
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                }`}
              >
                {isHi ? status.badgeTagHi : status.badgeTagEn}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                {isHi ? "कैंपस सत्यापित पिकअप SLA" : "Verified Campus Pickup SLA"}
              </span>
            </div>

            <p className="text-sm font-semibold text-white leading-snug">
              {status.unlocked
                ? isHi
                  ? status.unlockedMessageHi
                  : status.unlockedMessageEn
                : isHi
                ? status.nudgeMessageHi
                : status.nudgeMessageEn}
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-xs space-y-1 pt-1">
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${status.progressPercent}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    status.unlocked
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                      : "bg-gradient-to-r from-amber-500 to-yellow-400"
                  }`}
                />
              </div>
              <p className="text-[10px] text-slate-400 flex justify-between">
                <span>{isHi ? `${status.boxCount}/2 बॉक्स कार्ट में` : `${status.boxCount}/2 Boxes in Cart`}</span>
                <span>
                  {status.unlocked
                    ? isHi
                      ? "डोरस्टेप शुल्क: ₹0 (माफ़)"
                      : "Doorstep Fee: ₹0 (Waived)"
                    : isHi
                    ? `डोरस्टेप शुल्क: ₹${STANDARD_PICKUP_FEE}`
                    : `Doorstep Fee: ₹${STANDARD_PICKUP_FEE}`}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: CTA Button if locked */}
        {!status.unlocked && onAddBox && (
          <button
            type="button"
            onClick={onAddBox}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{isHi ? "+1 बॉक्स जोड़ें (+₹300/माह)" : "+ Add 1 Box (+₹300/mo)"}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
