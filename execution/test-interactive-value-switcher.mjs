import fs from "fs";
import path from "path";
import { execSync } from "child_process";

console.log("🚀 STARTING INTERACTIVE VALUE SWITCHER VERIFICATION SUITE...\n");

const rootDir = process.cwd();
const switcherPath = path.join(rootDir, "src", "components", "stash", "InteractiveValueSwitcher.tsx");
const heroPath = path.join(rootDir, "src", "components", "stash", "Hero.tsx");

let passedChecks = 0;
const totalChecks = 5;

// Check 1: InteractiveValueSwitcher.tsx exists
if (fs.existsSync(switcherPath)) {
  console.log("✅ CHECK 1/5 PASSED: InteractiveValueSwitcher.tsx exists.");
  passedChecks++;
} else {
  console.error("❌ CHECK 1/5 FAILED: InteractiveValueSwitcher.tsx missing!");
}

// Check 2: Verify copy & pricing formulas in InteractiveValueSwitcher.tsx
const switcherContent = fs.readFileSync(switcherPath, "utf-8");
if (
  (switcherContent.includes("8,000") || switcherContent.includes("dead_rent")) &&
  switcherContent.includes("₹300") &&
  switcherContent.includes("Saarthi Stash")
) {
  console.log("✅ CHECK 2/5 PASSED: Interactive value contrast copy & ₹300/mo rate verified.");
  passedChecks++;
} else {
  console.error("❌ CHECK 2/5 FAILED: Missing value contrast copy or ₹300 rate!");
}

// Check 3: Verify Web Audio haptics integration
if (switcherContent.includes("playPop")) {
  console.log("✅ CHECK 3/5 PASSED: Web Audio API micro-haptics (playPop) verified.");
  passedChecks++;
} else {
  console.error("❌ CHECK 3/5 FAILED: Missing playPop audio haptic calls!");
}

// Check 4: Verify Hero.tsx integration
const heroContent = fs.readFileSync(heroPath, "utf-8");
if (
  heroContent.includes("InteractiveValueSwitcher") &&
  heroContent.includes("<InteractiveValueSwitcher")
) {
  console.log("✅ CHECK 4/5 PASSED: Hero.tsx imports and renders InteractiveValueSwitcher.");
  passedChecks++;
} else {
  console.error("❌ CHECK 4/5 FAILED: Hero.tsx integration missing!");
}

// Check 5: Run npm run build
console.log("\n📦 Running production build validation...");
try {
  execSync("npm run build", { stdio: "pipe" });
  console.log("✅ CHECK 5/5 PASSED: npm run build completed with ZERO errors!");
  passedChecks++;
} catch (err) {
  console.error("❌ CHECK 5/5 FAILED: npm run build encountered errors:", err.message);
}

console.log(`\n----------------------------------------`);
console.log(`SUMMARY: ${passedChecks}/${totalChecks} CHECKS PASSED.`);
if (passedChecks === totalChecks) {
  console.log("🎉 INTERACTIVE VALUE SWITCHER TASK 123 VERIFICATION COMPLETED SUCCESSFULLY!");
} else {
  console.error("💥 VERIFICATION FAILED! Please fix the errors above.");
  process.exit(1);
}
