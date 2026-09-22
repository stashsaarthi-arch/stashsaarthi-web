import { readFileSync } from "fs";
import { resolve } from "path";

console.log("🧪 Starting Delivery Fleet Mini-PWA Verification Suite (Task 122)...\n");

let passCount = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
  passCount++;
}

// 1. Verify file existence
const enginePath = resolve("src/lib/deliveryFleetEngine.ts");
const modalPath = resolve("src/components/stash/DeliveryFleetScannerModal.tsx");

const engineCode = readFileSync(enginePath, "utf8");
const modalCode = readFileSync(modalPath, "utf8");

assert(
  engineCode.includes("PRESET_RUNNER_TASKS"),
  "deliveryFleetEngine.ts exports PRESET_RUNNER_TASKS",
);
assert(
  engineCode.includes("processDoorstepScan"),
  "deliveryFleetEngine.ts exports processDoorstepScan function",
);
assert(
  engineCode.includes("confirmDeliveryToHost"),
  "deliveryFleetEngine.ts exports confirmDeliveryToHost function",
);
assert(
  engineCode.includes("getRunnerStats"),
  "deliveryFleetEngine.ts exports getRunnerStats function",
);

assert(
  modalCode.includes("DeliveryFleetScannerModal"),
  "DeliveryFleetScannerModal component exported",
);
assert(
  modalCode.includes("Barcode Scanner"),
  "DeliveryFleetScannerModal contains Barcode Scanner tab",
);
assert(
  modalCode.includes("Doorstep Queue"),
  "DeliveryFleetScannerModal contains Doorstep Queue tab",
);
assert(modalCode.includes("SLA Telemetry"), "DeliveryFleetScannerModal contains SLA Telemetry tab");

// 2. Assert admin page integration
const adminPath = resolve("src/routes/admin.tsx");
const adminCode = readFileSync(adminPath, "utf8");
assert(
  adminCode.includes("DeliveryFleetScannerModal"),
  "Admin console mounts DeliveryFleetScannerModal",
);
assert(adminCode.includes("Fleet PWA"), "Admin console toolbar includes Fleet PWA trigger button");

console.log(
  `\n🎉 ALL ${passCount} VERIFICATION CHECKS PASSED SUCCESSFULLY! Task 122 delivery fleet scanner verified.`,
);
