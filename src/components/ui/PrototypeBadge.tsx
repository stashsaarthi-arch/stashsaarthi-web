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
        className={`text-xs uppercase font-mono tracking-wider font-bold text-slate-400 ${className}`}
      >
        {text}
      </span>
    );
  }

  if (variant === "overlay") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-300 text-xs font-mono font-bold uppercase tracking-wider ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        {badgeText}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/70 border border-slate-700 text-slate-300 text-xs font-mono font-bold uppercase tracking-wider ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
      {badgeText}
    </span>
  );
};
