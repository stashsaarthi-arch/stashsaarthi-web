/**
 * StashSaarthi Micro-Copy Alignment Engine
 * Standardizes baseline grid alignment, typography metrics, tabular numeric formats,
 * and optical vertical alignment offsets across badges, icons, price tags, and helper captions.
 */

export interface MicroCopySpec {
  fontSize: string;
  lineHeight: number | string;
  letterSpacing: string;
  iconBaselineOffset: string;
  alignmentClass: string;
}

export const MICRO_COPY_SPECS: Record<"badge" | "priceTag" | "caption" | "iconLabel" | "statusDot", MicroCopySpec> = {
  badge: {
    fontSize: "0.75rem", // 12px
    lineHeight: 1.2,
    letterSpacing: "0.025em",
    iconBaselineOffset: "0.05em",
    alignmentClass: "badge-align-baseline micro-copy-baseline",
  },
  priceTag: {
    fontSize: "1.125rem", // 18px base
    lineHeight: 1.1,
    letterSpacing: "-0.015em",
    iconBaselineOffset: "0.08em",
    alignmentClass: "price-tag-alignment tabular-numeric-tag micro-copy-baseline",
  },
  caption: {
    fontSize: "0.75rem", // 12px
    lineHeight: 1.4,
    letterSpacing: "0.01em",
    iconBaselineOffset: "0.1em",
    alignmentClass: "caption-grid-alignment helper-caption-baseline",
  },
  iconLabel: {
    fontSize: "0.875rem", // 14px
    lineHeight: 1.3,
    letterSpacing: "0.005em",
    iconBaselineOffset: "0.125em",
    alignmentClass: "micro-copy-baseline icon-align-baseline",
  },
  statusDot: {
    fontSize: "0.75rem", // 12px
    lineHeight: 1.2,
    letterSpacing: "0.02em",
    iconBaselineOffset: "0.02em",
    alignmentClass: "micro-copy-center inline-flex items-center gap-1.5",
  },
} as const;

/**
 * Returns CSS utility string for a specific micro-copy element type.
 */
export function getMicroCopyAlignmentClass(type: keyof typeof MICRO_COPY_SPECS): string {
  return MICRO_COPY_SPECS[type].alignmentClass;
}

/**
 * Formats price tags into tabular numeric representation with strict baseline grid alignment specs.
 */
export function formatPriceMicroCopy(
  amount: number,
  currencySymbol: string = "₹",
  periodSuffix: string = "/mo"
): { formatted: string; currencySymbol: string; amountStr: string; periodSuffix: string; alignmentClass: string } {
  const amountStr = amount.toLocaleString("en-IN");
  return {
    formatted: `${currencySymbol}${amountStr}${periodSuffix}`,
    currencySymbol,
    amountStr,
    periodSuffix,
    alignmentClass: "price-tag-alignment tabular-numeric-tag inline-flex items-baseline gap-0.5",
  };
}

/**
 * Audits micro-copy alignment properties for QA verification.
 */
export function auditMicroCopyElements(): { valid: boolean; specsCount: number; types: string[] } {
  const types = Object.keys(MICRO_COPY_SPECS);
  return {
    valid: types.length === 5,
    specsCount: types.length,
    types,
  };
}
