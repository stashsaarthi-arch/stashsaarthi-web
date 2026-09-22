import { toast } from "sonner";

export * from "./tokenRateLimiter";

/**
 * Client-Side Form Submission Rate Limiter
 * Enforces cooldowns and sliding-window rate limits across form submissions to prevent spam.
 */

export interface RateLimitConfig {
  /** Minimum time (ms) required between consecutive submissions. Default: 3000ms (3s) */
  minIntervalMs?: number;
  /** Maximum number of submissions allowed within windowMs. Default: 3 */
  maxSubmissions?: number;
  /** Sliding window duration (ms). Default: 30000ms (30s) */
  windowMs?: number;
}

const DEFAULT_CONFIG: Required<RateLimitConfig> = {
  minIntervalMs: 3000,
  maxSubmissions: 3,
  windowMs: 30000,
};

// In-memory fallback if sessionStorage is unavailable
const memoryStore = new Map<string, number[]>();

function getStorageKey(key: string): string {
  return `ss_ratelimit_${key}`;
}

function getTimestamps(key: string): number[] {
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const stored = sessionStorage.getItem(getStorageKey(key));
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed.filter((t) => typeof t === "number");
      }
    }
  } catch {
    // Ignore storage errors
  }
  return memoryStore.get(key) || [];
}

function saveTimestamps(key: string, timestamps: number[]): void {
  memoryStore.set(key, timestamps);
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      sessionStorage.setItem(getStorageKey(key), JSON.stringify(timestamps));
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Checks if a submission key is currently rate-limited.
 */
export function checkRateLimit(
  key: string,
  config?: RateLimitConfig,
): { allowed: boolean; remainingSeconds: number; message: string } {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();
  const timestamps = getTimestamps(key);

  // Filter out timestamps outside the sliding window
  const recentTimestamps = timestamps.filter((t) => now - t < cfg.windowMs);

  // Check 1: Minimum interval between submissions
  if (recentTimestamps.length > 0) {
    const lastSubmission = recentTimestamps[recentTimestamps.length - 1] ?? 0;
    const timeSinceLast = now - lastSubmission;
    if (timeSinceLast < cfg.minIntervalMs) {
      const remainingSeconds = Math.ceil((cfg.minIntervalMs - timeSinceLast) / 1000);
      return {
        allowed: false,
        remainingSeconds,
        message: `Please wait ${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""} before submitting again to prevent spam.`,
      };
    }
  }

  // Check 2: Maximum submissions within sliding window
  if (recentTimestamps.length >= cfg.maxSubmissions) {
    const oldestInWindow = recentTimestamps[0] ?? now;
    const timeUntilExpiry = cfg.windowMs - (now - oldestInWindow);
    const remainingSeconds = Math.max(1, Math.ceil(timeUntilExpiry / 1000));
    return {
      allowed: false,
      remainingSeconds,
      message: `Too many submissions. Please wait ${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""} before trying again.`,
    };
  }

  return { allowed: true, remainingSeconds: 0, message: "" };
}

/**
 * Records a successful submission attempt for a given key.
 */
export function recordSubmission(key: string, config?: RateLimitConfig): void {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();
  const timestamps = getTimestamps(key);
  const recentTimestamps = timestamps.filter((t) => now - t < cfg.windowMs);
  recentTimestamps.push(now);
  saveTimestamps(key, recentTimestamps);
}

/**
 * Convenience method: Checks rate limit AND records submission if allowed.
 */
export function checkAndRecordRateLimit(
  key: string,
  config?: RateLimitConfig,
): { allowed: boolean; remainingSeconds: number; message: string } {
  const check = checkRateLimit(key, config);
  if (check.allowed) {
    recordSubmission(key, config);
  }
  return check;
}

/**
 * Resets the rate limit history for a key (e.g. after successful secondary verification).
 */
export function resetRateLimit(key: string): void {
  memoryStore.delete(key);
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      sessionStorage.removeItem(getStorageKey(key));
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Displays a non-intrusive rate limit alert toast.
 */
export function showRateLimitToast(remainingSeconds: number, customMessage?: string): void {
  toast.warning(customMessage || `Submission Rate Limited`, {
    description: `Please wait ${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""} before submitting again.`,
    duration: 4000,
  });
}
