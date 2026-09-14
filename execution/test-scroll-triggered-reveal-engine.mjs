import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("⚡ [TEST SUITE] Verifying Task 154: Scroll-Triggered Reveal Engine...");

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

// 1. Check designTokens.ts for SCROLL_REVEAL_TOKENS
const tokensPath = path.join(rootDir, "src", "lib", "designTokens.ts");
const tokensContent = fs.readFileSync(tokensPath, "utf-8");

assert(
  tokensContent.includes("export const SCROLL_REVEAL_TOKENS ="),
  "designTokens.ts defines SCROLL_REVEAL_TOKENS"
);
assert(
  tokensContent.includes("translateYPx: 24"),
  "SCROLL_REVEAL_TOKENS includes translateYPx: 24"
);
assert(
  tokensContent.includes("export function getScrollRevealTokens"),
  "designTokens.ts exports getScrollRevealTokens helper"
);
assert(
  tokensContent.includes("export function getScrollRevealInlineStyles"),
  "designTokens.ts exports getScrollRevealInlineStyles helper"
);

// 2. Check styles.css for keyframes & utilities
const stylesPath = path.join(rootDir, "src", "styles.css");
const stylesContent = fs.readFileSync(stylesPath, "utf-8");

assert(
  stylesContent.includes("@keyframes scroll-reveal-fade-up"),
  "styles.css contains @keyframes scroll-reveal-fade-up"
);
assert(
  stylesContent.includes(".scroll-reveal-initial"),
  "styles.css contains .scroll-reveal-initial CSS class"
);
assert(
  stylesContent.includes(".scroll-reveal-active"),
  "styles.css contains .scroll-reveal-active CSS class"
);
assert(
  stylesContent.includes("@utility scroll-reveal-stage"),
  "styles.css contains @utility scroll-reveal-stage"
);

// 3. Check ScrollReveal.tsx implementation
const scrollRevealPath = path.join(rootDir, "src", "components", "ui", "ScrollReveal.tsx");
assert(fs.existsSync(scrollRevealPath), "ScrollReveal.tsx component exists");

const scrollRevealContent = fs.readFileSync(scrollRevealPath, "utf-8");
assert(
  scrollRevealContent.includes("export const ScrollReveal"),
  "ScrollReveal.tsx exports ScrollReveal component"
);
assert(
  scrollRevealContent.includes("export const ScrollRevealContainer"),
  "ScrollReveal.tsx exports ScrollRevealContainer component"
);
assert(
  scrollRevealContent.includes("IntersectionObserver"),
  "ScrollReveal.tsx implements IntersectionObserver"
);
assert(
  scrollRevealContent.includes("prefers-reduced-motion"),
  "ScrollReveal.tsx respects prefers-reduced-motion accessibility"
);

// 4. Check primitives.ts re-exports
const primitivesPath = path.join(rootDir, "src", "components", "ui", "primitives.ts");
const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");

assert(
  primitivesContent.includes("ScrollReveal"),
  "primitives.ts re-exports ScrollReveal"
);
assert(
  primitivesContent.includes("ScrollRevealContainer"),
  "primitives.ts re-exports ScrollRevealContainer"
);

// 5. Check index.tsx integration
const indexPath = path.join(rootDir, "src", "routes", "index.tsx");
const indexContent = fs.readFileSync(indexPath, "utf-8");

assert(
  indexContent.includes("<ScrollReveal"),
  "index.tsx wraps sections in <ScrollReveal>"
);

console.log("\n==========================================");
console.log(`SUMMARY: ${passed} passed, ${failed} failed.`);
console.log("==========================================\n");

if (failed > 0) {
  process.exit(1);
}
