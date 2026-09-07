import { toast } from "sonner";
import { playClick } from "./audio";

/**
 * Token Request Rate Limiter & Compliance Engine (Task 90)
 * Enforces strict rate limits, sliding-window quotas, and anti-spam protection
 * on all SMS and WhatsApp token requests across the StashSaarthi platform.
 */

export type TokenChannelKey =
  | "sms_token"
  | "whatsapp_token"
  | "trial_token"
  | "nudge_token"
  | "referral_token"
  | "roommate_token";

export interface TokenRateLimitConfig {
  /** Minimum time (ms) required between consecutive requests (Cooldown). */
  minIntervalMs: number;
  /** Maximum number of token requests allowed within windowMs. */
  maxSubmissions: number;
  /** Sliding window duration (ms). */
  windowMs: number;
  /** Human-readable channel display name for notifications. */
  displayName: string;
}

export const TOKEN_LIMIT_CONFIGS: Record<TokenChannelKey, TokenRateLimitConfig> = {
  sms_token: {
    minIntervalMs: 60000, // 60 seconds mandatory cooldown between SMS token requests
    maxSubmissions: 3, // Max 3 SMS tokens per 15-min window
    windowMs: 900000, // 15 minutes
    displayName: "SMS OTP / Token Request",
  },
  whatsapp_token: {
    minIntervalMs: 60000, // 60 seconds cooldown between WhatsApp token dispatches
    maxSubmissions: 3, // Max 3 WhatsApp token requests per 15-min window
    windowMs: 900000, // 15 minutes
    displayName: "WhatsApp Token Request",
  },
  trial_token: {
    minIntervalMs: 60000, // 60 seconds cooldown for student Zero-Fee Trial Token claims
    maxSubmissions: 2, // Max 2 claims per 30 mins
    windowMs: 1800000, // 30 minutes
    displayName: "Zero-Fee Trial Token Claim",
  },
  nudge_token: {
    minIntervalMs: 120000, // 2 minutes cooldown between automated WhatsApp re-engagement tokens
    maxSubmissions: 2, // Max 2 nudges per 60 mins
    windowMs: 3600000, // 1 hour
    displayName: "WhatsApp Delivery Nudge Token",
  },
  referral_token: {
    minIntervalMs: 10000, // 10 seconds between referral token share requests
    maxSubmissions: 5, // Max 5 referral shares per 5 mins
    windowMs: 300000, // 5 minutes
    displayName: "WhatsApp Referral Token Share",
  },
  roommate_token: {
    minIntervalMs: 10000, // 10 seconds between roommate menu share tokens
    maxSubmissions: 5, // Max 5 roommate shares per 5 mins
    windowMs: 300000, // 5 minutes
    displayName: "Roommate Menu Token Share",
  },
};

// In-memory fallback if sessionStorage/localStorage is unavailable
const tokenMemoryStore = new Map<string, number[]>();

function getStorageKey(key: string, channel: TokenChannelKey): string {
  const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, "_");
  return `ss_token_ratelimit_${channel}_${sanitizedKey}`;
}

function getTimestamps(key: string, channel: TokenChannelKey): number[] {
  const storeKey = getStorageKey(key, channel);
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const stored = sessionStorage.getItem(storeKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed.filter((t) => typeof t === "number");
      }
    }
  } catch {
    // Ignore storage errors
  }
  return tokenMemoryStore.get(storeKey) || [];
}

function saveTimestamps(key: string, channel: TokenChannelKey, timestamps: number[]): void {
  const storeKey = getStorageKey(key, channel);
  tokenMemoryStore.set(storeKey, timestamps);
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      sessionStorage.setItem(storeKey, JSON.stringify(timestamps));
    }
  } catch {
    // Ignore storage errors
  }
}

export interface TokenRateLimitResult {
  allowed: boolean;
  remainingSeconds: number;
  channel: TokenChannelKey;
  displayName: string;
  message: string;
}

/**
 * Evaluates whether a specific token request for a key & channel is allowed.
 */
export function checkTokenRateLimit(
  key: string,
  channel: TokenChannelKey = "sms_token",
  customConfig?: Partial<TokenRateLimitConfig>
): TokenRateLimitResult {
  const baseConfig = TOKEN_LIMIT_CONFIGS[channel];
  const cfg: TokenRateLimitConfig = { ...baseConfig, ...customConfig };
  const now = Date.now();
  const timestamps = getTimestamps(key, channel);

  // Filter out timestamps outside sliding window
  const recentTimestamps = timestamps.filter((t) => now - t < cfg.windowMs);

  // Check 1: Minimum inter-request interval (cooldown)
  if (recentTimestamps.length > 0) {
    const lastSubmission = recentTimestamps[recentTimestamps.length - 1] ?? 0;
    const timeSinceLast = now - lastSubmission;
    if (timeSinceLast < cfg.minIntervalMs) {
      const remainingSeconds = Math.ceil((cfg.minIntervalMs - timeSinceLast) / 1000);
      return {
        allowed: false,
        remainingSeconds,
        channel,
        displayName: cfg.displayName,
        message: `🛡️ Security Cooldown: Please wait ${remainingSeconds}s before requesting another ${cfg.displayName}.`,
      };
    }
  }

  // Check 2: Maximum token request quota per sliding window
  if (recentTimestamps.length >= cfg.maxSubmissions) {
    const oldestInWindow = recentTimestamps[0] ?? now;
    const timeUntilExpiry = cfg.windowMs - (now - oldestInWindow);
    const remainingSeconds = Math.max(1, Math.ceil(timeUntilExpiry / 1000));
    return {
      allowed: false,
      remainingSeconds,
      channel,
      displayName: cfg.displayName,
      message: `🛡️ Rate Limit Reached: Maximum ${cfg.maxSubmissions} ${cfg.displayName} requests per window. Please wait ${remainingSeconds}s.`,
    };
  }

  return {
    allowed: true,
    remainingSeconds: 0,
    channel,
    displayName: cfg.displayName,
    message: "",
  };
}

/**
 * Records a token request attempt for a given key and channel.
 */
export function recordTokenRequest(
  key: string,
  channel: TokenChannelKey = "sms_token",
  customConfig?: Partial<TokenRateLimitConfig>
): void {
  const baseConfig = TOKEN_LIMIT_CONFIGS[channel];
  const cfg: TokenRateLimitConfig = { ...baseConfig, ...customConfig };
  const now = Date.now();
  const timestamps = getTimestamps(key, channel);
  const recentTimestamps = timestamps.filter((t) => now - t < cfg.windowMs);
  recentTimestamps.push(now);
  saveTimestamps(key, channel, recentTimestamps);
}

/**
 * Evaluates rate limit AND records token request if allowed.
 * Shows rate limit toast automatically if request is blocked.
 */
export function checkAndRecordTokenRateLimit(
  key: string,
  channel: TokenChannelKey = "sms_token",
  customConfig?: Partial<TokenRateLimitConfig>
): TokenRateLimitResult {
  const result = checkTokenRateLimit(key, channel, customConfig);
  if (result.allowed) {
    recordTokenRequest(key, channel, customConfig);
  } else {
    showTokenRateLimitToast(result.remainingSeconds, result.displayName, result.message);
  }
  return result;
}

/**
 * Resets token rate limit history for a specific key and channel.
 */
export function resetTokenRateLimit(key: string, channel: TokenChannelKey): void {
  const storeKey = getStorageKey(key, channel);
  tokenMemoryStore.delete(storeKey);
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      sessionStorage.removeItem(storeKey);
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Displays a non-intrusive rate limit alert toast with audio micro-haptics.
 */
export function showTokenRateLimitToast(
  remainingSeconds: number,
  displayName: string = "Token Request",
  customMessage?: string
): void {
  try {
    playClick();
  } catch {
    // Ignore audio errors
  }
  toast.warning(`🛡️ ${displayName} Rate Limited`, {
    description:
      customMessage ||
      `Anti-spam limit active. Please wait ${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""} before trying again.`,
    duration: 5000,
  });
}

/**
 * Dedicated helper for SMS token requests (phone number as key)
 */
export function checkSmsTokenRateLimit(phoneNumber: string): TokenRateLimitResult {
  const cleanPhone = phoneNumber.replace(/\D/g, "") || "global_sms";
  return checkAndRecordTokenRateLimit(cleanPhone, "sms_token");
}

/**
 * Dedicated helper for WhatsApp token requests (phone number as key)
 */
export function checkWhatsAppTokenRateLimit(phoneNumber: string): TokenRateLimitResult {
  const cleanPhone = phoneNumber.replace(/\D/g, "") || "global_whatsapp";
  return checkAndRecordTokenRateLimit(cleanPhone, "whatsapp_token");
}
