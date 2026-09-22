import { supabase } from "./supabase";

export type PricingTierLevel = "premium" | "standard" | "budget";

export interface PricingZone {
  id?: string;
  zone_code: string;
  zone_name: string;
  zone_name_hi?: string;
  tier_level: PricingTierLevel;
  pincodes: string[];
  base_storage_rate_monthly: number;
  host_payout_rate_monthly: number;
  peak_season_multiplier: number;
  tiffin_base_rate: number;
  description: string;
}

export interface DynamicPricingQuote {
  zone_code: string;
  zone_name: string;
  zone_name_hi: string;
  tier_level: PricingTierLevel;
  base_storage_rate: number;
  host_payout_rate: number;
  peak_multiplier: number;
  demand_surge_multiplier: number;
  effective_rate_per_bag: number;
  total_stash_cost: number;
  total_host_payout: number;
  net_savings: number;
  savings_percent: number;
}

export interface LocationQuoteParams {
  pincode?: string;
  campus?: string;
  bags: number;
  months: number;
  monthlyRent?: number;
}

export const PRESET_PRICING_ZONES: PricingZone[] = [
  {
    zone_code: "IITK_PREMIUM",
    zone_name: "IIT Kanpur Premium Campus Belt",
    zone_name_hi: "आईआईटी कानपुर प्रीमियम कैंपस बेल्ट",
    tier_level: "premium",
    pincodes: ["208016"],
    base_storage_rate_monthly: 350,
    host_payout_rate_monthly: 210,
    peak_season_multiplier: 1.15,
    tiffin_base_rate: 95,
    description:
      "High-demand proximity node adjacent to Hall 1-13 & GH-1 with expedited 10-min pickup SLA.",
  },
  {
    zone_code: "KAKADEO_COACHING",
    zone_name: "Kakadeo Coaching & PG Hub",
    zone_name_hi: "काकादेव कोचिंग व पीजी हब",
    tier_level: "standard",
    pincodes: ["208002"],
    base_storage_rate_monthly: 300,
    host_payout_rate_monthly: 180,
    peak_season_multiplier: 1.1,
    tiffin_base_rate: 90,
    description: "High density student coaching hub (PW & Allen) with high tiffin & room demand.",
  },
  {
    zone_code: "CSJMU_MAIN",
    zone_name: "CSJMU University Belt",
    zone_name_hi: "सीएसजेएमयू विश्वविद्यालय बेल्ट",
    tier_level: "standard",
    pincodes: ["208024"],
    base_storage_rate_monthly: 300,
    host_payout_rate_monthly: 180,
    peak_season_multiplier: 1.05,
    tiffin_base_rate: 90,
    description: "Kalyanpur university gate node with steady year-round student traffic.",
  },
  {
    zone_code: "KALYANPUR_OUTER",
    zone_name: "Kalyanpur Outer & Awas Vikas",
    zone_name_hi: "कल्याणपुर आउटर व आवास विकास",
    tier_level: "budget",
    pincodes: ["208025"],
    base_storage_rate_monthly: 270,
    host_payout_rate_monthly: 160,
    peak_season_multiplier: 1.0,
    tiffin_base_rate: 85,
    description:
      "Budget-friendly residential cluster with spacious verified PG owner host storage capacity.",
  },
  {
    zone_code: "SWAROOP_NAGAR",
    zone_name: "Swaroop Nagar Medical Node",
    zone_name_hi: "स्वरूप नगर मेडिकल नोड",
    tier_level: "premium",
    pincodes: ["208001"],
    base_storage_rate_monthly: 340,
    host_payout_rate_monthly: 200,
    peak_season_multiplier: 1.1,
    tiffin_base_rate: 95,
    description: "GSVM Medical College & hospital residency node with climate-controlled storage.",
  },
  {
    zone_code: "LUCKNOW_CENTRAL",
    zone_name: "Lucknow University Hub",
    zone_name_hi: "लखनऊ विश्वविद्यालय हब",
    tier_level: "standard",
    pincodes: ["226007"],
    base_storage_rate_monthly: 320,
    host_payout_rate_monthly: 190,
    peak_season_multiplier: 1.05,
    tiffin_base_rate: 90,
    description: "Babuganj & Hazratganj student hub in Lucknow.",
  },
];

/**
 * Calculates a dynamic location-based pricing quote synchronously (instant UI fallback).
 */
export function calculateLocationPricingQuote({
  pincode = "",
  campus = "",
  bags = 2,
  months = 1.5,
  monthlyRent = 6000,
}: LocationQuoteParams): DynamicPricingQuote {
  const safeBags = Math.max(1, bags);
  const safeMonths = Math.max(0.5, months);
  const safeRent = Math.max(1000, monthlyRent);

  // Match zone by PIN code or campus name
  let matchedZone = PRESET_PRICING_ZONES.find((z) => {
    if (campus && z.zone_name.toLowerCase().includes(campus.toLowerCase())) return true;
    if (pincode && z.pincodes.includes(pincode.trim())) return true;
    return false;
  });

  if (!matchedZone) {
    matchedZone = PRESET_PRICING_ZONES.find((z) => z.zone_code === "CSJMU_MAIN")!;
  }

  // Calculate rate per bag rounded to nearest ₹5
  const surge = campus.toLowerCase().includes("iit") ? 1.15 : 1.0;
  const rawRate =
    matchedZone.base_storage_rate_monthly * matchedZone.peak_season_multiplier * surge;
  const effectiveRate = Math.round(rawRate / 5) * 5;

  const totalStashCost = Math.round(safeBags * effectiveRate * safeMonths);
  const totalHostPayout = Math.round(safeBags * matchedZone.host_payout_rate_monthly * safeMonths);
  const deadRentCost = Math.round(safeRent * safeMonths);
  const netSavings = Math.max(0, deadRentCost - totalStashCost);
  const savingsPercent = deadRentCost > 0 ? Math.round((netSavings / deadRentCost) * 100) : 0;

  return {
    zone_code: matchedZone.zone_code,
    zone_name: matchedZone.zone_name,
    zone_name_hi: matchedZone.zone_name_hi || matchedZone.zone_name,
    tier_level: matchedZone.tier_level,
    base_storage_rate: matchedZone.base_storage_rate_monthly,
    host_payout_rate: matchedZone.host_payout_rate_monthly,
    peak_multiplier: matchedZone.peak_season_multiplier,
    demand_surge_multiplier: surge,
    effective_rate_per_bag: effectiveRate,
    total_stash_cost: totalStashCost,
    total_host_payout: totalHostPayout,
    net_savings: netSavings,
    savings_percent: savingsPercent,
  };
}

/**
 * Async fetch for dynamic location pricing tier from Supabase RPC, falling back to local engine.
 */
export async function fetchLocationPricingQuoteFromSupabase(
  params: LocationQuoteParams,
): Promise<DynamicPricingQuote> {
  try {
    const { data, error } = await supabase.rpc("get_location_pricing_tier", {
      p_pincode: params.pincode || null,
      p_campus: params.campus || null,
    });

    if (!error && data && data.length > 0) {
      const row = data[0];
      const safeBags = Math.max(1, params.bags);
      const safeMonths = Math.max(0.5, params.months);
      const safeRent = Math.max(1000, params.monthlyRent || 6000);

      const effectiveRate = Number(row.effective_rate_per_bag) || 300;
      const totalStashCost = Math.round(safeBags * effectiveRate * safeMonths);
      const hostPayoutRate = Number(row.host_payout_rate) || 180;
      const totalHostPayout = Math.round(safeBags * hostPayoutRate * safeMonths);
      const deadRentCost = Math.round(safeRent * safeMonths);
      const netSavings = Math.max(0, deadRentCost - totalStashCost);
      const savingsPercent = deadRentCost > 0 ? Math.round((netSavings / deadRentCost) * 100) : 0;

      return {
        zone_code: row.zone_code,
        zone_name: row.zone_name,
        zone_name_hi: row.zone_name_hi || row.zone_name,
        tier_level: row.tier_level as PricingTierLevel,
        base_storage_rate: Number(row.base_storage_rate),
        host_payout_rate: hostPayoutRate,
        peak_multiplier: Number(row.peak_multiplier),
        demand_surge_multiplier: Number(row.demand_surge_multiplier),
        effective_rate_per_bag: effectiveRate,
        total_stash_cost: totalStashCost,
        total_host_payout: totalHostPayout,
        net_savings: netSavings,
        savings_percent: savingsPercent,
      };
    }
  } catch (err) {
    console.warn(
      "Supabase location pricing RPC query failed, using local calculation fallback:",
      err,
    );
  }

  // Fallback
  return calculateLocationPricingQuote(params);
}

/**
 * UI Theme helper for location pricing tier badges
 */
export function getZoneTierBadge(tierLevel: PricingTierLevel) {
  switch (tierLevel) {
    case "premium":
      return {
        label: "Premium Zone",
        label_hi: "प्रीमियम ज़ोन",
        badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        icon: "👑",
      };
    case "budget":
      return {
        label: "Budget Saver Zone",
        label_hi: "बजट सेवर ज़ोन",
        badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
        icon: "⚡",
      };
    case "standard":
    default:
      return {
        label: "Standard Zone",
        label_hi: "स्टैंडर्ड ज़ोन",
        badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        icon: "🌿",
      };
  }
}
