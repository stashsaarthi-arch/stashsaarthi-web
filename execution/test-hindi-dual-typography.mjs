import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("=================================================");
console.log("  TASK 113: HINDI & ENGLISH DUAL TYPOGRAPHY TEST ");
console.log("=================================================\n");

let passedCount = 0;
let totalCount = 0;

function assert(condition, description) {
  totalCount++;
  if (condition) {
    console.log(` ✅ PASSED: ${description}`);
    passedCount++;
  } else {
    console.error(` ❌ FAILED: ${description}`);
  }
}

// 1. Verify CSS dual typography rules in src/styles.css
const cssPath = path.join(rootDir, "src", "styles.css");
const cssContent = fs.readFileSync(cssPath, "utf-8");

assert(cssContent.includes('--font-devanagari: "Rozha One", "Mukta"'), "styles.css defines --font-devanagari font stack");
assert(cssContent.includes(':root[data-lang="hi"]'), "styles.css includes :root[data-lang=\"hi\"] selector for language switching");
assert(cssContent.includes(':lang(hi)'), "styles.css includes :lang(hi) rule to reset negative letter spacing");
assert(cssContent.includes('.hi-heading-safe'), "styles.css defines .hi-heading-safe utility for Devanagari headings");
assert(cssContent.includes('.hi-text-safe'), "styles.css defines .hi-text-safe utility for Devanagari body text");
assert(cssContent.includes('@utility devanagari-typeset'), "styles.css registers @utility devanagari-typeset");

// 2. Verify LanguageContext.tsx data-lang attribute sync
const langCtxPath = path.join(rootDir, "src", "context", "LanguageContext.tsx");
const langCtxContent = fs.readFileSync(langCtxPath, "utf-8");

assert(langCtxContent.includes('document.documentElement.setAttribute("data-lang"'), "LanguageContext.tsx syncs data-lang attribute on html");
assert(langCtxContent.includes('document.body.setAttribute("data-lang"'), "LanguageContext.tsx syncs data-lang attribute on body");

// 3. Verify designTokens.ts helpers and specs
const tokensPath = path.join(rootDir, "src", "lib", "designTokens.ts");
const tokensContent = fs.readFileSync(tokensPath, "utf-8");

assert(tokensContent.includes("DEVANAGARI_TYPOGRAPHY_TOKENS"), "designTokens.ts exports DEVANAGARI_TYPOGRAPHY_TOKENS");
assert(tokensContent.includes("getCalibratedTypographySpec"), "designTokens.ts exports getCalibratedTypographySpec helper");
assert(tokensContent.includes("getDualTypographyStyles"), "designTokens.ts exports getDualTypographyStyles helper");
assert(tokensContent.includes("getHindiTypographyClasses"), "designTokens.ts exports getHindiTypographyClasses helper");

// 4. Verify Typography.tsx primitive calibration
const typoPath = path.join(rootDir, "src", "components", "ui", "Typography.tsx");
const typoContent = fs.readFileSync(typoPath, "utf-8");

assert(typoContent.includes("getHindiTypographyClasses"), "Typography.tsx imports and uses getHindiTypographyClasses");
assert(typoContent.includes("data-lang={activeLang}"), "Typography.tsx sets data-lang attribute on element");

console.log("\n-------------------------------------------------");
console.log(` RESULTS: ${passedCount}/${totalCount} CHECKS PASSED`);
console.log("-------------------------------------------------\n");

if (passedCount !== totalCount) {
  process.exit(1);
}
