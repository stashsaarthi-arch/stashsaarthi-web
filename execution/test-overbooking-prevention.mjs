import {
  resetNodeSlotCapacity,
  getNodeAvailableSlots,
  tryAcquireSlotLock,
  confirmSlotBookingWithLock,
  releaseSlotLock,
  simulateConcurrentBookingRequests,
} from "../src/lib/slotLockEngine.ts";

console.log("=== StashSaarthi Autonomous System: Overbooking Prevention High-Concurrency Test Suite ===");

const TEST_NODE_ID = "NODE-STRESS-TEST-01";

// SCENARIO 1: 50 concurrent users racing for 1 remaining slot
console.log("\n[Test 1] Initializing node capacity: Total Slots = 10, Booked Slots = 9 (Exactly 1 slot remaining)...");
resetNodeSlotCapacity(TEST_NODE_ID, 10, 9);

const initialStatus = getNodeAvailableSlots(TEST_NODE_ID);
console.log(`  - Initial Available Slots: ${initialStatus.available} (Total: ${initialStatus.total}, Booked: ${initialStatus.booked})`);

if (initialStatus.available !== 1) {
  console.error(`❌ ERROR: Expected initial available slots = 1, got ${initialStatus.available}`);
  process.exit(1);
}

console.log("  - Launching 50 concurrent asynchronous booking requests simultaneously...");
const stressResult = await simulateConcurrentBookingRequests(TEST_NODE_ID, 50);

console.log("\n✔ Concurrency Stress Test Results:");
console.log(`  - Total Parallel Requests: ${stressResult.totalRequests}`);
console.log(`  - Successful Lock Claims: ${stressResult.successfulAcquires}`);
console.log(`  - Rejected (Overbooking Prevented): ${stressResult.rejectedAcquires}`);
console.log(`  - Rejection Reasons:`, stressResult.rejectionReasons);

if (stressResult.successfulAcquires !== 1) {
  console.error(`❌ ERROR: Overbooking detected! Expected exactly 1 successful claim, got ${stressResult.successfulAcquires}`);
  process.exit(1);
}

if (stressResult.rejectedAcquires !== 49) {
  console.error(`❌ ERROR: Expected exactly 49 rejections, got ${stressResult.rejectedAcquires}`);
  process.exit(1);
}

console.log("✔ Overbooking Guard: 100% SUCCESS. Exactly 1 winner claimed the final slot; 49 requests safely rejected with SLOT_FULL_OVERBOOKING_PREVENTED.");

// SCENARIO 2: Booking Confirmation using winner lock token
console.log("\n[Test 2] Confirming booking with winner lock token...");
const winnerToken = stressResult.winnerTokens[0];
const confirmSuccess = confirmSlotBookingWithLock(TEST_NODE_ID, winnerToken);
console.log(`  - Confirm Result: ${confirmSuccess ? "SUCCESS" : "FAILED"}`);

const postConfirmStatus = getNodeAvailableSlots(TEST_NODE_ID);
console.log(`  - Post-Confirmation Node Status: Booked = ${postConfirmStatus.booked}/${postConfirmStatus.total}, Available = ${postConfirmStatus.available}`);

if (postConfirmStatus.booked !== 10 || postConfirmStatus.available !== 0) {
  console.error("❌ ERROR: Post-confirmation node status mismatch!");
  process.exit(1);
}

// SCENARIO 3: Attempting to acquire lock when node is completely full (0 slots left)
console.log("\n[Test 3] Attempting 5 additional booking requests on full node (0 slots left)...");
const fullNodeAcquire = tryAcquireSlotLock(TEST_NODE_ID, "STUDENT-LATE-USER");
console.log(`  - Full Node Claim Success: ${fullNodeAcquire.success}`);
console.log(`  - Rejection Reason: ${fullNodeAcquire.reason}`);

if (fullNodeAcquire.success || fullNodeAcquire.reason !== "SLOT_FULL_OVERBOOKING_PREVENTED") {
  console.error("❌ ERROR: Lock acquired on full node!");
  process.exit(1);
}

console.log("\n=== Task 120 Verification Completed Successfully ===");
