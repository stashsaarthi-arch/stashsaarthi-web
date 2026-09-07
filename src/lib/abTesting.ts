import { useState, useEffect } from "react";
import { logSupabaseError } from "./supabaseLogger";

export type HeroCtaVariant = "mint" | "emerald" | "cyan";

const LOCAL_STORAGE_KEY = "ss_hero_cta_variant";
const ALL_VARIANTS: HeroCtaVariant[] = ["mint", "emerald", "cyan"];

/**
 * Returns the active Hero CTA variant for A/B testing.
 * Priorities:
 * 1. URL search param: ?ab_cta=mint | emerald | cyan
 * 2. LocalStorage persisted selection
 * 3. Random assignment (Mint vs Emerald vs Cyan)
 */
export function getHeroCtaVariant(): HeroCtaVariant {
  if (typeof window === "undefined") return "mint";

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const paramVariant = urlParams.get("ab_cta") as HeroCtaVariant | null;

    if (paramVariant && ALL_VARIANTS.includes(paramVariant)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, paramVariant);
      return paramVariant;
    }

    const storedVariant = localStorage.getItem(LOCAL_STORAGE_KEY) as HeroCtaVariant | null;
    if (storedVariant && ALL_VARIANTS.includes(storedVariant)) {
      return storedVariant;
    }

    // Deterministic or random allocation (33% Mint, 33% Emerald, 33% Cyan)
    const randomIndex = Math.floor(Math.random() * ALL_VARIANTS.length);
    const assignedVariant: HeroCtaVariant = ALL_VARIANTS[randomIndex] ?? "mint";
    localStorage.setItem(LOCAL_STORAGE_KEY, assignedVariant);
    return assignedVariant;
  } catch {
    return "mint";
  }
}

/**
 * Hook to read and toggle Hero CTA button A/B testing variant
 */
export function useHeroCtaVariant() {
  const [variant, setVariantState] = useState<HeroCtaVariant>("mint");

  useEffect(() => {
    setVariantState(getHeroCtaVariant());
  }, []);

  const setVariant = (newVariant: HeroCtaVariant) => {
    setVariantState(newVariant);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, newVariant);
      } catch {
        // ignore storage errors
      }
    }
  };

  return { variant, setVariant };
}

/**
 * Track CTA button click for A/B test conversion metrics
 */
export function trackCtaClick(variant: HeroCtaVariant, role: string, service: string) {
  try {
    // Log conversion telemetry
    logSupabaseError({
      table: "ab_test_conversions",
      operation: "insert",
      context: `A/B CTA Click: variant=${variant}, role=${role}, service=${service}`,
      payload: {
        variant,
        role,
        service,
        timestamp: new Date().toISOString(),
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      },
    });
  } catch {
    // Silent fallback
  }
}

/**
 * Log session recording & heatmap analytics metrics (e.g. Hotjar / Clarity integration)
 * for testing module ordering across Student and Host personas.
 */
export function trackPersonaLayoutRecording(role: string, moduleName: string, scrollDepth: number) {
  try {
    logSupabaseError({
      table: "session_heatmaps",
      operation: "insert",
      context: `Session Recording Telemetry: role=${role}, module=${moduleName}, depth=${scrollDepth}%`,
      payload: {
        role,
        moduleName,
        scrollDepth,
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    // Silent fallback
  }
}

export type ThaliPriceLabelVariant = "classic" | "value_save";

const THALI_STORAGE_KEY = "ss_thali_price_variant";
const ALL_THALI_VARIANTS: ThaliPriceLabelVariant[] = ["classic", "value_save"];

/**
 * Returns the active Standard Thali Price Label variant for A/B testing (Task 84).
 * Priorities:
 * 1. URL search param: ?ab_thali=classic | value_save
 * 2. LocalStorage persisted selection
 * 3. Random assignment (50% Classic vs 50% Value Save)
 */
export function getThaliPriceLabelVariant(): ThaliPriceLabelVariant {
  if (typeof window === "undefined") return "value_save";

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const paramVariant = urlParams.get("ab_thali") as ThaliPriceLabelVariant | null;

    if (paramVariant && ALL_THALI_VARIANTS.includes(paramVariant)) {
      localStorage.setItem(THALI_STORAGE_KEY, paramVariant);
      return paramVariant;
    }

    const storedVariant = localStorage.getItem(THALI_STORAGE_KEY) as ThaliPriceLabelVariant | null;
    if (storedVariant && ALL_THALI_VARIANTS.includes(storedVariant)) {
      return storedVariant;
    }

    const randomIndex = Math.floor(Math.random() * ALL_THALI_VARIANTS.length);
    const assignedVariant: ThaliPriceLabelVariant = ALL_THALI_VARIANTS[randomIndex] ?? "value_save";
    localStorage.setItem(THALI_STORAGE_KEY, assignedVariant);
    return assignedVariant;
  } catch {
    return "value_save";
  }
}

/**
 * Hook to read and toggle Standard Thali Price Label A/B testing variant (Task 84)
 */
export function useThaliPriceLabelVariant() {
  const [variant, setVariantState] = useState<ThaliPriceLabelVariant>("value_save");

  useEffect(() => {
    setVariantState(getThaliPriceLabelVariant());
  }, []);

  const setVariant = (newVariant: ThaliPriceLabelVariant) => {
    setVariantState(newVariant);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(THALI_STORAGE_KEY, newVariant);
      } catch {
        // ignore storage errors
      }
    }
  };

  const getLabel = (isHindi: boolean = false): string => {
    if (variant === "classic") {
      return isHindi ? "₹50 (पिकअप) / ₹60 (डिलीवरी)" : "₹50 (pickup) / ₹60 (delivery)";
    }
    return isHindi ? "₹50 से शुरू, पिकअप पर ज़्यादा बचत" : "From ₹50, save more on pickup";
  };

  return { variant, setVariant, getLabel };
}

/**
 * Track Thali Price Label click for A/B test conversion metrics
 */
export function trackThaliPriceClick(variant: ThaliPriceLabelVariant, action: string) {
  try {
    logSupabaseError({
      table: "ab_test_conversions",
      operation: "insert",
      context: `A/B Thali Price Click: variant=${variant}, action=${action}`,
      payload: {
        experiment: "thali_price_label",
        variant,
        action,
        timestamp: new Date().toISOString(),
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      },
    });
  } catch {
    // Silent fallback
  }
}


