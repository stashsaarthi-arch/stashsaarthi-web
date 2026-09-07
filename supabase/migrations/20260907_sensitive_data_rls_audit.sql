-- ============================================================================
-- Migration: StashSaarthi Database Security Audit & Sensitive Data Lockdown
-- Author: StashSaarthi Autonomous System [CSO - Security]
-- Date: 2026-09-07
-- Task 91: Audit the entire Supabase database and ensure no tables with
--          sensitive user information (PII) are publicly readable.
-- ============================================================================

-- 1. Explicit RLS Enforcement across 100% of schema tables (14 tables total)
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stash_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.co_living_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.waitlist_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.meal_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_shield_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.crowdsourced_room_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.meal_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.meal_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pricing_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.campus_location_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.component_interaction_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.visitor_sessions ENABLE ROW LEVEL SECURITY;

-- 2. Lockdown sensitive table SELECT policies (PII protection)

-- A. profiles: Only authenticated owners can read their profile
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- B. stash_bookings: Only authenticated owners can read their bookings
DROP POLICY IF EXISTS "Users read own bookings" ON public.stash_bookings;
CREATE POLICY "Users read own bookings"
  ON public.stash_bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- C. co_living_inquiries: Only authenticated owners can read their inquiries
DROP POLICY IF EXISTS "Users read own inquiries" ON public.co_living_inquiries;
CREATE POLICY "Users read own inquiries"
  ON public.co_living_inquiries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- D. waitlist_leads: No public SELECT allowed (lead capture only)
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.waitlist_leads;
CREATE POLICY "Anyone can submit a lead"
  ON public.waitlist_leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- E. users_waitlist: Restricted to authenticated owner matching JWT email
DROP POLICY IF EXISTS "Users read own waitlist record" ON public.users_waitlist;
CREATE POLICY "Users read own waitlist record"
  ON public.users_waitlist FOR SELECT
  TO authenticated
  USING (email = auth.jwt()->>'email');

-- F. meal_bookings: Restricted to authenticated owner matching phone/email
DROP POLICY IF EXISTS "Users read own meal bookings" ON public.meal_bookings;
CREATE POLICY "Users read own meal bookings"
  ON public.meal_bookings FOR SELECT
  TO authenticated
  USING (user_phone = auth.jwt()->>'phone' OR user_name = auth.jwt()->>'email');

-- G. user_shield_quotas: Restricted to owner phone
DROP POLICY IF EXISTS "Read own shield quota" ON public.user_shield_quotas;
CREATE POLICY "Read own shield quota"
  ON public.user_shield_quotas FOR SELECT
  TO authenticated
  USING (user_phone = auth.jwt()->>'phone');

-- 3. Audit helper function for automated security verification
CREATE OR REPLACE FUNCTION public.audit_supabase_db_security()
RETURNS TABLE (
  table_name TEXT,
  rls_enabled BOOLEAN,
  is_sensitive BOOLEAN,
  public_read_allowed BOOLEAN,
  security_status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.tablename::TEXT,
    t.rowsecurity::BOOLEAN AS rls_enabled,
    (t.tablename IN ('profiles', 'stash_bookings', 'co_living_inquiries', 'waitlist_leads', 'users_waitlist', 'meal_bookings', 'user_shield_quotas')) AS is_sensitive,
    EXISTS (
      SELECT 1 FROM pg_policies p 
      WHERE p.tablename = t.tablename 
        AND p.cmd = 'SELECT' 
        AND (p.roles @> ARRAY['public']::name[] OR p.roles @> ARRAY['anon']::name[])
        AND (p.qual IS NULL OR p.qual = 'true')
    ) AS public_read_allowed,
    CASE 
      WHEN NOT t.rowsecurity THEN 'CRITICAL: RLS Disabled'
      WHEN (t.tablename IN ('profiles', 'stash_bookings', 'co_living_inquiries', 'waitlist_leads', 'users_waitlist', 'meal_bookings', 'user_shield_quotas'))
           AND EXISTS (
             SELECT 1 FROM pg_policies p 
             WHERE p.tablename = t.tablename 
               AND p.cmd = 'SELECT' 
               AND (p.roles @> ARRAY['public']::name[] OR p.roles @> ARRAY['anon']::name[])
               AND (p.qual IS NULL OR p.qual = 'true')
           ) THEN 'HIGH RISK: Sensitive Table Publicly Readable'
      ELSE 'SECURE'
    END AS security_status
  FROM pg_tables t
  WHERE t.schemaname = 'public';
END;
$$;
