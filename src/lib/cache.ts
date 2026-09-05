/**
 * High-Performance Multi-Tier Caching Layer
 * 
 * Supports:
 * Tier 1: In-memory Map cache with millisecond TTL (0ms instant response)
 * Tier 2: Asynchronous IndexedDB persistence via idb-keyval (survives reloads)
 * Tier 3: Upstash / Redis REST interface (if VITE_UPSTASH_REDIS_REST_URL is configured)
 * 
 * Used for frequently accessed, non-user-specific data:
 * - Campus nodes & inventory stats
 * - Public review aggregates & verified feedback
 * - Meal pricing tiers & plan matrix
 */

import { get as idbGet, set as idbSet, del as idbDel } from "idb-keyval";

export interface CacheOptions {
  /** Time to live in seconds (default: 300s = 5 minutes) */
  ttlSeconds?: number;
  /** Whether to persist across browser sessions (default: true) */
  persistent?: boolean;
}

interface CacheEnvelope<T> {
  data: T;
  expiresAt: number; // unix timestamp in ms
  cachedAt: number;
}

// In-Memory Tier 1 Cache
const memoryCache = new Map<string, CacheEnvelope<unknown>>();

// Upstash REST configuration (read from Vite env if provided)
const UPSTASH_REST_URL = (typeof import.meta !== "undefined" && import.meta.env?.VITE_UPSTASH_REDIS_REST_URL) || "";
const UPSTASH_REST_TOKEN = (typeof import.meta !== "undefined" && import.meta.env?.VITE_UPSTASH_REDIS_REST_TOKEN) || "";

/**
 * Check if Upstash Redis REST credentials are configured.
 */
export function isUpstashConfigured(): boolean {
  return Boolean(UPSTASH_REST_URL && UPSTASH_REST_TOKEN);
}

/**
 * Retrieve cached value by key from Tier 1 (Memory) -> Tier 2 (IndexedDB) -> Tier 3 (Upstash).
 */
export async function getCached<T>(key: string): Promise<T | null> {
  const now = Date.now();

  // Tier 1: Memory check
  const memEntry = memoryCache.get(key) as CacheEnvelope<T> | undefined;
  if (memEntry) {
    if (memEntry.expiresAt > now) {
      return memEntry.data;
    }
    // Expired in memory
    memoryCache.delete(key);
  }

  // Tier 2: Persistent IndexedDB check (Client-side only)
  if (typeof window !== "undefined") {
    try {
      const stored = (await idbGet(`cache:${key}`)) as CacheEnvelope<T> | undefined;
      if (stored) {
        if (stored.expiresAt > now) {
          // Re-populate Tier 1 memory cache
          memoryCache.set(key, stored);
          return stored.data;
        }
        // Expired in storage
        await idbDel(`cache:${key}`);
      }
    } catch {
      // Storage access failure fallback
    }
  }

  // Tier 3: Upstash REST Redis (if configured)
  if (isUpstashConfigured()) {
    try {
      const response = await fetch(`${UPSTASH_REST_URL}/get/${encodeURIComponent(key)}`, {
        headers: {
          Authorization: `Bearer ${UPSTASH_REST_TOKEN}`,
        },
      });
      if (response.ok) {
        const json = await response.json();
        if (json.result) {
          const parsed = typeof json.result === "string" ? JSON.parse(json.result) : json.result;
          const envelope = parsed as CacheEnvelope<T>;
          if (envelope && envelope.expiresAt > now) {
            memoryCache.set(key, envelope);
            return envelope.data;
          }
        }
      }
    } catch {
      // Redis network failure fallback
    }
  }

  return null;
}

/**
 * Set a key-value pair in cache with expiration.
 */
export async function setCached<T>(
  key: string,
  data: T,
  options?: CacheOptions
): Promise<void> {
  const ttlSeconds = options?.ttlSeconds ?? 300; // 5 min default
  const persistent = options?.persistent ?? true;
  const now = Date.now();
  const expiresAt = now + ttlSeconds * 1000;

  const envelope: CacheEnvelope<T> = {
    data,
    expiresAt,
    cachedAt: now,
  };

  // Tier 1: Memory
  memoryCache.set(key, envelope);

  // Tier 2: Persistent storage
  if (persistent && typeof window !== "undefined") {
    try {
      await idbSet(`cache:${key}`, envelope);
    } catch {
      // Storage quota or permission failure fallback
    }
  }

  // Tier 3: Upstash REST Redis
  if (isUpstashConfigured()) {
    try {
      const serialized = JSON.stringify(envelope);
      await fetch(`${UPSTASH_REST_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(serialized)}?EX=${ttlSeconds}`, {
        headers: {
          Authorization: `Bearer ${UPSTASH_REST_TOKEN}`,
        },
      });
    } catch {
      // Ignore network errors
    }
  }
}

/**
 * Invalidate a specific cache entry across all tiers.
 */
export async function invalidateCached(key: string): Promise<void> {
  memoryCache.delete(key);

  if (typeof window !== "undefined") {
    try {
      await idbDel(`cache:${key}`);
    } catch {
      // Ignore idb errors
    }
  }

  if (isUpstashConfigured()) {
    try {
      await fetch(`${UPSTASH_REST_URL}/del/${encodeURIComponent(key)}`, {
        headers: {
          Authorization: `Bearer ${UPSTASH_REST_TOKEN}`,
        },
      });
    } catch {
      // Ignore errors
    }
  }
}

/**
 * Stale-while-revalidate or Cache-first fetch helper.
 * If cached, returns immediately; otherwise executes fetcher and caches result.
 */
export async function getOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: CacheOptions
): Promise<T> {
  const cached = await getCached<T>(key);
  if (cached !== null) {
    return cached;
  }

  const fresh = await fetcher();
  await setCached(key, fresh, options);
  return fresh;
}
