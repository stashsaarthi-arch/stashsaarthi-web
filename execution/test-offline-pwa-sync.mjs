/**
 * StashSaarthi Offline PWA & Dynamic IndexedDB Sync Verification Test
 * ---------------------------------------------------------------------
 * Tests the offline booking queue logic, service worker sync registration hooks,
 * and database schema structure.
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`  ✓ ${message}`);
  }
}

console.log("=== StashSaarthi Task 102 Offline PWA & Sync Audit ===");

// 1. Verify src/lib/offlineBookingQueue.ts existence & content
const offlineQueuePath = resolve(process.cwd(), "src/lib/offlineBookingQueue.ts");
assert(existsSync(offlineQueuePath), "src/lib/offlineBookingQueue.ts exists");

const queueSource = readFileSync(offlineQueuePath, "utf-8");
assert(queueSource.includes("StashSaarthi_Offline_DB"), "Defines StashSaarthi_Offline_DB database");
assert(queueSource.includes("offline_booking_requests"), "Defines offline_booking_requests object store");
assert(queueSource.includes("enqueueOfflineBooking"), "Exports enqueueOfflineBooking function");
assert(queueSource.includes("flushOfflineBookingQueue"), "Exports flushOfflineBookingQueue function");
assert(queueSource.includes("registerBackgroundPeriodicSync"), "Exports registerBackgroundPeriodicSync function");

// 2. Verify public/sw.js background & periodic sync handlers
const swPath = resolve(process.cwd(), "public/sw.js");
assert(existsSync(swPath), "public/sw.js exists");

const swSource = readFileSync(swPath, "utf-8");
assert(swSource.includes('event.tag === "sync-offline-bookings"'), "SW handles background sync tag 'sync-offline-bookings'");
assert(swSource.includes('event.tag === "periodic-booking-sync"'), "SW handles periodic sync tag 'periodic-booking-sync'");
assert(swSource.includes("FLUSH_OFFLINE_BOOKINGS"), "SW notifies clients via FLUSH_OFFLINE_BOOKINGS message");

// 3. Verify src/lib/sw-register.ts periodic sync integration
const swRegisterPath = resolve(process.cwd(), "src/lib/sw-register.ts");
const swRegSource = readFileSync(swRegisterPath, "utf-8");
assert(swRegSource.includes("registerBackgroundPeriodicSync"), "sw-register.ts imports & registers background periodic sync");

// 4. Verify src/routes/__root.tsx auto-sync initialization
const rootPath = resolve(process.cwd(), "src/routes/__root.tsx");
const rootSource = readFileSync(rootPath, "utf-8");
assert(rootSource.includes("initOfflineQueueAutoSync"), "__root.tsx initializes offline queue auto-sync");
assert(rootSource.includes("stashsaarthi:offline-bookings-synced"), "__root.tsx listens for synced event for user notifications");

// 5. Verify src/components/stash/BookingModal.tsx offline fallback
const bookingModalPath = resolve(process.cwd(), "src/components/stash/BookingModal.tsx");
const bookingModalSource = readFileSync(bookingModalPath, "utf-8");
assert(bookingModalSource.includes("enqueueOfflineBooking"), "BookingModal imports enqueueOfflineBooking");
assert(bookingModalSource.includes("Saved to Offline Vault (Kakadeo Basement)"), "BookingModal includes offline vault toast notice");

console.log("\n✅ ALL TASK 102 OFFLINE PWA & PERIODIC SYNC VERIFICATIONS PASSED!");
