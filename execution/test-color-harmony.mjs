import { parseOklch, checkContrast, generateSurfaceHarmonyScale, auditSurfaceContrastHarmony, STUDENT_SURFACE_HARMONY, HOST_SURFACE_HARMONY } from "../src/lib/colorHarmony.ts";

console.log("=========================================");
console.log("  COLOR HARMONY & CONTRAST CHECKER AUDIT ");
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

// 1. Test OKLCH Parser
const parsed = parseOklch("oklch(0.72 0.19 160)");
assert(parsed.l === 0.72 && parsed.c === 0.19 && parsed.h === 160, "parseOklch correctly parses L, C, H components");

// 2. Test Contrast Calculator (White foreground on Obsidian background should be > 10:1 ratio)
const fgWhite = "oklch(0.97 0.008 220)";
const bgObsidian = "oklch(0.12 0.012 230)";
const contrast = checkContrast(fgWhite, bgObsidian);

assert(contrast.ratio > 10.0, `Obsidian background contrast ratio is ${contrast.formattedRatio} ( > 10.0 )`);
assert(contrast.passesAAA === true, "Obsidian background passes WCAG AAA contrast standard");

// 3. Test Student Persona Surface Harmony Scale
const studentAudit = auditSurfaceContrastHarmony("student");
assert(studentAudit.compliant === true, "Student persona surface layers (--surface-1, --surface-2, --surface-elevated) 100% WCAG AA compliant");
console.log("   Student FG Metrics:", studentAudit.fgMetrics);
console.log("   Student Muted Metrics:", studentAudit.mutedMetrics);

// 4. Test Host Persona Surface Harmony Scale
const hostAudit = auditSurfaceContrastHarmony("host");
assert(hostAudit.compliant === true, "Host persona surface layers (--surface-1, --surface-2, --surface-elevated) 100% WCAG AA compliant");
console.log("   Host FG Metrics:", hostAudit.fgMetrics);
console.log("   Host Muted Metrics:", hostAudit.mutedMetrics);

console.log("\n-----------------------------------------");
console.log(`RESULTS: ${passed}/${total} checks passed.`);
if (passed !== total) {
  process.exit(1);
}
