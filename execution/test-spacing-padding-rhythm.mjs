import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("🔍 Verifying Task 116: Spacing & Padding Rhythm Architecture...\n");

let passed = 0;
let failed = 0;

function assert(condition, description) {
  if (condition) {
    console.log(`  ✅ PASSED: ${description}`);
    passed++;
  } else {
    console.error(`  ❌ FAILED: ${description}`);
    failed++;
  }
}

// 1. Verify designTokens.ts contains VERTICAL_RHYTHM_TOKENS and CONTAINER_WIDTH_TOKENS
const designTokensPath = path.join(rootDir, "src", "lib", "designTokens.ts");
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");

assert(
  designTokensContent.includes("export const VERTICAL_RHYTHM_TOKENS ="),
  "src/lib/designTokens.ts exports VERTICAL_RHYTHM_TOKENS object"
);

assert(
  designTokensContent.includes("export const CONTAINER_WIDTH_TOKENS ="),
  "src/lib/designTokens.ts exports CONTAINER_WIDTH_TOKENS object"
);

assert(
  designTokensContent.includes("export const CONTAINER_GUTTER_TOKENS ="),
  "src/lib/designTokens.ts exports CONTAINER_GUTTER_TOKENS object"
);

assert(
  designTokensContent.includes("export function getVerticalRhythmClasses"),
  "src/lib/designTokens.ts exports getVerticalRhythmClasses helper function"
);

assert(
  designTokensContent.includes("export function getContainerWidthClasses"),
  "src/lib/designTokens.ts exports getContainerWidthClasses helper function"
);

assert(
  designTokensContent.includes("export function getSectionContainerClasses"),
  "src/lib/designTokens.ts exports getSectionContainerClasses helper function"
);

// 2. Verify styles.css contains vertical rhythm & container max width utilities
const stylesPath = path.join(rootDir, "src", "styles.css");
const stylesContent = fs.readFileSync(stylesPath, "utf-8");

assert(
  stylesContent.includes("@utility section-py-compact"),
  "src/styles.css defines @utility section-py-compact"
);

assert(
  stylesContent.includes("@utility section-py-standard"),
  "src/styles.css defines @utility section-py-standard"
);

assert(
  stylesContent.includes("@utility section-py-relaxed"),
  "src/styles.css defines @utility section-py-relaxed"
);

assert(
  stylesContent.includes("@utility section-py-hero"),
  "src/styles.css defines @utility section-py-hero"
);

assert(
  stylesContent.includes("@utility container-max-6xl"),
  "src/styles.css defines @utility container-max-6xl"
);

assert(
  stylesContent.includes("@utility container-max-7xl"),
  "src/styles.css defines @utility container-max-7xl"
);

assert(
  stylesContent.includes("@utility section-container-gutter"),
  "src/styles.css defines @utility section-container-gutter"
);

// 3. Verify SectionWrapper component and primitive re-exports
const sectionWrapperPath = path.join(rootDir, "src", "components", "ui", "SectionWrapper.tsx");
assert(
  fs.existsSync(sectionWrapperPath),
  "src/components/ui/SectionWrapper.tsx exists"
);

const primitivesPath = path.join(rootDir, "src", "components", "ui", "primitives.ts");
const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");

assert(
  primitivesContent.includes("SectionWrapper") && primitivesContent.includes("SectionContainer"),
  "src/components/ui/primitives.ts re-exports SectionWrapper and SectionContainer"
);

// 4. Verify Ecosystem.tsx uses SectionWrapper
const ecosystemPath = path.join(rootDir, "src", "components", "stash", "Ecosystem.tsx");
const ecosystemContent = fs.readFileSync(ecosystemPath, "utf-8");

assert(
  ecosystemContent.includes("SectionWrapper"),
  "src/components/stash/Ecosystem.tsx integrates SectionWrapper primitive"
);

console.log(`\n📊 Summary: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 Task 116 Spacing & Padding Rhythm Verification Passed Successfully!");
}
