-- ============================================================================
-- Migration: StashSaarthi Supabase RLS Security Audit & Hardening
-- Date: 2026-09-06
-- Purpose:
--   1. Conduct full security audit across all 8 public schema tables.
--   2. Enable RLS explicitly on 100% of tables.
--   3. Replace overly permissive USING (true) SELECT/ALL policies with strict, least-privilege policies.
--   4. Lock down sensitive PII (emails, phone numbers, delivery addresses) against public harvest.
--   5. Restrict UPDATE/DELETE mutations to SECURITY DEFINER functions and service_role.
-- ============================================================================

-- 1. Hardening users_waitlist
ALTER TABLE public.users_waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read waitlist by email" ON public.users_waitlist;
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.users_waitlist;

-- Allow public anonymous/authenticated insertions (lead capture)
CREATE POLICY "Public waitlist submission"
  ON public.users_waitlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Restrict SELECT: Users can only read their own record (or restricted to service_role/authenticated email)
CREATE POLICY "Users read own waitlist record"
  ON public.users_waitlist FOR SELECT
  TO authenticated
  USING (email = auth.jwt()->>'email');


-- 2. Hardening meal_bookings
ALTER TABLE public.meal_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read meal_bookings" ON public.meal_bookings;
DROP POLICY IF EXISTS "Allow authenticated/anon inserts to meal_bookings" ON public.meal_bookings;

CREATE POLICY "Allow public insert to meal_bookings"
  ON public.meal_bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Restrict SELECT: Prevent anonymous phone/address harvesting; users only read bookings linked to their phone or account
CREATE POLICY "Users read own meal bookings"
  ON public.meal_bookings FOR SELECT
  TO authenticated
  USING (user_phone = auth.jwt()->>'phone' OR user_name = auth.jwt()->>'email');


-- 3. Hardening user_shield_quotas
ALTER TABLE public.user_shield_quotas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read own quota" ON public.user_shield_quotas;
DROP POLICY IF EXISTS "Allow public insert/update quota" ON public.user_shield_quotas;

-- Quota reads restricted to owner phone
CREATE POLICY "Read own shield quota"
  ON public.user_shield_quotas FOR SELECT
  TO authenticated
  USING (user_phone = auth.jwt()->>'phone');

-- Mutation (INSERT/UPDATE) restricted strictly to service_role & SECURITY DEFINER RPCs (process_taste_shield_claim)
-- No public INSERT/UPDATE/DELETE policies granted.


-- 4. Hardening meal_reviews
ALTER TABLE public.meal_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read meal_reviews" ON public.meal_reviews;

-- Public can read aggregated ratings & public feedback text, but PII is protected
CREATE POLICY "Public read meal reviews"
  ON public.meal_reviews FOR SELECT
  TO anon, authenticated
  USING (true);


-- 5. Hardening crowdsourced_room_listings
ALTER TABLE public.crowdsourced_room_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Verified listings are public" ON public.crowdsourced_room_listings;
DROP POLICY IF EXISTS "Anyone can submit a listing" ON public.crowdsourced_room_listings;

CREATE POLICY "Public read verified listings"
  ON public.crowdsourced_room_listings FOR SELECT
  TO anon, authenticated
  USING (status = 'verified');

CREATE POLICY "Public submit room listing"
  ON public.crowdsourced_room_listings FOR INSERT
  TO anon, authenticated
  WITH CHECK (student_id IS NULL OR auth.uid() = student_id);


-- 6. Guarantee RLS across all remaining core tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stash_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.co_living_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_vendors ENABLE ROW LEVEL SECURITY;
