import fs from "fs";
import path from "path";
import { execSync } from "child_process";

console.log("=================================================");
console.log("TEST SUITE: TASK 139 DEVANAGARI TYPE TUNING FOR HOSTS");
console.log("=================================================\n");

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`✅ PASSED [${passed + 1}]: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
}

// 1. Check designTokens.ts for DEVANAGARI_HOST_TYPOGRAPHY_TOKENS and helper functions
const designTokensPath = path.resolve("src/lib/designTokens.ts");
const designTokensCode = fs.readFileSync(designTokensPath, "utf-8");

assert(
  designTokensCode.includes("DEVANAGARI_HOST_TYPOGRAPHY_TOKENS"),
  "designTokens.ts exports DEVANAGARI_HOST_TYPOGRAPHY_TOKENS"
);

assert(
  designTokensCode.includes("getDevanagariHostTypographyClasses"),
  "designTokens.ts exports getDevanagariHostTypographyClasses helper"
);

assert(
  designTokensCode.includes("getDevanagariHostStyles"),
  "designTokens.ts exports getDevanagariHostStyles helper"
);

assert(
  designTokensCode.includes("0.035em") && designTokensCode.includes("1.75"),
  "designTokens.ts specifies generous letter-spacing (0.035em) and expanded line-height (1.75)"
);

// 2. Check fontOptimization.ts for Devanagari fallback chain and fonts stylesheet
const fontOptPath = path.resolve("src/lib/fontOptimization.ts");
const fontOptCode = fs.readFileSync(fontOptPath, "utf-8");

assert(
  fontOptCode.includes("DEVANAGARI_FONT_FALLBACK_CHAIN"),
  "fontOptimization.ts exports DEVANAGARI_FONT_FALLBACK_CHAIN"
);

assert(
  fontOptCode.includes("Noto+Sans+Devanagari") && fontOptCode.includes("Tiro+Devanagari+Hindi"),
  "fontOptimization.ts preloads Noto Sans Devanagari & Tiro Devanagari Hindi fonts"
);

// 3. Check styles.css for Devanagari variables, utilities, and host overrides
const stylesCssPath = path.resolve("src/styles.css");
const stylesCssCode = fs.readFileSync(stylesCssPath, "utf-8");

assert(
  stylesCssCode.includes("--font-devanagari:"),
  "styles.css defines --font-devanagari custom property"
);

assert(
  stylesCssCode.includes("@utility devanagari-host-text") && stylesCssCode.includes("@utility devanagari-host-heading"),
  "styles.css defines @utility devanagari-host-text & devanagari-host-heading"
);

assert(
  stylesCssCode.includes(".senior-host-devanagari-active"),
  "styles.css defines .senior-host-devanagari-active class"
);

assert(
  stylesCssCode.includes('html[lang="hi"][data-persona="host"]'),
  "styles.css defines automatic CSS rules for Hindi Senior Host mode"
);

// 4. Check Typography.tsx and DevanagariHostText.tsx integration
const typographyPath = path.resolve("src/components/ui/Typography.tsx");
const typographyCode = fs.readFileSync(typographyPath, "utf-8");

assert(
  typographyCode.includes("usePersona") && typographyCode.includes("isHost"),
  "Typography.tsx integrates usePersona context and checks isHost"
);

const devanagariHostTextPath = path.resolve("src/components/ui/DevanagariHostText.tsx");
assert(
  fs.existsSync(devanagariHostTextPath),
  "src/components/ui/DevanagariHostText.tsx primitive exists"
);

const primitivesPath = path.resolve("src/components/ui/primitives.ts");
const primitivesCode = fs.readFileSync(primitivesPath, "utf-8");

assert(
  primitivesCode.includes("DevanagariHostText"),
  "src/components/ui/primitives.ts re-exports DevanagariHostText"
);

console.log("\n-------------------------------------------------");
console.log(`SUMMARY: ${passed}/${total} CHECKS PASSED FOR TASK 139!`);
console.log("=================================================\n");
