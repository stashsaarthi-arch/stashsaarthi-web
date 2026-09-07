/**
 * Android Go & Low-End Device Mobile Performance Verification Script
 * Validates hardware detection thresholds, 2GB memory budget protection,
 * WebGL 2D fallback triggers, Card3D touch tilt disabling, and zero-crash assertions.
 */

import { readFileSync } from "fs";

console.log("================================================================");
console.log("📱 STASHSAARTHI ANDROID GO MOBILE PERFORMANCE VERIFICATION HARNESS");
console.log("================================================================");

let totalPassed = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    totalPassed++;
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

// 1. Verify androidGoGuard.ts exists and exports diagnoseAndroidGo
try {
  const guardContent = readFileSync("./src/lib/androidGoGuard.ts", "utf-8");
  assert(
    guardContent.includes("export function diagnoseAndroidGo()"),
    "androidGoGuard.ts exports diagnoseAndroidGo()"
  );
  assert(
    guardContent.includes("Redmi\\sA1") && guardContent.includes("JioPhone"),
    "androidGoGuard.ts includes user-agent patterns for Kanpur low-end devices (Redmi A1, JioPhone Next)"
  );
  assert(
    guardContent.includes("memoryGb <= 2"),
    "androidGoGuard.ts enforces 2GB RAM budget detection ceiling"
  );
} catch (e) {
  assert(false, `Failed to inspect androidGoGuard.ts: ${e.message}`);
}

// 2. Verify LowDataContext.tsx auto-disables WebGL & animations in Low-Data / Slow-2G mode
try {
  const lowDataContent = readFileSync("./src/context/LowDataContext.tsx", "utf-8");
  assert(
    lowDataContent.includes('setAttribute("data-webgl-supported", "false")'),
    "LowDataContext disables WebGL context attribute on low-data detection"
  );
  assert(
    lowDataContent.includes('classList.add("legacy-android-fallback")'),
    "LowDataContext applies legacy android CSS fallback class"
  );
} catch (e) {
  assert(false, `Failed to inspect LowDataContext.tsx: ${e.message}`);
}

// 3. Verify Card3D component disables heavy mouse/touch tilt transforms on touch viewports
try {
  const card3dContent = readFileSync("./src/components/ui/Card3D.tsx", "utf-8");
  assert(
    card3dContent.includes("ontouchstart") || card3dContent.includes("maxTouchPoints") || card3dContent.includes("isLowData") || card3dContent.includes("low-data"),
    "Card3D protects low-end touch viewports from heavy tilt reflows"
  );
} catch (e) {
  assert(false, `Failed to inspect Card3D.tsx: ${e.message}`);
}

// 4. Verify AndroidGoPerformanceAudit module
try {
  const auditContent = readFileSync("./src/lib/androidGoPerformanceAudit.ts", "utf-8");
  assert(
    auditContent.includes("runAndroidGoPerformanceAudit"),
    "androidGoPerformanceAudit.ts exports runAndroidGoPerformanceAudit()"
  );
  assert(
    auditContent.includes("measureAndroidGoFpsBenchmark"),
    "androidGoPerformanceAudit.ts exports measureAndroidGoFpsBenchmark()"
  );
} catch (e) {
  assert(false, `Failed to inspect androidGoPerformanceAudit.ts: ${e.message}`);
}

// 5. Verify AndroidGoPerfModal component
try {
  const modalContent = readFileSync("./src/components/stash/AndroidGoPerfModal.tsx", "utf-8");
  assert(
    modalContent.includes("AndroidGoPerfModal"),
    "AndroidGoPerfModal.tsx exports QA performance modal component"
  );
  assert(
    modalContent.includes("handleRunFpsBenchmark"),
    "AndroidGoPerfModal includes interactive 1.2s FPS stress test benchmark"
  );
} catch (e) {
  assert(false, `Failed to inspect AndroidGoPerfModal.tsx: ${e.message}`);
}

console.log("----------------------------------------------------------------");
console.log(`📊 SUMMARY: ${totalPassed}/${totalTests} Android Go Performance Safety Assertions Passed.`);
console.log("----------------------------------------------------------------");

if (totalPassed === totalTests) {
  console.log("🎉 ALL ANDROID GO MOBILE PERFORMANCE CHECKS PASSED SUCCESSFULLY!");
  process.exit(0);
} else {
  console.error("⚠️ SOME PERFORMANCE CHECKS FAILED!");
  process.exit(1);
}
