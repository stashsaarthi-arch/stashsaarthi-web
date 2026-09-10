-- Migration: Unified User Master Bookings View
-- Purpose: Merge Storage (stash_bookings), Kitchen Tokens (meal_bookings), and Spaces Lease Agreements (co_living_inquiries)
-- into a single queryable view with standardized schema for instant client pagination and dashboard rendering.

CREATE OR REPLACE VIEW public.user_master_bookings AS
SELECT
  id::text AS id,
  'storage'::text AS booking_type,
  user_id::text AS user_id,
  user_name::text AS user_name,
  phone::text AS user_phone,
  email::text AS user_email,
  (COALESCE(bag_count, 1)::text || ' Bag(s) Luggage Storage (' || COALESCE(city, 'Kanpur') || ')')::text AS title,
  jsonb_build_object(
    'bag_count', COALESCE(bag_count, 1),
    'duration_months', COALESCE(duration_months, 1),
    'city', COALESCE(city, 'Kanpur')
  ) AS service_details,
  COALESCE(total_amount, 300)::numeric AS total_amount,
  'active'::text AS status,
  created_at
FROM public.stash_bookings

UNION ALL

SELECT
  id::text AS id,
  'kitchen'::text AS booking_type,
  NULL::text AS user_id,
  user_name::text AS user_name,
  user_phone::text AS user_phone,
  NULL::text AS user_email,
  (COALESCE(vendor_selected, 'Home Kitchen') || ' - ' || COALESCE(meal_slot, 'Meal Token'))::text AS title,
  jsonb_build_object(
    'vendor_selected', COALESCE(vendor_selected, 'Home Kitchen'),
    'meal_slot', COALESCE(meal_slot, 'Lunch'),
    'meal_date', meal_date,
    'tokens_debited', COALESCE(tokens_debited, 1),
    'fulfillment_type', COALESCE(fulfillment_type, 'pickup'),
    'pickup_code', pickup_code
  ) AS service_details,
  (COALESCE(tokens_debited, 1) * 50)::numeric AS total_amount,
  COALESCE(order_status, 'confirmed')::text AS status,
  created_at
FROM public.meal_bookings

UNION ALL

SELECT
  id::text AS id,
  'spaces'::text AS booking_type,
  user_id::text AS user_id,
  name::text AS user_name,
  phone::text AS user_phone,
  email::text AS user_email,
  ('Co-Living Room Lease (' || COALESCE(preferred_location, 'Kakadeo') || ')')::text AS title,
  jsonb_build_object(
    'preferred_location', COALESCE(preferred_location, 'Kakadeo'),
    'role', COALESCE(role, 'student'),
    'message', message
  ) AS service_details,
  5500::numeric AS total_amount,
  'active'::text AS status,
  created_at
FROM public.co_living_inquiries;

-- Grant select access to authenticated & anon roles
GRANT SELECT ON public.user_master_bookings TO authenticated, anon;
