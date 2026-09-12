import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("🔍 Running Font Loading & FOUT / Zero CLS Optimization Verification (Task 112)...\n");

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

// 1. Verify Google Fonts URL and preconnect links in __root.tsx
const rootPath = path.join(rootDir, "src", "routes", "__root.tsx");
const rootContent = fs.readFileSync(rootPath, "utf-8");

assert(rootContent.includes("fonts.googleapis.com"), "Google Fonts API link present in __root.tsx");
assert(rootContent.includes("fonts.gstatic.com"), "Google Fonts gstatic preconnect present in __root.tsx");
assert(rootContent.includes("display=swap"), "font-display: swap parameter included in Google Fonts stylesheet URL");
assert(rootContent.includes("initFontOptimization"), "initFontOptimization imported and invoked in __root.tsx");

// 2. Verify @font-face fallback metric overrides in styles.css
const cssPath = path.join(rootDir, "src", "styles.css");
const cssContent = fs.readFileSync(cssPath, "utf-8");

assert(cssContent.includes('font-family: "Plus Jakarta Sans Fallback"'), "Plus Jakarta Sans Fallback @font-face defined in styles.css");
assert(cssContent.includes('font-family: "Inter Fallback"'), "Inter Fallback @font-face defined in styles.css");
assert(cssContent.includes("ascent-override"), "ascent-override specified for zero CLS font fallback");
assert(cssContent.includes("descent-override"), "descent-override specified for zero CLS font fallback");
assert(cssContent.includes("size-adjust"), "size-adjust specified for zero CLS font fallback");

// 3. Verify fontOptimization.ts module exports
const optPath = path.join(rootDir, "src", "lib", "fontOptimization.ts");
const optContent = fs.readFileSync(optPath, "utf-8");

assert(optContent.includes("export const FONT_SPECS"), "FONT_SPECS design token dictionary exported");
assert(optContent.includes("export function getFontFamilyWithFallbacks"), "getFontFamilyWithFallbacks function exported");
assert(optContent.includes("export function initFontOptimization"), "initFontOptimization function exported");
assert(optContent.includes("export function injectFontMetricOverrides"), "injectFontMetricOverrides function exported");
assert(optContent.includes("export function getFontLoadingStats"), "getFontLoadingStats function exported");

console.log(`\n📊 Verification Summary: ${passed}/${total} checks passed.`);
if (passed === total) {
  console.log("🎉 ALL FONT LOADING & FOUT / ZERO CLS CHECKS PASSED SUCCESSFULLY!");
} else {
  console.error("❌ SOME CHECKS FAILED!");
  process.exit(1);
}
