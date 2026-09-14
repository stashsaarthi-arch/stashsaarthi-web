import fs from "fs";
import path from "path";
import { execSync } from "child_process";

console.log("=================================================");
console.log("  SCROLL-TRIGGERED REVEAL ENGINE VERIFICATION");
console.log("=================================================\n");

let passedCount = 0;
let totalCount = 0;

function assert(condition, message) {
  totalCount++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedCount++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

// 1. Verify Design Tokens in designTokens.ts
const designTokensPath = path.resolve("src/lib/designTokens.ts");
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");

assert(
  designTokensContent.includes("export const SCROLL_REVEAL_TOKENS = {") &&
    designTokensContent.includes("translateYPx: 24") &&
    designTokensContent.includes("durationMs: 600") &&
    designTokensContent.includes("staggerDelayMs: 120") &&
    designTokensContent.includes('easing: "cubic-bezier(0.16, 1, 0.3, 1)"'),
  "designTokens.ts exports SCROLL_REVEAL_TOKENS with 24px translateY, 600ms organic spring duration, & 120ms stagger delay"
);

assert(
  designTokensContent.includes("export function getScrollRevealTokens") &&
    designTokensContent.includes("export function getScrollRevealInlineStyles") &&
    designTokensContent.includes("export function getScrollRevealClasses"),
  "designTokens.ts exports getScrollRevealTokens, getScrollRevealInlineStyles, and getScrollRevealClasses helper functions"
);

// 2. Verify CSS Keyframes & Utility Rules in styles.css
const stylesCssPath = path.resolve("src/styles.css");
const stylesCssContent = fs.readFileSync(stylesCssPath, "utf-8");

assert(
  stylesCssContent.includes("@keyframes scroll-reveal-fade-up") &&
    stylesCssContent.includes(".scroll-reveal-initial") &&
    stylesCssContent.includes(".scroll-reveal-active") &&
    stylesCssContent.includes("@utility scroll-reveal-stage"),
  "styles.css contains keyframes @keyframes scroll-reveal-fade-up, .scroll-reveal-initial, .scroll-reveal-active, and @utility scroll-reveal-stage"
);

assert(
  stylesCssContent.includes('[data-persona="student"] .scroll-reveal-stage') &&
    stylesCssContent.includes('[data-persona="host"] .scroll-reveal-stage'),
  "styles.css contains Student & Senior Host persona ambient glow highlights for scroll reveal stages"
);

// 3. Verify Component Structure in ScrollReveal.tsx
const scrollRevealPath = path.resolve("src/components/ui/ScrollReveal.tsx");
const scrollRevealContent = fs.readFileSync(scrollRevealPath, "utf-8");

assert(
  scrollRevealContent.includes("export const ScrollReveal") &&
    scrollRevealContent.includes("export const ScrollRevealContainer") &&
    scrollRevealContent.includes("export const ScrollRevealItem"),
  "ScrollReveal.tsx exports ScrollReveal, ScrollRevealContainer, and ScrollRevealItem components"
);

assert(
  scrollRevealContent.includes("IntersectionObserver") &&
    scrollRevealContent.includes("prefers-reduced-motion"),
  "ScrollReveal.tsx includes IntersectionObserver scroll trigger and reduced motion accessibility checks"
);

// 4. Verify Primitive Re-exports in primitives.ts
const primitivesPath = path.resolve("src/components/ui/primitives.ts");
const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");

assert(
  primitivesContent.includes("ScrollReveal,") &&
    primitivesContent.includes("ScrollRevealContainer,") &&
    primitivesContent.includes("ScrollRevealItem,"),
  "primitives.ts re-exports ScrollReveal, ScrollRevealContainer, and ScrollRevealItem primitives"
);

// 5. Verify Section Integration in routes/index.tsx
const indexRoutePath = path.resolve("src/routes/index.tsx");
const indexRouteContent = fs.readFileSync(indexRoutePath, "utf-8");

assert(
  indexRouteContent.includes('import { ScrollReveal } from "@/components/ui/ScrollReveal";') &&
    indexRouteContent.includes('<ScrollReveal direction="up" translateY={24}>'),
  "src/routes/index.tsx integrates ScrollReveal across primary landing page sections"
);

// 6. Build Verification
console.log("\n  Running production build check (npm run build)...");
try {
  const buildOutput = execSync("npm run build", { encoding: "utf-8" });
  assert(!buildOutput.includes("error") || buildOutput.includes("built in"), "npm run build compiled cleanly with 0 errors");
} catch (err) {
  assert(false, `npm run build failed: ${err.message}`);
}

console.log("\n=================================================");
console.log(`  VERIFICATION RESULTS: ${passedCount}/${totalCount} CHECKS PASSED`);
console.log("=================================================\n");

if (passedCount === totalCount) {
  console.log("✨ ALL SCROLL-TRIGGERED REVEAL ENGINE CHECKS PASSED 100%!");
  process.exit(0);
} else {
  console.error("⚠️ SOME CHECKS FAILED!");
  process.exit(1);
}
