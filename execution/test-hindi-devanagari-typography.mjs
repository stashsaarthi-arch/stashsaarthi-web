import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("🔍 Running Hindi & English Dual Typography Calibration Verification (Task 113)...\n");

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✅ PASSED: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Verify CSS rules in styles.css for Devanagari Hindi font & line-height calibration
const cssPath = path.join(rootDir, "src", "styles.css");
const cssContent = fs.readFileSync(cssPath, "utf-8");

assert(cssContent.includes("--font-devanagari:"), "--font-devanagari CSS variable defined in styles.css");
assert(cssContent.includes('"Rozha One"'), "Rozha One font included in Devanagari font stack");
assert(cssContent.includes('"Mukta"'), "Mukta font included in Devanagari font stack");
assert(cssContent.includes('font-family: "Mukta Fallback"'), "Mukta Fallback @font-face defined in styles.css");
assert(cssContent.includes('html[lang="hi"]'), 'html[lang="hi"] rules defined for Hindi language');
assert(cssContent.includes(":lang(hi)"), ":lang(hi) selector used for Devanagari language targets");
assert(cssContent.includes(".lang-hi"), ".lang-hi utility selector defined");
assert(cssContent.includes("line-height: var(--hindi-line-height-h1, 1.35)"), "Calibrated line-height (1.35) specified for Hindi h1");
assert(cssContent.includes("line-height: var(--hindi-line-height-body, 1.7)"), "Calibrated line-height (1.7) specified for Hindi body copy");
assert(cssContent.includes("text-devanagari-calibrated"), "@utility text-devanagari-calibrated defined in styles.css");

// 2. Verify designTokens.ts exports for Devanagari Hindi typography
const tokensPath = path.join(rootDir, "src", "lib", "designTokens.ts");
const tokensContent = fs.readFileSync(tokensPath, "utf-8");

assert(tokensContent.includes("export const DEVANAGARI_TYPOGRAPHY_TOKENS"), "DEVANAGARI_TYPOGRAPHY_TOKENS exported from designTokens.ts");
assert(tokensContent.includes("export function getCalibratedTypographySpec"), "getCalibratedTypographySpec helper function exported");
assert(tokensContent.includes("maxFontWeight: 700"), "Font weight calibration capping defined for Devanagari headings");

// 3. Verify fontOptimization.ts updates
const optPath = path.join(rootDir, "src", "lib", "fontOptimization.ts");
const optContent = fs.readFileSync(optPath, "utf-8");

assert(optContent.includes("devanagari:"), "devanagari font spec added to FONT_SPECS");
assert(optContent.includes("Mukta"), "Mukta font included in FONT_SPECS and Google Fonts URL");
assert(optContent.includes("Rozha+One"), "Rozha One font included in Google Fonts stylesheet URL");
assert(optContent.includes("Mukta Fallback"), "Mukta Fallback metric override defined in fontOptimization.ts");

// 4. Verify Typography.tsx primitive component updates
const typoPath = path.join(rootDir, "src", "components", "ui", "Typography.tsx");
const typoContent = fs.readFileSync(typoPath, "utf-8");

assert(typoContent.includes("getCalibratedTypographySpec"), "Typography component uses getCalibratedTypographySpec");
assert(typoContent.includes("useLanguage"), "Typography component integrated with useLanguage context");
assert(typoContent.includes("font-devanagari"), "Typography component applies font-devanagari class for Hindi");

console.log(`\n📊 Verification Summary: ${passed}/${total} checks passed.`);
if (passed === total) {
  console.log("🎉 ALL HINDI & ENGLISH DUAL TYPOGRAPHY CALIBRATION CHECKS PASSED!");
} else {
  console.error("❌ SOME CHECKS FAILED!");
  process.exit(1);
}
