import { readFileSync, existsSync } from "fs";
import { join } from "path";

console.log("==================================================");
console.log("🧪 Task 161 Test Runner: Multi-Step Booking Modal");
console.log("==================================================\n");

let passed = true;

// 1. Verify designTokens.ts has MULTI_STEP_BOOKING_TOKENS & getMultiStepBookingTokens
const tokensPath = join(process.cwd(), "src", "lib", "designTokens.ts");
const tokensContent = readFileSync(tokensPath, "utf-8");

if (
  tokensContent.includes("MULTI_STEP_BOOKING_TOKENS") &&
  tokensContent.includes("getMultiStepBookingTokens")
) {
  console.log("✅ Check 1 PASS: MULTI_STEP_BOOKING_TOKENS and helper function exported in designTokens.ts");
} else {
  console.error("❌ Check 1 FAIL: Missing MULTI_STEP_BOOKING_TOKENS in designTokens.ts");
  passed = false;
}

// 2. Verify styles.css contains distraction-free & breadcrumbs styling
const stylesPath = join(process.cwd(), "src", "styles.css");
const stylesContent = readFileSync(stylesPath, "utf-8");

if (
  stylesContent.includes("distraction-free-booking-stage") &&
  stylesContent.includes("booking-breadcrumb-pill") &&
  stylesContent.includes("booking-validation-error-glow")
) {
  console.log("✅ Check 2 PASS: styles.css contains distraction-free modal & breadcrumbs CSS utilities");
} else {
  console.error("❌ Check 2 FAIL: Missing distraction-free CSS utilities in styles.css");
  passed = false;
}

// 3. Verify BookingModal.tsx integrates breadcrumbs, step validation & audio haptics
const modalPath = join(process.cwd(), "src", "components", "stash", "BookingModal.tsx");
const modalContent = readFileSync(modalPath, "utf-8");

const requiredTerms = [
  "getMultiStepBookingTokens",
  "usePersona",
  "playClick",
  "playPop",
  "stepValidationError",
  "handleStepClick",
  "distraction-free-booking-stage",
  "booking-breadcrumb-pill",
];

let allTermsFound = true;
for (const term of requiredTerms) {
  if (!modalContent.includes(term)) {
    console.error(`❌ Missing term in BookingModal.tsx: ${term}`);
    allTermsFound = false;
    passed = false;
  }
}

if (allTermsFound) {
  console.log("✅ Check 3 PASS: BookingModal.tsx incorporates all multi-step breadcrumb & validation requirements");
}

console.log("\n==================================================");
if (passed) {
  console.log("🎉 ALL CHECKS PASSED FOR TASK 161!");
  process.exit(0);
} else {
  console.error("💥 TASK 161 VERIFICATION FAILED!");
  process.exit(1);
}
