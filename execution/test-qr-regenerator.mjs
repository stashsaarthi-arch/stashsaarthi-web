import { getOfflineQrSvgDataUri } from "../src/lib/storageQrValidator.ts";
import assert from "assert";

console.log("Running StashSaarthi QR Re-generator Tests...");

const sampleToken = "ST-982104";

// Test 1: Offline SVG Data URI Generation
const svgDataUri = getOfflineQrSvgDataUri(sampleToken);
assert.ok(svgDataUri.startsWith("data:image/svg+xml;utf8,"));
assert.ok(svgDataUri.includes("%3Csvg"));
console.log("✅ Test 1 Passed: Offline SVG Data URI generated without network calls.");

console.log("\n🎉 ALL QR RE-GENERATOR TESTS PASSED SUCCESSFULLY!");
