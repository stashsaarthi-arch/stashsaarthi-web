import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

console.log("==========================================================");
console.log("🧪 TESTING TASK 141: SAARTHI STASH CARD 2.0 OVERHAUL");
console.log("==========================================================");

const projectRoot = process.cwd();

// 1. Verify Design Tokens
console.log("\n[1/5] Checking designTokens.ts for SAARTHI_STASH_CARD_TOKENS...");
const tokensPath = path.join(projectRoot, "src/lib/designTokens.ts");
const tokensContent = fs.readFileSync(tokensPath, "utf8");

if (!tokensContent.includes("SAARTHI_STASH_CARD_TOKENS")) {
  console.error("❌ FAILED: SAARTHI_STASH_CARD_TOKENS missing from designTokens.ts");
  process.exit(1);
}
if (!tokensContent.includes("getSaarthiStashCardTokens")) {
  console.error("❌ FAILED: getSaarthiStashCardTokens missing from designTokens.ts");
  process.exit(1);
}
console.log("  ✅ SAARTHI_STASH_CARD_TOKENS and helper function verified in designTokens.ts");

// 2. Verify CSS Utilities
console.log("\n[2/5] Checking styles.css for CSS utility rules...");
const cssPath = path.join(projectRoot, "src/styles.css");
const cssContent = fs.readFileSync(cssPath, "utf8");

const requiredCssRules = [
  "laser-seal-beam-sweep",
  "laser-seal-scanner",
  "stash-card-3d-stage",
  "stash-price-pill-glow",
];

for (const rule of requiredCssRules) {
  if (!cssContent.includes(rule)) {
    console.error(`❌ FAILED: CSS rule '${rule}' missing from styles.css`);
    process.exit(1);
  }
}
console.log("  ✅ All CSS utility rules for Saarthi Stash Card 2.0 verified in styles.css");

// 3. Verify Component Creation
console.log("\n[3/5] Checking SaarthiStashCard2.tsx component...");
const componentPath = path.join(projectRoot, "src/components/ui/SaarthiStashCard2.tsx");
if (!fs.existsSync(componentPath)) {
  console.error("❌ FAILED: SaarthiStashCard2.tsx does not exist");
  process.exit(1);
}

const componentContent = fs.readFileSync(componentPath, "utf8");
const requiredTestIds = [
  "saarthi-stash-card-2",
  "stash-pricing-pill",
  "3d-bag-depth-preview",
  "tamper-proof-seal-indicator",
  "stash-booking-cta",
];

for (const testId of requiredTestIds) {
  if (!componentContent.includes(testId)) {
    console.error(`❌ FAILED: Test ID '${testId}' missing from SaarthiStashCard2.tsx`);
    process.exit(1);
  }
}
console.log("  ✅ SaarthiStashCard2.tsx component structure and data-testids verified");

// 4. Verify Primitive Re-export & Ecosystem Integration
console.log("\n[4/5] Checking primitives.ts and Ecosystem.tsx integration...");
const primitivesPath = path.join(projectRoot, "src/components/ui/primitives.ts");
const primitivesContent = fs.readFileSync(primitivesPath, "utf8");
if (!primitivesContent.includes("SaarthiStashCard2")) {
  console.error("❌ FAILED: SaarthiStashCard2 not exported in primitives.ts");
  process.exit(1);
}

const ecosystemPath = path.join(projectRoot, "src/components/stash/Ecosystem.tsx");
const ecosystemContent = fs.readFileSync(ecosystemPath, "utf8");
if (!ecosystemContent.includes("SaarthiStashCard2")) {
  console.error("❌ FAILED: SaarthiStashCard2 not integrated into Ecosystem.tsx");
  process.exit(1);
}
console.log("  ✅ SaarthiStashCard2 primitive re-export and Ecosystem integration verified");

// 5. Build Verification
console.log("\n[5/5] Running TypeScript compilation check & Vite build...");
try {
  execSync("npm run build", { stdio: "inherit" });
  console.log("  ✅ Production build compiled cleanly with zero errors!");
} catch (error) {
  console.error("❌ FAILED: npm run build failed");
  process.exit(1);
}

console.log("\n==========================================================");
console.log("🎉 ALL 5/5 SAARTHI STASH CARD 2.0 CHECKS PASSED SUCCESSFULLY!");
console.log("==========================================================");
