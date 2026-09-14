import fs from "fs";
import path from "path";
import { execSync } from "child_process";

console.log("=================================================");
console.log("TASK 167: FORM VALIDATION MICRO-STATES TEST SUITE");
console.log("=================================================\n");

let passedChecks = 0;
const totalChecks = 5;

// Check 1: Design Tokens
try {
  const designTokensPath = path.join(process.cwd(), "src/lib/designTokens.ts");
  const tokensContent = fs.readFileSync(designTokensPath, "utf8");

  if (
    tokensContent.includes("FORM_VALIDATION_TOKENS") &&
    tokensContent.includes("getFormValidationTokens") &&
    tokensContent.includes("form-shake-error") &&
    tokensContent.includes("microCopy")
  ) {
    console.log("✅ Check 1 PASSED: FORM_VALIDATION_TOKENS & helper functions defined in designTokens.ts");
    passedChecks++;
  } else {
    console.error("❌ Check 1 FAILED: Missing FORM_VALIDATION_TOKENS or helper functions in designTokens.ts");
  }
} catch (err) {
  console.error("❌ Check 1 FAILED with exception:", err.message);
}

// Check 2: CSS Keyframes & Utility Classes
try {
  const stylesPath = path.join(process.cwd(), "src/styles.css");
  const stylesContent = fs.readFileSync(stylesPath, "utf8");

  if (
    stylesContent.includes("@keyframes form-shake-error") &&
    stylesContent.includes(".form-shake-active") &&
    stylesContent.includes(".validation-hint-text") &&
    stylesContent.includes(".form-input-valid") &&
    stylesContent.includes(".form-input-invalid")
  ) {
    console.log("✅ Check 2 PASSED: Form validation keyframes & utility classes present in styles.css");
    passedChecks++;
  } else {
    console.error("❌ Check 2 FAILED: Missing form validation keyframes or CSS classes in styles.css");
  }
} catch (err) {
  console.error("❌ Check 2 FAILED with exception:", err.message);
}

// Check 3: FormValidationInput Component
try {
  const compPath = path.join(process.cwd(), "src/components/ui/FormValidationInput.tsx");
  const compContent = fs.readFileSync(compPath, "utf8");

  if (
    compContent.includes("export const FormValidationInput") &&
    compContent.includes("usePersona") &&
    compContent.includes("getFormValidationTokens") &&
    compContent.includes("playWarningBeep") &&
    compContent.includes("shakeTrigger") &&
    compContent.includes("aria-invalid")
  ) {
    console.log("✅ Check 3 PASSED: FormValidationInput primitive component correctly implemented");
    passedChecks++;
  } else {
    console.error("❌ Check 3 FAILED: FormValidationInput component missing key validation logic");
  }
} catch (err) {
  console.error("❌ Check 3 FAILED with exception:", err.message);
}

// Check 4: Primitives Re-export
try {
  const primitivesPath = path.join(process.cwd(), "src/components/ui/primitives.ts");
  const primitivesContent = fs.readFileSync(primitivesPath, "utf8");

  if (
    primitivesContent.includes("FormValidationInput") &&
    primitivesContent.includes("FormValidationInputProps") &&
    primitivesContent.includes("ValidationInputType")
  ) {
    console.log("✅ Check 4 PASSED: FormValidationInput re-exported cleanly in primitives.ts");
    passedChecks++;
  } else {
    console.error("❌ Check 4 FAILED: FormValidationInput not re-exported in primitives.ts");
  }
} catch (err) {
  console.error("❌ Check 4 FAILED with exception:", err.message);
}

// Check 5: Production Build Verification
try {
  console.log("\nRunning production build verification (`npm run build`)...");
  execSync("npm run build", { stdio: "inherit" });
  console.log("✅ Check 5 PASSED: Production build compiled cleanly with 0 errors!");
  passedChecks++;
} catch (err) {
  console.error("❌ Check 5 FAILED: Build failed during execution");
}

console.log(`\n=================================================`);
console.log(`RESULT: ${passedChecks}/${totalChecks} CHECKS PASSED`);
console.log(`=================================================`);

if (passedChecks === totalChecks) {
  process.exit(0);
} else {
  process.exit(1);
}
