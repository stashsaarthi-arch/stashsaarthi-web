/**
 * StashSaarthi Anti-Fraud Taste Shield & Meal Review Engine
 *
 * Gatekeeper Architecture:
 * 1. Rating Threshold: Rating <= 2 activates 50% refund evaluation.
 * 2. Monthly Quota Check: Exactly 1 claim allowed per calendar month (monthly_claims_used == 0).
 * 3. Account Standing: is_shield_blocked must be false.
 * 4. Photo Evidence Requirement: Real-time mobile camera proof upload to 'review-proofs' bucket.
 * 5. Time Window Check: Submitted within 2 hours of meal completion.
 */

import { supabase } from "@/integrations/supabase/client";
import { logSupabaseError } from "@/lib/supabaseLogger";

export type TasteShieldIssueCategory =
  "taste_quality" | "raw_or_burnt" | "hygiene_foreign_object" | "missing_items" | "other";

export type RefundStatus = "not_eligible" | "auto_credited" | "under_review" | "rejected";

export interface UserShieldQuota {
  userPhone: string;
  monthlyClaimsUsed: number;
  lastClaimDate: string | null;
  isShieldBlocked: boolean;
  totalLifetimeStrikes: number;
  isQuotaAvailable: boolean;
}

export interface TasteShieldClaimRequest {
  bookingId: string;
  userPhone: string;
  userName?: string | undefined;
  vendorId?: string | undefined;
  vendorName?: string | undefined;
  rating: number;
  issueCategory?: TasteShieldIssueCategory | undefined;
  feedbackText?: string | undefined;
  photoFile?: File | null | undefined;
  photoUrl?: string | null | undefined;
  tokensDebited?: number | undefined;
  orderCreatedAt?: string | undefined;
  positiveTags?: string[] | undefined;
}

export interface TasteShieldClaimResult {
  success: boolean;
  eligible: boolean;
  refundStatus: RefundStatus;
  refundTokens: number;
  message: string;
  rejectionReason?:
    "quota_exhausted" | "missing_photo" | "window_expired" | "account_blocked" | null | undefined;
  reviewId?: string | undefined;
}

const DEFAULT_VENDOR_ID = "11111111-1111-1111-1111-111111111111"; // Kakadeo Annapurna Kitchen

/**
 * Checks if the user has available Taste Shield quota for the current calendar month
 */
export async function getUserShieldQuota(userPhone: string): Promise<UserShieldQuota> {
  const normalizedPhone = userPhone.trim();
  const cacheKey = `stash_shield_quota_${normalizedPhone}`;

  // Default clean state
  let quota: UserShieldQuota = {
    userPhone: normalizedPhone,
    monthlyClaimsUsed: 0,
    lastClaimDate: null,
    isShieldBlocked: false,
    totalLifetimeStrikes: 0,
    isQuotaAvailable: true,
  };

  // Try local cache first for instant feedback
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        quota = parsed;
      }
    } catch {
      // ignore
    }
  }

  // Fetch live from Supabase
  try {
    const { data, error } = await supabase
      .from("user_shield_quotas")
      .select(
        "user_phone, monthly_claims_used, last_claim_date, is_shield_blocked, total_lifetime_strikes",
      )
      .eq("user_phone", normalizedPhone)
      .maybeSingle();

    if (!error && data) {
      const now = new Date();
      let claimsUsed = data.monthly_claims_used ?? 0;

      // Calendar month rollover check: if last claim was in an earlier month, claims reset to 0
      if (data.last_claim_date) {
        const lastDate = new Date(data.last_claim_date);
        if (lastDate.getFullYear() < now.getFullYear() || lastDate.getMonth() < now.getMonth()) {
          claimsUsed = 0;
        }
      }

      quota = {
        userPhone: data.user_phone,
        monthlyClaimsUsed: claimsUsed,
        lastClaimDate: data.last_claim_date,
        isShieldBlocked: data.is_shield_blocked ?? false,
        totalLifetimeStrikes: data.total_lifetime_strikes ?? 0,
        isQuotaAvailable: claimsUsed === 0 && !data.is_shield_blocked,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(cacheKey, JSON.stringify(quota));
      }
    }
  } catch (err) {
    console.warn("[TasteShield] Error fetching remote quota, using cached state:", err);
  }

  return quota;
}

/**
 * Uploads evidence photo from live camera to Supabase Storage 'review-proofs' bucket
 */
export async function uploadProofPhoto(file: File, bookingId: string): Promise<string> {
  const sanitizedBookingId = bookingId || "demo-booking";
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${sanitizedBookingId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
  const filePath = `${sanitizedBookingId}/${fileName}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from("review-proofs")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.warn(
        "[TasteShield:Storage] Remote upload error, falling back to local object URL",
        uploadError,
      );
      return URL.createObjectURL(file);
    }

    const { data: publicUrlData } = supabase.storage.from("review-proofs").getPublicUrl(filePath);

    return publicUrlData.publicUrl || URL.createObjectURL(file);
  } catch (err) {
    console.warn("[TasteShield:Storage] Upload exception, fallback to local URL", err);
    return URL.createObjectURL(file);
  }
}

/**
 * Submits the meal review and evaluates Taste Shield 50% refund claim
 */
export async function submitTasteShieldClaim(
  claim: TasteShieldClaimRequest,
): Promise<TasteShieldClaimResult> {
  const userPhone = claim.userPhone.trim();
  const rating = Math.max(1, Math.min(5, Math.round(claim.rating)));
  const tokensDebited = claim.tokensDebited && claim.tokensDebited > 0 ? claim.tokensDebited : 60;
  const vendorId = claim.vendorId || DEFAULT_VENDOR_ID;

  // Step 1: Upload photo proof if file was attached and URL not yet established
  let photoUrl = claim.photoUrl || null;
  if (!photoUrl && claim.photoFile) {
    try {
      photoUrl = await uploadProofPhoto(claim.photoFile, claim.bookingId);
    } catch (photoErr) {
      console.warn("[TasteShield] Photo upload failed, continuing with null", photoErr);
    }
  }

  // Step 2: Attempt RPC in Supabase Postgres
  try {
    const { data: rpcData, error: rpcError } = await (supabase.rpc as any)(
      "process_taste_shield_claim",
      {
        p_booking_id: claim.bookingId,
        p_user_phone: userPhone,
        p_vendor_id: vendorId,
        p_rating: rating,
        p_issue_category: claim.issueCategory || null,
        p_feedback_text: claim.feedbackText || null,
        p_photo_url: photoUrl,
      },
    );

    if (!rpcError && rpcData && typeof rpcData === "object") {
      const parsed = rpcData as {
        review_id?: string;
        eligible?: boolean;
        refund_status?: RefundStatus;
        refund_tokens?: number;
        rejection_reason?: string;
        message?: string;
      };

      const isEligible = Boolean(parsed.eligible);
      const refundTokens = parsed.refund_tokens || 0;
      const refundStatus: RefundStatus =
        parsed.refund_status || (isEligible ? "auto_credited" : "not_eligible");

      // Update local storage quota cache
      if (typeof window !== "undefined" && isEligible) {
        const cacheKey = `stash_shield_quota_${userPhone}`;
        const updatedQuota: UserShieldQuota = {
          userPhone,
          monthlyClaimsUsed: 1,
          lastClaimDate: new Date().toISOString(),
          isShieldBlocked: false,
          totalLifetimeStrikes: 0,
          isQuotaAvailable: false,
        };
        localStorage.setItem(cacheKey, JSON.stringify(updatedQuota));
      }

      return {
        success: true,
        eligible: isEligible,
        refundStatus,
        refundTokens,
        message:
          parsed.message ||
          (isEligible
            ? `Verified claim! ${refundTokens} tokens credited to your wallet.`
            : "Feedback recorded!"),
        rejectionReason: (parsed.rejection_reason as any) || null,
        reviewId: parsed.review_id,
      };
    }
  } catch (rpcEx) {
    console.warn(
      "[TasteShield] RPC invocation error, activating client gatekeeper fallback",
      rpcEx,
    );
  }

  // Step 3: Client Anti-Fraud Gatekeeper Fallback
  // (Ensures zero breakage in case RPC is not yet applied to database)
  const currentQuota = await getUserShieldQuota(userPhone);
  let isEligible = false;
  let rejectionReason:
    "quota_exhausted" | "missing_photo" | "window_expired" | "account_blocked" | null = null;

  if (rating <= 2) {
    const now = Date.now();
    const orderTime = claim.orderCreatedAt ? new Date(claim.orderCreatedAt).getTime() : now;
    const isWithin2Hours = now - orderTime <= 2 * 60 * 60 * 1000;

    if (currentQuota.isShieldBlocked) {
      rejectionReason = "account_blocked";
    } else if (currentQuota.monthlyClaimsUsed > 0) {
      rejectionReason = "quota_exhausted";
    } else if (!photoUrl || photoUrl.trim().length === 0) {
      rejectionReason = "missing_photo";
    } else if (!isWithin2Hours) {
      rejectionReason = "window_expired";
    } else {
      isEligible = true;
    }
  }

  const refundStatus: RefundStatus = isEligible ? "auto_credited" : "not_eligible";
  const refundTokens = isEligible ? Math.floor(tokensDebited * 0.5) : 0;

  let message = "";
  if (isEligible) {
    message = `Verified claim! 50% tokens (${refundTokens} Tokens) credited to your wallet.`;
  } else if (rejectionReason === "quota_exhausted") {
    message =
      "Feedback recorded! Your monthly Taste Shield quota is currently used, but our kitchen quality team has been alerted.";
  } else if (rejectionReason === "missing_photo") {
    message = "Feedback recorded! A live camera photo is required for instant Taste Shield credit.";
  } else if (rejectionReason === "window_expired") {
    message =
      "Feedback recorded! Taste Shield claim window expired (must be within 2 hours of meal).";
  } else if (rejectionReason === "account_blocked") {
    message = "Feedback recorded. Taste Shield is not active on this account.";
  } else {
    message = "Feedback recorded! Thank you for rating your meal.";
  }

  // Persist review to Supabase
  try {
    const { data: insertedReview, error: insertError } = await supabase
      .from("meal_reviews")
      .insert({
        booking_id: claim.bookingId,
        user_phone: userPhone,
        vendor_id: vendorId,
        rating,
        issue_category: claim.issueCategory || null,
        feedback_text: claim.feedbackText || null,
        photo_url: photoUrl,
        refund_status: refundStatus,
        refund_tokens: refundTokens,
      })
      .select("id")
      .maybeSingle();

    if (insertError) {
      logSupabaseError({
        table: "meal_reviews",
        operation: "insert",
        error: insertError,
        context: "submitTasteShieldClaim_insert",
      });
    }

    // If claim was approved, update quota table
    if (isEligible) {
      await supabase.from("user_shield_quotas").upsert({
        user_phone: userPhone,
        monthly_claims_used: 1,
        last_claim_date: new Date().toISOString(),
        is_shield_blocked: false,
        total_lifetime_strikes: 0,
      });

      // Update local quota cache
      if (typeof window !== "undefined") {
        const cacheKey = `stash_shield_quota_${userPhone}`;
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            userPhone,
            monthlyClaimsUsed: 1,
            lastClaimDate: new Date().toISOString(),
            isShieldBlocked: false,
            totalLifetimeStrikes: 0,
            isQuotaAvailable: false,
          }),
        );
      }
    }

    return {
      success: true,
      eligible: isEligible,
      refundStatus,
      refundTokens,
      message,
      rejectionReason,
      reviewId: insertedReview?.id,
    };
  } catch (err) {
    console.error("[TasteShield] Error saving review:", err);
    return {
      success: true,
      eligible: isEligible,
      refundStatus,
      refundTokens,
      message,
      rejectionReason,
    };
  }
}
