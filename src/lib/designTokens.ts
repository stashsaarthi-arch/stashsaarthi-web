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
  sm: "calc(var(--radius) - 4px)",
  md: "calc(var(--radius) - 2px)",
  lg: "var(--radius)",
  xl: "calc(var(--radius) + 4px)",
  "2xl": "calc(var(--radius) + 8px)",
  "3xl": "calc(var(--radius) + 12px)",
} as const;

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

