/**
 * StashSaarthi Deterministic Supabase Telemetry & Zero-Data-Drop Engine
 *
 * Enforces:
 * 1. Structured bulletproof error logging (table, payload, error code, timestamp, network status)
 * 2. Zero Data Drop (auto-persist failed inserts to indexed local storage queue)
 * 3. Automatic background retry sync when network recovers
 */

import { supabase } from "@/integrations/supabase/client";
import { get, set, del } from "idb-keyval";

export interface SupabaseLogPayload {
  table: string;
  operation: "insert" | "upsert" | "update" | "delete" | "select";
  payload?: unknown;
  error?: any;
  context?: string;
}

export function logSupabaseError({
  table,
  operation,
  payload,
  error,
  context,
}: SupabaseLogPayload) {
  const timestamp = new Date().toISOString();
  const errObj = error as {
    code?: string;
    message?: string;
    details?: string;
    hint?: string;
  } | null;
  const errorDetails = {
    timestamp,
    table,
    operation,
    context: context || "General",
    code: errObj?.code || "UNKNOWN_ERROR",
    message: errObj?.message || (typeof error === "string" ? error : "Unknown Supabase Exception"),
    details: errObj?.details || null,
    hint: errObj?.hint || null,
    payload: sanitizePayload(payload),
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  };

  console.error(`[StashSaarthi:SupabaseError][${table}:${operation}]`, errorDetails);

  // Auto queue for zero data drop if it was a write operation
  if (operation === "insert" || operation === "upsert") {
    void queueOfflineSubmission(table, payload);
  }

  return errorDetails;
}

function sanitizePayload(payload: unknown) {
  if (!payload || typeof payload !== "object") return payload;
  try {
    const copy = { ...(payload as Record<string, unknown>) };
    // Redact password or raw tokens if present
    if (copy["password"]) copy["password"] = "[REDACTED]";
    if (
      copy["token"] &&
      typeof copy["token"] === "string" &&
      (copy["token"] as string).length > 30
    ) {
      copy["token"] = "[REDACTED]";
    }
    return copy;
  } catch {
    return payload;
  }
}

/**
 * Queue failed write operation to IndexedDB for guaranteed zero data drop
 */
export async function queueOfflineSubmission(table: string, data: unknown) {
  if (typeof window === "undefined" || !data) return;
  try {
    const queueKey = `stash_offline_queue_${table}`;
    const existing = (await get(queueKey)) || [];
    const item = {
      id: `offline-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      queuedAt: new Date().toISOString(),
      table,
      data,
    };
    existing.push(item);
    await set(queueKey, existing);
    console.info(
      `[StashSaarthi:ZeroDataDrop] Saved item to offline queue for table "${table}" (Total pending: ${existing.length})`,
    );
  } catch (err) {
    console.warn("[StashSaarthi:ZeroDataDrop] IndexedDB queue error:", err);
  }
}

/**
 * Attempt to flush offline queued records back to Supabase
 */
export async function flushOfflineQueues() {
  if (typeof window === "undefined" || !navigator.onLine) return;

  const tables = ["users_waitlist", "co_living_inquiries", "crowdsourced_room_listings"];

  for (const table of tables) {
    const queueKey = `stash_offline_queue_${table}`;
    try {
      const items = (await get(queueKey)) as { data: unknown }[] | undefined;
      if (!Array.isArray(items) || items.length === 0) continue;

      console.info(
        `[StashSaarthi:ZeroDataDrop] Flushing ${items.length} queued items to "${table}"...`,
      );
      const remaining: { data: unknown }[] = [];

      for (const item of items) {
        try {
          const { error } = await (supabase.from as any)(table).insert(
            item.data as Record<string, unknown>,
          );
          if (error && error.code !== "23505") {
            // 23505 is unique violation, treat as success/synced
            remaining.push(item);
          }
        } catch {
          remaining.push(item);
        }
      }

      if (remaining.length === 0) {
        await del(queueKey);
        console.info(
          `[StashSaarthi:ZeroDataDrop] Table "${table}" offline queue completely synced!`,
        );
      } else {
        await set(queueKey, remaining);
      }
    } catch {
      // ignore
    }
  }
}

// Auto register online event listener in browser
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    console.info("[StashSaarthi:Network] Connection restored. Syncing offline queues...");
    void flushOfflineQueues();
  });
  // Also attempt flush on idle
  setTimeout(() => {
    void flushOfflineQueues();
  }, 3000);
}
