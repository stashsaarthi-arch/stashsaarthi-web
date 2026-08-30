import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logSupabaseError } from "./supabaseLogger";

// ─── Validation ──────────────────────────────────────────────

/** Standard email format check */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** College/University email format check (.edu, .ac.in, .res.in, .org, or edu subdomains) */
export function isCollegeEmail(email: string): boolean {
  const clean = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+(\.edu|\.ac\.in|\.res\.in|\.edu\.in)$/.test(clean);
}

/**
 * Validates a 10-digit Indian mobile number.
 * Accepts optional +91 / 91 prefix and spaces/dashes.
 * Core digits must start with 6-9.
 */
export function isValidIndianPhone(phone: string): boolean {
  const digits = phone.replace(/[\s\-+]/g, "");
  // Strip country code if present
  const core = digits.startsWith("91") && digits.length > 10 ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(core);
}

/**
 * Validates a 6-digit Indian Postal PIN code (e.g. 208016 for IIT Kanpur).
 */
export function isValidIndianPin(pin: string): boolean {
  const clean = pin.replace(/\D/g, "");
  return /^[1-9][0-9]{5}$/.test(clean);
}

// ─── Error classification ────────────────────────────────────

/** Supabase unique-violation error code */
export function isDuplicateEmailError(error: unknown): boolean {
  if (error && typeof error === "object" && "code" in error) {
    return (error as { code: string }).code === "23505";
  }
  return false;
}

/** Catch network / fetch failures */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError && error.message.toLowerCase().includes("fetch")) return true;
  if (error && typeof error === "object" && "message" in error) {
    const msg = (error as { message: string }).message.toLowerCase();
    return msg.includes("network") || msg.includes("failed to fetch") || msg.includes("offline");
  }
  return false;
}

// ─── Types ───────────────────────────────────────────────────

export type WaitlistFormData = {
  full_name: string;
  email: string;
  phone_number: string | null;
  user_type: "student" | "host";
  college_or_locality: string | null;
};

export type GoogleProfile = {
  email: string;
  name: string;
  picture?: string | undefined;
};

// ─── DB operations ───────────────────────────────────────────

/**
 * Insert a new waitlist user. Returns structured result
 * so callers can show the right toast.
 */
export async function insertWaitlistUser(
  data: WaitlistFormData,
): Promise<{ success: boolean; duplicate?: boolean; error?: string }> {
  const payload = {
    full_name: data.full_name.trim(),
    email: data.email.trim().toLowerCase(),
    phone_number: data.phone_number?.trim() || null,
    user_type: data.user_type,
    college_or_locality: data.college_or_locality?.trim() || null,
    verified: false,
    source: "waitlist_form",
  };

  try {
    const { error } = await supabase.from("users_waitlist").insert(payload);

    if (error) {
      if (isDuplicateEmailError(error)) {
        return { success: false, duplicate: true };
      }
      logSupabaseError({
        table: "users_waitlist",
        operation: "insert",
        payload,
        error,
        context: "waitlist_form",
      });
      throw error;
    }

    return { success: true };
  } catch (err) {
    if (isNetworkError(err)) {
      logSupabaseError({
        table: "users_waitlist",
        operation: "insert",
        payload,
        error: err,
        context: "network_failure",
      });
      return { success: false, error: "network" };
    }
    logSupabaseError({
      table: "users_waitlist",
      operation: "insert",
      payload,
      error: err,
      context: "insertWaitlistUser_catch",
    });
    return { success: false, error: "unknown" };
  }
}

/**
 * Persist a Google-authenticated user to `users_waitlist`.
 * If the email already exists, this is a no-op (no error).
 */
export async function upsertGoogleUser(profile: GoogleProfile): Promise<void> {
  const payload = {
    full_name: profile.name,
    email: profile.email.toLowerCase(),
    phone_number: null,
    user_type: "student" as const,
    college_or_locality: null,
    verified: true,
    avatar_url: profile.picture || null,
    source: "google_auth",
  };

  try {
    // Check if user already exists
    const { data: existing, error: selectErr } = await supabase
      .from("users_waitlist")
      .select("id")
      .eq("email", profile.email.toLowerCase())
      .maybeSingle();

    if (selectErr) {
      logSupabaseError({
        table: "users_waitlist",
        operation: "select",
        payload: { email: profile.email },
        error: selectErr,
        context: "upsertGoogleUser_lookup",
      });
    }

    if (existing) return; // already registered — nothing to do

    const { error } = await supabase.from("users_waitlist").insert(payload);

    // Ignore duplicate constraint race condition
    if (error && !isDuplicateEmailError(error)) {
      logSupabaseError({
        table: "users_waitlist",
        operation: "insert",
        payload,
        error,
        context: "upsertGoogleUser_insert",
      });
    }
  } catch (err) {
    logSupabaseError({
      table: "users_waitlist",
      operation: "insert",
      payload,
      error: err,
      context: "upsertGoogleUser_catch",
    });
  }
}

/**
 * Show a retry toast for network errors.
 * The `retryFn` is called when the user clicks "Retry".
 */
export function showNetworkRetryToast(retryFn: () => void) {
  toast.error("Connection issue — couldn't reach our servers", {
    description: "Check your internet and try again.",
    action: {
      label: "Retry",
      onClick: retryFn,
    },
    duration: 8000,
  });
}
