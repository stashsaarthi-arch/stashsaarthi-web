import { readFileSync } from "fs";
import { resolve } from "path";
import {
  MICRO_COPY_SPECS,
  getMicroCopyAlignmentClass,
  formatPriceMicroCopy,
  auditMicroCopyElements,
} from "../src/lib/microCopyAlignment.ts";

console.log("==========================================================================");
console.log("🧪 VERIFYING TASK 118: MICRO-COPY BASELINE ALIGNMENT ENGINE");
console.log("==========================================================================\n");

let passedChecks = 0;
let totalChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    console.log(`  ✅ PASSED: ${message}`);
    passedChecks++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Test MICRO_COPY_SPECS exports
assert(MICRO_COPY_SPECS.badge !== undefined, "MICRO_COPY_SPECS.badge spec is defined");
assert(MICRO_COPY_SPECS.priceTag !== undefined, "MICRO_COPY_SPECS.priceTag spec is defined");
assert(MICRO_COPY_SPECS.caption !== undefined, "MICRO_COPY_SPECS.caption spec is defined");
assert(MICRO_COPY_SPECS.iconLabel !== undefined, "MICRO_COPY_SPECS.iconLabel spec is defined");
assert(MICRO_COPY_SPECS.statusDot !== undefined, "MICRO_COPY_SPECS.statusDot spec is defined");

// 2. Test helper functions
const badgeClass = getMicroCopyAlignmentClass("badge");
assert(badgeClass.includes("badge-align-baseline"), "getMicroCopyAlignmentClass('badge') returns badge-align-baseline");

const priceData = formatPriceMicroCopy(300, "₹", "/mo");
assert(priceData.formatted === "₹300/mo", "formatPriceMicroCopy returns correctly formatted price string");
assert(priceData.alignmentClass.includes("tabular-numeric-tag"), "formatPriceMicroCopy includes tabular-numeric-tag class");

const auditResult = auditMicroCopyElements();
assert(auditResult.valid === true && auditResult.specsCount === 5, "auditMicroCopyElements returns valid audit result");

// 3. Test styles.css definitions
const stylesContent = readFileSync(resolve("src/styles.css"), "utf-8");
assert(stylesContent.includes("@utility micro-copy-baseline"), "styles.css contains @utility micro-copy-baseline");
assert(stylesContent.includes("@utility badge-align-baseline"), "styles.css contains @utility badge-align-baseline");
assert(stylesContent.includes("@utility price-tag-alignment"), "styles.css contains @utility price-tag-alignment");
assert(stylesContent.includes("@utility caption-grid-alignment"), "styles.css contains @utility caption-grid-alignment");
assert(stylesContent.includes("@utility tabular-numeric-tag"), "styles.css contains @utility tabular-numeric-tag");

// 4. Test component file updates
const pillBadgeContent = readFileSync(resolve("src/components/ui/PillBadge.tsx"), "utf-8");
assert(pillBadgeContent.includes("badge-align-baseline"), "PillBadge.tsx incorporates badge-align-baseline utility");

const chipContent = readFileSync(resolve("src/components/ui/Chip.tsx"), "utf-8");
assert(chipContent.includes("badge-align-baseline"), "Chip.tsx incorporates badge-align-baseline utility");

const badgeContent = readFileSync(resolve("src/components/ui/badge.tsx"), "utf-8");
assert(badgeContent.includes("badge-align-baseline"), "badge.tsx incorporates badge-align-baseline utility");

console.log("\n--------------------------------------------------------------------------");
console.log(`Results: ${passedChecks}/${totalChecks} checks passed.`);
if (passedChecks === totalChecks) {
  console.log("🎉 ALL MICRO-COPY BASELINE GRID ALIGNMENT CHECKS PASSED!");
} else {
  console.error("⚠️ SOME CHECKS FAILED!");
}
