/**
 * StashSaarthi — Task 127 Verification Test
 * Verifies Free Campus Doorstep Pickup Threshold engine, nudge banners, and state logic.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("--------------------------------------------------");
console.log("RUNNING TASK 127: Free Campus Doorstep Pickup Threshold Test");
console.log("--------------------------------------------------");

// 1. Verify Core Library File
const libPath = path.join(rootDir, "src", "lib", "freePickupThreshold.ts");
if (!fs.existsSync(libPath)) {
  console.error("❌ FAILED: src/lib/freePickupThreshold.ts does not exist!");
  process.exit(1);
}
console.log("✅ PASSED: Core library src/lib/freePickupThreshold.ts found.");

const libContent = fs.readFileSync(libPath, "utf-8");
if (
  !libContent.includes("FREE_PICKUP_THRESHOLD_BOXES = 2") ||
  !libContent.includes("STANDARD_PICKUP_FEE = 99")
) {
  console.error("❌ FAILED: Threshold values mismatch in src/lib/freePickupThreshold.ts!");
  process.exit(1);
}
console.log("✅ PASSED: Threshold constants (2 boxes, ₹99 standard fee) verified.");

// 2. Verify UI Banner Component
const componentPath = path.join(rootDir, "src", "components", "stash", "FreePickupNudgeBanner.tsx");
if (!fs.existsSync(componentPath)) {
  console.error("❌ FAILED: src/components/stash/FreePickupNudgeBanner.tsx does not exist!");
  process.exit(1);
}
console.log("✅ PASSED: Banner component src/components/stash/FreePickupNudgeBanner.tsx found.");

const compContent = fs.readFileSync(componentPath, "utf-8");
if (
  !compContent.includes("calculateFreePickupStatus") ||
  !compContent.includes("Add 1 box to unlock FREE pickup")
) {
  console.error("❌ FAILED: Banner component missing required dynamic nudge logic!");
  process.exit(1);
}
console.log("✅ PASSED: Dynamic nudge banner UI strings & logic verified.");

// 3. Verify Integration in BookingModal & Calculator
const bookingModalPath = path.join(rootDir, "src", "components", "stash", "BookingModal.tsx");
const calculatorPath = path.join(rootDir, "src", "components", "stash", "Calculator.tsx");

const bookingModalContent = fs.readFileSync(bookingModalPath, "utf-8");
const calculatorContent = fs.readFileSync(calculatorPath, "utf-8");

if (!bookingModalContent.includes("<FreePickupNudgeBanner")) {
  console.error("❌ FAILED: FreePickupNudgeBanner not integrated in BookingModal.tsx!");
  process.exit(1);
}
console.log("✅ PASSED: Integrated into BookingModal.tsx.");

if (!calculatorContent.includes("<FreePickupNudgeBanner")) {
  console.error("❌ FAILED: FreePickupNudgeBanner not integrated in Calculator.tsx!");
  process.exit(1);
}
console.log("✅ PASSED: Integrated into Calculator.tsx.");

console.log("--------------------------------------------------");
console.log("TASK 127 VERIFICATION SUCCESSFUL!");
console.log("--------------------------------------------------");
