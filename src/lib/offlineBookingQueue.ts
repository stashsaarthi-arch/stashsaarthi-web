/**
 * StashSaarthi Dynamic IndexedDB Offline Queue & Background Periodic Sync Engine
 * --------------------------------------------------------------------------------
 * Handles booking requests when cell service drops in Kakadeo basement nodes.
 * Stores pending requests in IndexedDB ("StashSaarthi_Offline_DB") and auto-flushes
 * when internet connectivity is restored via Window "online" events, Service Worker
 * Background Sync ("sync"), or Periodic Sync ("periodicsync").
 */

import { supabase } from "@/integrations/supabase/client";

export interface OfflineBookingPayload {
  user_id?: string | null;
  role: string;
  name: string;
  email: string;
  phone: string;
  preferred_location: string;
  message: string;
  token: string;
  service: string;
  amount: number;
}

export interface OfflineBookingRecord {
  queueId: string;
  payload: OfflineBookingPayload;
  createdAt: string;
  retryCount: number;
  status: "pending" | "syncing" | "synced" | "failed";
  lastError?: string;
}

const DB_NAME = "StashSaarthi_Offline_DB";
const DB_VERSION = 1;
const STORE_NAME = "offline_booking_requests";

/**
 * Opens or upgrades the IndexedDB database for offline booking requests.
 */
export function openOfflineBookingDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" && typeof self === "undefined") {
      reject(new Error("IndexedDB is not available in non-browser environment"));
      return;
    }

    const idb = typeof window !== "undefined" ? window.indexedDB : self.indexedDB;
    if (!idb) {
      reject(new Error("IndexedDB is not supported on this device"));
      return;
    }

    const request = idb.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "queueId" });
        store.createIndex("status", "status", { unique: false });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Enqueues a new offline booking request into IndexedDB.
 */
export async function enqueueOfflineBooking(
  payload: OfflineBookingPayload
): Promise<OfflineBookingRecord> {
  const db = await openOfflineBookingDB();
  const queueId = `OFF-BK-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const record: OfflineBookingRecord = {
    queueId,
    payload,
    createdAt: new Date().toISOString(),
    retryCount: 0,
    status: "pending",
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(record);

    request.onsuccess = async () => {
      // Trigger SW background sync registration if supported
      await registerBackgroundPeriodicSync();
      resolve(record);
    };

    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieves all pending offline booking records from IndexedDB.
 */
export async function getPendingOfflineBookings(): Promise<OfflineBookingRecord[]> {
  try {
    const db = await openOfflineBookingDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const records = (request.result as OfflineBookingRecord[]) || [];
        const pending = records.filter(
          (r) => r.status === "pending" || r.status === "failed"
        );
        resolve(pending);
      };

      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("[OfflineQueue] Error fetching pending bookings:", err);
    return [];
  }
}

/**
 * Removes a synced or processed booking record from IndexedDB.
 */
export async function removeOfflineBooking(queueId: string): Promise<void> {
  try {
    const db = await openOfflineBookingDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(queueId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn(`[OfflineQueue] Failed to delete queueId ${queueId}:`, err);
  }
}

/**
 * Updates status of a queued offline booking.
 */
export async function updateOfflineBookingStatus(
  queueId: string,
  status: OfflineBookingRecord["status"],
  lastError?: string
): Promise<void> {
  try {
    const db = await openOfflineBookingDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(queueId);

      getReq.onsuccess = () => {
        const record = getReq.result as OfflineBookingRecord | undefined;
        if (!record) {
          resolve();
          return;
        }

        const updated: OfflineBookingRecord = {
          ...record,
          status,
          retryCount: status === "failed" ? record.retryCount + 1 : record.retryCount,
          ...(lastError ? { lastError } : {}),
        };

        const putReq = store.put(updated);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      };

      getReq.onerror = () => reject(getReq.error);
    });
  } catch (err) {
    console.warn(`[OfflineQueue] Error updating status for ${queueId}:`, err);
  }
}

/**
 * Flushes all pending bookings from IndexedDB to Supabase backend.
 */
export async function flushOfflineBookingQueue(): Promise<{
  syncedCount: number;
  failedCount: number;
}> {
  const pendingRecords = await getPendingOfflineBookings();
  if (pendingRecords.length === 0) {
    return { syncedCount: 0, failedCount: 0 };
  }

  let syncedCount = 0;
  let failedCount = 0;

  for (const record of pendingRecords) {
    try {
      await updateOfflineBookingStatus(record.queueId, "syncing");
      const { error } = await supabase.from("co_living_inquiries").insert({
        user_id: record.payload.user_id ?? null,
        role: record.payload.role,
        name: record.payload.name,
        email: record.payload.email,
        phone: record.payload.phone,
        preferred_location: record.payload.preferred_location,
        message: `${record.payload.message} · [Synced from Kakadeo Basement Offline Queue ${record.queueId}]`,
      });

      if (error) {
        await updateOfflineBookingStatus(record.queueId, "failed", error.message);
        failedCount++;
      } else {
        await removeOfflineBooking(record.queueId);
        syncedCount++;
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      await updateOfflineBookingStatus(record.queueId, "failed", errMsg);
      failedCount++;
    }
  }

  if (syncedCount > 0 && typeof window !== "undefined") {
    // Notify window via custom event
    window.dispatchEvent(
      new CustomEvent("stashsaarthi:offline-bookings-synced", {
        detail: { syncedCount, failedCount },
      })
    );
  }

  return { syncedCount, failedCount };
}

/**
 * Registers Background Sync and Periodic Background Sync APIs on Service Worker.
 */
export async function registerBackgroundPeriodicSync(): Promise<boolean> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const reg = await navigator.serviceWorker.ready;

    // 1. One-shot Background Sync API ('sync')
    if ("sync" in reg) {
      const syncReg = (reg as unknown as { sync: { register(tag: string): Promise<void> } }).sync;
      await syncReg.register("sync-offline-bookings");
      console.info("[OfflineQueue] Registered Service Worker 'sync-offline-bookings'");
    }

    // 2. Periodic Background Sync API ('periodicSync')
    if ("periodicSync" in reg) {
      const periodicReg = (
        reg as unknown as {
          periodicSync: {
            register(tag: string, options?: { minInterval: number }): Promise<void>;
          };
        }
      ).periodicSync;

      try {
        await periodicReg.register("periodic-booking-sync", {
          minInterval: 12 * 60 * 60 * 1000, // 12 hours
        });
        console.info("[OfflineQueue] Registered Service Worker 'periodic-booking-sync'");
      } catch (err) {
        // Periodic sync permission may require PWA installation; non-fatal
        console.debug("[OfflineQueue] Periodic sync permission deferred:", err);
      }
    }

    return true;
  } catch (err) {
    console.warn("[OfflineQueue] Could not register SW sync tags:", err);
    return false;
  }
}

/**
 * Initializes automatic sync listeners for window "online" and SW messages.
 */
export function initOfflineQueueAutoSync(): void {
  if (typeof window === "undefined") return;

  // Sync whenever network comes back online
  window.addEventListener("online", () => {
    console.info("[OfflineQueue] Connectivity restored — flushing offline queue...");
    flushOfflineBookingQueue();
  });

  // Sync if Service Worker sends a message
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data["type"] === "FLUSH_OFFLINE_BOOKINGS") {
        console.info("[OfflineQueue] Received FLUSH_OFFLINE_BOOKINGS from SW");
        flushOfflineBookingQueue();
      }
    });
  }

  // Attempt initial sync on load if online
  if (navigator.onLine) {
    setTimeout(() => {
      flushOfflineBookingQueue();
    }, 3000);
  }
}
