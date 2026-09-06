import React from "react";
import { Zap, ZapOff, Gauge } from "lucide-react";
import { useLowData } from "@/context/LowDataContext";
import { useLanguage } from "@/context/LanguageContext";

export interface LowDataToggleProps {
  compact?: boolean;
  className?: string;
}

export const LowDataToggle = React.memo(function LowDataToggle({
  compact = false,
  className = "",
}: LowDataToggleProps) {
  const { isLowData, toggleLowData, isAutoDetected, effectiveType } = useLowData();
  const { language } = useLanguage();
  const isHi = language === "hi";

  const label = isLowData
    ? isHi
      ? "लो-डेटा ऑन"
      : "Low-Data ON"
    : isHi
      ? "स्टैंडर्ड मोड"
      : "Standard Mode";

  const tooltip = isLowData
    ? isHi
      ? "लो-डेटा मोड चालू है: एनिमेशन और 3D बंद हैं।"
      : `Low-Data Mode Active (${effectiveType.toUpperCase()}): Animations & 3D disabled.`
    : isHi
      ? "लो-डेटा मोड चालू करने के लिए क्लिक करें (कम डेटा वाले नेटवर्क के लिए)।"
      : "Click to enable Low-Data Mode for weak 2G/3G cellular networks.";

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleLowData}
        title={tooltip}
        aria-label={label}
        aria-pressed={isLowData}
        className={`relative inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-95 cursor-pointer ${
          isLowData
            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
            : "bg-white/5 text-muted-foreground hover:text-white border border-white/10 hover:bg-white/10"
        } ${className}`}
      >
        {isLowData ? (
          <ZapOff className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
        ) : (
          <Zap className="h-3.5 w-3.5 text-emerald-400" />
        )}
        <span className="whitespace-nowrap">{isLowData ? (isHi ? "लो-डेटा" : "Low-Data") : (isHi ? "डेटा" : "Data")}</span>
        {isAutoDetected && isLowData && (
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLowData}
      title={tooltip}
      aria-label={label}
      aria-pressed={isLowData}
      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
        isLowData
          ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-md"
          : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
      } ${className}`}
    >
      <div className="flex items-center gap-2">
        {isLowData ? (
          <Gauge className="h-4 w-4 text-amber-400 shrink-0" />
        ) : (
          <Zap className="h-4 w-4 text-emerald-400 shrink-0" />
        )}
        <div className="flex flex-col text-left">
          <span>{label}</span>
          <span className="text-[10px] font-normal text-muted-foreground">
            {isLowData
              ? isHi
                ? "एनिमेशन और WebGL बंद"
                : "Static images & 0 WebGL"
              : isHi
                ? "120 FPS kinetic एनिमेशन"
                : "120 FPS kinetic animations"}
          </span>
        </div>
      </div>
      <div
        className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold ${
          isLowData ? "bg-amber-500/30 text-amber-200" : "bg-white/10 text-slate-400"
        }`}
      >
        {isLowData ? (isHi ? "सक्रिय" : "ACTIVE") : (isHi ? "ऑफ" : "OFF")}
      </div>
    </button>
  );
});
