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
