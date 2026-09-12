import { GLASSMORPHISM_TOKENS, STUDENT_TOKENS, HOST_TOKENS } from "../src/lib/designTokens.ts";
import fs from "node:fs";
import path from "node:path";

console.log("=========================================");
console.log("   GLASSMORPHISM UTILITIES AUDIT SUITE   ");
console.log("=========================================\n");

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    passed++;
    console.log(`✅ [PASS] ${message}`);
  } else {
    console.error(`❌ [FAIL] ${message}`);
  }
}

// 1. Verify GLASSMORPHISM_TOKENS exports in designTokens.ts
assert(typeof GLASSMORPHISM_TOKENS.glass.backdropFilter === "string", "GLASSMORPHISM_TOKENS.glass has backdropFilter defined");
assert(typeof GLASSMORPHISM_TOKENS.glassPanel.backdropFilter === "string", "GLASSMORPHISM_TOKENS.glassPanel has backdropFilter defined");
assert(typeof GLASSMORPHISM_TOKENS.glassCard.backdropFilter === "string", "GLASSMORPHISM_TOKENS.glassCard has backdropFilter defined");

// 2. Read src/styles.css and verify CSS rules
const stylesPath = path.resolve(process.cwd(), "src/styles.css");
const stylesCss = fs.readFileSync(stylesPath, "utf-8");

assert(stylesCss.includes("@utility glass {"), "styles.css contains @utility glass block");
assert(stylesCss.includes("@utility glass-hover {"), "styles.css contains @utility glass-hover block");
assert(stylesCss.includes("@utility glass-panel {"), "styles.css contains @utility glass-panel block");
assert(stylesCss.includes("@utility glass-card {"), "styles.css contains @utility glass-card block");

assert(stylesCss.includes("backdrop-filter: blur(16px) saturate(140%);"), "glass utility uses 16px blur & 140% saturation");
assert(stylesCss.includes("backdrop-filter: blur(20px) saturate(160%);"), "glass-panel utility uses 20px blur & 160% saturation");
assert(stylesCss.includes("transform: translate3d(0, 0, 0);"), "glass utilities enforce GPU translate3d hardware acceleration");

assert(stylesCss.includes("--surface-panel:"), "surface panel OKLCH tokens defined in CSS theme layers");
assert(stylesCss.includes("--surface-card:"), "surface card OKLCH tokens defined in CSS theme layers");

console.log("\n-----------------------------------------");
console.log(`RESULTS: ${passed}/${total} checks passed.`);
if (passed !== total) {
  process.exit(1);
}
