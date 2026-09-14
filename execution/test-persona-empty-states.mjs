import fs from "fs";
import path from "path";
import { execSync } from "child_process";

console.log("=================================================");
console.log("TESTING: PERSONA-SPECIFIC EMPTY STATES (TASK 137)");
console.log("=================================================");

let testsPassed = 0;
const totalTests = 5;

// 1. Verify designTokens.ts contains PERSONA_EMPTY_STATE_TOKENS
const tokensPath = path.resolve("src/lib/designTokens.ts");
const tokensContent = fs.readFileSync(tokensPath, "utf-8");

if (
  tokensContent.includes("PERSONA_EMPTY_STATE_TOKENS") &&
  tokensContent.includes("getPersonaEmptyStateTokens") &&
  tokensContent.includes("student_search_miss") &&
  tokensContent.includes("host_zero_bookings")
) {
  console.log("✅ Check 1: PERSONA_EMPTY_STATE_TOKENS and helper exported from designTokens.ts");
  testsPassed++;
} else {
  console.error("❌ Check 1 Failed: Missing PERSONA_EMPTY_STATE_TOKENS in designTokens.ts");
}

// 2. Verify PersonaEmptyState.tsx existence and SVG artwork
const emptyStatePath = path.resolve("src/components/ui/PersonaEmptyState.tsx");
if (fs.existsSync(emptyStatePath)) {
  const emptyStateContent = fs.readFileSync(emptyStatePath, "utf-8");
  if (
    emptyStateContent.includes("StudentSearchMissSvg") &&
    emptyStateContent.includes("HostZeroBookingsSvg") &&
    emptyStateContent.includes("export function PersonaEmptyState")
  ) {
    console.log("✅ Check 2: PersonaEmptyState.tsx exists with custom SVG illustrations and component export");
    testsPassed++;
  } else {
    console.error("❌ Check 2 Failed: PersonaEmptyState.tsx missing required SVG artwork or export");
  }
} else {
  console.error("❌ Check 2 Failed: PersonaEmptyState.tsx file does not exist");
}

// 3. Verify primitives.ts re-exports PersonaEmptyState
const primitivesPath = path.resolve("src/components/ui/primitives.ts");
const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");
if (
  primitivesContent.includes("PersonaEmptyState") &&
  primitivesContent.includes("PersonaEmptyStateProps")
) {
  console.log("✅ Check 3: PersonaEmptyState primitive re-exported in primitives.ts");
  testsPassed++;
} else {
  console.error("❌ Check 3 Failed: primitives.ts does not re-export PersonaEmptyState");
}

// 4. Verify CampusNodeChecker and MyBookingsDashboard integration
const campusNodePath = path.resolve("src/components/stash/CampusNodeChecker.tsx");
const bookingsPath = path.resolve("src/components/stash/MyBookingsDashboard.tsx");
const campusContent = fs.readFileSync(campusNodePath, "utf-8");
const bookingsContent = fs.readFileSync(bookingsPath, "utf-8");

if (
  campusContent.includes("PersonaEmptyState") &&
  bookingsContent.includes("PersonaEmptyState")
) {
  console.log("✅ Check 4: CampusNodeChecker and MyBookingsDashboard integrate PersonaEmptyState");
  testsPassed++;
} else {
  console.error("❌ Check 4 Failed: PersonaEmptyState missing in CampusNodeChecker or MyBookingsDashboard");
}

// 5. Build check
try {
  console.log("Running production build check (npm run build)...");
  execSync("npm run build", { stdio: "pipe" });
  console.log("✅ Check 5: Production build succeeded with zero TypeScript/Vite errors");
  testsPassed++;
} catch (err) {
  console.error("❌ Check 5 Failed: Build errors encountered:", err.stdout?.toString() || err.message);
}

console.log(`\nRESULTS: ${testsPassed}/${totalTests} tests passed.`);
if (testsPassed === totalTests) {
  console.log("SUCCESS: PERSONA-SPECIFIC EMPTY STATES CHECKS PASSED SUCCESSFULLY!");
  process.exit(0);
} else {
  console.error("FAILURE: Some checks failed.");
  process.exit(1);
}
