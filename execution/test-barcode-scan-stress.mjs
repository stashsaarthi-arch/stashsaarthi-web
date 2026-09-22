/**
 * Verification Test Suite: Task 126 — Barcode Scan Stress Test (html5-qrcode)
 * Verifies that the scanner decode engine achieves >= 95.0% decode accuracy under
 * dim lighting (<30 lx) and crumpled packaging tape conditions.
 */

import {
  STRESS_PROFILES,
  runBarcodeScanStressTest,
  decodeBarcodeWithHtml5Qrcode,
  applyScannerPreprocessing,
} from "../src/lib/barcodeScanStressEngine.ts";

function runVerification() {
  console.log("=================================================");
  console.log("🔍 Task 126: Barcode Scan Stress Test Suite");
  console.log("=================================================\n");

  // 1. Verify stress profile exports
  console.log("🔹 1. Checking Stress Profiles...");
  if (!STRESS_PROFILES || STRESS_PROFILES.length < 4) {
    throw new Error("❌ FAIL: Expected at least 4 stress profiles.");
  }
  console.log(
    `   ✅ Defined ${STRESS_PROFILES.length} stress profiles (Dim Lighting, Crumpled Tape, etc.)`,
  );

  // 2. Test Image Preprocessing Math
  console.log("\n🔹 2. Verifying Signal Preprocessing Engine...");
  const preprocessed = applyScannerPreprocessing(2.1, 18, 0.85); // Extreme dim & crumpled
  if (preprocessed.enhancedContrast < 3.0 || preprocessed.normalizedBrightness < 20) {
    throw new Error("❌ FAIL: Preprocessing gain failed to boost contrast/brightness.");
  }
  console.log(
    `   ✅ Contrast Boost: ${preprocessed.enhancedContrast}x | Normalized Lux: ${preprocessed.normalizedBrightness} lx`,
  );

  // 3. Single Decode Simulation
  console.log("\n🔹 3. Verifying Single Barcode Decode Simulation...");
  const singleRes = decodeBarcodeWithHtml5Qrcode("SS-SEAL-8921", STRESS_PROFILES[1]);
  if (!singleRes.success || singleRes.confidenceScore < 80.0) {
    throw new Error(
      `❌ FAIL: Single decode simulation failed with score ${singleRes.confidenceScore}%`,
    );
  }
  console.log(
    `   ✅ Single Decode Success: ${singleRes.barcode} (Confidence: ${singleRes.confidenceScore}%, Time: ${singleRes.scanTimeMs}ms)`,
  );

  // 4. 100-Sample Automated Benchmark Suite
  console.log("\n🔹 4. Running 100-Sample Automated Scan Benchmark Suite...");
  const summary = runBarcodeScanStressTest(100);
  console.log(`   • Total Scans: ${summary.totalScans}`);
  console.log(`   • Decoded: ${summary.successfulDecodes}`);
  console.log(`   • Failed: ${summary.failedDecodes}`);
  console.log(`   • Decode Pass Rate: ${summary.decodeRatePercent}%`);
  console.log(`   • Avg Scan Time: ${summary.avgScanTimeMs}ms`);

  if (!summary.passTarget95Percent || summary.decodeRatePercent < 95.0) {
    throw new Error(
      `❌ FAIL: Decode rate ${summary.decodeRatePercent}% fell below 95.0% SLA target.`,
    );
  }
  console.log("   ✅ Target 95%+ Decode Accuracy PASSED!");

  console.log("\n=================================================");
  console.log("🎉 ALL BARCODE SCAN STRESS CHECKS PASSED SUCCESSFULLY!");
  console.log("=================================================");
}

runVerification();
