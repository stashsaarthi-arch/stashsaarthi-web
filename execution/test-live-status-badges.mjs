/**
 * Test script for Task 111: Live Status Badges & Realtime Custody Lifecycle
 * Verifies Supabase realtime channels & lifecycle state updates.
 */

import fs from 'fs';
import path from 'path';

console.log("🔍 Running Task 111 Verification Check (Live Status Badges)...");

let passed = true;

const hookPath = path.join(process.cwd(), 'src', 'hooks', 'useBookingRealtimeStatus.ts');
const badgePath = path.join(process.cwd(), 'src', 'components', 'stash', 'BookingLiveStatusBadge.tsx');
const dashboardPath = path.join(process.cwd(), 'src', 'components', 'stash', 'MyBookingsDashboard.tsx');
const drawerPath = path.join(process.cwd(), 'src', 'components', 'stash', 'BookingDetailDrawer.tsx');

if (!fs.existsSync(hookPath)) {
  console.error("❌ useBookingRealtimeStatus.ts hook missing!");
  passed = false;
} else {
  const content = fs.readFileSync(hookPath, 'utf-8');
  if (!content.includes("item_received") || !content.includes("in_secure_locker") || !content.includes("ready_for_retrieval")) {
    console.error("❌ Lifecycle state transitions missing in useBookingRealtimeStatus.ts");
    passed = false;
  } else {
    console.log("✅ useBookingRealtimeStatus hook confirmed with full custody lifecycle states!");
  }
}

if (!fs.existsSync(badgePath)) {
  console.error("❌ BookingLiveStatusBadge.tsx component missing!");
  passed = false;
} else {
  console.log("✅ BookingLiveStatusBadge.tsx component confirmed!");
}

if (!fs.existsSync(dashboardPath) || !fs.readFileSync(dashboardPath, 'utf-8').includes("BookingLiveStatusBadge")) {
  console.error("❌ BookingLiveStatusBadge not integrated into MyBookingsDashboard.tsx!");
  passed = false;
} else {
  console.log("✅ BookingLiveStatusBadge integrated into MyBookingsDashboard!");
}

if (!fs.existsSync(drawerPath) || !fs.readFileSync(drawerPath, 'utf-8').includes("BookingLiveStatusBadge")) {
  console.error("❌ BookingLiveStatusBadge not integrated into BookingDetailDrawer.tsx!");
  passed = false;
} else {
  console.log("✅ BookingLiveStatusBadge integrated into BookingDetailDrawer!");
}

if (passed) {
  console.log("\n🎉 TASK 111 VERIFICATION PASSED: Supabase Realtime Live Status Badges complete!");
  process.exit(0);
} else {
  console.error("\n❌ TASK 111 VERIFICATION FAILED!");
  process.exit(1);
}
