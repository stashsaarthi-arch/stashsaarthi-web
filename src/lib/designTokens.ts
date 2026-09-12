/**
 * StashSaarthi OKLCH Design Tokens Engine
 * Formalized design tokens for Student (Mint/Emerald/Cyan/Obsidian)
 * and Senior Host (Amber/Gold/Obsidian) dual-persona architecture.
 */

export interface OklchColor {
  l: number; // Lightness (0-1)
  c: number; // Chroma (0-0.4)
  h: number; // Hue (0-360)
  alpha?: number;
  raw: string; // CSS oklch() string
}

export const STUDENT_TOKENS = {
  mint: { l: 0.72, c: 0.19, h: 160, raw: "oklch(0.72 0.19 160)" },
  emerald: { l: 0.696, c: 0.149, h: 162, raw: "oklch(0.696 0.149 162)" },
  cyan: { l: 0.868, c: 0.16, h: 178, raw: "oklch(0.868 0.16 178)" },
  obsidian: { l: 0.12, c: 0.012, h: 230, raw: "oklch(0.12 0.012 230)" },
  surface1: { l: 0.16, c: 0.012, h: 230, raw: "oklch(0.16 0.012 230)" },
  surface2: { l: 0.198, c: 0.013, h: 223, raw: "oklch(0.198 0.013 223)" },
  surfaceElevated: { l: 0.24, c: 0.016, h: 223, raw: "oklch(0.24 0.016 223)" },
} as const;

export const HOST_TOKENS = {
  amber: { l: 0.769, c: 0.165, h: 70, raw: "oklch(0.769 0.165 70)" },
  gold: { l: 0.837, c: 0.175, h: 82, raw: "oklch(0.837 0.175 82)" },
  obsidian: { l: 0.13, c: 0.015, h: 65, raw: "oklch(0.13 0.015 65)" },
  surface1: { l: 0.17, c: 0.015, h: 65, raw: "oklch(0.17 0.015 65)" },
  surface2: { l: 0.21, c: 0.017, h: 62, raw: "oklch(0.21 0.017 62)" },
  surfaceElevated: { l: 0.25, c: 0.019, h: 62, raw: "oklch(0.25 0.019 62)" },
} as const;

export const GLOBAL_SPACING_SCALE = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
} as const;

export const GLOBAL_RADIUS_SCALE = {
  xs: "calc(var(--radius) - 6px)",
  sm: "calc(var(--radius) - 4px)",
  md: "calc(var(--radius) - 2px)",
  lg: "var(--radius)",
  xl: "calc(var(--radius) + 4px)",
  "2xl": "calc(var(--radius) + 8px)",
  "3xl": "calc(var(--radius) + 12px)",
  "4xl": "calc(var(--radius) + 16px)",
  full: "9999px",
} as const;

export const SEMANTIC_RADIUS_TOKENS = {
  badge: GLOBAL_RADIUS_SCALE.sm,
  button: GLOBAL_RADIUS_SCALE.md,
  input: GLOBAL_RADIUS_SCALE.md,
  card: GLOBAL_RADIUS_SCALE.xl,
  panel: GLOBAL_RADIUS_SCALE["2xl"],
  modal: GLOBAL_RADIUS_SCALE["3xl"],
  pill: GLOBAL_RADIUS_SCALE.full,
} as const;

/**
 * Helper to retrieve unified radius token for a UI role
 */
export function getSemanticRadius(role: keyof typeof SEMANTIC_RADIUS_TOKENS): string {
  return SEMANTIC_RADIUS_TOKENS[role];
}

/**
 * Helper to retrieve persona-specific primary OKLCH token
 */
export function getPersonaAccentColor(role: "student" | "host"): string {
  return role === "host" ? HOST_TOKENS.amber.raw : STUDENT_TOKENS.mint.raw;
}

/**
 * Helper to retrieve persona-specific secondary OKLCH token
 */
export function getPersonaSecondaryColor(role: "student" | "host"): string {
  return role === "host" ? HOST_TOKENS.gold.raw : STUDENT_TOKENS.emerald.raw;
}

/**
 * Helper to retrieve persona-specific background OKLCH token
 */
export function getPersonaObsidianBg(role: "student" | "host"): string {
  return role === "host" ? HOST_TOKENS.obsidian.raw : STUDENT_TOKENS.obsidian.raw;
}

/**
 * Helper to retrieve persona-specific surface layer OKLCH token
 */
export function getSurfaceLayerColor(
  role: "student" | "host",
  level: "surface1" | "surface2" | "surfaceElevated"
): string {
  const tokens = role === "host" ? HOST_TOKENS : STUDENT_TOKENS;
  return tokens[level].raw;
}

export const GLASSMORPHISM_TOKENS = {
  glass: {
    backdropFilter: "blur(16px) saturate(140%)",
    border: "1px solid oklch(1 0 0 / 12%)",
    shadow: "var(--shadow-glass)",
  },
  glassPanel: {
    backdropFilter: "blur(20px) saturate(160%)",
    border: "1px solid oklch(1 0 0 / 15%)",
    shadow: "0 28px 64px -16px oklch(0 0 0 / 70%), inset 0 1px 0 oklch(1 0 0 / 12%)",
  },
  glassCard: {
    backdropFilter: "blur(14px) saturate(135%)",
    border: "1px solid oklch(1 0 0 / 11%)",
    shadow: "0 14px 36px -10px oklch(0 0 0 / 55%), inset 0 1px 0 oklch(1 0 0 / 9%)",
  },
} as const;

export const GRADIENT_TOKENS = {
  mintEmerald: "linear-gradient(135deg, oklch(0.72 0.19 160), oklch(0.696 0.149 162))",
  amberGold: "linear-gradient(135deg, oklch(0.769 0.165 70), oklch(0.837 0.175 82))",
  cyanEmerald: "linear-gradient(135deg, oklch(0.868 0.16 178), oklch(0.696 0.149 162))",
  obsidianMesh: "radial-gradient(ellipse at 50% 0%, oklch(0.24 0.016 223 / 50%) 0%, oklch(0.12 0.012 230 / 95%) 100%)",
} as const;

/**
 * Helper to retrieve persona-specific gradient CSS string
 */
export function getPersonaGradient(role: "student" | "host"): string {
  return role === "host" ? GRADIENT_TOKENS.amberGold : GRADIENT_TOKENS.mintEmerald;
}

export const SHADOW_TOKENS = {
  subtle: "var(--shadow-subtle)",
  card: "var(--shadow-card)",
  floating: "var(--shadow-floating)",
  glow: "var(--shadow-glow)",
} as const;

/**
 * Helper to retrieve persona-specific shadow glow specification
 */
export function getPersonaShadowGlow(role: "student" | "host"): string {
  const glowColor = role === "host" ? "oklch(0.809 0.165 76 / 40%)" : "oklch(0.72 0.19 160 / 40%)";
  return `0 0 32px -4px ${glowColor}, 0 12px 32px -8px oklch(0 0 0 / 65%)`;
}

export const DEPTH_TEXTURE_TOKENS = {
  noiseDataUri: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.035'/%3E%3C/svg%3E\")",
  radialMeshStudent: "radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.72 0.19 160 / 18%) 0%, transparent 70%), radial-gradient(circle 600px at 100% 100%, oklch(0.868 0.16 178 / 12%) 0%, transparent 60%), radial-gradient(circle 500px at 0% 50%, oklch(0.696 0.149 162 / 10%) 0%, transparent 50%)",
  radialMeshHost: "radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.809 0.165 76 / 18%) 0%, transparent 70%), radial-gradient(circle 600px at 100% 100%, oklch(0.85 0.18 84 / 12%) 0%, transparent 60%), radial-gradient(circle 500px at 0% 50%, oklch(0.769 0.165 70 / 10%) 0%, transparent 50%)",
  radialMeshPersona: "var(--radial-mesh-persona)",
} as const;

/**
 * Helper to retrieve persona-specific radial mesh CSS gradient
 */
export function getPersonaRadialMesh(role: "student" | "host"): string {
  return role === "host" ? DEPTH_TEXTURE_TOKENS.radialMeshHost : DEPTH_TEXTURE_TOKENS.radialMeshStudent;
}

/**
 * Helper to retrieve complete obsidian depth background specification with ambient noise
 */
export function getObsidianDepthTexture(role: "student" | "host"): {
  backgroundColor: string;
  backgroundImage: string;
} {
  const mesh = getPersonaRadialMesh(role);
  return {
    backgroundColor: getPersonaObsidianBg(role),
    backgroundImage: `${mesh}, ${DEPTH_TEXTURE_TOKENS.noiseDataUri}`,
  };
}

export interface StatusTokenSpec {
  raw: string;
  bg: string;
  border: string;
  text: string;
  glow: string;
}

export const STATUS_TOKENS: Record<"success" | "warning" | "error" | "info", StatusTokenSpec> = {
  success: {
    raw: "oklch(0.72 0.19 160)",
    bg: "oklch(0.72 0.19 160 / 12%)",
    border: "oklch(0.72 0.19 160 / 30%)",
    text: "oklch(0.85 0.16 160)",
    glow: "0 0 16px -2px oklch(0.72 0.19 160 / 35%)",
  },
  warning: {
    raw: "oklch(0.78 0.17 75)",
    bg: "oklch(0.78 0.17 75 / 12%)",
    border: "oklch(0.78 0.17 75 / 30%)",
    text: "oklch(0.88 0.15 75)",
    glow: "0 0 16px -2px oklch(0.78 0.17 75 / 35%)",
  },
  error: {
    raw: "oklch(0.65 0.22 25)",
    bg: "oklch(0.65 0.22 25 / 12%)",
    border: "oklch(0.65 0.22 25 / 30%)",
    text: "oklch(0.82 0.18 25)",
    glow: "0 0 16px -2px oklch(0.65 0.22 25 / 35%)",
  },
  info: {
    raw: "oklch(0.82 0.16 195)",
    bg: "oklch(0.82 0.16 195 / 12%)",
    border: "oklch(0.82 0.16 195 / 30%)",
    text: "oklch(0.90 0.14 195)",
    glow: "0 0 16px -2px oklch(0.82 0.16 195 / 35%)",
  },
} as const;

export type StatusType = "success" | "warning" | "error" | "info";

/**
 * Helper to retrieve harmonized status token specification
 */
export function getStatusTokenSpec(status: StatusType): StatusTokenSpec {
  return STATUS_TOKENS[status];
}

export interface FluidTypographySpec {
  fontSize: string;
  lineHeight: number | string;
  letterSpacing?: string;
  fontFamily?: string;
  maxFontWeight?: number | undefined;
  paddingAdjust?: string | undefined;
}

export const FLUID_TYPOGRAPHY_TOKENS = {
  display: {
    fontSize: "clamp(2.25rem, 3.5vw + 1rem, 5.5rem)",
    lineHeight: 1.08,
    letterSpacing: "-0.03em",
  },
  h1: {
    fontSize: "clamp(1.5rem, 4vw, 3rem)",
    lineHeight: 1.12,
    letterSpacing: "-0.02em",
  },
  h2: {
    fontSize: "clamp(1.35rem, 1.8vw + 0.6rem, 2.85rem)",
    lineHeight: 1.2,
    letterSpacing: "-0.015em",
  },
  h3: {
    fontSize: "clamp(1.15rem, 1.2vw + 0.5rem, 2rem)",
    lineHeight: 1.25,
    letterSpacing: "-0.01em",
  },
  h4: {
    fontSize: "clamp(1rem, 0.8vw + 0.45rem, 1.5rem)",
    lineHeight: 1.3,
    letterSpacing: "0em",
  },
  body: {
    fontSize: "clamp(0.875rem, 0.6vw + 0.65rem, 1.25rem)",
    lineHeight: 1.6,
    letterSpacing: "0em",
  },
  caption: {
    fontSize: "clamp(0.75rem, 0.4vw + 0.55rem, 1rem)",
    lineHeight: 1.4,
    letterSpacing: "0.01em",
  },
  overline: {
    fontSize: "clamp(0.7rem, 0.35vw + 0.5rem, 0.875rem)",
    lineHeight: 1.3,
    letterSpacing: "0.08em",
  },
} as const;

export type FluidTypographyLevel = keyof typeof FLUID_TYPOGRAPHY_TOKENS;

export interface DevanagariTypographySpec {
  fontFamily: string;
  lineHeight: number;
  letterSpacing: string;
  maxFontWeight?: number;
  paddingAdjust?: string;
}

export const DEVANAGARI_TYPOGRAPHY_TOKENS: Record<FluidTypographyLevel, DevanagariTypographySpec> = {
  display: {
    fontFamily: 'var(--font-devanagari, "Rozha One", "Mukta", sans-serif)',
    lineHeight: 1.32,
    letterSpacing: "0.01em",
    maxFontWeight: 800,
    paddingAdjust: "0.06em",
  },
  h1: {
    fontFamily: 'var(--font-devanagari, "Mukta", sans-serif)',
    lineHeight: 1.35,
    letterSpacing: "0.01em",
    maxFontWeight: 700,
    paddingAdjust: "0.05em",
  },
  h2: {
    fontFamily: 'var(--font-devanagari, "Mukta", sans-serif)',
    lineHeight: 1.38,
    letterSpacing: "0.01em",
    maxFontWeight: 700,
    paddingAdjust: "0.04em",
  },
  h3: {
    fontFamily: 'var(--font-devanagari, "Mukta", sans-serif)',
    lineHeight: 1.4,
    letterSpacing: "0.01em",
    maxFontWeight: 600,
    paddingAdjust: "0.03em",
  },
  h4: {
    fontFamily: 'var(--font-devanagari, "Mukta", sans-serif)',
    lineHeight: 1.45,
    letterSpacing: "0em",
    maxFontWeight: 600,
    paddingAdjust: "0.02em",
  },
  body: {
    fontFamily: 'var(--font-devanagari, "Mukta", sans-serif)',
    lineHeight: 1.7,
    letterSpacing: "0em",
    maxFontWeight: 500,
  },
  caption: {
    fontFamily: 'var(--font-devanagari, "Mukta", sans-serif)',
    lineHeight: 1.5,
    letterSpacing: "0.01em",
    maxFontWeight: 500,
  },
  overline: {
    fontFamily: 'var(--font-devanagari, "Mukta", sans-serif)',
    lineHeight: 1.4,
    letterSpacing: "0.05em",
    maxFontWeight: 600,
  },
} as const;

/**
 * Helper to retrieve fluid typography specification for a given level
 */
export function getFluidTypographySpec(level: FluidTypographyLevel): FluidTypographySpec {
  return FLUID_TYPOGRAPHY_TOKENS[level];
}

/**
 * Helper to retrieve language-calibrated typography specification (English vs Devanagari Hindi)
 */
export function getCalibratedTypographySpec(
  level: FluidTypographyLevel,
  language: "en" | "hi" = "en"
): FluidTypographySpec {
  const fluidSpec = FLUID_TYPOGRAPHY_TOKENS[level];
  if (language === "hi") {
    const devanagariSpec = DEVANAGARI_TYPOGRAPHY_TOKENS[level];
    return {
      fontSize: fluidSpec.fontSize,
      fontFamily: devanagariSpec.fontFamily,
      lineHeight: devanagariSpec.lineHeight,
      letterSpacing: devanagariSpec.letterSpacing,
      maxFontWeight: devanagariSpec.maxFontWeight,
      paddingAdjust: devanagariSpec.paddingAdjust,
    };
  }
  return fluidSpec;
}

/**
 * Helper to retrieve dual typography styles (English vs Devanagari Hindi) for direct inline styling or CSS object mapping
 */
export function getDualTypographyStyles(
  language: "en" | "hi" = "en",
  level: FluidTypographyLevel = "body"
): {
  fontFamily?: string;
  lineHeight: number | string;
  letterSpacing: string;
  paddingTop?: string;
  paddingBottom?: string;
} {
  const spec = getCalibratedTypographySpec(level, language);
  if (language === "hi") {
    const res: {
      fontFamily?: string;
      lineHeight: number | string;
      letterSpacing: string;
      paddingTop?: string;
      paddingBottom?: string;
    } = {
      lineHeight: spec.lineHeight,
      letterSpacing: spec.letterSpacing || "0.01em",
    };
    if (spec.fontFamily) res.fontFamily = spec.fontFamily;
    if (spec.paddingAdjust) {
      res.paddingTop = spec.paddingAdjust;
      res.paddingBottom = spec.paddingAdjust;
    } else {
      res.paddingTop = "0.04em";
      res.paddingBottom = "0.04em";
    }
    return res;
  }
  return {
    lineHeight: spec.lineHeight,
    letterSpacing: spec.letterSpacing || "0em",
  };
}

/**
 * Helper to retrieve safe Hindi utility classes when language is 'hi'
 */
export function getHindiTypographyClasses(isHindi: boolean, isHeading: boolean = false): string {
  if (!isHindi) return "";
  return isHeading
    ? "font-devanagari hi-heading-safe tracking-normal overflow-visible"
    : "font-devanagari hi-text-safe tracking-normal";
}






