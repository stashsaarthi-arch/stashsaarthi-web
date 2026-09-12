import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isSoundEnabled, toggleSound } from "@/lib/audio";
import { useLanguage } from "@/context/LanguageContext";

export interface SoundToggleProps {
  compact?: boolean;
  className?: string;
}

export const SoundToggle = React.memo(function SoundToggle({
  compact = false,
  className = "",
}: SoundToggleProps) {
  const [enabled, setEnabled] = useState(false);
  const { language } = useLanguage();
  const isHi = language === "hi";

  useEffect(() => {
    setEnabled(isSoundEnabled());
  }, []);

  const handleToggle = () => {
    const next = toggleSound();
    setEnabled(next);
  };

  const label = enabled
    ? isHi
      ? "ऑडियो फीडबैक सक्रिय"
      : "Sound feedback on"
    : isHi
      ? "ऑडियो म्यूट"
      : "Sound muted";

  const title = enabled
    ? isHi
      ? "ऑडियो फीडबैक बंद करने के लिए क्लिक करें"
      : "Click to mute subtle micro-interaction sounds"
    : isHi
      ? "ऑडियो फीडबैक चालू करने के लिए क्लिक करें"
      : "Click to enable subtle micro-interaction sounds";

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleToggle}
        title={title}
        aria-label={label}
        aria-pressed={enabled}
        className={`relative inline-flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-95 cursor-pointer ${
          enabled
            ? "bg-white/10 text-emerald-400 border border-emerald-500/30 hover:bg-white/15"
            : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"
        } ${className}`}
      >
        {enabled ? (
          <Volume2 className="h-3.5 w-3.5" />
        ) : (
          <VolumeX className="h-3.5 w-3.5 opacity-60" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={title}
      aria-label={label}
      aria-pressed={enabled}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer active:scale-95 ${
        enabled
          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
          : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white"
      } ${className}`}
    >
      {enabled ? (
        <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <VolumeX className="h-3.5 w-3.5" />
      )}
      <span>{enabled ? (isHi ? "ध्वनि चालू" : "Sound On") : (isHi ? "ध्वनि म्यूट" : "Sound Off")}</span>
    </button>
  );
});
