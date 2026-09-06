-- Migration: Location-Based Dynamic Pricing Tiers & Schema
-- Author: StashSaarthi Autonomous System [CTO]
-- Date: 2026-09-06

-- 1. Create Pricing Zones Table
CREATE TABLE IF NOT EXISTS public.pricing_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_code TEXT NOT NULL UNIQUE,
    zone_name TEXT NOT NULL,
    zone_name_hi TEXT,
    tier_level TEXT NOT NULL CHECK (tier_level IN ('premium', 'standard', 'budget')),
    pincodes TEXT[] NOT NULL DEFAULT '{}',
    base_storage_rate_monthly NUMERIC(10, 2) NOT NULL DEFAULT 300.00,
    host_payout_rate_monthly NUMERIC(10, 2) NOT NULL DEFAULT 180.00,
    peak_season_multiplier NUMERIC(4, 2) NOT NULL DEFAULT 1.00,
    room_brokerage_fee_pct NUMERIC(4, 2) NOT NULL DEFAULT 0.00,
    tiffin_base_rate NUMERIC(10, 2) NOT NULL DEFAULT 90.00,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Campus Location Pricing Mapping Table
CREATE TABLE IF NOT EXISTS public.campus_location_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_name TEXT NOT NULL UNIQUE,
    zone_id UUID NOT NULL REFERENCES public.pricing_zones(id) ON DELETE CASCADE,
    proximity_radius_km NUMERIC(5, 2) NOT NULL DEFAULT 1.5,
    demand_surge_multiplier NUMERIC(4, 2) NOT NULL DEFAULT 1.00,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.pricing_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_location_pricing ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public Read Access
CREATE POLICY "Allow public read access on pricing_zones"
    ON public.pricing_zones
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Allow public read access on campus_location_pricing"
    ON public.campus_location_pricing
    FOR SELECT
    USING (is_active = true);

-- RLS Policies: Admin / Service Role Write Access
CREATE POLICY "Allow authenticated service role write on pricing_zones"
    ON public.pricing_zones
    FOR ALL
    TO authenticated, service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated service role write on campus_location_pricing"
    ON public.campus_location_pricing
    FOR ALL
    TO authenticated, service_role
    USING (true)
    WITH CHECK (true);

-- 4. Seed Initial Kanpur & Lucknow Location Pricing Tiers
INSERT INTO public.pricing_zones (
    zone_code, zone_name, zone_name_hi, tier_level, pincodes, base_storage_rate_monthly, host_payout_rate_monthly, peak_season_multiplier, description
) VALUES
(
    'IITK_PREMIUM', 
    'IIT Kanpur Premium Campus Belt', 
    'आईआईटी कानपुर प्रीमियम कैंपस बेल्ट', 
    'premium', 
    ARRAY['208016'], 
    350.00, 
    210.00, 
    1.15, 
    'High-demand proximity node adjacent to Hall 1-13 & GH-1 with expedited 10-min pickup SLA.'
),
(
    'KAKADEO_COACHING', 
    'Kakadeo Coaching & PG Hub', 
    'काकादेव कोचिंग व पीजी हब', 
    'standard', 
    ARRAY['208002'], 
    300.00, 
    180.00, 
    1.10, 
    'High density student coaching hub (PW & Allen) with high tiffin & room demand.'
),
(
    'CSJMU_MAIN', 
    'CSJMU University Belt', 
    'सीएसजेएमयू विश्वविद्यालय बेल्ट', 
    'standard', 
    ARRAY['208024'], 
    300.00, 
    180.00, 
    1.05, 
    'Kalyanpur university gate node with steady year-round student traffic.'
),
(
    'KALYANPUR_OUTER', 
    'Kalyanpur Outer & Awas Vikas', 
    'कल्याणपुर आउटर व आवास विकास', 
    'budget', 
    ARRAY['208025'], 
    270.00, 
    160.00, 
    1.00, 
    'Budget-friendly residential cluster with spacious senior host storage capacity.'
),
(
    'SWAROOP_NAGAR', 
    'Swaroop Nagar Medical Node', 
    'स्वरूप नगर मेडिकल नोड', 
    'premium', 
    ARRAY['208001'], 
    340.00, 
    200.00, 
    1.10, 
    'GSVM Medical College & hospital residency node with climate-controlled storage.'
),
(
    'LUCKNOW_CENTRAL', 
    'Lucknow University Hub', 
    'लखनऊ विश्वविद्यालय हब', 
    'standard', 
    ARRAY['226007'], 
    320.00, 
    190.00, 
    1.05, 
    'Babuganj & Hazratganj student hub in Lucknow.'
)
ON CONFLICT (zone_code) DO NOTHING;

-- Seed Campus Mappings
INSERT INTO public.campus_location_pricing (campus_name, zone_id, proximity_radius_km, demand_surge_multiplier)
SELECT 'IIT Kanpur', id, 1.0, 1.15 FROM public.pricing_zones WHERE zone_code = 'IITK_PREMIUM'
ON CONFLICT (campus_name) DO NOTHING;

INSERT INTO public.campus_location_pricing (campus_name, zone_id, proximity_radius_km, demand_surge_multiplier)
SELECT 'CSJMU Kanpur', id, 1.5, 1.05 FROM public.pricing_zones WHERE zone_code = 'CSJMU_MAIN'
ON CONFLICT (campus_name) DO NOTHING;

INSERT INTO public.campus_location_pricing (campus_name, zone_id, proximity_radius_km, demand_surge_multiplier)
SELECT 'HBTI Kanpur', id, 1.2, 1.10 FROM public.pricing_zones WHERE zone_code = 'SWAROOP_NAGAR'
ON CONFLICT (campus_name) DO NOTHING;

INSERT INTO public.campus_location_pricing (campus_name, zone_id, proximity_radius_km, demand_surge_multiplier)
SELECT 'GSVM Medical College', id, 0.8, 1.10 FROM public.pricing_zones WHERE zone_code = 'SWAROOP_NAGAR'
ON CONFLICT (campus_name) DO NOTHING;

INSERT INTO public.campus_location_pricing (campus_name, zone_id, proximity_radius_km, demand_surge_multiplier)
SELECT 'Lucknow University', id, 1.5, 1.05 FROM public.pricing_zones WHERE zone_code = 'LUCKNOW_CENTRAL'
ON CONFLICT (campus_name) DO NOTHING;

-- 5. RPC Function: Calculate Dynamic Location-Based Quote
CREATE OR REPLACE FUNCTION public.get_location_pricing_tier(
    p_pincode TEXT DEFAULT NULL,
    p_campus TEXT DEFAULT NULL
)
RETURNS TABLE (
    zone_code TEXT,
    zone_name TEXT,
    zone_name_hi TEXT,
    tier_level TEXT,
    base_storage_rate NUMERIC,
    host_payout_rate NUMERIC,
    peak_multiplier NUMERIC,
    demand_surge_multiplier NUMERIC,
    effective_rate_per_bag NUMERIC,
    platform_net_per_bag NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_zone public.pricing_zones%ROWTYPE;
    v_campus_surge NUMERIC := 1.00;
BEGIN
    -- Match by Campus first if specified
    IF p_campus IS NOT NULL AND p_campus <> '' THEN
        SELECT pz.*, clp.demand_surge_multiplier
        INTO v_zone, v_campus_surge
        FROM public.campus_location_pricing clp
        JOIN public.pricing_zones pz ON clp.zone_id = pz.id
        WHERE clp.campus_name ILIKE '%' || p_campus || '%' AND clp.is_active = true
        LIMIT 1;
    END IF;

    -- Fallback to PIN code matching if campus not found
    IF v_zone.id IS NULL AND p_pincode IS NOT NULL AND p_pincode <> '' THEN
        SELECT * INTO v_zone
        FROM public.pricing_zones
        WHERE p_pincode = ANY(pincodes) AND is_active = true
        LIMIT 1;
    END IF;

    -- Fallback to default Standard Zone (CSJMU_MAIN)
    IF v_zone.id IS NULL THEN
        SELECT * INTO v_zone
        FROM public.pricing_zones
        WHERE zone_code = 'CSJMU_MAIN'
        LIMIT 1;
    END IF;

    zone_code := v_zone.zone_code;
    zone_name := v_zone.zone_name;
    zone_name_hi := v_zone.zone_name_hi;
    tier_level := v_zone.tier_level;
    base_storage_rate := v_zone.base_storage_rate_monthly;
    host_payout_rate := v_zone.host_payout_rate_monthly;
    peak_multiplier := v_zone.peak_season_multiplier;
    demand_surge_multiplier := v_campus_surge;
    
    -- Calculate effective monthly rate per bag rounded to nearest ₹5
    effective_rate_per_bag := ROUND((v_zone.base_storage_rate_monthly * v_zone.peak_season_multiplier * v_campus_surge) / 5.0) * 5.0;
    platform_net_per_bag := effective_rate_per_bag - v_zone.host_payout_rate_monthly - 40.00; -- ₹40 ops/insurance reserve

    RETURN NEXT;
END;
$$;
