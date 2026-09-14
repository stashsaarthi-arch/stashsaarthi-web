import fs from "fs";
import path from "path";
import { execSync } from "child_process";

console.log("=================================================");
console.log("   MAGNETIC BUTTONS MICRO-INTERACTION SUITE    ");
console.log("=================================================\n");

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASSED: ${message}`);
    passedCount++;
  } else {
    console.error(`❌ FAILED: ${message}`);
    failedCount++;
  }
}

const rootDir = process.cwd();

// 1. Check designTokens.ts
const designTokensPath = path.join(rootDir, "src", "lib", "designTokens.ts");
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");

assert(
  designTokensContent.includes("export const MAGNETIC_BUTTON_TOKENS"),
  "designTokens.ts exports MAGNETIC_BUTTON_TOKENS"
);

assert(
  designTokensContent.includes("magneticStrength: 0.35") &&
    designTokensContent.includes("magneticRadiusPx: 120") &&
    designTokensContent.includes("maxDisplacementPx: 18") &&
    designTokensContent.includes("touchThresholdPx: 768"),
  "MAGNETIC_BUTTON_TOKENS contains strength, radius, displacement, and touch threshold parameters"
);

assert(
  designTokensContent.includes("export function getMagneticButtonTokens"),
  "designTokens.ts exports getMagneticButtonTokens helper function"
);

// 2. Check styles.css
const stylesCssPath = path.join(rootDir, "src", "styles.css");
const stylesCssContent = fs.readFileSync(stylesCssPath, "utf-8");

assert(
  stylesCssContent.includes(".magnetic-button-wrapper") &&
    stylesCssContent.includes(".magnetic-button-stage") &&
    stylesCssContent.includes(".magnetic-button-pulled"),
  "styles.css contains magnetic button CSS wrapper and stage utility rules"
);

assert(
  stylesCssContent.includes("magnetic-button-glow-student") &&
    stylesCssContent.includes("magnetic-button-glow-host"),
  "styles.css contains dual-persona magnetic pull glow classes"
);

assert(
  stylesCssContent.includes("magnetic-button-disabled"),
  "styles.css contains magnetic-button-disabled fallback rule"
);

// 3. Check MagneticButton.tsx component
const magneticButtonPath = path.join(rootDir, "src", "components", "ui", "MagneticButton.tsx");
assert(fs.existsSync(magneticButtonPath), "MagneticButton.tsx exists in src/components/ui/");

const magneticButtonContent = fs.readFileSync(magneticButtonPath, "utf-8");
assert(
  magneticButtonContent.includes("export const MagneticButton") &&
    magneticButtonContent.includes("usePersona") &&
    magneticButtonContent.includes("isLowDataModeEnabled") &&
    magneticButtonContent.includes("requestAnimationFrame"),
  "MagneticButton component incorporates persona awareness, low-data checks, and RAF throttled transforms"
);

// 4. Check primitives.ts re-export
const primitivesPath = path.join(rootDir, "src", "components", "ui", "primitives.ts");
const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");

assert(
  primitivesContent.includes("MagneticButton") &&
    primitivesContent.includes("MagneticButtonProps"),
  "primitives.ts re-exports MagneticButton and MagneticButtonProps"
);

// 5. Check HeroCtaButton.tsx integration
const heroCtaButtonPath = path.join(rootDir, "src", "components", "ui", "HeroCtaButton.tsx");
const heroCtaButtonContent = fs.readFileSync(heroCtaButtonPath, "utf-8");

assert(
  heroCtaButtonContent.includes("MagneticButton") &&
    heroCtaButtonContent.includes("enableMagnetic"),
  "HeroCtaButton.tsx integrates MagneticButton wrapper with enableMagnetic option"
);

// 6. Test Vite production build compilation
console.log("\nRunning production build check (npm run build)...");
try {
  const buildOutput = execSync("npm run build", { encoding: "utf-8", cwd: rootDir });
  assert(
    buildOutput.includes("built in") || buildOutput.includes("dist"),
    "Production build compiled cleanly with zero Vite/TypeScript errors"
  );
} catch (err) {
  assert(false, `Production build failed: ${err.message}`);
}

console.log("\n=================================================");
console.log(`SUMMARY: Passed ${passedCount} checks, Failed ${failedCount} checks`);
console.log("=================================================");

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
