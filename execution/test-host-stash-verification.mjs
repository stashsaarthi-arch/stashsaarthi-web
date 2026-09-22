import fs from "fs";
import path from "path";
import assert from "assert";

console.log("🧪 Running Host Stash Verification Checklist Test Harness...");

// 1. Check file existence
const enginePath = path.join(process.cwd(), "src/lib/hostVerificationEngine.ts");
const componentPath = path.join(
  process.cwd(),
  "src/components/stash/HostStashVerificationModal.tsx",
);
const adminPath = path.join(process.cwd(), "src/routes/admin.tsx");

assert.ok(fs.existsSync(enginePath), "hostVerificationEngine.ts should exist");
assert.ok(fs.existsSync(componentPath), "HostStashVerificationModal.tsx should exist");
assert.ok(fs.existsSync(adminPath), "admin.tsx should exist");

console.log("✅ 1. Required files exist.");

// 2. Import engine dynamically
const engine = await import("../src/lib/hostVerificationEngine.ts");

assert.ok(
  typeof engine.validateIntakeChecklist === "function",
  "validateIntakeChecklist function should be exported",
);
assert.ok(
  typeof engine.createAndSaveVerification === "function",
  "createAndSaveVerification function should be exported",
);
assert.ok(
  typeof engine.getSavedVerifications === "function",
  "getSavedVerifications function should be exported",
);
assert.strictEqual(engine.MAX_ALLOWED_WEIGHT_KG, 25.0, "MAX_ALLOWED_WEIGHT_KG should be 25.0");

console.log("✅ 2. Engine exports verified.");

// 3. Test valid checklist validation
const validChecklist = {
  sealIntact: true,
  barcodeSerial: "SS-KNP-BAR-8921",
  measuredWeightKg: 18.5,
  photoProofUrl: "data:image/svg+xml;charset=utf-8,test",
  notes: "All good",
};

const validResult = engine.validateIntakeChecklist(validChecklist);
assert.strictEqual(validResult.isValid, true, "Valid checklist should pass validation");
assert.strictEqual(validResult.status, "verified", "Status should be verified");
assert.strictEqual(validResult.sealPassed, true, "Seal should pass");
assert.strictEqual(validResult.barcodePassed, true, "Barcode should pass");
assert.strictEqual(validResult.weightPassed, true, "Weight should pass");
assert.strictEqual(validResult.photoPassed, true, "Photo should pass");
assert.ok(validResult.certificateId.startsWith("SS-INTAKE-2026-"), "Certificate ID format valid");

console.log("✅ 3. Valid intake checklist test PASSED.");

// 4. Test overweight checklist (> 25.0 kg)
const overweightChecklist = {
  sealIntact: true,
  barcodeSerial: "SS-KNP-BAR-8921",
  measuredWeightKg: 28.5, // > 25kg
  photoProofUrl: "data:image/svg+xml;charset=utf-8,test",
};

const overweightResult = engine.validateIntakeChecklist(overweightChecklist);
assert.strictEqual(overweightResult.isValid, false, "Overweight checklist should fail validation");
assert.strictEqual(overweightResult.weightPassed, false, "Weight check should fail");
assert.strictEqual(overweightResult.status, "flagged", "Status should be flagged for overweight");

console.log("✅ 4. Overweight checklist restriction test PASSED.");

// 5. Test broken seal checklist
const brokenSealChecklist = {
  sealIntact: false,
  barcodeSerial: "SS-KNP-BAR-8921",
  measuredWeightKg: 15.0,
  photoProofUrl: "data:image/svg+xml;charset=utf-8,test",
};

const brokenSealResult = engine.validateIntakeChecklist(brokenSealChecklist);
assert.strictEqual(brokenSealResult.isValid, false, "Broken seal checklist should fail validation");
assert.strictEqual(brokenSealResult.sealPassed, false, "Seal check should fail");

console.log("✅ 5. Broken seal checklist restriction test PASSED.");

// 6. Test createAndSaveVerification
const record = engine.createAndSaveVerification(validChecklist, "BK-TEST-101");
assert.ok(record.id.startsWith("VER-"), "Verification record ID format valid");
assert.strictEqual(record.measuredWeightKg, 18.5, "Measured weight retained");
assert.strictEqual(record.status, "verified", "Status verified");

console.log("✅ 6. Verification record creation test PASSED.");

// 7. Verify admin.tsx integration
const adminContent = fs.readFileSync(adminPath, "utf8");
assert.ok(
  adminContent.includes("HostStashVerificationModal"),
  "admin.tsx should import HostStashVerificationModal",
);
assert.ok(
  adminContent.includes("setIsHostVerificationOpen"),
  "admin.tsx should manage host verification state",
);
assert.ok(
  adminContent.includes("Stash Verification"),
  "admin.tsx should render Stash Verification button",
);

console.log("✅ 7. Admin dashboard integration verified.");

console.log("\n🎉 ALL 7 HOST STASH VERIFICATION CHECKS PASSED SUCCESSFULLY!");
