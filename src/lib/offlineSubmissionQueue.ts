import { supabase } from "@/integrations/supabase/client";
import { logSupabaseError } from "./supabaseLogger";

export interface OfflineSubmission {
  id: string;
  type: "booking" | "waitlist" | "meal";
  payload: Record<string, any>;
  timestamp: string;
  retryCount: number;
  status: "pending" | "syncing" | "synced" | "failed";
  lastError?: string;
}

const STORAGE_KEY = "ss_offline_submission_queue";

// In-memory fallback for SSR and non-browser environments
let memoryQueue: OfflineSubmission[] = [];

const readQueue = (): OfflineSubmission[] => {
  if (typeof window === "undefined") return memoryQueue;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return memoryQueue;
  }
};

const writeQueue = (queue: OfflineSubmission[]) => {
  if (typeof window === "undefined") {
    memoryQueue = queue;
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    window.dispatchEvent(
      new CustomEvent("stashsaarthi:offline-queue-change", {
        detail: { count: queue.filter((q) => q.status === "pending").length },
      }),
    );
  } catch (err) {
    console.error("Failed to write to offline submission queue", err);
  }
};

/**
 * Enqueues a submission into the local offline queue
 */
export const enqueueOfflineSubmission = (
  type: "booking" | "waitlist" | "meal",
  payload: Record<string, any>,
): OfflineSubmission => {
  const queue = readQueue();
  const submission: OfflineSubmission = {
    id: `offline-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    payload,
    timestamp: new Date().toISOString(),
    retryCount: 0,
    status: "pending",
  };

  queue.push(submission);
  writeQueue(queue);
  return submission;
};

/**
 * Returns total number of pending items awaiting online sync
 */
export const getPendingOfflineCount = (): number => {
  return readQueue().filter((q) => q.status === "pending").length;
};

/**
 * Processes and flushes all pending offline submissions to Supabase
 */
export const flushOfflineSubmissions = async (): Promise<{
  synced: number;
  failed: number;
}> => {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return { synced: 0, failed: 0 };
  }

  const queue = readQueue();
  const pending = queue.filter((q) => q.status === "pending");
  if (pending.length === 0) return { synced: 0, failed: 0 };

  let synced = 0;
  let failed = 0;

  for (const item of pending) {
    try {
      item.status = "syncing";
      item.retryCount += 1;

      if (item.type === "booking") {
        const { error } = await (supabase as any).from("co_living_inquiries").insert(item.payload);
        if (error) throw error;
      } else if (item.type === "meal") {
        const { error } = await (supabase as any).from("meal_bookings").insert([item.payload]);
        if (error) throw error;
      } else if (item.type === "waitlist") {
        const { error } = await (supabase as any).from("waitlist_leads").insert([item.payload]);
        if (error) throw error;
      }

      item.status = "synced";
      synced += 1;
    } catch (err: any) {
      item.status = "failed";
      item.lastError = err?.message || String(err);
      failed += 1;
      logSupabaseError({
        table:
          item.type === "meal"
            ? "meal_bookings"
            : item.type === "waitlist"
              ? "waitlist_submissions"
              : "co_living_inquiries",
        operation: "insert",
        error: err,
        context: `offlineQueue_flush_${item.id}`,
      });
    }
  }

  // Keep failed items for inspection/retry, filter out synced items
  const updatedQueue = queue.filter((q) => q.status !== "synced");
  writeQueue(updatedQueue);

  return { synced, failed };
};

// Automatically listen for browser online event
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    flushOfflineSubmissions().then(({ synced }) => {
      if (synced > 0) {
        window.dispatchEvent(
          new CustomEvent("stashsaarthi:offline-synced", {
            detail: { count: synced },
          }),
        );
      }
    });
  });
}
