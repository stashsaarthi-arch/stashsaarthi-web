import fs from "fs";
import path from "path";

const targetFile = path.join(process.cwd(), "src/components/stash/MyBookingsDashboard.tsx");

if (!fs.existsSync(targetFile)) {
  console.error(`❌ Target file not found: ${targetFile}`);
  process.exit(1);
}

const content = fs.readFileSync(targetFile, "utf-8");

const requiredFilters = [
  { key: "all", label: "All Services" },
  { key: "stash", label: "Luggage Stash" },
  { key: "kitchen", label: "Kitchen Subscriptions" },
  { key: "spaces", label: "Spaces Lease" },
  { key: "connect", label: "Connect Sessions" },
];

console.log("🔍 Verifying Task 106: Vertical-Wise Booking Filters in MyBookingsDashboard.tsx...");

let passed = true;

if (!content.includes("type VerticalFilter =")) {
  console.error("❌ Missing type definition for VerticalFilter");
  passed = false;
} else {
  console.log("✅ Verified type definition: VerticalFilter");
}

if (!content.includes("const VERTICAL_FILTERS")) {
  console.error("❌ Missing VERTICAL_FILTERS array");
  passed = false;
} else {
  console.log("✅ Verified VERTICAL_FILTERS configuration array");
}

for (const rf of requiredFilters) {
  if (content.includes(`key: "${rf.key}"`) && content.includes(rf.label)) {
    console.log(`✅ Verified vertical filter pill: [${rf.label}] (${rf.key})`);
  } else {
    console.error(`❌ Missing vertical filter pill for: [${rf.label}] (${rf.key})`);
    passed = false;
  }
}

if (passed) {
  console.log("\n🎉 ALL CHECKS PASSED: Task 106 Vertical Booking Filters verified successfully!");
  process.exit(0);
} else {
  console.error("\n❌ Task 106 verification failed!");
  process.exit(1);
}
