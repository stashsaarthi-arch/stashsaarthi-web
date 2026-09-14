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
