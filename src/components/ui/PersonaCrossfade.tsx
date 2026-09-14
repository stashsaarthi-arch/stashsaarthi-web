import React from "react";
import { motion } from "framer-motion";
import { usePersona } from "../../context/PersonaContext";
import { getPersonaCrossfadeStyles, PERSONA_CROSSFADE_TOKENS } from "../../lib/designTokens";

export interface PersonaCrossfadeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  durationMs?: number;
  enableMotion?: boolean;
}

/**
 * PersonaCrossfade Primitive
 * Wraps persona-sensitive UI surfaces with a gentle 250ms CSS color-interpolate fade.
 * Eliminates jarring flashes when switching between Student (Mint) and Senior Host (Amber) modes.
 */
export function PersonaCrossfade({
  children,
  className = "",
  durationMs = PERSONA_CROSSFADE_TOKENS.durationMs,
  enableMotion = true,
  style,
  id,
  title,
  onClick,
}: PersonaCrossfadeProps) {
  const { role, isPersonaTransitioning } = usePersona();
  const inlineStyles = getPersonaCrossfadeStyles();

  if (enableMotion) {
    return (
      <motion.div
        key={role}
        id={id}
        title={title}
        onClick={onClick}
        initial={{ opacity: 0.94, filter: "brightness(0.98)" }}
        animate={{ opacity: 1, filter: "brightness(1)" }}
        transition={{ duration: durationMs / 1000, ease: [0.16, 1, 0.3, 1] }}
        className={`persona-crossfade-container ${isPersonaTransitioning ? "persona-transitioning" : ""} ${className}`}
        style={{
          ...inlineStyles,
          ...(style as any),
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      id={id}
      title={title}
      onClick={onClick}
      className={`persona-crossfade-container ${isPersonaTransitioning ? "persona-transitioning" : ""} ${className}`}
      style={{
        ...inlineStyles,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
