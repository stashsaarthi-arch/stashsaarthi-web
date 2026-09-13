/**
 * Verification Suite for Task 119: UI - Truncation & Multi-line Clamping / harden
 * Verifies design tokens, CSS utility rules, TruncatedText primitive exports,
 * Devanagari Hindi clamp safety, and component integrations.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

let totalChecks = 0;
let passedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

console.log("\n🧪 Running Verification Suite: Truncation & Multi-line Clamping (Task 119)\n");

// 1. Verify src/lib/designTokens.ts exports
const designTokensPath = path.join(rootDir, "src/lib/designTokens.ts");
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");

assert(
  designTokensContent.includes("TRUNCATION_TOKENS") &&
    designTokensContent.includes("LineClampTier") &&
    designTokensContent.includes("getTruncationClasses") &&
    designTokensContent.includes("getHindiTruncationClasses") &&
    designTokensContent.includes("getHindiTruncationSpec"),
  "src/lib/designTokens.ts defines TRUNCATION_TOKENS, LineClampTier, and truncation helper functions"
);

// 2. Verify src/styles.css @utility rules
const stylesPath = path.join(rootDir, "src/styles.css");
const stylesContent = fs.readFileSync(stylesPath, "utf-8");

assert(stylesContent.includes("@utility line-clamp-1"), "src/styles.css defines @utility line-clamp-1");
assert(stylesContent.includes("@utility line-clamp-2"), "src/styles.css defines @utility line-clamp-2");
assert(stylesContent.includes("@utility line-clamp-3"), "src/styles.css defines @utility line-clamp-3");
assert(stylesContent.includes("@utility line-clamp-none"), "src/styles.css defines @utility line-clamp-none");
assert(stylesContent.includes("@utility hi-clamp-safe"), "src/styles.css defines @utility hi-clamp-safe");
assert(stylesContent.includes("@utility clamp-with-tooltip"), "src/styles.css defines @utility clamp-with-tooltip");

// 3. Verify src/components/ui/TruncatedText.tsx
const truncatedTextPath = path.join(rootDir, "src/components/ui/TruncatedText.tsx");
assert(fs.existsSync(truncatedTextPath), "src/components/ui/TruncatedText.tsx primitive exists");

const truncatedTextContent = fs.readFileSync(truncatedTextPath, "utf-8");
assert(
  truncatedTextContent.includes("getTruncationClasses") &&
    truncatedTextContent.includes("getHindiTruncationClasses") &&
    truncatedTextContent.includes("title=") &&
    truncatedTextContent.includes("clamp-with-tooltip"),
  "TruncatedText component integrates truncation classes, Devanagari safety, and title tooltip fallback"
);

// 4. Verify src/components/ui/primitives.ts exports TruncatedText
const primitivesPath = path.join(rootDir, "src/components/ui/primitives.ts");
const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");

assert(
  primitivesContent.includes("TruncatedText") && primitivesContent.includes("TruncatedTextProps"),
  "src/components/ui/primitives.ts exports TruncatedText and TruncatedTextProps"
);

// 5. Verify src/components/ui/BentoGrid.tsx integration
const bentoGridPath = path.join(rootDir, "src/components/ui/BentoGrid.tsx");
const bentoGridContent = fs.readFileSync(bentoGridPath, "utf-8");

assert(
  bentoGridContent.includes("TruncatedText") &&
    bentoGridContent.includes("lines") &&
    bentoGridContent.includes("LineClampTier"),
  "src/components/ui/BentoGrid.tsx leverages TruncatedText and LineClampTier for BentoTitle & BentoDescription"
);

console.log(`\n📊 Test Summary: ${passedChecks}/${totalChecks} checks passed.\n`);

if (passedChecks !== totalChecks) {
  process.exit(1);
}
