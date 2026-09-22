import {
  evaluateHostTier,
  DEFAULT_HOST_METRICS,
  getHostLeaderboard,
} from "../src/lib/superHostRatingEngine.ts";

console.log("=== StashSaarthi Autonomous System: SuperHost Rating & Tiering Test Suite ===");

// TEST 1: Host with 100% check-in accuracy & 0 disputes (Mrs. Sarita Sharma)
console.log("\n[Test 1] Evaluating host with 100% check-in SLA accuracy & 0 disputes...");
const saritaMetrics = DEFAULT_HOST_METRICS[0];
const saritaResult = evaluateHostTier(saritaMetrics);

console.log(`  - Host: ${saritaResult.hostName}`);
console.log(`  - Check-in Accuracy: ${saritaResult.checkInAccuracyPercentage}%`);
console.log(`  - Total Disputes: ${saritaMetrics.totalDisputes}`);
console.log(`  - Granted Tier: ${saritaResult.tier}`);
console.log(`  - SuperHost Badge Granted: ${saritaResult.superHostBadgeGranted}`);
console.log(`  - Composite Score: ${saritaResult.score} / 100`);

if (!saritaResult.superHostBadgeGranted || saritaResult.tier !== "Master SuperHost") {
  console.error("❌ ERROR: Failed to grant SuperHost status to qualifying host!");
  process.exit(1);
}
console.log(
  "✔ Test 1 PASSED: Host with 100% check-in SLA & 0 disputes successfully granted Master SuperHost tier.",
);

// TEST 2: Host with <99% accuracy & 1 dispute (Shri Alok Tripathi)
console.log("\n[Test 2] Evaluating host with 93.3% check-in accuracy & 1 recorded dispute...");
const alokMetrics = DEFAULT_HOST_METRICS[2];
const alokResult = evaluateHostTier(alokMetrics);

console.log(`  - Host: ${alokResult.hostName}`);
console.log(`  - Check-in Accuracy: ${alokResult.checkInAccuracyPercentage}%`);
console.log(`  - Total Disputes: ${alokMetrics.totalDisputes}`);
console.log(`  - Granted Tier: ${alokResult.tier}`);
console.log(`  - SuperHost Badge Granted: ${alokResult.superHostBadgeGranted}`);
console.log(`  - Missing Criteria:`, alokResult.missingRequirementsEn);

if (alokResult.superHostBadgeGranted || alokResult.tier === "SuperHost") {
  console.error("❌ ERROR: SuperHost badge granted to host with <99% accuracy or disputes!");
  process.exit(1);
}
console.log(
  "✔ Test 2 PASSED: Host with <99% accuracy / active disputes correctly restricted from SuperHost badge.",
);

// TEST 3: Edge Case — 98.9% accuracy (Strict 99.0% threshold check)
console.log("\n[Test 3] Testing strict 99.0% check-in accuracy boundary (98.9% vs 99.0%)...");
const boundaryHost = {
  hostId: "HOST-BOUNDARY",
  hostName: "Boundary Host",
  nodeAddress: "Kakadeo, Kanpur",
  campusNode: "Kakadeo Coaching Belt",
  totalCheckIns: 1000,
  successfulCheckIns: 989, // Exactly 98.9%
  totalDisputes: 0,
  resolvedDisputes: 0,
  averageRating: 4.9,
  onTimePayoutPercentage: 100,
};

const boundaryResult = evaluateHostTier(boundaryHost);
console.log(`  - Boundary Host Accuracy: ${boundaryResult.checkInAccuracyPercentage}%`);
console.log(`  - SuperHost Granted: ${boundaryResult.superHostBadgeGranted}`);

if (boundaryResult.superHostBadgeGranted) {
  console.error("❌ ERROR: SuperHost granted at 98.9% accuracy!");
  process.exit(1);
}
console.log("✔ Test 3 PASSED: Strict 99.0% threshold enforced.");

console.log("\n=== Task 121 Verification Completed Successfully ===");
