import React from "react";
import { motion } from "motion/react";
import { Search, Sparkles, RefreshCw, ChevronRight, ShieldCheck, MapPin, Compass } from "lucide-react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  PERSONA_EMPTY_STATE_TOKENS,
  getPersonaEmptyStateTokens,
  type EmptyStateVariantTier,
} from "@/lib/designTokens";
import { playPop } from "@/lib/audio";
import { Button } from "@/components/ui/button";

export interface PersonaEmptyStateProps {
  /** Variant preset or defaults to persona mode */
  variant?: EmptyStateVariantTier;
  /** Custom title string (English) */
  title?: string;
  /** Custom title string (Hindi) */
  titleHi?: string;
  /** Custom description (English) */
  description?: string;
  /** Custom description (Hindi) */
  descriptionHi?: string;
  /** Primary button action handler */
  onPrimaryAction?: () => void;
  /** Primary button label (English) */
  primaryActionLabel?: string;
  /** Primary button label (Hindi) */
  primaryActionLabelHi?: string;
  /** Secondary button action handler */
  onSecondaryAction?: () => void;
  /** Secondary button label (English) */
  secondaryActionLabel?: string;
  /** Secondary button label (Hindi) */
  secondaryActionLabelHi?: string;
  /** Callback when a suggestion chip is clicked */
  onSuggestionClick?: (suggestion: string) => void;
  /** Custom suggestion array */
  customSuggestions?: string[];
  /** Optional container CSS class overrides */
  className?: string;
}

/**
 * Charming SVG Illustration for Student Persona Search Misses
 */
function StudentSearchMissSvg({ accent = "#00F5A0", secondary = "#06B6D4" }: { accent?: string; secondary?: string }) {
  return (
    <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
      {/* Background ambient glow halo */}
      <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-2xl animate-pulse" />

      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10">
        <defs>
          <linearGradient id="studentSvgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.8" />
            <stop offset="100%" stopColor={secondary} stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="radarPulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.4" />
            <stop offset="100%" stopColor={secondary} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Concentric Radar Rings */}
        <circle cx="100" cy="100" r="75" stroke={accent} strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
        <circle cx="100" cy="100" r="50" stroke={secondary} strokeWidth="1.5" opacity="0.4" />
        <circle cx="100" cy="100" r="25" stroke={accent} strokeWidth="1" opacity="0.5" />
        <circle cx="100" cy="100" r="85" fill="url(#radarPulse)" />

        {/* Sweeping Radar Scanner Line */}
        <path d="M100 100 L160 50 A 75 75 0 0 0 100 25 Z" fill="url(#studentSvgGrad)" opacity="0.25" />

        {/* Floating Cyberpunk Luggage Carton */}
        <rect x="55" y="115" width="45" height="32" rx="6" fill="#0F172A" stroke={accent} strokeWidth="2" opacity="0.9" />
        <line x1="55" y1="128" x2="100" y2="128" stroke={secondary} strokeWidth="1.5" strokeDasharray="3 3" />
        <rect x="70" y="122" width="15" height="4" rx="1" fill={accent} opacity="0.8" />

        {/* Magnifying Glass & Search Pin Icon */}
        <circle cx="118" cy="78" r="22" stroke="url(#studentSvgGrad)" strokeWidth="3.5" fill="#0A0D0F" fillOpacity="0.85" />
        <line x1="134" y1="94" x2="155" y2="115" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        <path d="M112 78 C112 74.6863 114.686 72 118 72 C121.314 72 124 74.6863 124 78 C124 82 118 87 118 87 C118 87 112 82 112 78 Z" fill={secondary} opacity="0.9" />
        <circle cx="118" cy="77" r="2.5" fill="#0A0D0F" />

        {/* Floating Sparkles & Question Nodes */}
        <circle cx="45" cy="65" r="3" fill={accent} className="animate-ping" style={{ animationDuration: "3s" }} />
        <circle cx="160" cy="140" r="2" fill={secondary} />
        <circle cx="145" cy="45" r="3" fill={accent} />
      </svg>
    </div>
  );
}

/**
 * Charming SVG Illustration for Senior Host Persona Zero-Bookings State
 */
function HostZeroBookingsSvg({ accent = "#F59E0B", secondary = "#FBBF24" }: { accent?: string; secondary?: string }) {
  return (
    <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
      {/* Background ambient warm glow halo */}
      <div className="absolute inset-0 rounded-full bg-amber-500/15 blur-2xl animate-pulse" />

      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10">
        <defs>
          <linearGradient id="hostSvgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
            <stop offset="100%" stopColor={secondary} stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="warmHearthGlow" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor={secondary} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Cozy Roof & Hearth Outline */}
        <path d="M40 100 L100 45 L160 100 L145 100 L145 155 L55 155 L55 100 Z" fill="#18130B" stroke="url(#hostSvgGrad)" strokeWidth="2.5" />

        {/* Ambient Hearth Inner Light */}
        <circle cx="100" cy="115" r="42" fill="url(#warmHearthGlow)" />

        {/* Illuminated Front Door / Vault Gate */}
        <rect x="84" y="108" width="32" height="47" rx="4" fill="#0A0D0F" stroke={secondary} strokeWidth="1.5" />
        <circle cx="108" cy="132" r="2.5" fill={accent} />

        {/* Hanging Warm Brass Lantern */}
        <line x1="100" y1="45" x2="100" y2="70" stroke={secondary} strokeWidth="1.5" />
        <polygon points="94,70 106,70 109,84 91,84" fill={accent} opacity="0.9" />
        <circle cx="100" cy="77" r="4" fill="#FFE885" className="animate-pulse" />

        {/* Safety Cover Shield Icon */}
        <path d="M140 120 C140 120 152 124 158 120 C158 135 150 148 140 152 C130 148 122 135 122 120 C128 124 140 120 140 120 Z" fill="#0A0D0F" stroke={accent} strokeWidth="2" />
        <path d="M135 136 L139 140 L146 132" stroke={secondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Floating Stars & Income Sparkles */}
        <path d="M45 60 L48 66 L54 69 L48 72 L45 78 L42 72 L36 69 L42 66 Z" fill={secondary} />
        <path d="M162 65 L164 70 L169 72 L164 74 L162 79 L160 74 L155 72 L160 70 Z" fill={accent} />
        <circle cx="60" cy="135" r="3" fill={secondary} opacity="0.8" />
      </svg>
    </div>
  );
}

export function PersonaEmptyState({
  variant,
  title,
  titleHi,
  description,
  descriptionHi,
  onPrimaryAction,
  primaryActionLabel,
  primaryActionLabelHi,
  onSecondaryAction,
  secondaryActionLabel,
  secondaryActionLabelHi,
  onSuggestionClick,
  customSuggestions,
  className = "",
}: PersonaEmptyStateProps) {
  const { role } = usePersona();
  const { language } = useLanguage();
  const isHi = language === "hi";

  const effectiveVariant: EmptyStateVariantTier =
    variant || (role === "host" ? "host_zero_bookings" : "student_search_miss");

  const tokens = getPersonaEmptyStateTokens(role, effectiveVariant);

  const displayTitle = isHi
    ? titleHi || title || tokens.defaultTitleHi
    : title || tokens.defaultTitleEn;

  const displayDesc = isHi
    ? descriptionHi || description || tokens.defaultDescHi
    : description || tokens.defaultDescEn;

  const suggestions = customSuggestions || (tokens.suggestions as unknown as string[]);

  const handleSuggestionSelect = (s: string) => {
    playPop();
    if (onSuggestionClick) {
      onSuggestionClick(s);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 text-center backdrop-blur-xl transition-all ${tokens.accentBorder} ${className}`}
      data-persona={role}
    >
      {/* Top Subtle Gradient Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tokens.gradientTitle}`}
      />

      {/* Empathetic Illustrated SVG Artwork */}
      {effectiveVariant === "student_search_miss" ? (
        <StudentSearchMissSvg accent={tokens.svgAccent} secondary={tokens.svgSecondary} />
      ) : (
        <HostZeroBookingsSvg accent={tokens.svgAccent} secondary={tokens.svgSecondary} />
      )}

      {/* Empathetic Title & Description */}
      <div className="mt-4 max-w-md mx-auto space-y-2">
        <h3
          className={`text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r ${tokens.gradientTitle} bg-clip-text text-transparent`}
        >
          {displayTitle}
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {displayDesc}
        </p>
      </div>

      {/* Interactive Suggestion Chips */}
      {suggestions && suggestions.length > 0 && (
        <div className="mt-5 max-w-lg mx-auto">
          <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-center gap-1.5">
            <Compass className="h-3 w-3 text-cyan-400" />
            <span>{isHi ? "त्वरित सुझाव / लोकप्रिय हब:" : "Quick Suggestions & Popular Nodes:"}</span>
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSuggestionSelect(s)}
                className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full border transition-all cursor-pointer ${tokens.badgeBg}`}
              >
                <Sparkles className="h-3 w-3 opacity-70" />
                <span>{s}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {(onPrimaryAction || onSecondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {onPrimaryAction && (
            <Button
              variant={tokens.primaryButtonVariant}
              size="sm"
              onClick={() => {
                playPop();
                onPrimaryAction();
              }}
              className="cursor-pointer gap-1.5 font-bold px-4 py-2 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>
                {isHi
                  ? primaryActionLabelHi || primaryActionLabel || (effectiveVariant === "student_search_miss" ? "फिल्टर रीसेट करें" : "कमरा पंजीकृत करें")
                  : primaryActionLabel || (effectiveVariant === "student_search_miss" ? "Reset Filters" : "List Your Space")}
              </span>
            </Button>
          )}

          {onSecondaryAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                playPop();
                onSecondaryAction();
              }}
              className="cursor-pointer gap-1.5 border-white/20 text-slate-300 hover:text-white hover:bg-white/10 text-xs px-4 py-2"
            >
              <span>
                {isHi
                  ? secondaryActionLabelHi || secondaryActionLabel || "अन्य विकल्प देखें"
                  : secondaryActionLabel || "Explore Other Options"}
              </span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}

      {/* Trust Badge Footer Line */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck className={`h-3.5 w-3.5 ${role === "host" ? "text-amber-400" : "text-emerald-400"}`} />
        <span>
          {role === "host"
            ? isHi
              ? "100% पुलिस-सत्यापित अतिथि • ₹10,000 सुरक्षा कवर गारंटी"
              : "100% Police-Vetted Guests • ₹10,000 Property Shield Protection"
            : isHi
              ? "200+ सत्यापित हॉस्टल नोड्स • शून्य ब्रोकरेज गारंटी"
              : "200+ Verified Campus Storage Hubs • Zero Brokerage Guarantee"}
        </span>
      </div>
    </motion.div>
  );
}
