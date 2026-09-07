-- ============================================================================
-- StashSaarthi 18-Month Data Retention & Inactive Account Purge Migration
-- Statutory Basis: Digital Personal Data Protection (DPDP) Act 2023 - Sec 12(3)
--                  & EU GDPR Article 17 (Right to Erasure / Storage Limitation)
-- ============================================================================

-- Function: purge_inactive_student_data_18_months()
-- Automatically deletes or anonymizes student logs, waitlist entries, and temporary
-- telemetry records older than 18 months (547 days), while preserving statutory tax receipts.
CREATE OR REPLACE FUNCTION purge_inactive_student_data_18_months()
RETURNS TABLE (
  purged_waitlist_count INT,
  purged_telemetry_count INT,
  purged_sessions_count INT,
  purged_bookings_anonymized_count INT,
  executed_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_cutoff TIMESTAMPTZ := NOW() - INTERVAL '18 months';
  v_waitlist_deleted INT := 0;
  v_telemetry_deleted INT := 0;
  v_sessions_deleted INT := 0;
  v_bookings_anonymized INT := 0;
BEGIN
  -- 1. Purge unconverted waitlist leads older than 18 months
  DELETE FROM public.users_waitlist
  WHERE created_at < v_cutoff;
  GET DIAGNOSTICS v_waitlist_deleted = ROW_COUNT;

  DELETE FROM public.waitlist_leads
  WHERE created_at < v_cutoff;

  -- 2. Purge old component interaction telemetry older than 30 days
  DELETE FROM public.component_interaction_telemetry
  WHERE created_at < NOW() - INTERVAL '30 days';
  GET DIAGNOSTICS v_telemetry_deleted = ROW_COUNT;

  -- 3. Purge inactive visitor session logs older than 18 months
  DELETE FROM public.visitor_sessions
  WHERE updated_at < v_cutoff OR created_at < v_cutoff;
  GET DIAGNOSTICS v_sessions_deleted = ROW_COUNT;

  -- 4. Anonymize PII in completed financial bookings older than 18 months (preserving aggregate stats for 7-year tax requirement)
  UPDATE public.stash_bookings
  SET 
    full_name = 'Anonymized Data Principal',
    phone_number = '+910000000000',
    email = 'anonymized@stashsaarthi.internal'
  WHERE created_at < v_cutoff AND full_name != 'Anonymized Data Principal';
  GET DIAGNOSTICS v_bookings_anonymized = ROW_COUNT;

  RETURN QUERY SELECT 
    v_waitlist_deleted,
    v_telemetry_deleted,
    v_sessions_deleted,
    v_bookings_anonymized,
    NOW();
END;
$$;

-- Grant execution permissions on retention purge RPC
GRANT EXECUTE ON FUNCTION purge_inactive_student_data_18_months() TO service_role;
GRANT EXECUTE ON FUNCTION purge_inactive_student_data_18_months() TO authenticated;

-- Comment on database function
COMMENT ON FUNCTION purge_inactive_student_data_18_months() IS 
  'DPDP Act 2023 Sec 12(3) compliant function to purge inactive student accounts & logs older than 18 months.';
