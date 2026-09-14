import React, { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, HeartHandshake, RefreshCw } from "lucide-react";
import { usePersona } from "../../context/PersonaContext";
import { useLanguage } from "../../context/LanguageContext";
import { getPersonaContextIndicatorTokens } from "../../lib/designTokens";
import { playPersonaSwitch } from "../../lib/audio";

export interface PersonaContextIndicatorProps {
  /**
   * Screen corner position for the sticky badge.
   * Default: "top-right"
   */
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  /**
   * Whether to display top corner ambient background halo gradient.
   * Default: true
   */
  showHalo?: boolean;
  /**
   * Whether to display the sticky corner badge indicator.
   * Default: true
   */
  showStickyBadge?: boolean;
  /**
   * Render in compact minimalist badge mode.
   * Default: false
   */
  isCompact?: boolean;
  /**
   * Custom CSS container class
   */
  className?: string;
  /**
   * Optional custom persona toggle override callback
   */
  onTogglePersona?: () => void;
}

export const PersonaContextIndicator: React.FC<PersonaContextIndicatorProps> = ({
  position = "top-right",
  showHalo = true,
  showStickyBadge = true,
  isCompact = false,
  className = "",
  onTogglePersona,
}) => {
  const { role, setRole, isHost } = usePersona();
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [_isExpanded, setIsExpanded] = useState(false);


  const tokens = getPersonaContextIndicatorTokens(role);

  const handleToggle = () => {
    const nextRole = isHost ? "student" : "host";
    playPersonaSwitch(nextRole);
    if (onTogglePersona) {
      onTogglePersona();
    } else {
      setRole(nextRole);
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-20 left-4 sm:left-6";
      case "bottom-right":
        return "bottom-20 right-4 sm:right-6";
      case "bottom-left":
        return "bottom-20 left-4 sm:left-6";
      case "top-right":
      default:
        return "top-20 right-4 sm:right-6";
    }
  };

  return (
    <>
      {/* Ambient Gradient Halo Overlay at Screen Corner */}
      {showHalo && (
        <motion.div
          key={`persona-halo-${role}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`fixed top-0 right-0 pointer-events-none w-72 h-72 sm:w-96 sm:h-96 z-30 transition-all duration-500 ${
            isHost ? "persona-context-halo-host" : "persona-context-halo-student"
          }`}
          aria-hidden="true"
        />
      )}

      {/* Sticky Corner Badge Indicator */}
      {showStickyBadge && (
        <div className={`fixed z-40 hidden sm:flex items-center ${getPositionClasses()} ${className}`}>
          <motion.div
            layout
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            className={`group sticky-persona-corner-badge flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border text-xs font-medium tracking-wide ${tokens.badgeBg}`}
            data-persona={role}
          >
            {/* Live Indicator Pulse Beacon */}
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 persona-indicator-pulse-dot ${tokens.pulseDot}`} />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${tokens.pulseDot}`} />
            </span>

            {/* Persona Icon */}
            <span className="flex items-center justify-center">
              {isHost ? (
                <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </span>

            {/* Persona Mode Headline Label */}
            <div className="flex flex-col text-left leading-none">
              <span className="font-semibold tracking-wider text-[10px] uppercase opacity-90">
                {isHi ? tokens.roleLabelHi : tokens.roleLabelEn}
              </span>
              {!isCompact && (
                <span className="text-[9px] text-muted-foreground font-normal mt-0.5">
                  {isHi ? tokens.contextSubtextHi : tokens.contextSubtextEn}
                </span>
              )}
            </div>

            {/* Quick Switch Action Button */}
            <motion.button
              type="button"
              onClick={handleToggle}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="ml-1.5 flex items-center gap-1 px-2 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/90 text-[10px] font-semibold transition-colors border border-slate-700/60 focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label={isHi ? tokens.switchLabelHi : tokens.switchLabelEn}
              title={isHi ? tokens.switchLabelHi : tokens.switchLabelEn}
            >
              <RefreshCw className="w-3 h-3 transition-transform group-hover:rotate-180 duration-500" />
              <span className="hidden group-hover:inline transition-all duration-200">
                {isHi ? tokens.switchLabelHi : tokens.switchLabelEn}
              </span>
            </motion.button>
          </motion.div>
        </div>
      )}
    </>
  );
};
