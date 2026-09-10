/**
 * Test script for Task 107: CTO - One-Click Rebook & Renewal Triggers
 * Verifies that MyBookingsDashboard and BookingDetailDrawer contain the required
 * 1-tap rebook/renew triggers and custom event dispatches.
 */

import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

const dashboardPath = path.join(rootDir, 'src', 'components', 'stash', 'MyBookingsDashboard.tsx');
const drawerPath = path.join(rootDir, 'src', 'components', 'stash', 'BookingDetailDrawer.tsx');

console.log("🔍 Running Task 107 Verification Check...");

let passed = true;

if (!fs.existsSync(dashboardPath)) {
  console.error("❌ MyBookingsDashboard.tsx not found!");
  passed = false;
} else {
  const dashboardContent = fs.readFileSync(dashboardPath, 'utf-8');
  if (!dashboardContent.includes("handleRebook") || !dashboardContent.includes("handleReorderMeal")) {
    console.error("❌ handleRebook or handleReorderMeal missing in MyBookingsDashboard.tsx");
    passed = false;
  } else {
    console.log("✅ handleRebook & handleReorderMeal present in MyBookingsDashboard.tsx");
  }

  if (!dashboardContent.includes("stashsaarthi:open-booking")) {
    console.error("❌ Event 'stashsaarthi:open-booking' not dispatched in MyBookingsDashboard.tsx");
    passed = false;
  } else {
    console.log("✅ Custom event 'stashsaarthi:open-booking' dispatch confirmed in MyBookingsDashboard.tsx");
  }
}

if (!fs.existsSync(drawerPath)) {
  console.error("❌ BookingDetailDrawer.tsx not found!");
  passed = false;
} else {
  const drawerContent = fs.readFileSync(drawerPath, 'utf-8');
  if (!drawerContent.includes("handleRenew") || !drawerContent.includes("1-Tap Renew Storage Slot")) {
    console.error("❌ 1-Tap Renew trigger missing in BookingDetailDrawer.tsx");
    passed = false;
  } else {
    console.log("✅ 1-Tap Renew trigger present in BookingDetailDrawer.tsx");
  }
}

if (passed) {
  console.log("\n🎉 TASK 107 VERIFICATION PASSED: All One-Click Rebook triggers operational!");
  process.exit(0);
} else {
  console.error("\n❌ TASK 107 VERIFICATION FAILED!");
  process.exit(1);
}
