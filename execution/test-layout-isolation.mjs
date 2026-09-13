import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("🔍 Running Layout Isolation Verification Suite (Task 120)...");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASSED: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
    failed++;
  }
}

// 1. Check designTokens.ts for LAYOUT_ISOLATION_TOKENS and helper function
const designTokensPath = path.join(rootDir, "src", "lib", "designTokens.ts");
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");

assert(
  designTokensContent.includes("LAYOUT_ISOLATION_TOKENS"),
  "src/lib/designTokens.ts exports LAYOUT_ISOLATION_TOKENS object"
);

assert(
  designTokensContent.includes("getLayoutIsolationClasses"),
  "src/lib/designTokens.ts exports getLayoutIsolationClasses helper function"
);

assert(
  designTokensContent.includes('layoutStyle: "contain: layout style"'),
  "LAYOUT_ISOLATION_TOKENS includes layoutStyle tier specification"
);

// 2. Check styles.css for layout isolation CSS utilities
const stylesCssPath = path.join(rootDir, "src", "styles.css");
const stylesCssContent = fs.readFileSync(stylesCssPath, "utf-8");

assert(
  stylesCssContent.includes("@utility layout-isolated"),
  "src/styles.css contains @utility layout-isolated rule"
);

assert(
  stylesCssContent.includes("contain: layout style"),
  "src/styles.css contains contain: layout style declaration"
);

assert(
  stylesCssContent.includes("isolation: isolate"),
  "src/styles.css contains isolation: isolate declaration"
);

assert(
  stylesCssContent.includes("@utility layout-isolated-strict"),
  "src/styles.css contains @utility layout-isolated-strict rule"
);

assert(
  stylesCssContent.includes("@utility layout-isolated-paint"),
  "src/styles.css contains @utility layout-isolated-paint rule"
);

// 3. Check SectionWrapper.tsx for layout isolation integration
const sectionWrapperPath = path.join(rootDir, "src", "components", "ui", "SectionWrapper.tsx");
const sectionWrapperContent = fs.readFileSync(sectionWrapperPath, "utf-8");

assert(
  sectionWrapperContent.includes("isIsolated"),
  "SectionWrapper.tsx supports isIsolated prop"
);

assert(
  sectionWrapperContent.includes("getLayoutIsolationClasses"),
  "SectionWrapper.tsx integrates getLayoutIsolationClasses helper"
);

// 4. Check Hero.tsx and SolutionsHub.tsx for layout-isolated integration
const heroPath = path.join(rootDir, "src", "components", "stash", "Hero.tsx");
const heroContent = fs.readFileSync(heroPath, "utf-8");

assert(
  heroContent.includes("layout-isolated") || heroContent.includes("section-isolated"),
  "Hero.tsx applies layout isolation utility class"
);

const solutionsHubPath = path.join(rootDir, "src", "components", "stash", "SolutionsHub.tsx");
const solutionsHubContent = fs.readFileSync(solutionsHubPath, "utf-8");

assert(
  solutionsHubContent.includes("layout-isolated") || solutionsHubContent.includes("section-isolated"),
  "SolutionsHub.tsx applies layout isolation utility class"
);

console.log("\n==================================================");
console.log(`Layout Isolation Test Results: ${passed} Passed, ${failed} Failed.`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("✨ ALL 11 LAYOUT ISOLATION CHECKS PASSED SUCCESSFULLY!");
  process.exit(0);
}
