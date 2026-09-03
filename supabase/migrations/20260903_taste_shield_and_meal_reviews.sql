-- ============================================================================
-- Migration: StashSaarthi Anti-Fraud Taste Shield & Meal Review System
-- Date: 2026-09-03
-- Purpose:
--   1. Provision meal_vendors & meal_bookings (if not already existing)
--   2. Provision meal_reviews & user_shield_quotas with anti-fraud constraints
--   3. Provision review-proofs storage bucket with public read/upload policies
--   4. Provision process_taste_shield_claim RPC function for atomic 50% auto-refund
-- ============================================================================

-- 0. Ensure Vendors Table
CREATE TABLE IF NOT EXISTS public.meal_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed Kanpur meal hub nodes
INSERT INTO public.meal_vendors (id, name, location) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Kakadeo Hub - Annapurna Kitchen', 'Kakadeo, Kanpur'),
  ('22222222-2222-2222-2222-222222222222', 'CSJMU Kalyanpur - Dadi Maa Rasoi', 'Kalyanpur, Kanpur'),
  ('33333333-3333-3333-3333-333333333333', 'IIT Kanpur Gate 1 - Campus Senior Mess', 'IIT Kanpur, Kanpur'),
  ('44444444-4444-4444-4444-444444444444', 'HBTI Nawabganj - Shanti Home Food', 'Nawabganj, Kanpur')
ON CONFLICT (id) DO NOTHING;

-- 0.1 Ensure Bookings Table
CREATE TABLE IF NOT EXISTS public.meal_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT,
  user_phone TEXT NOT NULL,
  menu_id TEXT,
  vendor_selected TEXT,
  vendor_id UUID REFERENCES public.meal_vendors(id),
  fulfillment_type TEXT CHECK (fulfillment_type IN ('DineIn_Pickup', 'RoomDelivery')),
  delivery_address TEXT,
  pickup_code TEXT,
  meal_date DATE,
  meal_slot TEXT CHECK (meal_slot IN ('Lunch', 'Dinner')),
  tokens_debited INT NOT NULL DEFAULT 0,
  vendor_payout INT DEFAULT 0,
  delivery_runner_payout INT DEFAULT 0,
  cutoff_time TIMESTAMPTZ,
  order_status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 1. Review & Taste Shield Claims Table
CREATE TABLE IF NOT EXISTS public.meal_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.meal_bookings(id) NOT NULL,
  user_phone TEXT NOT NULL,
  vendor_id UUID REFERENCES public.meal_vendors(id) NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  issue_category TEXT CHECK (issue_category IN ('taste_quality', 'raw_or_burnt', 'hygiene_foreign_object', 'missing_items', 'other')),
  feedback_text TEXT,
  photo_url TEXT,
  refund_status TEXT CHECK (refund_status IN ('not_eligible', 'auto_credited', 'under_review', 'rejected')) DEFAULT 'not_eligible',
  refund_tokens INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. User Shield Quota Tracking Table
CREATE TABLE IF NOT EXISTS public.user_shield_quotas (
  user_phone TEXT PRIMARY KEY,
  monthly_claims_used INT DEFAULT 0,
  last_claim_date TIMESTAMPTZ,
  is_shield_blocked BOOLEAN DEFAULT false,
  total_lifetime_strikes INT DEFAULT 0
);

-- 3. Row Level Security & Public Policies
ALTER TABLE public.meal_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_shield_quotas ENABLE ROW LEVEL SECURITY;

-- Permissions
GRANT SELECT, INSERT, UPDATE ON public.meal_vendors TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.meal_bookings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.meal_reviews TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_shield_quotas TO anon, authenticated;

-- Policies for meal_vendors
DROP POLICY IF EXISTS "Allow public read meal_vendors" ON public.meal_vendors;
CREATE POLICY "Allow public read meal_vendors"
ON public.meal_vendors FOR SELECT TO anon, authenticated USING (true);

-- Policies for meal_bookings
DROP POLICY IF EXISTS "Allow authenticated/anon inserts to meal_bookings" ON public.meal_bookings;
CREATE POLICY "Allow authenticated/anon inserts to meal_bookings"
ON public.meal_bookings FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read meal_bookings" ON public.meal_bookings;
CREATE POLICY "Allow public read meal_bookings"
ON public.meal_bookings FOR SELECT TO anon, authenticated USING (true);

-- Policies for meal_reviews
DROP POLICY IF EXISTS "Allow authenticated/anon inserts to meal_reviews" ON public.meal_reviews;
CREATE POLICY "Allow authenticated/anon inserts to meal_reviews"
ON public.meal_reviews FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read meal_reviews" ON public.meal_reviews;
CREATE POLICY "Allow public read meal_reviews"
ON public.meal_reviews FOR SELECT TO anon, authenticated USING (true);

-- Policies for user_shield_quotas
DROP POLICY IF EXISTS "Allow public read own quota" ON public.user_shield_quotas;
CREATE POLICY "Allow public read own quota"
ON public.user_shield_quotas FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public insert/update quota" ON public.user_shield_quotas;
CREATE POLICY "Allow public insert/update quota"
ON public.user_shield_quotas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 4. Supabase Storage Bucket for Evidence Proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-proofs', 'review-proofs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Allow public read on review-proofs" ON storage.objects;
CREATE POLICY "Allow public read on review-proofs"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'review-proofs');

DROP POLICY IF EXISTS "Allow public upload to review-proofs" ON storage.objects;
CREATE POLICY "Allow public upload to review-proofs"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'review-proofs');

-- 5. Anti-Fraud Gatekeeper RPC Function
CREATE OR REPLACE FUNCTION public.process_taste_shield_claim(
  p_booking_id UUID,
  p_user_phone TEXT,
  p_vendor_id UUID,
  p_rating INT,
  p_issue_category TEXT DEFAULT NULL,
  p_feedback_text TEXT DEFAULT NULL,
  p_photo_url TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_booking RECORD;
  v_quota RECORD;
  v_refund_tokens INT := 0;
  v_is_eligible BOOLEAN := false;
  v_rejection_reason TEXT := NULL;
  v_refund_status TEXT := 'not_eligible';
  v_review_id UUID;
  v_now TIMESTAMPTZ := now();
  v_monthly_claims_used INT := 0;
  v_tokens_debited INT := 60;
BEGIN
  -- Validate rating
  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;

  -- 1. Query booking details (if exists)
  SELECT * INTO v_booking FROM public.meal_bookings WHERE id = p_booking_id;
  IF FOUND AND v_booking.tokens_debited IS NOT NULL THEN
    v_tokens_debited := v_booking.tokens_debited;
  END IF;

  -- 2. Query or initialize user quota
  SELECT * INTO v_quota FROM public.user_shield_quotas WHERE user_phone = p_user_phone;
  IF NOT FOUND THEN
    INSERT INTO public.user_shield_quotas (user_phone, monthly_claims_used, last_claim_date, is_shield_blocked, total_lifetime_strikes)
    VALUES (p_user_phone, 0, NULL, false, 0)
    RETURNING * INTO v_quota;
  END IF;

  -- Reset monthly quota if last claim was in an earlier calendar month
  IF v_quota.last_claim_date IS NOT NULL THEN
    IF date_trunc('month', v_quota.last_claim_date) < date_trunc('month', v_now) THEN
      v_monthly_claims_used := 0;
    ELSE
      v_monthly_claims_used := COALESCE(v_quota.monthly_claims_used, 0);
    END IF;
  ELSE
    v_monthly_claims_used := 0;
  END IF;

  -- 3. Check Taste Shield Eligibility (Rules for 50% Auto-Refund)
  IF p_rating <= 2 THEN
    -- Rule 1: Account Standing (is_shield_blocked must be false)
    IF v_quota.is_shield_blocked IS TRUE THEN
      v_rejection_reason := 'account_blocked';
    -- Rule 2: Quota Check (monthly_claims_used must be 0 for current calendar month)
    ELSIF v_monthly_claims_used > 0 THEN
      v_rejection_reason := 'quota_exhausted';
    -- Rule 3: Photo Requirement (photo_url must not be null/empty)
    ELSIF p_photo_url IS NULL OR trim(p_photo_url) = '' THEN
      v_rejection_reason := 'missing_photo';
    -- Rule 4: Timing (must be submitted within 2 hours of booking)
    ELSIF v_booking.created_at IS NOT NULL AND (v_now - v_booking.created_at) > INTERVAL '2 hours' THEN
      v_rejection_reason := 'window_expired';
    ELSE
      v_is_eligible := true;
    END IF;
  END IF;

  -- 4. Calculate Refund & Update Quota
  IF v_is_eligible THEN
    v_refund_status := 'auto_credited';
    v_refund_tokens := FLOOR(v_tokens_debited * 0.5);

    UPDATE public.user_shield_quotas
    SET monthly_claims_used = v_monthly_claims_used + 1,
        last_claim_date = v_now
    WHERE user_phone = p_user_phone;
  ELSE
    v_refund_status := 'not_eligible';
    v_refund_tokens := 0;
  END IF;

  -- 5. Insert Review Record
  INSERT INTO public.meal_reviews (
    booking_id,
    user_phone,
    vendor_id,
    rating,
    issue_category,
    feedback_text,
    photo_url,
    refund_status,
    refund_tokens,
    created_at
  ) VALUES (
    p_booking_id,
    p_user_phone,
    p_vendor_id,
    p_rating,
    p_issue_category,
    p_feedback_text,
    p_photo_url,
    v_refund_status,
    v_refund_tokens,
    v_now
  )
  RETURNING id INTO v_review_id;

  -- 6. Format and return response
  RETURN jsonb_build_object(
    'review_id', v_review_id,
    'eligible', v_is_eligible,
    'refund_status', v_refund_status,
    'refund_tokens', v_refund_tokens,
    'rejection_reason', v_rejection_reason,
    'message', CASE
      WHEN v_is_eligible THEN format('Verified claim! %s tokens credited to your wallet.', v_refund_tokens)
      WHEN v_rejection_reason = 'quota_exhausted' THEN 'Feedback recorded! Your monthly Taste Shield quota is currently used, but our kitchen quality team has been alerted.'
      WHEN v_rejection_reason = 'missing_photo' THEN 'Feedback recorded! A live camera photo is required for instant Taste Shield credit.'
      WHEN v_rejection_reason = 'window_expired' THEN 'Feedback recorded! Taste Shield claim window expired (must be within 2 hours of meal).'
      WHEN v_rejection_reason = 'account_blocked' THEN 'Feedback recorded. Taste Shield protection is not active on this account.'
      ELSE 'Feedback recorded! Thank you for rating your meal.'
    END
  );
END;
$$;
