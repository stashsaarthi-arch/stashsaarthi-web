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




