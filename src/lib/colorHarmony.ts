/**
 * StashSaarthi Color Harmony & Automated Contrast Checking Engine
 * 
 * Provides automated WCAG 2.1 relative luminance and contrast ratio calculations,
 * background-to-surface layer stepping scales (--surface-1, --surface-2, --surface-elevated),
 * and automated surface contrast audit utilities for Student and Host personas.
 */

import { OklchColor, STUDENT_TOKENS, HOST_TOKENS } from "./designTokens";

export interface ContrastResult {
  ratio: number;
  formattedRatio: string;
  passesAA: boolean;
  passesAAA: boolean;
  passesAALarge: boolean;
  rating: "AAA" | "AA" | "AA_LARGE" | "FAIL";
}

export interface SurfaceHarmonyScale {
  base: OklchColor;
  surface1: OklchColor;
  surface2: OklchColor;
  surfaceElevated: OklchColor;
  contrastMetrics: {
    fgVsBase: ContrastResult;
    fgVsSurface1: ContrastResult;
    fgVsSurface2: ContrastResult;
    fgVsSurfaceElevated: ContrastResult;
    mutedVsSurface1: ContrastResult;
    mutedVsSurface2: ContrastResult;
    mutedVsSurfaceElevated: ContrastResult;
  };
}

/**
 * Parses OKLCH raw string (e.g., "oklch(0.72 0.19 160)" or "oklch(0.16 0.012 230 / 80%)")
 * into a structured OklchColor object.
 */
export function parseOklch(raw: string): OklchColor {
  const cleaned = raw.trim();
  const match = cleaned.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.%]+))?\s*\)/i);
  if (!match) {
    // Default fallback to dark obsidian if parsing fails
    return { l: 0.12, c: 0.012, h: 230, alpha: 1, raw: "oklch(0.12 0.012 230)" };
  }

  const l = parseFloat(match[1] ?? "0");
  const c = parseFloat(match[2] ?? "0");
  const h = parseFloat(match[3] ?? "0");
  let alpha = 1;

  if (match[4]) {
    const alphaStr = match[4];
    if (alphaStr.endsWith("%")) {
      alpha = parseFloat(alphaStr) / 100;
    } else {
      alpha = parseFloat(alphaStr);
    }
  }

  return { l, c, h, alpha, raw };
}

/**
 * Computes standard relative luminance Y (0 to 1) from OKLCH values
 * using exact OKLCH -> Oklab -> LMS -> Linear sRGB conversion.
 */
export function getOklchLuminance(color: OklchColor | string): number {
  const parsed = typeof color === "string" ? parseOklch(color) : color;
  const { l: L, c: C, h: H } = parsed;

  const rad = (H * Math.PI) / 180;
  const a = C * Math.cos(rad);
  const b = C * Math.sin(rad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const lComp = l_ * l_ * l_;
  const mComp = m_ * m_ * m_;
  const sComp = s_ * s_ * s_;

  let rLinear = +4.0767416621 * lComp - 3.3077115913 * mComp + 0.2309699292 * sComp;
  let gLinear = -1.2684380046 * lComp + 2.6097574011 * mComp - 0.3413193965 * sComp;
  let bLinear = -0.0041960863 * lComp - 0.7034186147 * mComp + 1.707614701 * sComp;

  rLinear = Math.max(0, Math.min(1, rLinear));
  gLinear = Math.max(0, Math.min(1, gLinear));
  bLinear = Math.max(0, Math.min(1, bLinear));

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculates WCAG 2.1 contrast ratio between two OKLCH colors or raw CSS color strings.
 */
export function checkContrast(
  fgColor: OklchColor | string,
  bgColor: OklchColor | string
): ContrastResult {
  const lum1 = getOklchLuminance(fgColor);
  const lum2 = getOklchLuminance(bgColor);

  const maxLum = Math.max(lum1, lum2);
  const minLum = Math.min(lum1, lum2);

  const ratio = (maxLum + 0.05) / (minLum + 0.05);
  const roundedRatio = Math.round(ratio * 100) / 100;

  const passesAAA = ratio >= 7.0;
  const passesAA = ratio >= 4.5;
  const passesAALarge = ratio >= 3.0;

  let rating: "AAA" | "AA" | "AA_LARGE" | "FAIL" = "FAIL";
  if (passesAAA) rating = "AAA";
  else if (passesAA) rating = "AA";
  else if (passesAALarge) rating = "AA_LARGE";

  return {
    ratio: roundedRatio,
    formattedRatio: `${roundedRatio}:1`,
    passesAA,
    passesAAA,
    passesAALarge,
    rating,
  };
}

/**
 * Generates automated background-to-surface layer color harmony scale
 * for background, surface-1, surface-2, and surface-elevated.
 */
export function generateSurfaceHarmonyScale(
  baseColor: OklchColor | string,
  fgText: string = "oklch(0.97 0.008 220)",
  mutedText: string = "oklch(0.79 0.014 220)"
): SurfaceHarmonyScale {
  const base = typeof baseColor === "string" ? parseOklch(baseColor) : baseColor;

  // Surface-1: Base + 0.04 Lightness step
  const surface1L = Math.min(0.98, base.l + 0.04);
  const surface1: OklchColor = {
    l: surface1L,
    c: base.c,
    h: base.h,
    alpha: 1,
    raw: `oklch(${surface1L.toFixed(3)} ${base.c} ${base.h})`,
  };

  // Surface-2: Base + 0.078 Lightness step
  const surface2L = Math.min(0.98, base.l + 0.078);
  const surface2: OklchColor = {
    l: surface2L,
    c: Math.min(0.4, base.c * 1.05),
    h: base.h,
    alpha: 1,
    raw: `oklch(${surface2L.toFixed(3)} ${(base.c * 1.05).toFixed(3)} ${base.h})`,
  };

  // Surface-Elevated: Base + 0.12 Lightness step
  const surfaceElevatedL = Math.min(0.98, base.l + 0.12);
  const surfaceElevated: OklchColor = {
    l: surfaceElevatedL,
    c: Math.min(0.4, base.c * 1.25),
    h: base.h,
    alpha: 1,
    raw: `oklch(${surfaceElevatedL.toFixed(3)} ${(base.c * 1.25).toFixed(3)} ${base.h})`,
  };

  return {
    base,
    surface1,
    surface2,
    surfaceElevated,
    contrastMetrics: {
      fgVsBase: checkContrast(fgText, base),
      fgVsSurface1: checkContrast(fgText, surface1),
      fgVsSurface2: checkContrast(fgText, surface2),
      fgVsSurfaceElevated: checkContrast(fgText, surfaceElevated),
      mutedVsSurface1: checkContrast(mutedText, surface1),
      mutedVsSurface2: checkContrast(mutedText, surface2),
      mutedVsSurfaceElevated: checkContrast(mutedText, surfaceElevated),
    },
  };
}

/**
 * Pre-computed Surface Layer Harmony Scales for Student Persona Mode
 */
export const STUDENT_SURFACE_HARMONY = generateSurfaceHarmonyScale(
  STUDENT_TOKENS.obsidian,
  "oklch(0.97 0.008 220)",
  "oklch(0.79 0.014 220)"
);

/**
 * Pre-computed Surface Layer Harmony Scales for Senior Host Persona Mode
 */
export const HOST_SURFACE_HARMONY = generateSurfaceHarmonyScale(
  HOST_TOKENS.obsidian,
  "oklch(0.97 0.008 220)",
  "oklch(0.79 0.014 220)"
);

/**
 * Audits surface layer contrast harmony for a specific persona role.
 * Returns compliance metrics and pass status.
 */
export function auditSurfaceContrastHarmony(role: "student" | "host") {
  const harmony = role === "host" ? HOST_SURFACE_HARMONY : STUDENT_SURFACE_HARMONY;
  const metrics = harmony.contrastMetrics;

  const allFgPassAA =
    metrics.fgVsBase.passesAA &&
    metrics.fgVsSurface1.passesAA &&
    metrics.fgVsSurface2.passesAA &&
    metrics.fgVsSurfaceElevated.passesAA;

  const allMutedPassAA =
    metrics.mutedVsSurface1.passesAA &&
    metrics.mutedVsSurface2.passesAA &&
    metrics.mutedVsSurfaceElevated.passesAA;

  return {
    role,
    compliant: allFgPassAA && allMutedPassAA,
    fgMetrics: {
      base: metrics.fgVsBase.formattedRatio,
      surface1: metrics.fgVsSurface1.formattedRatio,
      surface2: metrics.fgVsSurface2.formattedRatio,
      surfaceElevated: metrics.fgVsSurfaceElevated.formattedRatio,
    },
    mutedMetrics: {
      surface1: metrics.mutedVsSurface1.formattedRatio,
      surface2: metrics.mutedVsSurface2.formattedRatio,
      surfaceElevated: metrics.mutedVsSurfaceElevated.formattedRatio,
    },
    harmonyScale: {
      base: harmony.base.raw,
      surface1: harmony.surface1.raw,
      surface2: harmony.surface2.raw,
      surfaceElevated: harmony.surfaceElevated.raw,
    },
  };
}
