import React from "react";
import { SHOW_PROTOTYPE_TAGS } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  className?: string;
  variant?: "pill" | "text" | "overlay";
}

export const PrototypeBadge: React.FC<Props> = ({ className = "", variant = "pill" }) => {
  const { language } = useLanguage();
  const isHi = language === "hi";

  if (!SHOW_PROTOTYPE_TAGS) return null;

  const text = isHi ? "[प्रोटोटाइप]" : "[PROTOTYPE]";
  const badgeText = isHi ? "प्रोटोटाइप" : "PROTOTYPE";

  if (variant === "text") {
    return (
      <span
        className={`text-[10px] uppercase font-mono tracking-wider font-bold text-amber-400/90 ${className}`}
      >
        {text}
      </span>
    );
  }

  if (variant === "overlay") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        {badgeText}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      {badgeText}
    </span>
  );
};
