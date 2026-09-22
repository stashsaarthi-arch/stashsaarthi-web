/**
 * Test script for Task 110: Campus Empty State Delight Verification
 * Verifies customized campus-specific empty state graphic & instant ₹50 welcome discount card.
 */

import fs from "fs";
import path from "path";

console.log("🔍 Running Task 110 Verification Check (Campus Empty State Delight)...");

let passed = true;

const emptyStatePath = path.join(
  process.cwd(),
  "src",
  "components",
  "stash",
  "CampusEmptyStateDelight.tsx",
);
const dashboardPath = path.join(
  process.cwd(),
  "src",
  "components",
  "stash",
  "MyBookingsDashboard.tsx",
);

if (!fs.existsSync(emptyStatePath)) {
  console.error("❌ CampusEmptyStateDelight.tsx not found!");
  passed = false;
} else {
  const content = fs.readFileSync(emptyStatePath, "utf-8");
  if (
    !content.includes("WELCOME50") ||
    !content.includes("₹50") ||
    !content.includes("stashsaarthi:open-booking")
  ) {
    console.error(
      "❌ Promo code WELCOME50, ₹50 discount card, or booking trigger missing in CampusEmptyStateDelight.tsx",
    );
    passed = false;
  } else {
    console.log(
      "✅ CampusEmptyStateDelight component confirmed with WELCOME50 promo code & ₹50 discount card!",
    );
  }
}

if (!fs.existsSync(dashboardPath)) {
  console.error("❌ MyBookingsDashboard.tsx not found!");
  passed = false;
} else {
  const dashContent = fs.readFileSync(dashboardPath, "utf-8");
  if (!dashContent.includes("<CampusEmptyStateDelight />")) {
    console.error("❌ CampusEmptyStateDelight not rendered in MyBookingsDashboard renderEmpty()");
    passed = false;
  } else {
    console.log("✅ CampusEmptyStateDelight integrated into MyBookingsDashboard empty state!");
  }
}

if (passed) {
  console.log("\n🎉 TASK 110 VERIFICATION PASSED: Campus Empty State Delight ready!");
  process.exit(0);
} else {
  console.error("\n❌ TASK 110 VERIFICATION FAILED!");
  process.exit(1);
}
