import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";

const rootDir = process.cwd();
const stylesCssPath = path.join(rootDir, "src", "styles.css");
const designTokensPath = path.join(rootDir, "src", "lib", "designTokens.ts");
const typographyComponentPath = path.join(rootDir, "src", "components", "ui", "Typography.tsx");

console.log("🔍 Running Fluid Typography Scale Test Harness...");

// 1. Check styles.css for clamp variables and utility classes
const stylesContent = fs.readFileSync(stylesCssPath, "utf-8");

assert.ok(
  stylesContent.includes("--text-fluid-h1: clamp(1.5rem, 4vw, 3rem);"),
  "❌ styles.css missing exact clamp scale for --text-fluid-h1"
);

const requiredVariables = [
  "--text-fluid-display",
  "--text-fluid-h1",
  "--text-fluid-h2",
  "--text-fluid-h3",
  "--text-fluid-h4",
  "--text-fluid-body",
  "--text-fluid-caption",
  "--text-fluid-overline",
];

for (const variable of requiredVariables) {
  assert.ok(stylesContent.includes(variable), `❌ styles.css missing variable: ${variable}`);
}

const requiredUtilities = [
  "@utility text-fluid-display",
  "@utility text-fluid-h1",
  "@utility text-fluid-h2",
  "@utility text-fluid-h3",
  "@utility text-fluid-h4",
  "@utility text-fluid-body",
  "@utility text-fluid-caption",
  "@utility text-fluid-overline",
];

for (const utility of requiredUtilities) {
  assert.ok(stylesContent.includes(utility), `❌ styles.css missing utility: ${utility}`);
}

// 2. Check designTokens.ts for FLUID_TYPOGRAPHY_TOKENS and helper function
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");

assert.ok(
  designTokensContent.includes("FLUID_TYPOGRAPHY_TOKENS"),
  "❌ designTokens.ts missing FLUID_TYPOGRAPHY_TOKENS"
);
assert.ok(
  designTokensContent.includes('fontSize: "clamp(1.5rem, 4vw, 3rem)"'),
  "❌ designTokens.ts missing clamp for h1 fontSize"
);
assert.ok(
  designTokensContent.includes("getFluidTypographySpec"),
  "❌ designTokens.ts missing getFluidTypographySpec helper"
);

// 3. Check Typography.tsx primitive
const typographyContent = fs.readFileSync(typographyComponentPath, "utf-8");

assert.ok(
  typographyContent.includes("FluidTypographyLevel"),
  "❌ Typography.tsx missing FluidTypographyLevel import"
);
assert.ok(
  typographyContent.includes("text-fluid-h1"),
  "❌ Typography.tsx missing text-fluid-h1 utility mapping"
);

console.log("✅ ALL FLUID TYPOGRAPHY SCALE CHECKS PASSED SUCCESSFULLY!");
