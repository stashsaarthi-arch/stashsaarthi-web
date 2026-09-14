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

export interface HierarchyTokenSpec {
  level: FluidTypographyLevel;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: string;
  fontFamily: string;
  contrastRole: "display-contrast" | "heading-contrast" | "body-contrast" | "muted-contrast";
}

export const TEXT_HIERARCHY_TOKENS: Record<FluidTypographyLevel, HierarchyTokenSpec> = {
  display: {
    level: "display",
    fontWeight: 800,
    lineHeight: 1.08,
    letterSpacing: "-0.03em",
    fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
    contrastRole: "display-contrast",
  },
  h1: {
    level: "h1",
    fontWeight: 800,
    lineHeight: 1.12,
    letterSpacing: "-0.02em",
    fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
    contrastRole: "heading-contrast",
  },
  h2: {
    level: "h2",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.015em",
    fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
    contrastRole: "heading-contrast",
  },
  h3: {
    level: "h3",
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: "-0.01em",
    fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
    contrastRole: "heading-contrast",
  },
  h4: {
    level: "h4",
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: "0em",
    fontFamily: 'var(--font-sans, "Plus Jakarta Sans", sans-serif)',
    contrastRole: "heading-contrast",
  },
  body: {
    level: "body",
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: "0em",
    fontFamily: 'var(--font-body, "Inter", sans-serif)',
    contrastRole: "body-contrast",
  },
  caption: {
    level: "caption",
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: "0.01em",
    fontFamily: 'var(--font-body, "Inter", sans-serif)',
    contrastRole: "muted-contrast",
  },
  overline: {
    level: "overline",
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: "0.08em",
    fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
    contrastRole: "muted-contrast",
  },
} as const;

/**
 * Helper to retrieve text hierarchy utility classes for a given level
 */
export function getHeadingHierarchyClasses(level: FluidTypographyLevel): string {
  switch (level) {
    case "display":
      return "heading-display text-fluid-display font-extrabold tracking-tight";
    case "h1":
      return "heading-h1 text-fluid-h1 font-extrabold tracking-tight";
    case "h2":
      return "heading-h2 text-fluid-h2 font-bold tracking-tight";
    case "h3":
      return "heading-h3 text-fluid-h3 font-bold tracking-tight";
    case "h4":
      return "heading-h4 text-fluid-h4 font-semibold";
    case "overline":
      return "text-overline text-fluid-overline font-semibold text-muted-foreground uppercase tracking-widest";
    case "caption":
      return "text-caption text-fluid-caption font-medium text-muted-foreground";
    case "body":
    default:
      return "text-fluid-body font-normal leading-relaxed";
  }
}

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
 * Devanagari Type Tuning Tokens for Senior Hosts (Task 139)
 * Generous letter-spacing, optimized font fallbacks, matra padding, and high-legibility scale for Hindi text.
 */
export const DEVANAGARI_HOST_TYPOGRAPHY_TOKENS = {
  fontFamily:
    '"Mukta", "Rozha One", "Noto Sans Devanagari", "Tiro Devanagari Hindi", "Kohinoor Devanagari", "ITF Devanagari", "Hind", "Baloo 2", "Anek Devanagari", "Mangal", "Utsaah", "Arial Unicode MS", ui-sans-serif, system-ui, sans-serif',
  hostDevanagariFallbackChain: [
    "Mukta",
    "Rozha One",
    "Noto Sans Devanagari",
    "Tiro Devanagari Hindi",
    "Kohinoor Devanagari",
    "ITF Devanagari",
    "Hind",
    "Baloo 2",
    "Anek Devanagari",
    "Mangal",
    "Utsaah",
    "Arial Unicode MS",
    "ui-sans-serif",
    "system-ui",
    "sans-serif",
  ],
  body: {
    letterSpacing: "0.035em",
    lineHeight: 1.75,
    sizeScale: 1.08,
    matraPaddingTop: "0.06em",
    matraPaddingBottom: "0.06em",
    utilityClass: "devanagari-host-text",
  },
  heading: {
    letterSpacing: "0.02em",
    lineHeight: 1.4,
    sizeScale: 1.05,
    matraPaddingTop: "0.08em",
    matraPaddingBottom: "0.08em",
    utilityClass: "devanagari-host-heading",
  },
  trackingClass: "tracking-devanagari-host",
} as const;

/**
 * Helper to retrieve Devanagari Host typography classes when language is Hindi and persona is Host.
 */
export function getDevanagariHostTypographyClasses(
  isHindi: boolean,
  isHost: boolean = false,
  isHeading: boolean = false
): string {
  if (!isHindi) return "";
  if (isHost) {
    return isHeading
      ? "font-devanagari devanagari-host-heading overflow-visible senior-host-devanagari-active"
      : "font-devanagari devanagari-host-text overflow-visible senior-host-devanagari-active";
  }
  return isHeading
    ? "font-devanagari hi-heading-safe tracking-normal overflow-visible"
    : "font-devanagari hi-text-safe tracking-normal";
}

/**
 * Helper to retrieve dynamic style object for Devanagari Host typography.
 */
export function getDevanagariHostStyles(
  isHindi: boolean,
  isHost: boolean = false,
  isHeading: boolean = false
): Record<string, string | number> {
  if (!isHindi) return {};
  if (!isHost) {
    return {
      fontFamily: DEVANAGARI_HOST_TYPOGRAPHY_TOKENS.fontFamily,
      paddingTop: "0.04em",
      paddingBottom: "0.04em",
      overflow: "visible",
    };
  }

  const spec = isHeading
    ? DEVANAGARI_HOST_TYPOGRAPHY_TOKENS.heading
    : DEVANAGARI_HOST_TYPOGRAPHY_TOKENS.body;

  return {
    fontFamily: DEVANAGARI_HOST_TYPOGRAPHY_TOKENS.fontFamily,
    letterSpacing: spec.letterSpacing,
    lineHeight: spec.lineHeight,
    fontSize: `${spec.sizeScale}em`,
    paddingTop: spec.matraPaddingTop,
    paddingBottom: spec.matraPaddingBottom,
    overflow: "visible",
  };
}

/**
 * Helper to retrieve safe Hindi utility classes when language is 'hi'
 */
export function getHindiTypographyClasses(
  isHindi: boolean,
  isHeading: boolean = false,
  isHost: boolean = false
): string {
  return getDevanagariHostTypographyClasses(isHindi, isHost, isHeading);
}

export const BENTO_GRID_TOKENS = {
  columns: {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  },
  aspectRatios: {
    square: "aspect-square",
    standard: "aspect-[4/3]",
    video: "aspect-[16/9]",
    wide: "aspect-[2/1]",
    portrait: "aspect-[3/4]",
    auto: "aspect-auto",
  },
  spans: {
    featured: "bento-span-featured col-span-1 md:col-span-2 row-span-1 md:row-span-2",
    wide: "bento-span-wide col-span-1 md:col-span-2 row-span-1",
    tall: "bento-span-tall col-span-1 row-span-1 md:row-span-2",
    normal: "bento-span-normal col-span-1 row-span-1",
    half: "bento-span-half col-span-1 md:col-span-2 row-span-1",
    full: "bento-span-full col-span-1 md:col-span-3 lg:col-span-4 row-span-1",
  },
  gap: {
    sm: "gap-3 sm:gap-4",
    md: "gap-4 sm:gap-6",
    lg: "gap-4 sm:gap-6 lg:gap-8",
    xl: "gap-6 sm:gap-8 lg:gap-10",
  },
  autoFlow: {
    dense: "grid-flow-dense",
    row: "grid-flow-row",
    column: "grid-flow-col",
  },
} as const;

export type BentoSpanType = keyof typeof BENTO_GRID_TOKENS.spans;
export type BentoAspectRatioType = keyof typeof BENTO_GRID_TOKENS.aspectRatios;
export type BentoGapType = keyof typeof BENTO_GRID_TOKENS.gap;

/**
 * Helper to retrieve Bento Grid item span utility classes
 */
export function getBentoSpanClasses(span: BentoSpanType = "normal"): string {
  return BENTO_GRID_TOKENS.spans[span] || BENTO_GRID_TOKENS.spans.normal;
}

/**
 * Helper to retrieve Bento Grid gap utility classes
 */
export function getBentoGapClasses(gap: BentoGapType = "lg"): string {
  return BENTO_GRID_TOKENS.gap[gap] || BENTO_GRID_TOKENS.gap.lg;
}

export const VERTICAL_RHYTHM_TOKENS = {
  compact: {
    pyMobile: "3rem",
    pyDesktop: "4rem",
    classes: "section-py-compact py-12 md:py-16",
  },
  standard: {
    pyMobile: "4rem",
    pyDesktop: "6rem",
    classes: "section-py-standard py-16 md:py-24",
  },
  relaxed: {
    pyMobile: "5rem",
    pyDesktop: "8rem",
    classes: "section-py-relaxed py-20 md:py-32",
  },
  hero: {
    pyMobile: "6rem",
    pyDesktop: "9rem",
    classes: "section-py-hero py-24 md:py-36",
  },
} as const;

export type VerticalRhythmTier = keyof typeof VERTICAL_RHYTHM_TOKENS;

export const CONTAINER_WIDTH_TOKENS = {
  sm: { maxWidth: "48rem", classes: "max-w-3xl" },
  md: { maxWidth: "64rem", classes: "max-w-5xl" },
  lg: { maxWidth: "72rem", classes: "max-w-6xl container-max-6xl" },
  xl: { maxWidth: "80rem", classes: "max-w-7xl container-max-7xl" },
  full: { maxWidth: "100%", classes: "max-w-full" },
} as const;

export type ContainerSizeTier = keyof typeof CONTAINER_WIDTH_TOKENS;

export const CONTAINER_GUTTER_TOKENS = {
  compact: "container-gutter-compact px-3 sm:px-4 lg:px-6",
  standard: "container-gutter-standard px-4 sm:px-6 lg:px-8",
  relaxed: "container-gutter-relaxed px-6 sm:px-8 lg:px-12",
  narrowSafe: "container-gutter-standard mobile-gutter-safe px-4 sm:px-6 lg:px-8",
} as const;

export type ContainerGutterTier = keyof typeof CONTAINER_GUTTER_TOKENS;

/**
 * Helper to retrieve section vertical rhythm utility classes
 */
export function getVerticalRhythmClasses(rhythm: VerticalRhythmTier = "standard"): string {
  return VERTICAL_RHYTHM_TOKENS[rhythm]?.classes || VERTICAL_RHYTHM_TOKENS.standard.classes;
}

/**
 * Helper to retrieve container maximum width utility classes
 */
export function getContainerWidthClasses(size: ContainerSizeTier = "xl"): string {
  return CONTAINER_WIDTH_TOKENS[size]?.classes || CONTAINER_WIDTH_TOKENS.xl.classes;
}

/**
 * Helper to retrieve container responsive horizontal gutter padding classes
 */
export function getContainerGutterClasses(gutter: ContainerGutterTier = "standard"): string {
  return CONTAINER_GUTTER_TOKENS[gutter] || CONTAINER_GUTTER_TOKENS.standard;
}

/**
 * Helper to retrieve zero text-to-edge crowding mobile safety classes for narrow viewports (iPhone SE / Android)
 */
export function getMobileGutterSafetyClasses(): string {
  return "section-container-gutter mobile-gutter-safe px-4 sm:px-6 lg:px-8 w-full box-border break-words";
}

/**
 * Helper to retrieve complete standardized section container class string
 */
export function getSectionContainerClasses(
  rhythm: VerticalRhythmTier = "standard",
  width: ContainerSizeTier = "xl",
  gutter: ContainerGutterTier = "standard"
): string {
  return `${getVerticalRhythmClasses(rhythm)} ${getContainerWidthClasses(width)} ${getContainerGutterClasses(gutter)} mobile-gutter-safe mx-auto w-full`;
}

export const TRUNCATION_TOKENS = {
  clamp1: "line-clamp-1 overflow-hidden text-ellipsis break-words",
  clamp2: "line-clamp-2 overflow-hidden text-ellipsis break-words",
  clamp3: "line-clamp-3 overflow-hidden text-ellipsis break-words",
  none: "line-clamp-none overflow-visible whitespace-normal",
  truncationSafe: "truncation-safe overflow-hidden text-ellipsis break-words",
} as const;

export type LineClampTier = 1 | 2 | 3 | "none";

/**
 * Helper to retrieve line clamping utility classes
 */
export function getTruncationClasses(lines: LineClampTier = 2): string {
  switch (lines) {
    case 1:
      return TRUNCATION_TOKENS.clamp1;
    case 2:
      return TRUNCATION_TOKENS.clamp2;
    case 3:
      return TRUNCATION_TOKENS.clamp3;
    case "none":
      return TRUNCATION_TOKENS.none;
    default:
      return TRUNCATION_TOKENS.clamp2;
  }
}

/**
 * Helper to retrieve Devanagari Hindi text line clamp safety classes preventing bottom matra clipping
 */
export function getHindiTruncationClasses(isHindi: boolean, lines: LineClampTier = 2): string {
  if (!isHindi || lines === "none") return "";
  return "hi-clamp-safe hi-leading-relaxed pb-[0.05em]";
}

/**
 * Helper to retrieve full specification for text truncation and Devanagari safety
 */
export function getHindiTruncationSpec(
  isHindi: boolean,
  lines: LineClampTier = 2
): { className: string; lineClamp: LineClampTier } {
  return {
    className: `${getTruncationClasses(lines)} ${getHindiTruncationClasses(isHindi, lines)}`,
    lineClamp: lines,
  };
}

export const LAYOUT_ISOLATION_TOKENS = {
  layoutStyle: "contain: layout style",
  layoutPaint: "contain: layout style paint",
  strict: "contain: strict",
  isolation: "isolate",
  classes: "layout-isolated contain-layout-style isolate",
} as const;

export type LayoutIsolationTier = "layoutStyle" | "layoutPaint" | "strict" | "none";

/**
 * Helper to retrieve CSS layout isolation utility classes preventing browser reflow cascades
 */
export function getLayoutIsolationClasses(tier: LayoutIsolationTier = "layoutStyle"): string {
  switch (tier) {
    case "layoutStyle":
      return "layout-isolated contain-layout-style isolate";
    case "layoutPaint":
      return "layout-isolated-paint contain-layout-paint isolate";
    case "strict":
      return "layout-isolated-strict contain-strict isolate";
    case "none":
      return "";
    default:
      return "layout-isolated contain-layout-style isolate";
  }
}

export const HERO_CTA_TOKENS = {
  mint: {
    borderGlow: "hero-cta-animated-border",
    shimmer: "btn-shimmer-sweep",
    glowShadow: "shadow-[0_0_35px_rgba(16,185,129,0.55)]",
    gradient: "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950",
  },
  emerald: {
    borderGlow: "hero-cta-animated-border",
    shimmer: "btn-shimmer-sweep",
    glowShadow: "shadow-[0_0_35px_rgba(16,185,129,0.65)]",
    gradient: "bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-500 text-slate-950",
  },
  cyan: {
    borderGlow: "hero-cta-animated-border",
    shimmer: "btn-shimmer-sweep",
    glowShadow: "shadow-[0_0_35px_rgba(6,182,212,0.65)]",
    gradient: "bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400 text-slate-950",
  },
  amber: {
    borderGlow: "hero-cta-amber-border",
    shimmer: "btn-shimmer-sweep",
    glowShadow: "shadow-[0_0_35px_rgba(245,158,11,0.55)]",
    gradient: "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950",
  },
} as const;

export type HeroCtaVariantTier = "mint" | "emerald" | "cyan" | "amber" | "heroMint" | "heroEmerald" | "heroCyan" | "warm";

/**
 * Helper to retrieve GPU-accelerated animated border glow & shimmer utility classes for Hero CTA buttons
 */
export function getHeroCtaGlowClasses(variant: HeroCtaVariantTier = "mint"): {
  wrapperClasses: string;
  borderClasses: string;
  buttonClasses: string;
} {
  const isAmber = variant === "amber" || variant === "warm";
  const borderClasses = isAmber ? HERO_CTA_TOKENS.amber.borderGlow : HERO_CTA_TOKENS.mint.borderGlow;
  return {
    wrapperClasses: "hero-cta-glow-wrapper group/hero-cta",
    borderClasses: `${borderClasses} opacity-80 group-hover/hero-cta:opacity-100 transition-opacity`,
    buttonClasses: "hero-cta-overdrive btn-shimmer-sweep relative z-10 font-extrabold tracking-wide uppercase shadow-2xl",
  };
}

export const SENIOR_HOST_LEGIBILITY_TOKENS = {
  baseFontSize: "clamp(1.125rem, 0.8vw + 0.85rem, 1.45rem)",
  captionFontSize: "clamp(0.95rem, 0.5vw + 0.75rem, 1.15rem)",
  borderContrast: "2px solid oklch(0.809 0.165 76 / 45%)",
  borderShadow: "0 0 20px -2px oklch(0.809 0.165 76 / 30%)",
  buttonMinHeight: "52px",
  contrastRatio: "WCAG AAA 7:1+",
  activeBadgeText: "Senior Legibility Mode Active (18px+ High Contrast)",
} as const;

/**
 * Helper to retrieve Senior Host legibility utility classes when Host persona is active
 */
export function getSeniorHostLegibilityClasses(isHost: boolean): string {
  if (!isHost) return "";
  return "senior-host-text-lg senior-host-border-contrast senior-host-btn-accessible";
}

/**
 * Helper to retrieve high-contrast border classes for host persona cards & panels
 */
export function getHostBorderContrastClasses(isHost: boolean): string {
  if (!isHost) return "";
  return "border-2 border-[oklch(0.809_0.165_76_/_0.45)] shadow-[0_0_20px_-2px_rgba(245,158,11,0.3)]";
}

/**
 * Helper to retrieve 18px+ base font legibility classes for host persona body text
 */
export function getHostTypographyClasses(isHost: boolean): string {
  if (!isHost) return "";
  return "text-[1.125rem] leading-[1.7] font-medium tracking-wide";
}

export const STUDENT_CYBERPUNK_TOKENS = {
  mintEdge: "oklch(0.72 0.19 160 / 30%)",
  cyanEdge: "oklch(0.868 0.16 178 / 35%)",
  emeraldEdge: "oklch(0.696 0.149 162 / 25%)",
  frostedGlassBlur: "blur(18px) saturate(150%)",
  cyberpunkBg: "linear-gradient(145deg, oklch(0.14 0.014 230 / 85%), oklch(0.11 0.01 230 / 92%))",
  gradientEdge: "linear-gradient(135deg, oklch(0.72 0.19 160 / 60%), oklch(0.868 0.16 178 / 60%))",
  neonGlowShadow: "0 0 25px -3px oklch(0.72 0.19 160 / 40%), inset 0 1px 0 oklch(0.868 0.16 178 / 30%)",
} as const;

/**
 * Helper to retrieve Student Cyberpunk card utility classes
 */
export function getStudentCyberpunkCardClasses(isHoverable = true): string {
  return [
    "student-cyberpunk-card",
    "student-frosted-glass-depth",
    "student-mint-cyan-edge",
    isHoverable ? "hover:scale-[1.015] hover:shadow-[0_0_28px_-2px_rgba(0,245,160,0.3)] transition-all duration-300" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Helper to retrieve Student mint/cyan edge highlight classes
 */
export function getStudentEdgeHighlightClasses(variant: "mint" | "cyan" | "dual" = "dual"): string {
  if (variant === "mint") return "border border-emerald-500/35 shadow-[0_0_20px_-4px_rgba(16,185,129,0.25)]";
  if (variant === "cyan") return "border border-cyan-400/35 shadow-[0_0_20px_-4px_rgba(0,245,160,0.25)]";
  return "student-mint-cyan-edge student-neon-mint-glow";
}

export const HOST_WARM_HEARTH_TOKENS = {
  amberAccent: "oklch(0.769 0.165 70 / 35%)",
  terracottaAccent: "oklch(0.60 0.14 45 / 35%)",
  warmBrassAccent: "oklch(0.82 0.15 85 / 40%)",
  hearthBg: "linear-gradient(145deg, oklch(0.16 0.016 65 / 90%), oklch(0.12 0.012 55 / 95%))",
  hearthGradientEdge: "linear-gradient(135deg, oklch(0.769 0.165 70 / 60%), oklch(0.60 0.14 45 / 60%), oklch(0.82 0.15 85 / 60%))",
  hearthGlowShadow: "0 0 28px -3px oklch(0.769 0.165 70 / 35%), inset 0 1px 0 oklch(0.82 0.15 85 / 30%)",
  hearthGlassBlur: "blur(16px) saturate(140%)",
} as const;

/**
 * Helper to retrieve Senior Host Warm Hearth card utility classes
 */
export function getHostWarmHearthCardClasses(isHoverable = true): string {
  return [
    "host-warm-hearth-card",
    "host-warm-hearth-depth",
    "host-hearth-amber-brass-edge",
    isHoverable ? "hover:scale-[1.015] hover:shadow-[0_0_30px_-2px_rgba(245,158,11,0.35)] transition-all duration-300" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Helper to retrieve Senior Host hearth accent highlight classes
 */
export function getHostHearthAccentClasses(variant: "amber" | "terracotta" | "brass" | "trio" = "trio"): string {
  if (variant === "amber") return "border border-amber-500/40 shadow-[0_0_22px_-4px_rgba(245,158,11,0.3)]";
  if (variant === "terracotta") return "border border-orange-600/40 shadow-[0_0_22px_-4px_rgba(234,88,12,0.3)]";
  if (variant === "brass") return "border border-yellow-500/40 shadow-[0_0_22px_-4px_rgba(234,179,8,0.3)]";
  return "host-hearth-amber-brass-edge host-hearth-amber-glow";
}

export const DYNAMIC_PERSONA_NAVBAR_TOKENS = {
  student: {
    brandGlow: "drop-shadow-[0_0_14px_rgba(16,185,129,0.55)] [filter:drop-shadow(0_0_16px_rgba(0,245,160,0.45))]",
    topAccentLine: "bg-gradient-to-r from-emerald-500 via-teal-400 via-cyan-400 to-emerald-500",
    activeIndicator: "bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 shadow-[0_0_14px_rgba(16,185,129,0.7)]",
    linkHover: "hover:text-emerald-300 hover:bg-emerald-500/10",
    linkActive: "text-emerald-300 bg-emerald-500/15 font-semibold border-emerald-400/80 shadow-[0_0_12px_rgba(16,185,129,0.25)]",
    scrolledBorder: "border-b border-emerald-500/25 shadow-[0_12px_32px_-6px_rgba(0,0,0,0.85),0_4px_20px_-2px_rgba(16,185,129,0.18)]",
    ctaButton: "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 shadow-md shadow-emerald-500/25 active:scale-95",
    mobileDrawerBorder: "border-t border-emerald-500/30 shadow-[inset_0_1px_0_rgba(16,185,129,0.25)]",
  },
  host: {
    brandGlow: "drop-shadow-[0_0_14px_rgba(245,158,11,0.6)] [filter:drop-shadow(0_0_16px_rgba(251,191,36,0.5))]",
    topAccentLine: "bg-gradient-to-r from-amber-500 via-yellow-400 via-amber-400 to-amber-500",
    activeIndicator: "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.7)]",
    linkHover: "hover:text-amber-300 hover:bg-amber-500/10",
    linkActive: "text-amber-300 bg-amber-500/15 font-semibold border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.25)]",
    scrolledBorder: "border-b border-amber-500/25 shadow-[0_12px_32px_-6px_rgba(0,0,0,0.85),0_4px_20px_-2px_rgba(245,158,11,0.18)]",
    ctaButton: "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-md shadow-amber-500/25 active:scale-95",
    mobileDrawerBorder: "border-t border-amber-500/30 shadow-[inset_0_1px_0_rgba(245,158,11,0.25)]",
  },
} as const;

export type PersonaType = "student" | "host";

/**
 * Helper to retrieve dynamic persona themed navbar tokens
 */
export function getPersonaNavbarTokens(role: PersonaType = "student") {
  return DYNAMIC_PERSONA_NAVBAR_TOKENS[role] || DYNAMIC_PERSONA_NAVBAR_TOKENS.student;
}

/**
 * Helper to retrieve navbar brand logo glow classes
 */
export function getNavbarBrandGlowClasses(role: PersonaType = "student"): string {
  return role === "host"
    ? "navbar-brand-glow-host " + DYNAMIC_PERSONA_NAVBAR_TOKENS.host.brandGlow
    : "navbar-brand-glow-student " + DYNAMIC_PERSONA_NAVBAR_TOKENS.student.brandGlow;
}

/**
 * Helper to retrieve navbar link indicator & underline styling classes
 */
export function getNavbarLinkIndicatorClasses(role: PersonaType = "student", isActive: boolean = false): string {
  const tokens = getPersonaNavbarTokens(role);
  if (isActive) {
    return `${tokens.linkActive} relative navbar-link-active`;
  }
  return `${tokens.linkHover} text-muted-foreground hover:text-foreground relative`;
}

export const DYNAMIC_PERSONA_FOOTER_TOKENS = {
  student: {
    topAccentLine: "bg-gradient-to-r from-emerald-500 via-teal-400 via-cyan-400 to-emerald-500",
    brandGlow: "drop-shadow-[0_0_14px_rgba(16,185,129,0.55)]",
    titleGradient: "from-emerald-400 via-teal-300 to-cyan-400",
    accentDot: "text-cyan-400",
    activeTabBg: "border-cyan/50 bg-cyan/15 text-emerald-300",
    formBorder: "border-emerald-500/20 bg-slate-900/80 shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)]",
    badgeBg: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:border-cyan-500/50 hover:bg-cyan-500/20",
    ctaButtonVariant: "hero" as const,
    resourcesTitle: "Student Ecosystem & Resources",
    resourcesTitleHi: "छात्र इकोसिस्टम व संसाधन",
  },
  host: {
    topAccentLine: "bg-gradient-to-r from-amber-500 via-yellow-400 via-amber-400 to-amber-500",
    brandGlow: "drop-shadow-[0_0_14px_rgba(245,158,11,0.6)]",
    titleGradient: "from-amber-400 via-yellow-300 to-amber-500",
    accentDot: "text-amber-400",
    activeTabBg: "border-amber/50 bg-amber/15 text-amber-300",
    formBorder: "border-amber-500/25 bg-slate-900/85 shadow-[0_0_30px_-5px_rgba(245,158,11,0.2)]",
    badgeBg: "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:border-amber-500/50 hover:bg-amber-500/20",
    ctaButtonVariant: "warm" as const,
    resourcesTitle: "Senior Host Ecosystem & Legal Charters",
    resourcesTitleHi: "वरिष्ठ होस्ट इकोसिस्टम व कानूनी चार्टर",
  },
} as const;

/**
 * Helper to retrieve dynamic persona themed footer tokens
 */
export function getPersonaFooterTokens(role: PersonaType = "student") {
  return DYNAMIC_PERSONA_FOOTER_TOKENS[role] || DYNAMIC_PERSONA_FOOTER_TOKENS.student;
}

export const PERSONA_EMPTY_STATE_TOKENS = {
  student_search_miss: {
    badgeBg: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    glowColor: "rgba(0, 245, 160, 0.25)",
    gradientTitle: "from-cyan-400 via-emerald-300 to-teal-400",
    accentBorder: "border-emerald-500/30 bg-slate-900/90 shadow-[0_0_35px_-5px_rgba(16,185,129,0.2)]",
    primaryButtonVariant: "hero" as const,
    defaultTitleEn: "No Campus Nodes Found Nearby",
    defaultTitleHi: "पास में कोई कैंपस नोड नहीं मिला",
    defaultDescEn: "We couldn't locate active micro-storage nodes matching your search query. Try broadening your radius or checking popular coaching hubs.",
    defaultDescHi: "आपकी खोज से मेल खाता कोई सक्रिय नोड नहीं मिला। कृपया लोकप्रिय कोचिंग हब या पिनकोड से खोजें।",
    suggestions: ["Kakadeo (PW/Allen)", "IIT Kanpur (Hall 13)", "CSJMU Kalyanpur", "Swaroop Nagar"],
    svgAccent: "#00F5A0",
    svgSecondary: "#06B6D4",
  },
  host_zero_bookings: {
    badgeBg: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    glowColor: "rgba(245, 158, 11, 0.25)",
    gradientTitle: "from-amber-400 via-yellow-300 to-amber-500",
    accentBorder: "border-amber-500/35 bg-slate-900/90 shadow-[0_0_35px_-5px_rgba(245,158,11,0.25)]",
    primaryButtonVariant: "warm" as const,
    defaultTitleEn: "Your Senior Host Space is Ready & Waiting",
    defaultTitleHi: "आपका सीनियर होस्ट स्पेस तैयार है",
    defaultDescEn: "Students start packing for upcoming vacations in 12 days! Your listed room or storage space is active and queued for priority student matching.",
    defaultDescHi: "छात्र जल्द ही छुट्टियों के लिए पैकिंग शुरू करेंगे! आपका पंजीकृत स्थान प्राथमिकता मिलान के लिए तैयार है।",
    suggestions: ["Verify Aadhaar & Photos", "Check ₹11.5k Estimator", "TPA Sec 105 FAQ", "WhatsApp Nodal Officer"],
    svgAccent: "#F59E0B",
    svgSecondary: "#FBBF24",
  },
} as const;

export type EmptyStateVariantTier = "student_search_miss" | "host_zero_bookings";

/**
 * Helper to retrieve persona-specific empty state tokens
 */
export function getPersonaEmptyStateTokens(role: "student" | "host" = "student", variant?: EmptyStateVariantTier) {
  const selectedVariant = variant || (role === "host" ? "host_zero_bookings" : "student_search_miss");
  return PERSONA_EMPTY_STATE_TOKENS[selectedVariant];
}

/**
 * Saarthi Stash Card 2.0 Design Tokens (Task 141)
 * 3D bag depth preview, tamper-proof laser seal indicator, ₹300/mo prominent pricing pill, and 1-click booking CTA.
 */
export const SAARTHI_STASH_CARD_TOKENS = {
  pricePill: {
    amount: "₹300",
    unitEn: "/ bag / mo",
    unitHi: "/ बैग / माह",
    savingsEn: "Save 80% Dead Rent",
    savingsHi: "80% मृत-किराया बचत",
    breakdownEn: "Host Earns ₹180 • Platform Net ₹80 • Zero Brokerage",
    breakdownHi: "होस्ट कमाई ₹180 • प्लेटफॉर्म शुद्ध ₹80 • 0% दलाली",
    accentColor: "#06B6D4",
    mintColor: "#10B981",
  },
  tamperProofSeal: {
    code: "QR-SEAL-8839",
    labelEn: "100% Tamper-Proof Laser Seal",
    labelHi: "100% डिजिटल लेजर सील सत्यापित",
    shieldCoverEn: "₹10,000 Insurance Cover",
    shieldCoverHi: "₹10,000 बीमा सुरक्षा कवर",
    scanBeatMs: 2500,
  },
  depthPreview: {
    capacityEn: "35kg Max Vault Capacity",
    capacityHi: "35 किग्रा अधिकतम वॉल्ट क्षमता",
    items: [
      { nameEn: "Standard Trolley Bag", nameHi: "स्टैंडर्ड ट्रॉली बैग", depthZ: "30px", icon: "luggage" },
      { nameEn: "Heavy Study Cartons (x2)", nameHi: "अध्ययन कार्टन (x2)", depthZ: "20px", icon: "box" },
      { nameEn: "Cooler / Books / Bucket", nameHi: "कूलर / किताबें / बाल्टी", depthZ: "10px", icon: "package" },
    ],
  },
  ctaEn: "Book Saarthi Stash @ ₹300",
  ctaHi: "सारथी स्टैश बुक करें (₹300)",
} as const;

/**
 * Helper to retrieve Saarthi Stash Card 2.0 tokens based on active role
 */
export function getSaarthiStashCardTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...SAARTHI_STASH_CARD_TOKENS,
    primaryAccent: isHost ? "#F59E0B" : "#00F5A0",
    secondaryAccent: isHost ? "#FBBF24" : "#06B6D4",
    glowShadow: isHost
      ? "0 0 30px -4px rgba(245, 158, 11, 0.4)"
      : "0 0 30px -4px rgba(0, 245, 160, 0.4)",
  };
}

/**
 * Saarthi Spaces Card 2.0 Design Tokens (Task 142)
 * 16:9 room image carousels, verified senior host badges, zero-brokerage guarantees, and walking distance tags.
 */
export const SAARTHI_SPACES_CARD_TOKENS = {
  aspectRatio: "16/9",
  carousel: {
    autoPlayIntervalMs: 4000,
    aspectRatioClass: "aspect-[16/9]",
  },
  verifiedHostBadge: {
    labelEn: "Verified Senior Host",
    labelHi: "सत्यापित सीनियर होस्ट",
    subtextEn: "TPA Sec 105 Shielded • Police Vetted",
    subtextHi: "TPA धारा 105 सुरक्षित • पुलिस सत्यापित",
    shieldCoverEn: "₹10k Property Safety Cover",
    shieldCoverHi: "₹10k संपत्ति सुरक्षा कवर",
    badgeColor: "#F59E0B",
  },
  zeroBrokerageGuarantee: {
    labelEn: "0% Brokerage Guarantee",
    labelHi: "0% ब्रोकरेज गारंटी",
    savingsTagEn: "Save ₹5,500 Direct Host Booking",
    savingsTagHi: "डायरेक्ट होस्ट बुकिंग से ₹5,500 बचाएं",
    accentColor: "#10B981",
  },
  distanceTags: {
    iitk: {
      tagEn: "🚶 650m to IIT Gate 1 • 7 min walk",
      tagHi: "🚶 650मी गेट 1 तक • 7 मिनट पैदल",
      transitEn: "🛺 ₹10 E-Rickshaw (4 min)",
      transitHi: "🛺 ₹10 ई-रिक्शा (4 मिनट)",
    },
    kakadeo: {
      tagEn: "🚶 400m to Kakadeo PW Vidyapeeth • 4 min walk",
      tagHi: "🚶 400मी काकादेव PW तक • 4 मिनट पैदल",
      transitEn: "🛺 ₹5 Local E-Rickshaw (2 min)",
      transitHi: "🛺 ₹5 लोकल ई-रिक्शा (2 मिनट)",
    },
    csjmu: {
      tagEn: "🚶 900m to CSJMU Metro • 9 min walk",
      tagHi: "🚶 900मी सीएसजेएमयू मेट्रो • 9 मिनट पैदल",
      transitEn: "🛺 ₹15 E-Rickshaw (6 min)",
      transitHi: "🛺 ₹15 ई-रिक्शा (6 मिनट)",
    },
  },
  ctaEn: "Book Verified Room ⚡",
  ctaHi: "सत्यापित कमरा बुक करें ⚡",
} as const;

/**
 * Helper to retrieve Saarthi Spaces Card 2.0 tokens based on active role
 */
export function getSaarthiSpacesCardTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...SAARTHI_SPACES_CARD_TOKENS,
    primaryAccent: isHost ? "#F59E0B" : "#10B981",
    secondaryAccent: isHost ? "#FBBF24" : "#06B6D4",
    glowShadow: isHost
      ? "0 0 28px -4px rgba(245, 158, 11, 0.35)"
      : "0 0 28px -4px rgba(16, 185, 129, 0.35)",
  };
}

export const PERSONA_CROSSFADE_TOKENS = {
  durationMs: 250,
  durationCss: "250ms",
  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  transitionClass: "persona-transitioning",
  cssProperties: [
    "color",
    "background-color",
    "border-color",
    "box-shadow",
    "text-shadow",
    "fill",
    "stroke",
    "filter",
  ],
} as const;

/**
 * Helper to retrieve persona transition crossfade utility classes
 */
export function getPersonaTransitionClasses(isTransitioning: boolean): string {
  if (!isTransitioning) return "transition-colors duration-200 ease-out";
  return "persona-transitioning transition-all duration-250 ease-out";
}

/**
 * Helper to retrieve inline CSS transition object for 250ms persona crossfade
 */
export function getPersonaCrossfadeStyles(): Record<string, string> {
  return {
    transition: `background-color ${PERSONA_CROSSFADE_TOKENS.durationCss} ${PERSONA_CROSSFADE_TOKENS.easing}, color ${PERSONA_CROSSFADE_TOKENS.durationCss} ${PERSONA_CROSSFADE_TOKENS.easing}, border-color ${PERSONA_CROSSFADE_TOKENS.durationCss} ${PERSONA_CROSSFADE_TOKENS.easing}, box-shadow ${PERSONA_CROSSFADE_TOKENS.durationCss} ${PERSONA_CROSSFADE_TOKENS.easing}`,
  };
}

export const PERSONA_CONTEXT_INDICATOR_TOKENS = {
  student: {
    badgeBg: "border-emerald-500/30 bg-slate-900/90 text-emerald-300 shadow-[0_0_24px_-4px_rgba(16,185,129,0.35)]",
    pulseDot: "bg-emerald-400 shadow-[0_0_10px_#10B981]",
    haloGradient: "radial-gradient(circle 380px at 100% 0%, oklch(0.72 0.19 160 / 18%) 0%, oklch(0.868 0.16 178 / 8%) 50%, transparent 80%)",
    roleLabelEn: "STUDENT MODE",
    roleLabelHi: "छात्र मोड",
    contextSubtextEn: "Kakadeo Campus Nodes",
    contextSubtextHi: "काकादेव कैंपस नोड्स",
    accentColor: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    switchTargetRole: "host" as const,
    switchLabelEn: "Switch to Host",
    switchLabelHi: "होस्ट मोड पर जाएं",
  },
  host: {
    badgeBg: "border-amber-500/35 bg-slate-900/90 text-amber-300 shadow-[0_0_24px_-4px_rgba(245,158,11,0.4)]",
    pulseDot: "bg-amber-400 shadow-[0_0_10px_#F59E0B]",
    haloGradient: "radial-gradient(circle 380px at 100% 0%, oklch(0.769 0.165 70 / 20%) 0%, oklch(0.837 0.175 82 / 9%) 50%, transparent 80%)",
    roleLabelEn: "SENIOR HOST MODE",
    roleLabelHi: "सीनियर होस्ट मोड",
    contextSubtextEn: "₹11.5k/mo Income Shield",
    contextSubtextHi: "₹11.5k/माह आय सुरक्षा",
    accentColor: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.45)",
    switchTargetRole: "student" as const,
    switchLabelEn: "Switch to Student",
    switchLabelHi: "छात्र मोड पर जाएं",
  },
} as const;

export type PersonaIndicatorRole = "student" | "host";

/**
 * Helper to retrieve persona context indicator design tokens
 */
export function getPersonaContextIndicatorTokens(role: PersonaIndicatorRole = "student") {
  return PERSONA_CONTEXT_INDICATOR_TOKENS[role] || PERSONA_CONTEXT_INDICATOR_TOKENS.student;
}

/**
 * Helper to retrieve persona corner ambient halo styles
 */
export function getPersonaHaloStyles(role: PersonaIndicatorRole = "student"): Record<string, string> {
  const tokens = getPersonaContextIndicatorTokens(role);
  return {
    backgroundImage: tokens.haloGradient,
  };
}

/**
 * Saarthi Kitchen Card 2.0 Design Tokens (Task 143)
 * Daily meal countdown timers, rotating homestyle thali previews, calorie/macro breakdowns, and chef bio tags.
 */
export const SAARTHI_KITCHEN_CARD_TOKENS = {
  countdownTimer: {
    lunchCutoffTime: "07:00 AM",
    dinnerCutoffTime: "02:00 PM",
    labelEn: "Daily Cutoff Countdown",
    labelHi: "दैनिक कट-ऑफ समय सीमा",
    lunchSubtextEn: "Order before 7 AM for Lunch",
    lunchSubtextHi: "दोपहर भोजन के लिए सुबह 7 बजे से पहले ऑर्डर करें",
    dinnerSubtextEn: "Order before 2 PM for Dinner",
    dinnerSubtextHi: "रात के खाने के लिए दोपहर 2 बजे से पहले ऑर्डर करें",
  },
  macroBreakdown: {
    caloriesLabelEn: "Calories",
    caloriesLabelHi: "कैलोरी",
    proteinLabelEn: "Protein",
    proteinLabelHi: "प्रोटीन",
    carbsLabelEn: "Carbs",
    carbsLabelHi: "कार्ब्स",
    fatsLabelEn: "Fats",
    fatsLabelHi: "फैट्स",
    unitKcal: "kcal",
    unitGram: "g",
  },
  chefBioTag: {
    defaultNameEn: "Sunita Sharma (Senior Host)",
    defaultNameHi: "सुनीता शर्मा (सीनियर होस्ट)",
    defaultExpEn: "22 Yrs Homestyle Culinary Experience",
    defaultExpHi: "22 वर्ष का घरेलू पाक अनुभव",
    defaultSpecialtyEn: "Desi Ghee Satvik Thali",
    defaultSpecialtyHi: "देसी घी सात्विक थाली",
    trustSealEn: "100% Home Cooked • Hygiene Certified",
    trustSealHi: "100% घर का बना • स्वच्छता प्रमाणित",
  },
  pricePill: {
    tokenRateEn: "1 Token = ₹1",
    tokenRateHi: "1 टोकन = ₹1",
    pickupLabelEn: "Pickup",
    pickupLabelHi: "पिकअप",
    deliveryLabelEn: "Room Delivery",
    deliveryLabelHi: "रूम डिलीवरी",
  },
  ctaEn: "Book Meal Token 🍲",
  ctaHi: "भोजन टोकन बुक करें 🍲",
} as const;

/**
 * Helper to retrieve Saarthi Kitchen Card 2.0 tokens based on active role
 */
export function getSaarthiKitchenCardTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...SAARTHI_KITCHEN_CARD_TOKENS,
    primaryAccent: isHost ? "#F59E0B" : "#10B981",
    secondaryAccent: isHost ? "#FBBF24" : "#06B6D4",
    glowShadow: isHost
      ? "0 0 28px -4px rgba(245, 158, 11, 0.35)"
      : "0 0 28px -4px rgba(16, 185, 129, 0.35)",
  };
}

/**
 * Saarthi Connect Card 2.0 Design Tokens (Task 144)
 * Intergenerational Mentorship cards with senior hobby tags, student skill-exchange chips, and karma points earned counters.
 */
export const SAARTHI_CONNECT_CARD_TOKENS = {
  seniorHobbyTags: {
    labelEn: "Senior Passions & Wisdom",
    labelHi: "वरिष्ठ रुचि व अनुभव क्षेत्र",
    hobbies: [
      { id: "music", nameEn: "Sitar & Classical Music", nameHi: "सितार व शास्त्रीय संगीत", icon: "🎵", color: "#F59E0B" },
      { id: "gardening", nameEn: "Organic Gardening & Herbs", nameHi: "जैविक बागवानी व पौधे", icon: "🌿", color: "#10B981" },
      { id: "chess", nameEn: "Chess & Mind Puzzles", nameHi: "शतरंज व दिमागी खेल", icon: "♟️", color: "#06B6D4" },
      { id: "literature", nameEn: "Hindi Literature & Poetry", nameHi: "हिंदी साहित्य व काव्य", icon: "📖", color: "#EC4899" },
      { id: "finance", nameEn: "Banking & Financial Wisdom", nameHi: "बैंकिंग व वित्तीय मार्गदर्शन", icon: "💼", color: "#FBBF24" },
    ],
  },
  studentSkillExchangeChips: {
    labelEn: "Student Contribution & Skill Exchange",
    labelHi: "छात्र कौशल आदान-प्रदान",
    skills: [
      { id: "smartphone", nameEn: "Smartphone & UPI Setup", nameHi: "स्मार्टफोन व यूपीआई सेट-अप", icon: "📱", color: "#00F5A0" },
      { id: "videocall", nameEn: "Family Video-Call Setup", nameHi: "परिवार संग वीडियो-कॉल", icon: "📹", color: "#38BDF8" },
      { id: "errands", nameEn: "Grocery & Medicine Pickups", nameHi: "राशन व दवाइयां लाना", icon: "🛒", color: "#A855F7" },
      { id: "techhelp", nameEn: "Laptop & App Troubleshooting", nameHi: "लैपटॉप व ऐप सहायता", icon: "💻", color: "#10B981" },
      { id: "walks", nameEn: "Evening Walks & Companionship", nameHi: "शाम की सैर व बातचीत", icon: "🚶", color: "#F59E0B" },
    ],
  },
  karmaPointsCounter: {
    labelEn: "Karma Points Earned",
    labelHi: "अर्जित कर्म अंक",
    defaultPoints: 1480,
    defaultTier: "Gold" as const,
    tierBadges: {
      Gold: { labelEn: "Gold Mentor • Top 5%", labelHi: "गोल्ड मेंटर • शीर्ष 5%", color: "#F59E0B", icon: "🏆" },
      Silver: { labelEn: "Silver Mentor • Verified", labelHi: "सिल्वर मेंटर • सत्यापित", color: "#94A3B8", icon: "🥈" },
      Bronze: { labelEn: "Community Saarthi", labelHi: "कम्युनिटी सारथी", color: "#CD7F32", icon: "🥉" },
    },
  },
  compatibilityBadge: {
    labelEn: "Match Compatibility",
    labelHi: "अनुकूलता मैच",
    highMatchThreshold: 90,
  },
  ctaEn: "Request Mentorship Pair 🤝",
  ctaHi: "मार्गदर्शन जोड़ी का अनुरोध करें 🤝",
} as const;

/**
 * Helper to retrieve Saarthi Connect Card 2.0 tokens based on active role
 */
export function getSaarthiConnectCardTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...SAARTHI_CONNECT_CARD_TOKENS,
    primaryAccent: isHost ? "#F59E0B" : "#06B6D4",
    secondaryAccent: isHost ? "#FBBF24" : "#10B981",
    glowShadow: isHost
      ? "0 0 28px -4px rgba(245, 158, 11, 0.35)"
      : "0 0 28px -4px rgba(6, 182, 212, 0.35)",
  };
}

/**
 * FAQ Accordion 2.0 Design Tokens (Task 145)
 * Buttery smooth height transitions, glowing active outlines, and instant category filters.
 */
export const FAQ_ACCORDION_TOKENS = {
  animation: {
    durationMs: 300,
    durationCss: "300ms",
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    utilityClass: "accordion-smooth-height",
  },
  activeOutlines: {
    student: {
      borderColor: "rgba(16, 185, 129, 0.45)",
      backgroundColor: "rgba(6, 78, 59, 0.25)",
      glowShadow: "0 0 24px -4px rgba(16, 185, 129, 0.3)",
      activeClass: "accordion-glowing-outline-student",
      pillActiveClass: "border-emerald-500/50 bg-emerald-500/15 text-emerald-300 shadow-sm",
      pillBadgeActiveClass: "bg-emerald-500/20 text-emerald-300",
    },
    host: {
      borderColor: "rgba(245, 158, 11, 0.45)",
      backgroundColor: "rgba(120, 53, 15, 0.25)",
      glowShadow: "0 0 24px -4px rgba(245, 158, 11, 0.3)",
      activeClass: "accordion-glowing-outline-host",
      pillActiveClass: "border-amber-500/50 bg-amber-500/15 text-amber-300 shadow-sm",
      pillBadgeActiveClass: "bg-amber-500/20 text-amber-300",
    },
  },
  categories: [
    { id: "transparency", labelEn: "Radical Transparency", labelHi: "पूर्ण पारदर्शिता एवं कठिन प्रश्न", icon: "🔍" },
    { id: "all", labelEn: "All Questions", labelHi: "सभी प्रश्न", icon: "📚" },
    { id: "storage", labelEn: "Student Storage", labelHi: "छात्र स्टोरेज", icon: "📦" },
    { id: "safety", labelEn: "Safety & Claims", labelHi: "सुरक्षा व ₹10k क्लेम", icon: "🛡️" },
    { id: "host", labelEn: "Senior Host Norms", labelHi: "सीनियर होस्ट नियम", icon: "🏡" },
  ],
} as const;

/**
 * Helper to retrieve FAQ Accordion 2.0 tokens based on active role
 */
export function getFaqAccordionTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...FAQ_ACCORDION_TOKENS,
    activeRole: role,
    primaryAccent: isHost ? "#F59E0B" : "#10B981",
    activeOutlineSpec: isHost ? FAQ_ACCORDION_TOKENS.activeOutlines.host : FAQ_ACCORDION_TOKENS.activeOutlines.student,
  };
}

/**
 * Helper to compute accordion item CSS classes dynamically based on open state and active role
 */
export function getFaqAccordionItemClasses(
  isOpen: boolean,
  role: "student" | "host" = "student"
): string {
  const isHost = role === "host";
  const base =
    "accordion-item-stage border rounded-xl overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]";
  if (!isOpen) {
    return `${base} border-neutral-800/80 bg-neutral-950/60 hover:border-neutral-700/90`;
  }
  return isHost
    ? `${base} ${FAQ_ACCORDION_TOKENS.activeOutlines.host.activeClass}`
    : `${base} ${FAQ_ACCORDION_TOKENS.activeOutlines.student.activeClass}`;
}

/**
 * Editorial-Grade Testimonial & Review Carousel Tokens (Task 146)
 * Student audio clip quotes, verified college badges, rating stars, and editorial typography.
 */
export const TESTIMONIAL_CAROUSEL_TOKENS = {
  audioClipQuotes: {
    equalizerBarsCount: 16,
    defaultDurationText: "0:42",
    pulseAnimationSpeedMs: 600,
    audioWaveformHeights: [35, 60, 85, 45, 95, 70, 40, 80, 65, 90, 50, 75, 40, 85, 60, 30],
    playingGlowStudent: "0 0 20px -2px rgba(16, 185, 129, 0.4)",
    playingGlowHost: "0 0 20px -2px rgba(245, 158, 11, 0.4)",
  },
  collegeBadges: {
    "IIT Kanpur": {
      nameEn: "IIT Kanpur",
      nameHi: "आईआईटी कानपुर",
      badgeTextEn: "IIT Kanpur • Hall 12",
      badgeTextHi: "आईआईटी कानपुर • हॉल 12",
      color: "#10B981",
      borderColor: "rgba(16, 185, 129, 0.35)",
      bg: "rgba(16, 185, 129, 0.12)",
      icon: "🎓",
    },
    "HBTI Kanpur": {
      nameEn: "HBTI Kanpur",
      nameHi: "एचबीटीआई कानपुर",
      badgeTextEn: "HBTI Kanpur • Chemical",
      badgeTextHi: "एचबीटीआई कानपुर • केमिकल",
      color: "#06B6D4",
      borderColor: "rgba(6, 182, 212, 0.35)",
      bg: "rgba(6, 182, 212, 0.12)",
      icon: "🏛️",
    },
    "CSJM University": {
      nameEn: "CSJM University",
      nameHi: "सीएसजेएम यूनिवर्सिटी",
      badgeTextEn: "CSJM University • BCA",
      badgeTextHi: "सीएसजेएम यूनिवर्सिटी • बीसीए",
      color: "#A855F7",
      borderColor: "rgba(168, 85, 247, 0.35)",
      bg: "rgba(168, 85, 247, 0.12)",
      icon: "📚",
    },
    "PW Vidyapeeth Kakadeo": {
      nameEn: "PW Kakadeo Hub",
      nameHi: "पीडब्लू काकादेव हब",
      badgeTextEn: "Physics Wallah • Kakadeo",
      badgeTextHi: "फिजिक्स वाला • काकादेव",
      color: "#3B82F6",
      borderColor: "rgba(59, 130, 246, 0.35)",
      bg: "rgba(59, 130, 246, 0.12)",
      icon: "⚡",
    },
    "Senior Host Vault": {
      nameEn: "Senior Host Vault",
      nameHi: "सीनियर होस्ट वॉल्ट",
      badgeTextEn: "Senior Host • Kalyanpur",
      badgeTextHi: "सीनियर होस्ट • कल्याणपुर",
      color: "#F59E0B",
      borderColor: "rgba(245, 158, 11, 0.35)",
      bg: "rgba(245, 158, 11, 0.12)",
      icon: "🏡",
    },
  },
  ratingStars: {
    maxStars: 5,
    starGlowColorStudent: "#F59E0B",
    starGlowColorHost: "#FBBF24",
    glowShadow: "0 0 12px rgba(245, 158, 11, 0.5)",
  },
  editorialLayout: {
    cardBorderRadius: "1.25rem",
    backdropBlur: "blur(20px) saturate(150%)",
    activeGlowStudent: "0 20px 50px -12px rgba(16, 185, 129, 0.25)",
    activeGlowHost: "0 20px 50px -12px rgba(245, 158, 11, 0.25)",
  },
} as const;

/**
 * Helper to retrieve Testimonial Carousel tokens based on active role
 */
export function getTestimonialCarouselTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...TESTIMONIAL_CAROUSEL_TOKENS,
    primaryAccent: isHost ? "#F59E0B" : "#10B981",
    secondaryAccent: isHost ? "#FBBF24" : "#06B6D4",
    cardGlow: isHost
      ? TESTIMONIAL_CAROUSEL_TOKENS.editorialLayout.activeGlowHost
      : TESTIMONIAL_CAROUSEL_TOKENS.editorialLayout.activeGlowStudent,
  };
}

/**
 * Campus Directory Search Bar & Live Filter Tokens (Task 147)
 * Auto-suggest chips, distance sliders, live filter tags, and instant query state.
 */
export const FILTER_SEARCH_BAR_TOKENS = {
  autoSuggestChips: [
    { id: "iitk", labelEn: "IIT Kanpur (208016)", labelHi: "आईआईटी कानपुर (208016)", query: "208016", badge: "650m" },
    { id: "csjmu", labelEn: "CSJMU Gate 1 (208024)", labelHi: "सीएसजेएमयू (208024)", query: "208024", badge: "300m" },
    { id: "kakadeo", labelEn: "Kakadeo PW (208002)", labelHi: "काकादेव पीडब्लू (208002)", query: "208002", badge: "150m" },
    { id: "kalyanpur", labelEn: "Kalyanpur (208025)", labelHi: "कल्याणपुर (208025)", query: "208025", badge: "1.2km" },
    { id: "hbti", labelEn: "HBTI Nawabganj (208001)", labelHi: "एचबीटीआई नवाबगंज (208001)", query: "208001", badge: "800m" },
    { id: "lucknow", labelEn: "LU Babuganj (226007)", labelHi: "लखनऊ बाबूगंज (226007)", query: "226007", badge: "500m" },
  ],
  distanceSlider: {
    minKm: 0.1,
    maxKm: 5.0,
    stepKm: 0.1,
    defaultMaxKm: 2.5,
    unitEn: "km radius",
    unitHi: "किमी दायरा",
  },
  liveFilterTags: [
    { id: "all", labelEn: "All Nodes", labelHi: "सभी नोड्स", icon: "🌐" },
    { id: "stash", labelEn: "Stash Lockers Available", labelHi: "स्टैश लॉकर उपलब्ध", icon: "📦" },
    { id: "rooms", labelEn: "Co-Living Rooms", labelHi: "को-लिविंग कमरा", icon: "🏠" },
    { id: "fast_pickup", labelEn: "Instant 10-Min Pickup", labelHi: "10-मिनट पिकअप", icon: "⚡" },
    { id: "top_rated", labelEn: "Top Rated (★ 4.8+)", labelHi: "टॉप रेटेड (★ 4.8+)", icon: "⭐" },
    { id: "walking", labelEn: "Walking Distance (< 500m)", labelHi: "पैदल दूरी (< 500मी)", icon: "🚶" },
  ],
  sortOptions: [
    { id: "distance", labelEn: "Nearest First", labelHi: "नज़दीकी पहले" },
    { id: "rating", labelEn: "Highest Rated", labelHi: "सर्वश्रेष्ठ रेटिंग" },
    { id: "stash_capacity", labelEn: "Max Stash Space", labelHi: "अधिकतम स्टैश" },
    { id: "pickup_speed", labelEn: "Fastest Pickup", labelHi: "तेज़ पिकअप" },
  ],
  personaAccents: {
    student: {
      primaryColor: "#10B981",
      secondaryColor: "#06B6D4",
      activeRingClass: "ring-emerald-500/50 border-emerald-500/40 bg-emerald-500/10",
      glowShadow: "0 0 25px rgba(16, 185, 129, 0.25)",
      chipActive: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      sliderThumb: "bg-emerald-400 border-emerald-500",
    },
    host: {
      primaryColor: "#F59E0B",
      secondaryColor: "#FBBF24",
      activeRingClass: "ring-amber-500/50 border-amber-500/40 bg-amber-500/10",
      glowShadow: "0 0 25px rgba(245, 158, 11, 0.25)",
      chipActive: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      sliderThumb: "bg-amber-400 border-amber-500",
    },
  },
} as const;

export function getFilterSearchBarTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...FILTER_SEARCH_BAR_TOKENS,
    activeAccents: isHost
      ? FILTER_SEARCH_BAR_TOKENS.personaAccents.host
      : FILTER_SEARCH_BAR_TOKENS.personaAccents.student,
  };
}

/**
 * Badge & Tag Standardization Tokens (Task 148)
 * Standardized metadata tags across cards and views with cohesive micro-padding, typography, and persona accents.
 */
export const METADATA_TAG_TOKENS = {
  microPadding: {
    sm: "px-2 py-0.5 text-[10px]",
    default: "px-2.5 py-0.5 text-[11px]",
    lg: "px-3 py-1 text-xs",
  },
  typography: {
    fontFamily: "var(--font-sans)",
    fontWeight: "600",
    letterSpacing: "0.025em",
    lineHeight: "1.2",
  },
  presets: {
    verifiedHost: {
      id: "verifiedHost",
      labelEn: "Verified Host",
      labelHi: "सत्यापित होस्ट",
      icon: "🛡️",
      bgStudent: "rgba(16, 185, 129, 0.12)",
      bgHost: "rgba(245, 158, 11, 0.15)",
      borderStudent: "rgba(16, 185, 129, 0.35)",
      borderHost: "rgba(245, 158, 11, 0.4)",
      textStudent: "#34D399",
      textHost: "#FCD34D",
      glowStudent: "0 0 10px rgba(16, 185, 129, 0.2)",
      glowHost: "0 0 10px rgba(245, 158, 11, 0.25)",
      badgeClass: "metadata-tag-verified-host",
    },
    campusProximity: {
      id: "campusProximity",
      labelEn: "Near Campus",
      labelHi: "कैंपस के समीप",
      icon: "📍",
      bgStudent: "rgba(6, 182, 212, 0.12)",
      bgHost: "rgba(245, 158, 11, 0.12)",
      borderStudent: "rgba(6, 182, 212, 0.35)",
      borderHost: "rgba(245, 158, 11, 0.35)",
      textStudent: "#22D3EE",
      textHost: "#FBBF24",
      glowStudent: "0 0 10px rgba(6, 182, 212, 0.2)",
      glowHost: "0 0 10px rgba(245, 158, 11, 0.2)",
      badgeClass: "metadata-tag-campus-proximity",
    },
    lifestyle: {
      id: "lifestyle",
      labelEn: "Veg Only",
      labelHi: "शुद्ध शाकाहारी",
      icon: "🥗",
      bgStudent: "rgba(16, 185, 129, 0.12)",
      bgHost: "rgba(234, 179, 8, 0.12)",
      borderStudent: "rgba(16, 185, 129, 0.35)",
      borderHost: "rgba(234, 179, 8, 0.35)",
      textStudent: "#34D399",
      textHost: "#FACC15",
      glowStudent: "0 0 10px rgba(16, 185, 129, 0.15)",
      glowHost: "0 0 10px rgba(234, 179, 8, 0.15)",
      badgeClass: "metadata-tag-lifestyle",
    },
    amenity: {
      id: "amenity",
      labelEn: "AC Room",
      labelHi: "एसी कमरा",
      icon: "❄️",
      bgStudent: "rgba(30, 41, 59, 0.8)",
      bgHost: "rgba(45, 35, 20, 0.8)",
      borderStudent: "rgba(51, 65, 85, 0.6)",
      borderHost: "rgba(180, 120, 40, 0.4)",
      textStudent: "#E2E8F0",
      textHost: "#FDE68A",
      glowStudent: "none",
      glowHost: "none",
      badgeClass: "metadata-tag-amenity",
    },
    pricingSave: {
      id: "pricingSave",
      labelEn: "0% Brokerage",
      labelHi: "0% ब्रोकरेज",
      icon: "⚡",
      bgStudent: "rgba(16, 185, 129, 0.18)",
      bgHost: "rgba(245, 158, 11, 0.18)",
      borderStudent: "rgba(16, 185, 129, 0.45)",
      borderHost: "rgba(245, 158, 11, 0.45)",
      textStudent: "#6EE7B7",
      textHost: "#FDE68A",
      glowStudent: "0 0 12px rgba(16, 185, 129, 0.3)",
      glowHost: "0 0 12px rgba(245, 158, 11, 0.3)",
      badgeClass: "metadata-tag-pricing-save",
    },
    statusLive: {
      id: "statusLive",
      labelEn: "Instant Active",
      labelHi: "तुरंत सक्रिय",
      icon: "🟢",
      bgStudent: "rgba(16, 185, 129, 0.15)",
      bgHost: "rgba(245, 158, 11, 0.15)",
      borderStudent: "rgba(16, 185, 129, 0.15)",
      borderHost: "rgba(245, 158, 11, 0.35)",
      textStudent: "#34D399",
      textHost: "#FCD34D",
      glowStudent: "0 0 8px rgba(16, 185, 129, 0.25)",
      glowHost: "0 0 8px rgba(245, 158, 11, 0.25)",
      badgeClass: "metadata-tag-status-live",
    },
  },
} as const;

export function getMetadataTagTokens(
  presetKey: keyof typeof METADATA_TAG_TOKENS.presets = "verifiedHost",
  role: "student" | "host" = "student"
) {
  const isHost = role === "host";
  const preset = METADATA_TAG_TOKENS.presets[presetKey] || METADATA_TAG_TOKENS.presets.verifiedHost;
  return {
    ...preset,
    bg: isHost ? preset.bgHost : preset.bgStudent,
    border: isHost ? preset.borderHost : preset.borderStudent,
    text: isHost ? preset.textHost : preset.textStudent,
    glow: isHost ? preset.glowHost : preset.glowStudent,
  };
}

export function getMetadataTagClasses(
  presetKey: keyof typeof METADATA_TAG_TOKENS.presets = "verifiedHost",
  size: "sm" | "default" | "lg" = "default"
): string {
  const paddingClass = METADATA_TAG_TOKENS.microPadding[size];
  const preset = METADATA_TAG_TOKENS.presets[presetKey] || METADATA_TAG_TOKENS.presets.verifiedHost;
  return `metadata-tag-base ${paddingClass} ${preset.badgeClass}`;
}

/**
 * Comparison Matrix Table Tokens (Task 149)
 * Sleek, high-contrast comparison matrix contrasting StashSaarthi vs Traditional PGs vs Commercial Warehouses.
 */
export const COMPARISON_MATRIX_TOKENS = {
  columns: {
    traditionalPg: {
      id: "traditionalPg",
      titleEn: "Traditional PGs / Hostels",
      titleHi: "पारंपरिक PGs / कमर्शियल हॉस्टल",
      subtitleEn: "Rigid 11-mo lock-in & full dead-rent",
      subtitleHi: "11-महीने सख्त लॉक-इन व पूरा मृत-किराया",
      badgeColor: "#F43F5E",
      bgClass: "bg-rose-500/5 dark:bg-rose-950/15 border-rose-500/20 text-rose-300",
      pillClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    },
    commercialWarehouse: {
      id: "commercialWarehouse",
      titleEn: "Commercial Warehouses",
      titleHi: "कमर्शियल वेयरहाउस (सेल्फ-स्टोरेज)",
      subtitleEn: "Suburban industrial units & heavy min volume",
      subtitleHi: "दूर औद्योगिक इलाके व भारी न्यूनतम शुल्क",
      badgeColor: "#F59E0B",
      bgClass: "bg-amber-500/5 dark:bg-amber-950/15 border-amber-500/20 text-amber-300",
      pillClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    stashSaarthi: {
      id: "stashSaarthi",
      titleEn: "StashSaarthi Network",
      titleHi: "स्टैशसारथी नेटवर्क (StashSaarthi)",
      subtitleEn: "Hyperlocal verified hosts & 0% brokerage",
      subtitleHi: "पड़ोस के सत्यापित होस्ट व 0% ब्रोकरेज",
      badgeColor: "#10B981",
      winnerTextEn: "WINNER",
      winnerTextHi: "सर्वश्रेष्ठ विकल्प",
      bgClass: "bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-500/50 text-emerald-300 shadow-[0_0_30px_-5px_rgba(16,185,129,0.25)]",
      pillClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold",
    },
  },
  categories: [
    { id: "all", labelEn: "All Metrics", labelHi: "सभी मानक", icon: "📊" },
    { id: "storage", labelEn: "Vacation Storage", labelHi: "वैकेशन स्टोरेज", icon: "📦" },
    { id: "pricing", labelEn: "Pricing & Lock-In", labelHi: "कीमत व लॉक-इन", icon: "💰" },
    { id: "logistics", labelEn: "Logistics & Pickup", labelHi: "पिकअप व पहुंच", icon: "🚚" },
    { id: "safety", labelEn: "Safety & Insurance", labelHi: "सुरक्षा व बीमा", icon: "🛡️" },
    { id: "lifestyle", labelEn: "Food & Community", labelHi: "भोजन व समुदाय", icon: "🍲" },
  ],
  statsHighlights: {
    deadRentSavedEn: "₹6,400 Avg Saved / Break",
    deadRentSavedHi: "₹6,400 औसतन बचत / ब्रेक",
    brokerageEn: "0% Brokerage (Direct Host)",
    brokerageHi: "0% ब्रोकरेज (सीधा होस्ट)",
    microStoragePriceEn: "₹300 / bag / mo",
    microStoragePriceHi: "₹300 / बैग / माह",
    lockInPenaltyEn: "0 Days Lock-In",
    lockInPenaltyHi: "0 दिन का लॉक-इन",
  },
} as const;

export function getComparisonMatrixTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...COMPARISON_MATRIX_TOKENS,
    primaryAccent: isHost ? "#F59E0B" : "#10B981",
    secondaryAccent: isHost ? "#FBBF24" : "#06B6D4",
  };
}

/**
 * Skeleton Loader Design Tokens (Task 150)
 * Shimmering wave skeleton loaders matching exact geometric card layouts to eliminate layout jumps.
 */
export const SKELETON_LOADER_TOKENS = {
  animation: {
    durationMs: 1800,
    durationCss: "1.8s",
    easing: "ease-in-out",
    keyframeName: "shimmer-wave-sweep",
    baseClass: "shimmer-wave-skeleton relative overflow-hidden rounded-xl bg-slate-900/60 border border-white/5",
  },
  personaShimmers: {
    student: {
      gradient: "linear-gradient(90deg, transparent 0%, oklch(0.72 0.19 160 / 22%) 50%, transparent 100%)",
      glowColor: "rgba(16, 185, 129, 0.25)",
      accentBorder: "border-emerald-500/20",
      shimmerClass: "shimmer-wave-student",
    },
    host: {
      gradient: "linear-gradient(90deg, transparent 0%, oklch(0.769 0.165 70 / 25%) 50%, transparent 100%)",
      glowColor: "rgba(245, 158, 11, 0.25)",
      accentBorder: "border-amber-500/20",
      shimmerClass: "shimmer-wave-host",
    },
  },
  geometries: {
    stashCard: {
      height: "440px",
      depthStageHeight: "180px",
      sealPillHeight: "36px",
      pricePillHeight: "56px",
      ctaHeight: "48px",
    },
    spacesCard: {
      height: "480px",
      imageCarouselAspect: "16/9",
      badgeRowHeight: "28px",
      titleHeight: "28px",
      walkingPillHeight: "32px",
      ctaRowHeight: "44px",
    },
    kitchenCard: {
      height: "460px",
      timerPulseHeight: "32px",
      thaliStageHeight: "160px",
      macroGridHeight: "48px",
      chefBioHeight: "36px",
      ctaHeight: "48px",
    },
    connectCard: {
      height: "450px",
      headerAvatarHeight: "64px",
      hobbiesRowHeight: "32px",
      skillsRowHeight: "32px",
      karmaCounterHeight: "36px",
      ctaHeight: "48px",
    },
    faqAccordion: {
      searchBarHeight: "52px",
      categoryChipsHeight: "38px",
      accordionItemHeight: "64px",
      accordionItemExpandedHeight: "180px",
    },
    testimonialCarousel: {
      stageHeight: "320px",
      audioWaveformHeight: "40px",
      collegeBadgeHeight: "28px",
      ratingStarsHeight: "24px",
    },
    comparisonMatrix: {
      headerRowHeight: "72px",
      dataRowHeight: "60px",
      mobileCardHeight: "320px",
    },
  },
} as const;

/**
 * Helper to retrieve Skeleton Loader design tokens based on active role
 */
export function getSkeletonLoaderTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  const personaSpec = isHost
    ? SKELETON_LOADER_TOKENS.personaShimmers.host
    : SKELETON_LOADER_TOKENS.personaShimmers.student;
  return {
    ...SKELETON_LOADER_TOKENS,
    activeRole: role,
    primaryAccent: isHost ? "#F59E0B" : "#10B981",
    personaSpec,
  };
}

/**
 * 3D Card Hover Physics & Specular Glare Design Tokens (Task 151)
 * GPU-accelerated tilt, specular glare follow, and auto-disable touch protection.
 */
export const CARD_3D_TOKENS = {
  maxTiltDeg: 12,
  tiltCoefficient: 1.0,
  perspectivePx: 1000,
  glareMaxOpacity: 0.35,
  touchThresholdPx: 768,
  transitionTiming: "cubic-bezier(0.16, 1, 0.3, 1)",
  resetDurationMs: 300,
  glareGradients: {
    student: "radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), oklch(0.72 0.19 160 / 35%) 0%, oklch(0.868 0.16 178 / 15%) 40%, transparent 80%)",
    host: "radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), oklch(0.769 0.165 70 / 35%) 0%, oklch(0.837 0.175 82 / 15%) 40%, transparent 80%)",
  },
} as const;

export function getCard3DTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...CARD_3D_TOKENS,
    activeRole: role,
    primaryAccent: isHost ? "#F59E0B" : "#10B981",
    glareGradient: isHost ? CARD_3D_TOKENS.glareGradients.host : CARD_3D_TOKENS.glareGradients.student,
  };
}

/**
 * Peacock Feather Micro-Interaction & Sparkle Physics Tokens (Task 152)
 * Refined Mor-Pankh dusting animation for Standard Thali selection with particle sparkles & spring physics.
 */
export const PEACOCK_FEATHER_TOKENS = {
  sweepPhysics: {
    durationMs: 850,
    sweepAngleDeg: 35,
    springStiffness: 260,
    springDamping: 18,
    featherRotationRange: [-12, 32],
    featherScaleMax: 1.3,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  sparkleBurst: {
    particleCount: 12,
    colors: [
      "#FBBF24", // Amber Gold
      "#10B981", // Electric Mint
      "#06B6D4", // Cyan
      "#FEF08A", // Makhan Yellow
      "#FFFBEB", // Desi Butter White
      "#6366F1", // Peacock Indigo
    ],
    spreadRadiusPx: 48,
    fadeDurationMs: 1200,
  },
  makhanMound: {
    baseScale: 1.0,
    dustScale: 1.22,
    gheeGlowColor: "rgba(245, 158, 11, 0.35)",
    glowPulseDurationMs: 1400,
  },
  personaAccents: {
    student: {
      glow: "rgba(16, 185, 129, 0.3)",
      badgeBg: "bg-emerald-950/80 border-emerald-500/40 text-emerald-300",
      featherBorder: "#10B981",
    },
    host: {
      glow: "rgba(245, 158, 11, 0.3)",
      badgeBg: "bg-amber-950/80 border-amber-500/40 text-amber-300",
      featherBorder: "#F59E0B",
    },
  },
} as const;

export function getPeacockFeatherTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...PEACOCK_FEATHER_TOKENS,
    activeRole: role,
    primaryAccent: isHost ? "#F59E0B" : "#10B981",
    personaSpec: isHost
      ? PEACOCK_FEATHER_TOKENS.personaAccents.host
      : PEACOCK_FEATHER_TOKENS.personaAccents.student,
  };
}

/**
 * Organic Spring Modal Entrances Design Tokens (Task 153)
 * Replaces linear modal fades with organic spring physics cubic-bezier(0.16, 1, 0.3, 1) across dialogs.
 */
export const SPRING_MODAL_TOKENS = {
  springEasing: "cubic-bezier(0.16, 1, 0.3, 1)",
  backdropEasing: "cubic-bezier(0.16, 1, 0.3, 1)",
  entranceDurationMs: 350,
  exitDurationMs: 220,
  springConfig: {
    type: "spring",
    stiffness: 380,
    damping: 28,
    mass: 0.9,
  },
  transformScale: {
    initial: 0.94,
    animate: 1.0,
    exit: 0.96,
  },
  transformY: {
    initial: 14,
    animate: 0,
    exit: 8,
  },
  backdropBlurPx: 16,
  backdropOpacity: {
    initial: 0,
    animate: 1,
    exit: 0,
  },
  personaGlows: {
    student: {
      borderGlow: "rgba(16, 185, 129, 0.3)",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 30px -4px rgba(16, 185, 129, 0.25)",
      topAccent: "linear-gradient(90deg, #10B981, #06B6D4, #00F5A0)",
    },
    host: {
      borderGlow: "rgba(245, 158, 11, 0.3)",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 30px -4px rgba(245, 158, 11, 0.28)",
      topAccent: "linear-gradient(90deg, #F59E0B, #FBBF24, #F59E0B)",
    },
  },
} as const;

export function getSpringModalTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...SPRING_MODAL_TOKENS,
    activeRole: role,
    primaryAccent: isHost ? "#F59E0B" : "#10B981",
    personaGlow: isHost
      ? SPRING_MODAL_TOKENS.personaGlows.host
      : SPRING_MODAL_TOKENS.personaGlows.student,
  };
}

/**
 * Scroll-Triggered Reveal Engine Design Tokens (Task 154)
 * Staggered section entrance reveals with subtle translation (translateY(24px) -> 0) and opacity fades on scroll.
 */
export const SCROLL_REVEAL_TOKENS = {
  translateYPx: 24,
  translateYCss: "24px",
  durationMs: 600,
  durationCss: "600ms",
  staggerDelayMs: 120, // 0.12s per staggered child item
  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  threshold: 0.15,
  directionOffsets: {
    up: { x: 0, y: 24 },
    down: { x: 0, y: -24 },
    left: { x: 24, y: 0 },
    right: { x: -24, y: 0 },
    fade: { x: 0, y: 0 },
  },
  personaAccents: {
    student: {
      glowColor: "rgba(16, 185, 129, 0.25)",
      borderColor: "rgba(16, 185, 129, 0.3)",
      haloGradient: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
    },
    host: {
      glowColor: "rgba(245, 158, 11, 0.25)",
      borderColor: "rgba(245, 158, 11, 0.3)",
      haloGradient: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(245, 158, 11, 0.15) 0%, transparent 70%)",
    },
  },
} as const;

export type ScrollRevealDirection = keyof typeof SCROLL_REVEAL_TOKENS.directionOffsets;

/**
 * Helper to retrieve Scroll Reveal design tokens based on active role
 */
export function getScrollRevealTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...SCROLL_REVEAL_TOKENS,
    activeRole: role,
    primaryAccent: isHost ? "#F59E0B" : "#10B981",
    personaSpec: isHost
      ? SCROLL_REVEAL_TOKENS.personaAccents.host
      : SCROLL_REVEAL_TOKENS.personaAccents.student,
  };
}

/**
 * Helper to calculate inline style transitions for scroll reveal elements with custom delay & stagger
 */
export function getScrollRevealInlineStyles(
  isVisible: boolean,
  delayMs: number = 0,
  direction: ScrollRevealDirection = "up",
  translateYPx: number = 24
): Record<string, string | number> {
  const offset = SCROLL_REVEAL_TOKENS.directionOffsets[direction] || { x: 0, y: translateYPx };
  const targetX = isVisible ? 0 : offset.x;
  const targetY = isVisible ? 0 : offset.y;

  return {
    opacity: isVisible ? 1 : 0,
    transform: `translate3d(${targetX}px, ${targetY}px, 0)`,
    transitionProperty: "opacity, transform",
    transitionDuration: SCROLL_REVEAL_TOKENS.durationCss,
    transitionTimingFunction: SCROLL_REVEAL_TOKENS.easing,
    transitionDelay: `${delayMs}ms`,
    willChange: "opacity, transform",
  };
}

/**
 * Helper to construct CSS class names for Scroll Reveal elements
 */
export function getScrollRevealClasses(
  isVisible: boolean,
  role: "student" | "host" = "student",
  direction: ScrollRevealDirection = "up",
  showPersonaGlow: boolean = false
): string {
  const baseClasses = "scroll-reveal-stage transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]";
  const visibilityClass = isVisible ? "scroll-reveal-active opacity-100 translate-x-0 translate-y-0" : "scroll-reveal-initial opacity-0";
  const personaGlowClass = showPersonaGlow && isVisible
    ? role === "host"
      ? "shadow-[0_0_28px_-4px_rgba(245,158,11,0.25)] border-amber-500/30"
      : "shadow-[0_0_28px_-4px_rgba(16,185,129,0.25)] border-emerald-500/30"
    : "";

  return `${baseClasses} ${visibilityClass} ${personaGlowClass}`.trim();
}

/**
 * Web Audio Haptic Soundscape Tokens & Audio Parameters
 * Formalized sound synthesis frequencies, ramps, and timings for toggles, counters, and payment confirmations.
 */
export const WEB_AUDIO_SOUNDSCAPE_TOKENS = {
  toggleSwitch: {
    on: { baseFreq: 440, targetFreq: 880, durationMs: 65, volume: 0.15, waveform: "sine" as OscillatorType },
    off: { baseFreq: 750, targetFreq: 360, durationMs: 65, volume: 0.12, waveform: "sine" as OscillatorType },
  },
  counterIncrement: {
    baseFreq: 520,
    pitchStepHz: 45,
    maxPitchHz: 1200,
    durationMs: 50,
    volume: 0.14,
    waveform: "sine" as OscillatorType,
  },
  counterDecrement: {
    baseFreq: 640,
    pitchStepHz: 35,
    minPitchHz: 320,
    durationMs: 45,
    volume: 0.1,
    waveform: "triangle" as OscillatorType,
  },
  paymentConfirmation: {
    frequencies: [523.25, 659.25, 783.99, 1046.5], // C5, E5, G5, C6 (Triumphant major chord arpeggio)
    staggerMs: 55,
    durationMs: 380,
    volume: 0.22,
    waveform: "sine" as OscillatorType,
  },
  successChime: {
    frequencies: [587.33, 880, 1174.66], // D5, A5, D6
    staggerMs: 45,
    durationMs: 260,
    volume: 0.18,
    waveform: "sine" as OscillatorType,
  },
  warningBeep: {
    frequencies: [320, 280],
    staggerMs: 60,
    durationMs: 140,
    volume: 0.12,
    waveform: "sawtooth" as OscillatorType,
  },
  personaGlows: {
    student: "rgba(16, 185, 129, 0.3)",
    host: "rgba(245, 158, 11, 0.3)",
  },
} as const;

export type AudioSoundscapeEventType = keyof typeof WEB_AUDIO_SOUNDSCAPE_TOKENS;

/**
 * Helper to retrieve soundscape token specs for a given event type
 */
export function getAudioSoundscapeTokens(eventType?: AudioSoundscapeEventType) {
  if (eventType && WEB_AUDIO_SOUNDSCAPE_TOKENS[eventType]) {
    return WEB_AUDIO_SOUNDSCAPE_TOKENS[eventType];
  }
  return WEB_AUDIO_SOUNDSCAPE_TOKENS;
}

/**
 * Magnetic Buttons Micro-Interaction Tokens (Task 156)
 * Subtle magnetic pull micro-interactions on primary desktop CTA buttons attracting toward cursor.
 */
export const MAGNETIC_BUTTON_TOKENS = {
  magneticStrength: 0.35,
  magneticRadiusPx: 120,
  maxDisplacementPx: 18,
  touchThresholdPx: 768,
  springConfig: {
    stiffness: 220,
    damping: 18,
    mass: 0.4,
  },
  resetTransitionCss: "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)",
  pullTransitionCss: "transform 100ms cubic-bezier(0.16, 1, 0.3, 1)",
  personaGlows: {
    student: {
      glowShadow: "0 0 25px rgba(16, 185, 129, 0.45)",
      borderColor: "rgba(16, 185, 129, 0.5)",
      ringClass: "ring-emerald-500/40",
    },
    host: {
      glowShadow: "0 0 25px rgba(245, 158, 11, 0.45)",
      borderColor: "rgba(245, 158, 11, 0.5)",
      ringClass: "ring-amber-500/40",
    },
  },
} as const;

export function getMagneticButtonTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...MAGNETIC_BUTTON_TOKENS,
    activeRole: role,
    primaryAccent: isHost ? "#F59E0B" : "#10B981",
    personaSpec: isHost
      ? MAGNETIC_BUTTON_TOKENS.personaGlows.host
      : MAGNETIC_BUTTON_TOKENS.personaGlows.student,
  };
}

/**
 * Interactive Dead Rent Savings Slider Design Tokens (Task 157)
 * Interactive vacation days slider dynamically animating saved currency notes and savings milestones.
 */
export const DEAD_RENT_SLIDER_TOKENS = {
  minDays: 5,
  maxDays: 90,
  defaultDays: 45,
  step: 1,
  dailyHostelRent: 250, // ₹250/day (₹7,500/mo avg room rent)
  monthlyStashCostPerBag: 300,
  milestones: [
    { days: 15, labelEn: "Weekend Getaway", labelHi: "वीकेंड ट्रिप", icon: "🏖️", savingsMultiplier: 0.2 },
    { days: 30, labelEn: "1 Month Break", labelHi: "1 माह छुट्टी", icon: "🎓", savingsMultiplier: 0.4 },
    { days: 45, labelEn: "Mid-Term Vacation", labelHi: "मिड-टर्म वेकेशन", icon: "🚀", savingsMultiplier: 0.6 },
    { days: 60, labelEn: "Summer Semester", labelHi: "समर सेमेस्टर", icon: "☀️", savingsMultiplier: 0.8 },
    { days: 90, labelEn: "Annual Internship", labelHi: "वार्षिक इंटरनशिप", icon: "💎", savingsMultiplier: 1.0 },
  ],
  animatedNotes: {
    burstParticleCount: 8,
    noteSymbol: "₹500",
    floatDurationMs: 1200,
    floatEasing: "cubic-bezier(0.16, 1, 0.3, 1)",
    noteGradients: [
      "linear-gradient(135deg, #10B981, #059669)", // Emerald 500
      "linear-gradient(135deg, #34D399, #059669)", // Mint 400
      "linear-gradient(135deg, #06B6D4, #0891B2)", // Cyan 500
      "linear-gradient(135deg, #F59E0B, #D97706)", // Amber 500
    ],
  },
  personaAccents: {
    student: {
      primaryColor: "#10B981",
      secondaryColor: "#00F5A0",
      cyanColor: "#06B6D4",
      sliderTrackBg: "linear-gradient(90deg, #10B981 0%, #06B6D4 50%, #00F5A0 100%)",
      thumbGlow: "0 0 20px rgba(16, 185, 129, 0.6)",
      milestoneActiveBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
      savingsTextGradient: "from-emerald-400 via-teal-300 to-cyan-400",
    },
    host: {
      primaryColor: "#F59E0B",
      secondaryColor: "#FBBF24",
      cyanColor: "#F59E0B",
      sliderTrackBg: "linear-gradient(90deg, #F59E0B 0%, #FBBF24 50%, #D97706 100%)",
      thumbGlow: "0 0 20px rgba(245, 158, 11, 0.6)",
      milestoneActiveBg: "bg-amber-500/20 text-amber-300 border-amber-500/50",
      savingsTextGradient: "from-amber-400 via-yellow-300 to-amber-500",
    },
  },
} as const;

export function getDeadRentSliderTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...DEAD_RENT_SLIDER_TOKENS,
    activeRole: role,
    primaryAccent: isHost ? "#F59E0B" : "#10B981",
    personaSpec: isHost
      ? DEAD_RENT_SLIDER_TOKENS.personaAccents.host
      : DEAD_RENT_SLIDER_TOKENS.personaAccents.student,
  };
}

/**
 * Confetti & Celebration Cannon Tokens (Task 158)
 * Lightweight canvas celebration particle physics upon booking confirmation & host agreement signing.
 */
export const CONFETTI_CELEBRATION_TOKENS = {
  particleCount: {
    standard: 90,
    grand: 160,
    burst: 60,
  },
  gravity: 0.28,
  drag: 0.96,
  decayMs: 3200,
  shapes: ["square", "circle", "ribbon", "star"] as const,
  palette: {
    student: [
      "#10B981", // Emerald 500
      "#00F5A0", // Mint Neon
      "#06B6D4", // Cyan 500
      "#FBBF24", // Sunset Gold
      "#14B8A6", // Teal 500
      "#8B5CF6", // Purple 500
    ],
    host: [
      "#F59E0B", // Warm Amber
      "#FBBF24", // Sunset Gold
      "#EA580C", // Terracotta
      "#F43F5E", // Rose Accent
      "#10B981", // Mint Secondary
    ],
  },
  triggerTypes: {
    booking_confirmation: {
      count: 120,
      soundEffect: "paymentConfirmation",
      labelEn: "Booking Escrow Locked Celebration",
      labelHi: "बुकिंग एस्क्रो सुरक्षित उत्सव",
    },
    host_agreement_signing: {
      count: 150,
      soundEffect: "successChime",
      labelEn: "Verified Senior Host Charter Signed",
      labelHi: "सत्यापित सीनियर होस्ट समझौता पूर्ण",
    },
    milestone_unlocked: {
      count: 80,
      soundEffect: "counterIncrement",
      labelEn: "Milestone Unlocked",
      labelHi: "माइलस्टोन अनलॉक हुआ",
    },
  },
} as const;

export type ConfettiTriggerType = keyof typeof CONFETTI_CELEBRATION_TOKENS.triggerTypes;

export function getConfettiCelebrationTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...CONFETTI_CELEBRATION_TOKENS,
    activeRole: role,
    palette: isHost
      ? CONFETTI_CELEBRATION_TOKENS.palette.host
      : CONFETTI_CELEBRATION_TOKENS.palette.student,
  };
}

/**
 * Tab Switching Indicator Glides Tokens (Task 159)
 * Design tokens for fluid sliding background pills and underlines
 */
export const TAB_GLIDER_TOKENS = {
  springConfig: {
    type: "spring",
    stiffness: 450,
    damping: 32,
    mass: 0.8,
  },
  transitionDurationMs: 250,
  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  layoutIdDefault: "tab-glider-pill-active",
  variants: {
    pills: {
      activeBgStudent: "bg-emerald-500/15 border-emerald-500/35 text-emerald-400",
      activeBgHost: "bg-amber-500/15 border-amber-500/35 text-amber-300",
      glowStudent: "0 0 16px -2px oklch(0.72 0.19 160 / 30%)",
      glowHost: "0 0 16px -2px oklch(0.809 0.165 76 / 30%)",
    },
    segmented: {
      activeBgStudent: "bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-md",
      activeBgHost: "bg-amber-950/80 border-amber-500/50 text-amber-200 shadow-md",
      glowStudent: "0 0 20px -4px oklch(0.72 0.19 160 / 35%)",
      glowHost: "0 0 20px -4px oklch(0.809 0.165 76 / 35%)",
    },
    underline: {
      indicatorHeightPx: 3,
      glowStudent: "0 2px 10px oklch(0.72 0.19 160 / 60%)",
      glowHost: "0 2px 10px oklch(0.809 0.165 76 / 60%)",
    },
  },
} as const;

export function getTabGliderTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...TAB_GLIDER_TOKENS,
    activeRole: role,
    accentGlow: isHost
      ? TAB_GLIDER_TOKENS.variants.pills.glowHost
      : TAB_GLIDER_TOKENS.variants.pills.glowStudent,
  };
}

/**
 * Laser Seal Barcode Glow Tokens (Task 160)
 * Design tokens for futuristic sweeping beam, barcode line glow, and anti-tamper verification status.
 */
export const LASER_BARCODE_SEAL_TOKENS = {
  beamSweepDurationMs: 2400,
  beamEasing: "cubic-bezier(0.4, 0, 0.2, 1)",
  glowColorStudent: "#10B981",
  glowColorHost: "#F59E0B",
  laserBeamColorStudent: "rgba(0, 245, 160, 0.9)",
  laserBeamColorHost: "rgba(251, 191, 36, 0.9)",
  laserTrailGradientStudent: "linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.15) 50%, rgba(0, 245, 160, 0.85) 95%, #ffffff 100%)",
  laserTrailGradientHost: "linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.15) 50%, rgba(251, 191, 36, 0.85) 95%, #ffffff 100%)",
  defaultSerialCode: "QR-SEAL-8839-X",
  securityStandards: [
    "Laser-Etched Tamper Hologram",
    "TPA Sec 105 Legal Protection",
    "₹10,000 Micro-Insurance Shield",
    "Encrypted Node Verification",
  ],
  pulseFrequencyMs: 1800,
  scannerWidthPx: 3,
} as const;

export function getLaserBarcodeSealTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...LASER_BARCODE_SEAL_TOKENS,
    activeRole: role,
    glowColor: isHost
      ? LASER_BARCODE_SEAL_TOKENS.glowColorHost
      : LASER_BARCODE_SEAL_TOKENS.glowColorStudent,
    laserBeamColor: isHost
      ? LASER_BARCODE_SEAL_TOKENS.laserBeamColorHost
      : LASER_BARCODE_SEAL_TOKENS.laserBeamColorStudent,
    laserTrailGradient: isHost
      ? LASER_BARCODE_SEAL_TOKENS.laserTrailGradientHost
      : LASER_BARCODE_SEAL_TOKENS.laserTrailGradientStudent,
  };
}

/**
 * Multi-Step Booking Journey Tokens (Task 161)
 * Design tokens for distraction-free 3-step progress journey, breadcrumb navigation, and step validation.
 */
export const MULTI_STEP_BOOKING_TOKENS = {
  steps: [
    {
      id: 1,
      stepNumber: 1,
      titleEn: "Service & Contact Details",
      titleHi: "सेवा विवरण व संपर्क",
      subtitleEn: "Select service dimension and fill verified contact details",
      subtitleHi: "अपनी सेवा चुनें और सत्यापित संपर्क विवरण भरें",
      completionPercent: 33,
      validationKeys: ["name", "phone", "email", "pincode"],
    },
    {
      id: 2,
      stepNumber: 2,
      titleEn: "Escrow Lock & Review",
      titleHi: "एस्क्रो सुरक्षा व समीक्षा",
      subtitleEn: "Choose payment mode, accept safety charter, and review escrow",
      subtitleHi: "भुगतान विधि चुनें, सुरक्षा चार्टर स्वीकार करें और समीक्षा करें",
      completionPercent: 66,
      validationKeys: ["waiverAccepted", "paymentMode"],
    },
    {
      id: 3,
      stepNumber: 3,
      titleEn: "StashPass Issued",
      titleHi: "डिजिटल स्टैशपास जारी",
      subtitleEn: "Official digital QR pass and local nodal concierge assigned",
      subtitleHi: "आधिकारिक डिजिटल QR पास और लोकल नोडल कंसीयज आवंटित",
      completionPercent: 100,
      validationKeys: ["tokenId"],
    },
  ],
  breadcrumbs: {
    activeBorderStudent: "border-emerald-500/50",
    activeBorderHost: "border-amber-500/50",
    activeBgStudent: "bg-emerald-500/20 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]",
    activeBgHost: "bg-amber-500/20 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]",
    completedBgStudent: "bg-emerald-500 text-black",
    completedBgHost: "bg-amber-500 text-black",
  },
  distractionFreeModal: {
    backdropFilter: "blur(24px) saturate(160%)",
    containerMaxWidth: "max-w-xl",
    shadow: "0 32px 80px -16px rgba(0, 0, 0, 0.85)",
  },
  stepValidationRules: {
    requireContact: true,
    requireWaiver: true,
    phoneMinDigits: 10,
    pinCodeDigits: 6,
  },
} as const;

export function getMultiStepBookingTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...MULTI_STEP_BOOKING_TOKENS,
    activeRole: role,
    accentColor: isHost ? "#F59E0B" : "#10B981",
    activeBreadcrumbClass: isHost
      ? MULTI_STEP_BOOKING_TOKENS.breadcrumbs.activeBgHost
      : MULTI_STEP_BOOKING_TOKENS.breadcrumbs.activeBgStudent,
    completedBreadcrumbClass: isHost
      ? MULTI_STEP_BOOKING_TOKENS.breadcrumbs.completedBgHost
      : MULTI_STEP_BOOKING_TOKENS.breadcrumbs.completedBgStudent,
  };
}

/**
 * Phone Number & 6-Digit OTP Input Tokens (Task 162)
 * High-legibility +91 Indian phone and 6-digit OTP input design tokens with auto-advance, digit paste support, and clear error hints.
 */
export const PHONE_OTP_INPUT_TOKENS = {
  countryCode: "+91",
  countryFlag: "🇮🇳",
  countryName: "India",
  otpLength: 6,
  phoneLength: 10,
  validPrefixes: ["6", "7", "8", "9"],
  resendCooldownSec: 30,
  placeholders: {
    phoneEn: "98765 43210",
    phoneHi: "98765 43210",
    otpEn: "• • • • • •",
  },
  errorHints: {
    invalidPhoneEn: "Enter a valid 10-digit Indian mobile number starting with 6-9",
    invalidPhoneHi: "कृपया 6-9 से शुरू होने वाला 10-अंकीय वैध भारतीय मोबाइल नंबर दर्ज करें",
    invalidOtpEn: "Enter complete 6-digit verification code",
    invalidOtpHi: "कृपया 6-अंकों का पूरा सत्यापन कोड दर्ज करें",
  },
  personaAccents: {
    student: {
      border: "border-emerald-500/50",
      ring: "focus-within:ring-emerald-500/50",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      glow: "shadow-[0_0_15px_rgba(16,185,129,0.35)]",
    },
    host: {
      border: "border-amber-500/50",
      ring: "focus-within:ring-amber-500/50",
      bg: "bg-amber-500/10",
      text: "text-amber-300",
      glow: "shadow-[0_0_15px_rgba(245,158,11,0.35)]",
    },
  },
} as const;

export function getPhoneOtpInputTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...PHONE_OTP_INPUT_TOKENS,
    activeRole: role,
    accent: isHost ? PHONE_OTP_INPUT_TOKENS.personaAccents.host : PHONE_OTP_INPUT_TOKENS.personaAccents.student,
  };
}

export const LUGGAGE_ITEMIZER_TOKENS = {
  categories: [
    {
      id: "suitcase",
      titleEn: "Large Trolley Suitcase",
      titleHi: "बड़ा ट्रॉली सूटकेस",
      subtitleEn: "28-32 inch heavy check-in trolley",
      subtitleHi: "28-32 इंच भारी चेक-इन सूटकेस",
      icon: "🧳",
      monthlyRate: 300,
      volumeLiters: 100,
      dimensions: "75 x 50 x 30 cm",
      maxWeightKg: 25,
      suggestedItems: ["Winter clothes", "Jackets", "Heavy coats", "Blankets"],
    },
    {
      id: "carton",
      titleEn: "Study Books & Gear Carton",
      titleHi: "किताबें एवं सामान कार्टन",
      subtitleEn: "Standard 7-ply heavy corrugated box",
      subtitleHi: "मानक 7-प्लाई कार्टन बॉक्स",
      icon: "📦",
      monthlyRate: 250,
      volumeLiters: 60,
      dimensions: "50 x 40 x 30 cm",
      maxWeightKg: 20,
      suggestedItems: ["JEE/NEET books", "Lab manuals", "Stationery", "Utensils"],
    },
    {
      id: "cooler",
      titleEn: "Room Air Cooler / Appliances",
      titleHi: "कमरे का एयर कूलर / उपकरण",
      subtitleEn: "Personal/desert cooler or mini fridge",
      subtitleHi: "पर्सनल/डेजर्ट कूलर या मिनी फ्रिज",
      icon: "❄️",
      monthlyRate: 400,
      volumeLiters: 140,
      dimensions: "60 x 60 x 90 cm",
      maxWeightKg: 18,
      suggestedItems: ["Symphony/Crompton cooler", "Pedestal fan", "Mini heater"],
    },
    {
      id: "backpack",
      titleEn: "Backpack & Duffel Bag",
      titleHi: "बैकपैक एवं डफ़ल बैग",
      subtitleEn: "35-45L laptop or travel bag",
      subtitleHi: "35-45 लीटर लैपटॉप या ट्रैवल बैग",
      icon: "🎒",
      monthlyRate: 150,
      volumeLiters: 40,
      dimensions: "45 x 35 x 20 cm",
      maxWeightKg: 10,
      suggestedItems: ["Laptops", "Gadgets", "Documents", "Daily clothes"],
    },
    {
      id: "bedding",
      titleEn: "Mattress & Bedding Roll",
      titleHi: "गद्दा एवं बिस्तर रोल",
      subtitleEn: "Single bed cotton/foam mattress roll",
      subtitleHi: "सिंगल बेड गद्दा एवं रजाई रोल",
      icon: "🛏️",
      monthlyRate: 200,
      volumeLiters: 80,
      dimensions: "90 x 40 x 40 cm (rolled)",
      maxWeightKg: 8,
      suggestedItems: ["Cotton mattress", "Quilt/Rajai", "Pillows", "Bed sheets"],
    },
  ],
  presets: [
    {
      id: "standard_vacation",
      nameEn: "Hostel Vacation Standard",
      nameHi: "हॉस्टल छुट्टी स्टैंडर्ड",
      icon: "🏖️",
      items: { suitcase: 1, carton: 1, backpack: 1 },
      badgeEn: "Most Popular",
      badgeHi: "सबसे लोकप्रिय",
    },
    {
      id: "heavy_moveout",
      nameEn: "Full Semester Moveout",
      nameHi: "फूल सेमेस्टर खाली करना",
      icon: "🚚",
      items: { suitcase: 2, carton: 2, cooler: 1, bedding: 1 },
      badgeEn: "Maximum Value",
      badgeHi: "अधिकतम बचत",
    },
    {
      id: "minimalist",
      nameEn: "Light Summer Break",
      nameHi: "हल्की गर्मी की छुट्टी",
      icon: "⚡",
      items: { suitcase: 1, backpack: 1 },
      badgeEn: "Fast Pick",
      badgeHi: "त्वरित चयन",
    },
  ],
  spaceCalculation: {
    baseVaultCapacityLiters: 500,
    deadRentPgMonthlyAvg: 4000,
    multiItemBundleDiscountPercentage: 10,
    insuranceCoverageAmount: 10000,
  },
  personaAccents: {
    student: {
      accentColor: "#10B981",
      secondaryColor: "#00F5A0",
      glow: "rgba(16, 185, 129, 0.35)",
      cardBorder: "border-emerald-500/30",
      cardActiveBorder: "border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]",
      badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      meterBar: "from-emerald-500 to-teal-400",
      text: "text-emerald-400",
    },
    host: {
      accentColor: "#F59E0B",
      secondaryColor: "#FBBF24",
      glow: "rgba(245, 158, 11, 0.35)",
      cardBorder: "border-amber-500/30",
      cardActiveBorder: "border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]",
      badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      meterBar: "from-amber-500 to-yellow-400",
      text: "text-amber-300",
    },
  },

} as const;

export function getLuggageItemizerTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...LUGGAGE_ITEMIZER_TOKENS,
    activeRole: role,
    accent: isHost ? LUGGAGE_ITEMIZER_TOKENS.personaAccents.host : LUGGAGE_ITEMIZER_TOKENS.personaAccents.student,
  };
}

export const DATE_TIME_SLOT_PICKER_TOKENS = {
  holidayPresets: [
    {
      id: "summer_break",
      nameEn: "Summer Break ☀️",
      nameHi: "ग्रीष्मकालीन अवकाश ☀️",
      subEn: "71 Days Vacation (May 15 – Jul 25)",
      subHi: "71 दिन अवकाश (15 मई - 25 जुलाई)",
      startOffsetDays: 1,
      durationDays: 71,
      estimatedSavings: "₹18,900",
      badgeEn: "Most Saved",
      badgeHi: "अधिकतम बचत",
      icon: "☀️",
    },
    {
      id: "diwali_break",
      nameEn: "Diwali Holidays 🪔",
      nameHi: "दीपावली छुट्टी 🪔",
      subEn: "13 Days Holiday (Oct 20 – Nov 02)",
      subHi: "13 दिन छुट्टी (20 अक्टू - 02 नवं)",
      startOffsetDays: 3,
      durationDays: 13,
      estimatedSavings: "₹3,400",
      badgeEn: "Popular",
      badgeHi: "लोकप्रिय",
      icon: "🪔",
    },
    {
      id: "holi_vacation",
      nameEn: "Holi Break 🎨",
      nameHi: "होली का त्यौहार 🎨",
      subEn: "10 Days Vacation (Mar 10 – Mar 20)",
      subHi: "10 दिन अवकाश (10 मार्च - 20 मार्च)",
      startOffsetDays: 2,
      durationDays: 10,
      estimatedSavings: "₹2,600",
      badgeEn: "Express",
      badgeHi: "एक्सप्रेस",
      icon: "🎨",
    },
    {
      id: "semester_end",
      nameEn: "Semester Exit 🎓",
      nameHi: "सेमेस्टर समाप्ति 🎓",
      subEn: "35 Days Break (Dec 01 – Jan 05)",
      subHi: "35 दिन ब्रेक (01 दिसं - 05 जन)",
      startOffsetDays: 5,
      durationDays: 35,
      estimatedSavings: "₹9,300",
      badgeEn: "Term End",
      badgeHi: "सत्र समाप्ति",
      icon: "🎓",
    },
    {
      id: "weekend_express",
      nameEn: "Quick Storage 🎒",
      nameHi: "त्वरित स्टैश 🎒",
      subEn: "Flexible Short Trip (7 Days)",
      subHi: "7 दिन का लघु प्रवास",
      startOffsetDays: 0,
      durationDays: 7,
      estimatedSavings: "₹1,800",
      badgeEn: "Short Stay",
      badgeHi: "लघु प्रवास",
      icon: "🎒",
    },
  ],
  timeSlots: [
    {
      id: "slot_morning",
      labelEn: "08:00 AM – 11:00 AM",
      labelHi: "सुबह 08:00 – 11:00",
      badgeEn: "Morning Express",
      badgeHi: "प्रातः सेवा",
      icon: "🌅",
      trafficEn: "Low Traffic",
      trafficHi: "कम ट्रैफिक",
    },
    {
      id: "slot_afternoon",
      labelEn: "12:00 PM – 03:00 PM",
      labelHi: "दोपहर 12:00 – 03:00",
      badgeEn: "Afternoon Slot",
      badgeHi: "मध्याह्न सेवा",
      icon: "☀️",
      trafficEn: "Standard",
      trafficHi: "सामान्य",
    },
    {
      id: "slot_evening",
      labelEn: "04:00 PM – 07:00 PM",
      labelHi: "शाम 04:00 – 07:00",
      badgeEn: "Evening Prime",
      badgeHi: "सायं प्राइम",
      icon: "🌆",
      trafficEn: "Campus Peak",
      trafficHi: "कैंपस पीक",
    },
    {
      id: "slot_night",
      labelEn: "07:00 PM – 09:30 PM",
      labelHi: "रात्रि 07:00 – 09:30",
      badgeEn: "Late Night",
      badgeHi: "रात्रि सेवा",
      icon: "🌙",
      trafficEn: "Quiet Hours",
      trafficHi: "शांत समय",
    },
  ],
  touchTargets: {
    minWidthPx: 48,
    minHeightPx: 48,
  },
  personaAccents: {
    student: {
      accentColor: "#10B981",
      secondaryColor: "#00F5A0",
      glow: "rgba(16, 185, 129, 0.35)",
      cardBorder: "border-emerald-500/30",
      cardActiveBorder: "border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]",
      chipBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      text: "text-emerald-400",
    },
    host: {
      accentColor: "#F59E0B",
      secondaryColor: "#FBBF24",
      glow: "rgba(245, 158, 11, 0.35)",
      cardBorder: "border-amber-500/30",
      cardActiveBorder: "border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)]",
      chipBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      text: "text-amber-300",
    },
  },
} as const;

export function getDateTimeSlotPickerTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...DATE_TIME_SLOT_PICKER_TOKENS,
    activeRole: role,
    accent: isHost ? DATE_TIME_SLOT_PICKER_TOKENS.personaAccents.host : DATE_TIME_SLOT_PICKER_TOKENS.personaAccents.student,
  };
}

/**
 * Dynamic Pricing Breakdown Drawer Tokens (Task 165)
 * Crystal-clear price summary drawer showing base rate, zero brokerage savings, and platform fee with 100% transparency.
 */
export const PRICING_BREAKDOWN_DRAWER_TOKENS = {
  feeStructure: {
    storageBaseMonthlyRate: 300, // ₹300/bag/mo
    hostPayoutMonthlyRate: 180,  // ₹180/bag/mo
    platformNetMargin: 80,       // ₹80/bag/mo
    insuranceCoverAmount: 10000, // ₹10,000 coverage
    insuranceFee: 0,            // ₹0 (Included)
    pickupSealFee: 0,           // ₹0 (Included)
    zeroBrokerageSavingsEstimate: 4000, // ₹4,000 avg PG dead rent savings
  },
  transparencyPills: [
    {
      id: "zero_brokerage",
      titleEn: "0% Brokerage Charged",
      titleHi: "0% ब्रोकरेज शुल्क",
      descEn: "Direct peer-to-peer senior host connection.",
      descHi: "वरिष्ठ नागरिक होस्ट से सीधा जुड़ाव।",
      icon: "⚡",
      color: "#10B981",
    },
    {
      id: "insurance_included",
      titleEn: "₹10,000 Safety Cover",
      titleHi: "₹10,000 सुरक्षा बीमा",
      descEn: "Complimentary damage & loss protection included.",
      descHi: "निःशुल्क क्षति व सामान सुरक्षा शामिल।",
      icon: "🛡️",
      color: "#06B6D4",
    },
    {
      id: "doorstep_pickup",
      titleEn: "Doorstep Pickup & Laser Seal",
      titleHi: "डोरस्टेप पिकअप व लेजर सील",
      descEn: "QR tamper-proof seals applied at pickup.",
      descHi: "पिकअप पर QR लेजर सील टैम्पर्ड सुरक्षा।",
      icon: "🔒",
      color: "#F59E0B",
    },
  ],
  personaAccents: {
    student: {
      accentColor: "#10B981",
      secondaryColor: "#00F5A0",
      glow: "rgba(16, 185, 129, 0.35)",
      drawerBg: "bg-slate-950/95 border-emerald-500/30",
      totalHighlightBg: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300",
      badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      text: "text-emerald-400",
    },
    host: {
      accentColor: "#F59E0B",
      secondaryColor: "#FBBF24",
      glow: "rgba(245, 158, 11, 0.35)",
      drawerBg: "bg-slate-950/95 border-amber-500/30",
      totalHighlightBg: "bg-amber-500/15 border-amber-500/40 text-amber-300",
      badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      text: "text-amber-300",
    },
  },
} as const;

export function getPricingBreakdownDrawerTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...PRICING_BREAKDOWN_DRAWER_TOKENS,
    activeRole: role,
    accent: isHost ? PRICING_BREAKDOWN_DRAWER_TOKENS.personaAccents.host : PRICING_BREAKDOWN_DRAWER_TOKENS.personaAccents.student,
  };
}

/**
 * UPI Payment Intent Modal Tokens (Task 166)
 * Instant 1-tap UPI app launcher specs, dynamic QR code matrix settings, VPA copy handles, and trust signals.
 */
export const UPI_PAYMENT_INTENT_TOKENS = {
  vpaHandle: "stashsaarthi@upi",
  merchantName: "StashSaarthi Micro-Storage",
  upiApps: [
    {
      id: "gpay",
      nameEn: "Google Pay",
      nameHi: "गूगल पे",
      badgeEn: "Most Popular",
      badgeHi: "सर्वाधिक लोकप्रिय",
      color: "#4285F4",
      bgGradient: "from-blue-600/90 to-blue-500/90 hover:from-blue-500 hover:to-blue-400",
      borderGlow: "border-blue-400/40 shadow-blue-500/20",
      schemePrefix: "upi://pay",
      icon: "🔷",
    },
    {
      id: "phonepe",
      nameEn: "PhonePe",
      nameHi: "फोन पे",
      badgeEn: "Instant Refund",
      badgeHi: "तत्काल रिफंड",
      color: "#5F259F",
      bgGradient: "from-purple-700/90 to-purple-600/90 hover:from-purple-600 hover:to-purple-500",
      borderGlow: "border-purple-400/40 shadow-purple-500/20",
      schemePrefix: "phonepe://pay",
      icon: "🟣",
    },
    {
      id: "paytm",
      nameEn: "Paytm UPI",
      nameHi: "पेटीएम UPI",
      badgeEn: "Zero Fee",
      badgeHi: "शून्य शुल्क",
      color: "#00BAF2",
      bgGradient: "from-sky-600/90 to-cyan-500/90 hover:from-sky-500 hover:to-cyan-400",
      borderGlow: "border-sky-400/40 shadow-sky-500/20",
      schemePrefix: "paytmmp://pay",
      icon: "🌐",
    },
    {
      id: "cred",
      nameEn: "CRED Pay",
      nameHi: "क्रेड पे",
      badgeEn: "Cashback Eligible",
      badgeHi: "कैशबैक योग्य",
      color: "#FFFFFF",
      bgGradient: "from-zinc-900 to-black hover:from-zinc-800 hover:to-zinc-900",
      borderGlow: "border-zinc-500/40 shadow-zinc-500/20",
      schemePrefix: "cred://pay",
      icon: "⚡",
    },
    {
      id: "bhim",
      nameEn: "BHIM UPI",
      nameHi: "भीम UPI",
      badgeEn: "NPCI Verified",
      badgeHi: "NPCI सत्यापित",
      color: "#FF6600",
      bgGradient: "from-amber-600/90 to-orange-500/90 hover:from-amber-500 hover:to-orange-400",
      borderGlow: "border-orange-400/40 shadow-orange-500/20",
      schemePrefix: "bhim://pay",
      icon: "🇮🇳",
    },
  ],
  qrConfig: {
    baseUrl: "upi://pay",
    defaultAmount: 300,
    currency: "INR",
    expiresInSec: 600,
    scanningBeamColorStudent: "#10B981",
    scanningBeamColorHost: "#F59E0B",
  },
  trustSignals: [
    {
      id: "npci_security",
      labelEn: "NPCI 256-bit Encrypted",
      labelHi: "NPCI 256-बिट सुरक्षित",
      icon: "🔒",
    },
    {
      id: "zero_fee",
      labelEn: "0% Gateway Surcharge",
      labelHi: "0% अतिरिक्त शुल्क",
      icon: "⚡",
    },
    {
      id: "insurance_cover",
      labelEn: "₹10,000 Insurance Cover",
      labelHi: "₹10,000 बीमा सुरक्षा",
      icon: "🛡️",
    },
  ],
  personaAccents: {
    student: {
      accentColor: "#10B981",
      secondaryColor: "#00F5A0",
      glow: "rgba(16, 185, 129, 0.35)",
      modalBg: "bg-slate-950/95 border-emerald-500/30",
      qrBorder: "border-emerald-500/40 shadow-emerald-500/20",
      actionBtnBg: "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold",
      badgeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    },
    host: {
      accentColor: "#F59E0B",
      secondaryColor: "#FBBF24",
      glow: "rgba(245, 158, 11, 0.35)",
      modalBg: "bg-slate-950/95 border-amber-500/30",
      qrBorder: "border-amber-500/40 shadow-amber-500/20",
      actionBtnBg: "bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold",
      badgeBg: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    },
  },
} as const;

export function getUpiPaymentIntentTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...UPI_PAYMENT_INTENT_TOKENS,
    activeRole: role,
    accent: isHost ? UPI_PAYMENT_INTENT_TOKENS.personaAccents.host : UPI_PAYMENT_INTENT_TOKENS.personaAccents.student,
  };
}

export const FORM_VALIDATION_TOKENS = {
  shakeAnimationMs: 500,
  debounceMs: 250,
  shakeKeyframe: "form-shake-error",
  microCopy: {
    name: {
      defaultEn: "Enter your full legal name",
      validEn: "Looking good! Clear name",
      invalidEn: "Please enter at least 2 characters",
      defaultHi: "अपना पूरा नाम दर्ज करें",
      validHi: "नाम सही है!",
      invalidHi: "कम से कम 2 अक्षर दर्ज करें",
    },
    phone: {
      defaultEn: "+91 10-digit mobile number",
      validEn: "Verified 10-digit mobile number",
      invalidEn: "Enter valid 10-digit mobile (starts with 6-9)",
      defaultHi: "+91 10-अंकों का मोबाइल नंबर",
      validHi: "सत्यापित 10-अंकों का नंबर",
      invalidHi: "वैध 10-अंकों का मोबाइल नंबर (6-9 से शुरू)",
    },
    email: {
      defaultEn: "College or personal email address",
      validEn: "Valid email address format",
      invalidEn: "Please enter a valid email address (e.g. name@domain.com)",
      defaultHi: "कॉलेज या व्यक्तिगत ईमेल पता",
      validHi: "वैध ईमेल फ़ॉर्मैट",
      invalidHi: "कृपया वैध ईमेल पता दर्ज करें (उदा. name@domain.com)",
    },
    pincode: {
      defaultEn: "6-digit Indian PIN code",
      validEn: "Valid Kanpur / Indian PIN code",
      invalidEn: "PIN code must be exactly 6 digits",
      defaultHi: "6-अंकों का भारतीय पिन कोड",
      validHi: "सत्यापित पिन कोड",
      invalidHi: "पिन कोड ठीक 6 अंकों का होना चाहिए",
    },
    custom: {
      defaultEn: "Fill required field",
      validEn: "Input verified",
      invalidEn: "Please check this input field",
      defaultHi: "आवश्यक फ़ील्ड भरें",
      validHi: "इनपुट सत्यापित",
      invalidHi: "कृपया यह फ़ील्ड भरें",
    },
  },
  personaAccents: {
    student: {
      validBorder: "border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.25)]",
      validText: "text-emerald-400",
      validBg: "bg-emerald-500/10",
      invalidBorder: "border-rose-500/70 shadow-[0_0_14px_rgba(244,63,94,0.3)]",
      invalidText: "text-rose-400",
      invalidBg: "bg-rose-500/10",
      focusBorder: "border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]",
    },
    host: {
      validBorder: "border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.25)]",
      validText: "text-amber-400",
      validBg: "bg-amber-500/10",
      invalidBorder: "border-rose-500/70 shadow-[0_0_14px_rgba(244,63,94,0.3)]",
      invalidText: "text-rose-400",
      invalidBg: "bg-rose-500/10",
      focusBorder: "border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.25)]",
    },
  },
} as const;

export function getFormValidationTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...FORM_VALIDATION_TOKENS,
    activeRole: role,
    accent: isHost ? FORM_VALIDATION_TOKENS.personaAccents.host : FORM_VALIDATION_TOKENS.personaAccents.student,
  };
}

/**
 * Booking Confirmation Digital Boarding Pass Tokens (Task 168)
 * Apple Wallet-style digital pass layout specs, QR seal matrix, host address metadata, directions, and print styling.
 */
export const BOOKING_CONFIRMATION_PASS_TOKENS = {
  header: {
    passTypeEn: "DIGITAL STASHPASS • CONFIRMED",
    passTypeHi: "डिजिटल स्टैशपास • सत्यापित",
    issuer: "StashSaarthi Intergenerational Micro-Storage",
    sealBadgeEn: "₹10,000 Insured Seal",
    sealBadgeHi: "₹10,000 बीमित सील",
  },
  cardDimensions: {
    borderRadius: "1.5rem",
    notchRadius: "1rem",
    aspectRatio: "auto",
    maxWidth: "28rem",
  },
  defaultBooking: {
    passId: "STASH-2026-8839-KNP",
    studentName: "Rahul Sharma",
    hostName: "Mrs. Savitri Devi",
    hostAddressEn: "House 42, Near PW Vidyapeeth, Kakadeo, Kanpur - 208025",
    hostAddressHi: "मकान 42, पीडब्लू विद्यापीठ के पास, काकादेव, कानपुर - 208025",
    distanceTagEn: "350m from IIT Kanpur Gate 1",
    distanceTagHi: "आईआईटी कानपुर गेट 1 से 350मी",
    storageItemEn: "2x Standard Suitcases (₹300/mo)",
    storageItemHi: "2x स्टैंडर ट्रॉली बैग (₹300/माह)",
    pickupSlotEn: "Tomorrow • Morning (8:00 AM - 11:00 AM)",
    pickupSlotHi: "कल • सुबह (8:00 AM - 11:00 AM)",
    vaultSealCode: "QR-SEAL-8839-X",
    totalPaid: "₹300",
    mapsQuery: "PW+Vidyapeeth+Kakadeo+Kanpur",
    supportWhatsapp: "+919369454350",
  },
  actions: {
    printEn: "Print / Save PDF Pass",
    printHi: "पास प्रिंट / पीडीएफ सेव करें",
    directionsEn: "Get Directions (Google Maps)",
    directionsHi: "दिशा-निर्देश (गूगल मैप्स)",
    shareEn: "Share Pass via WhatsApp",
    shareHi: "व्हाट्सएप पर पास शेयर करें",
  },
  personaAccents: {
    student: {
      accentColor: "#10B981",
      secondaryColor: "#00F5A0",
      bgGradient: "from-slate-900 via-emerald-950/80 to-slate-950",
      topBannerGradient: "from-emerald-500 via-teal-400 to-cyan-400",
      borderGlow: "border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.25)]",
      badgeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      qrGlow: "shadow-[0_0_20px_rgba(0,245,160,0.3)]",
      actionBtnBg: "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-bold",
    },
    host: {
      accentColor: "#F59E0B",
      secondaryColor: "#FBBF24",
      bgGradient: "from-slate-900 via-amber-950/80 to-slate-950",
      topBannerGradient: "from-amber-500 via-yellow-400 to-amber-500",
      borderGlow: "border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.25)]",
      badgeBg: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      qrGlow: "shadow-[0_0_20px_rgba(251,191,36,0.3)]",
      actionBtnBg: "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-bold",
    },
  },
} as const;

export function getBookingConfirmationPassTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...BOOKING_CONFIRMATION_PASS_TOKENS,
    activeRole: role,
    accent: isHost ? BOOKING_CONFIRMATION_PASS_TOKENS.personaAccents.host : BOOKING_CONFIRMATION_PASS_TOKENS.personaAccents.student,
  };
}

export const WHATSAPP_CHECKOUT_FALLBACK_TOKENS = {
  whatsappNumber: "+91 9369454350",
  whatsappNumberDigits: "919369454350",
  fallbackReason: "Weak Network / Low Signal Instant Order",
  speedGuarantee: "⚡ Instant 10-Second WhatsApp Dispatch",
  trustBadges: [
    "Zero Network Latency",
    "Verified StashSaarthi Nodal Dispatch",
    "Pay Cash or UPI at Pickup",
  ],
  personaAccents: {
    student: {
      accentColor: "#10B981",
      secondaryColor: "#00F5A0",
      bgGradient: "from-slate-900 via-emerald-950/80 to-slate-950",
      whatsappBtnBg: "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 font-bold hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]",
      badgeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      signalGlow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    },
    host: {
      accentColor: "#F59E0B",
      secondaryColor: "#FBBF24",
      bgGradient: "from-slate-900 via-amber-950/80 to-slate-950",
      whatsappBtnBg: "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-bold hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]",
      badgeBg: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      signalGlow: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
    },
  },
  bilingualCopy: {
    en: {
      title: "⚡ WhatsApp Quick-Checkout Fallback",
      subtitle: "Having network glitches or slow Internet? Send your order details directly to our 24/7 Kanpur Dispatch desk on WhatsApp with 1 tap.",
      networkSignalText: "Weak Signal Detected — 2G / Slow Network Fallback Mode Active",
      launchWhatsAppCta: "Launch WhatsApp & Finalize Order",
      copyPrefillCta: "Copy WhatsApp Order Message",
      prefillCopied: "Copied to Clipboard!",
      qrScanText: "Scan QR with mobile WhatsApp if ordering from laptop:",
      directNumberText: "Or message directly on WhatsApp:",
      howItWorksHeader: "How WhatsApp Fallback Works:",
      howItWorksSteps: [
        "1. Click button below to open official StashSaarthi WhatsApp",
        "2. Message pre-fills with your bag selection & pickup dates",
        "3. Instant verification badge & pickup team dispatched!"
      ],
      cancelCta: "Back to Checkout"
    },
    hi: {
      title: "⚡ व्हाट्सएप त्वरित बुकिंग फ़ॉलबैक",
      subtitle: "धीमे इंटरनेट या नेटवर्क समस्या का सामना कर रहे हैं? 1 टैप में व्हाट्सएप पर हमारी कानपुर डिस्पैच टीम को ऑर्डर भेजें।",
      networkSignalText: "कमजोर सिग्नल - धीमा नेटवर्क फ़ॉलबैक मोड सक्रिय",
      launchWhatsAppCta: "व्हाट्सएप खोलें और ऑर्डर पूरा करें",
      copyPrefillCta: "व्हाट्सएप संदेश कॉपी करें",
      prefillCopied: "क्लिपबोर्ड पर कॉपी हो गया!",
      qrScanText: "लैपटॉप से बुकिंग कर रहे हैं? मोबाइल व्हाट्सएप से स्कैन करें:",
      directNumberText: "या सीधे व्हाट्सएप पर संदेश भेजें:",
      howItWorksHeader: "व्हाट्सएप फ़ॉलबैक कैसे काम करता है:",
      howItWorksSteps: [
        "1. नीचे बटन दबाकर StashSaarthi आधिकारिक व्हाट्सएप खोलें",
        "2. बैग और पिकअप विवरण संदेश में स्वतः भर जाएगा",
        "3. तुरंत पिकअप टीम पुष्टि करेगी!"
      ],
      cancelCta: "चेकआउट पर वापस जाएं"
    }
  }
} as const;

export function getWhatsAppCheckoutFallbackTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...WHATSAPP_CHECKOUT_FALLBACK_TOKENS,
    activeRole: role,
    accent: isHost ? WHATSAPP_CHECKOUT_FALLBACK_TOKENS.personaAccents.host : WHATSAPP_CHECKOUT_FALLBACK_TOKENS.personaAccents.student,
  };
}

export const MODAL_BACKDROP_SCROLL_LOCK_TOKENS = {
  backdropClasses: "backdrop-blur-md bg-black/60 modal-backdrop-overlay",
  blurStrength: "12px",
  dimmingOpacity: "0.60",
  dimmingBgClass: "bg-black/60",
  zIndex: 50,
  transitionDurationMs: 300,
  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  scrollLock: {
    activeClass: "modal-scroll-lock-active",
    bodyOverflow: "hidden",
    touchAction: "none",
    overscrollBehavior: "none",
    scrollbarWidthVar: "--scrollbar-width",
  },
  personaAccents: {
    student: {
      accentColor: "#10B981",
      tintBg: "rgba(16, 185, 129, 0.04)",
      borderGlow: "rgba(16, 185, 129, 0.25)",
      radialHalo: "radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.12) 0%, rgba(10, 13, 15, 0.6) 70%)",
      overlayClass: "modal-backdrop-student",
    },
    host: {
      accentColor: "#F59E0B",
      tintBg: "rgba(245, 158, 11, 0.04)",
      borderGlow: "rgba(245, 158, 11, 0.25)",
      radialHalo: "radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.12) 0%, rgba(10, 13, 15, 0.6) 70%)",
      overlayClass: "modal-backdrop-host",
    },
  },
} as const;

export function getModalBackdropTokens(role: "student" | "host" = "student") {
  const isHost = role === "host";
  return {
    ...MODAL_BACKDROP_SCROLL_LOCK_TOKENS,
    activeRole: role,
    accent: isHost
      ? MODAL_BACKDROP_SCROLL_LOCK_TOKENS.personaAccents.host
      : MODAL_BACKDROP_SCROLL_LOCK_TOKENS.personaAccents.student,
  };
}





























