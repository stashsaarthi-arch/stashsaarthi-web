import React, { useState, useEffect } from "react";
import { Clock, Flame, Utensils, AlertTriangle, ChevronRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { playClick, playPop } from "@/lib/audio";

interface DeliveryCutoffCountdownProps {
  initialSlot?: "Lunch" | "Dinner";
  onSelectSlot?: (slot: "Lunch" | "Dinner") => void;
  onBookClick?: () => void;
  variant?: "banner" | "sticky" | "compact";
  className?: string;
}

export const DeliveryCutoffCountdown: React.FC<DeliveryCutoffCountdownProps> = ({
  initialSlot,
  onSelectSlot,
  onBookClick,
  variant = "banner",
  className = "",
}) => {
  const { language } = useLanguage();
  const isHindi = language === "hi";

  // Determine upcoming slot based on current hour if not explicitly set
  const [activeSlot, setActiveSlot] = useState<"Lunch" | "Dinner">(() => {
    if (initialSlot) return initialSlot;
    const currentHour = new Date().getHours();
    // Before 7am -> Lunch, 7am - 2pm -> Dinner, Past 2pm -> Next Day Lunch
    if (currentHour >= 7 && currentHour < 14) {
      return "Dinner";
    }
    return "Lunch";
  });

  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isUrgent: boolean;
    isCritical: boolean;
    isLocked: boolean;
    nextSlotLabel: string;
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isUrgent: false,
    isCritical: false,
    isLocked: false,
    nextSlotLabel: "Lunch",
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const target = new Date();

      if (activeSlot === "Lunch") {
        // Lunch cutoff is 7:00 AM
        target.setHours(7, 0, 0, 0);
        if (now.getTime() >= target.getTime()) {
          // If past 7 AM, move target to tomorrow 7 AM
          target.setDate(target.getDate() + 1);
        }
      } else {
        // Dinner cutoff is 2:00 PM (14:00)
        target.setHours(14, 0, 0, 0);
        if (now.getTime() >= target.getTime()) {
          // If past 2 PM, move target to tomorrow 2 PM
          target.setDate(target.getDate() + 1);
        }
      }

      const diffMs = target.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          isUrgent: true,
          isCritical: true,
          isLocked: true,
          nextSlotLabel: activeSlot,
        });
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      // Urgent if under 2 hours, Critical if under 45 mins
      const isUrgent = hours < 2;
      const isCritical = hours === 0 && minutes < 45;

      setTimeLeft({
        hours,
        minutes,
        seconds,
        isUrgent,
        isCritical,
        isLocked: false,
        nextSlotLabel: activeSlot,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [activeSlot]);

  const handleSlotSwitch = (slot: "Lunch" | "Dinner") => {
    playClick();
    setActiveSlot(slot);
    if (onSelectSlot) {
      onSelectSlot(slot);
    }
  };

  // Format natural countdown text (e.g. "1 hour 24 mins" or "35 mins")
  const getFormattedTimeText = () => {
    if (timeLeft.hours > 0) {
      if (isHindi) {
        return `${timeLeft.hours} घंटा ${timeLeft.minutes} मिनट`;
      }
      return `${timeLeft.hours} hr ${timeLeft.minutes} min`;
    }
    if (isHindi) {
      return `${timeLeft.minutes} मिनट ${timeLeft.seconds} से.`;
    }
    return `${timeLeft.minutes} mins ${timeLeft.seconds}s`;
  };

  // Get dynamic background and text color based on urgency
  const getThemeClasses = () => {
    if (timeLeft.isCritical) {
      return {
        wrapper: "bg-gradient-to-r from-rose-950/90 via-red-900/90 to-amber-950/90 border-rose-500/60 shadow-[0_0_25px_-5px_rgba(244,63,94,0.4)]",
        badge: "bg-rose-500 text-slate-950 animate-pulse font-extrabold",
        timerText: "text-rose-300 font-mono font-black",
        accentIcon: "text-rose-400 animate-bounce",
      };
    }
    if (timeLeft.isUrgent) {
      return {
        wrapper: "bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-amber-500/50 shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]",
        badge: "bg-amber-500 text-slate-950 font-bold",
        timerText: "text-amber-300 font-mono font-bold",
        accentIcon: "text-amber-400 animate-pulse",
      };
    }
    return {
      wrapper: "bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border-emerald-500/30 shadow-lg",
      badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold",
      timerText: "text-emerald-400 font-mono font-bold",
      accentIcon: "text-emerald-400",
    };
  };

  const theme = getThemeClasses();

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md ${theme.wrapper} ${className}`}>
        <Clock className={`w-3.5 h-3.5 ${theme.accentIcon}`} />
        <span className="text-xs text-slate-300 font-medium">
          {activeSlot} {isHindi ? "कटऑफ:" : "Cutoff:"}
        </span>
        <span className={`text-xs ${theme.timerText}`}>
          {getFormattedTimeText()}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 ${theme.wrapper} ${className}`}>
      {/* Animated subtle light sweep effect for critical state */}
      {timeLeft.isCritical && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Column: Slot Selector & Urgency Headline */}
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Urgency Badge */}
            <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider ${theme.badge}`}>
              {timeLeft.isCritical ? (
                <>
                  <Flame className="w-3 h-3 fill-slate-950" />
                  {isHindi ? "अंतिम 45 मिनट बाकी!" : "Closing Soon!"}
                </>
              ) : timeLeft.isUrgent ? (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  {isHindi ? "सीमित समय शेष" : "Limited Time"}
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" />
                  {isHindi ? "लाइव कटऑफ टाइमर" : "Live Slot Cutoff"}
                </>
              )}
            </span>

            {/* Slot Switcher Pills */}
            <div className="inline-flex bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => handleSlotSwitch("Lunch")}
                className={`px-2.5 py-1 rounded-md transition-all font-semibold cursor-pointer ${
                  activeSlot === "Lunch"
                    ? "bg-emerald-500 text-slate-950 font-extrabold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isHindi ? "लंच (7:00 AM)" : "Lunch (7 AM)"}
              </button>
              <button
                type="button"
                onClick={() => handleSlotSwitch("Dinner")}
                className={`px-2.5 py-1 rounded-md transition-all font-semibold cursor-pointer ${
                  activeSlot === "Dinner"
                    ? "bg-emerald-500 text-slate-950 font-extrabold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isHindi ? "डिनर (2:00 PM)" : "Dinner (2 PM)"}
              </button>
            </div>
          </div>

          {/* Natural Readable Countdown Sentence */}
          <div className="flex items-baseline gap-2">
            <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <span>
                {isHindi
                  ? `${activeSlot === "Lunch" ? "लंच" : "डिनर"} बुक करने के लिए ${getFormattedTimeText()} शेष!`
                  : `${getFormattedTimeText()} left to book ${activeSlot}!`}
              </span>
            </h4>
          </div>

          <p className="text-xs text-slate-300 font-medium">
            {isHindi
              ? activeSlot === "Lunch"
                ? "सुबह 7:00 बजे के बाद दोपहर 1:00 बजे का लंच स्लॉट लॉक हो जाएगा।"
                : "दोपहर 2:00 बजे के बाद रात 8:00 बजे का डिनर स्लॉट लॉक हो जाएगा।"
              : activeSlot === "Lunch"
                ? "Lunch slot locks at 7:00 AM for 1:00 PM fresh tiffin delivery."
                : "Dinner slot locks at 2:00 PM for 8:00 PM fresh tiffin delivery."}
          </p>
        </div>

        {/* Right Column: Clock Telemetry Box & Action Button */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800/80 pt-3 md:pt-0">
          {/* Digital Clock Box */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl px-3.5 py-2 flex items-center gap-2">
            <div className="text-right">
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                {isHindi ? "समय शेष" : "Cutoff Timer"}
              </span>
              <div className={`text-lg sm:text-xl ${theme.timerText}`}>
                {String(timeLeft.hours).padStart(2, "0")}:
                {String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
            </div>
          </div>

          {/* Order CTA Button */}
          {onBookClick && (
            <button
              type="button"
              onClick={() => {
                playPop();
                onBookClick();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition-all shadow-md hover:scale-105 cursor-pointer shrink-0"
            >
              <Utensils className="w-4 h-4" />
              <span>{isHindi ? `अभी ${activeSlot} बुक करें` : `Book ${activeSlot} Now`}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
