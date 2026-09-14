import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

console.log("⚡ [TEST SUITE] Running Student Persona Cyberpunk Aesthetics Verification (Task 133)...\n");

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✅ Check ${total}: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ Check ${total} FAILED: ${message}`);
  }
}

// Check 1: designTokens.ts exports STUDENT_CYBERPUNK_TOKENS and helper functions
const designTokensPath = path.join(rootDir, "src", "lib", "designTokens.ts");
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");
assert(
  designTokensContent.includes("STUDENT_CYBERPUNK_TOKENS") &&
    designTokensContent.includes("getStudentCyberpunkCardClasses") &&
    designTokensContent.includes("getStudentEdgeHighlightClasses"),
  "src/lib/designTokens.ts exports STUDENT_CYBERPUNK_TOKENS and helper functions"
);

// Check 2: styles.css contains student cyberpunk CSS rules and utility classes
const stylesPath = path.join(rootDir, "src", "styles.css");
const stylesContent = fs.readFileSync(stylesPath, "utf-8");
assert(
  stylesContent.includes("student-cyberpunk-card") &&
    stylesContent.includes("student-mint-cyan-edge") &&
    stylesContent.includes("student-frosted-glass-depth") &&
    stylesContent.includes("student-neon-mint-glow") &&
    stylesContent.includes('data-role="student"'),
  "src/styles.css contains [data-role=\"student\"] cyberpunk rules and utilities"
);

// Check 3: StudentCyberpunkCard.tsx component exists and renders mint/cyan edge highlights
const componentPath = path.join(rootDir, "src", "components", "ui", "StudentCyberpunkCard.tsx");
assert(fs.existsSync(componentPath), "src/components/ui/StudentCyberpunkCard.tsx primitive component exists");

const componentContent = fs.readFileSync(componentPath, "utf-8");
assert(
  componentContent.includes("StudentCyberpunkCard") &&
    componentContent.includes("getStudentCyberpunkCardClasses") &&
    componentContent.includes("glowVariant"),
  "StudentCyberpunkCard component leverages cyberpunk design tokens and props"
);

// Check 4: primitives.ts re-exports StudentCyberpunkCard
const primitivesPath = path.join(rootDir, "src", "components", "ui", "primitives.ts");
const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");
assert(
  primitivesContent.includes("StudentCyberpunkCard") &&
    primitivesContent.includes("StudentCyberpunkCardProps"),
  "src/components/ui/primitives.ts re-exports StudentCyberpunkCard primitive"
);

// Check 5: Floating3DLuggage.tsx integrates student cyberpunk classes
const luggagePath = path.join(rootDir, "src", "components", "stash", "Floating3DLuggage.tsx");
const luggageContent = fs.readFileSync(luggagePath, "utf-8");
assert(
  luggageContent.includes("student-cyberpunk-card") &&
    luggageContent.includes("student-mint-cyan-edge"),
  "src/components/stash/Floating3DLuggage.tsx integrates student cyberpunk classes"
);

console.log(`\n📊 TEST SUMMARY: ${passed}/${total} STUDENT CYBERPUNK AESTHETICS CHECKS PASSED.`);

if (passed === total) {
  console.log("🎉 SUCCESS: Task 133 Student Dark Mode Aesthetics verification completed successfully!\n");
  process.exit(0);
} else {
  console.error("❌ FAILURE: Some checks failed.\n");
  process.exit(1);
}
