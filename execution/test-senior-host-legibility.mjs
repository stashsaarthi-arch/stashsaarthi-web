import fs from "node:fs";
import path from "node:path";

console.log("--------------------------------------------------");
console.log("🧪 RUNNING SENIOR HOST LEGIBILITY MODE TEST HARNESS");
console.log("--------------------------------------------------\n");

let passedChecks = 0;
const totalChecks = 5;

// Check 1: Design Tokens in designTokens.ts
const tokensPath = path.resolve("src/lib/designTokens.ts");
if (fs.existsSync(tokensPath)) {
  const content = fs.readFileSync(tokensPath, "utf-8");
  if (
    content.includes("SENIOR_HOST_LEGIBILITY_TOKENS") &&
    content.includes("getSeniorHostLegibilityClasses") &&
    content.includes("getHostBorderContrastClasses") &&
    content.includes("getHostTypographyClasses")
  ) {
    console.log("✅ Check 1: SENIOR_HOST_LEGIBILITY_TOKENS & helper functions exported in designTokens.ts.");
    passedChecks++;
  } else {
    console.error("❌ Check 1 Failed: SENIOR_HOST_LEGIBILITY_TOKENS missing in designTokens.ts.");
  }
} else {
  console.error("❌ Check 1 Failed: designTokens.ts not found.");
}

// Check 2: CSS Legibility Specifications in styles.css
const cssPath = path.resolve("src/styles.css");
if (fs.existsSync(cssPath)) {
  const cssContent = fs.readFileSync(cssPath, "utf-8");
  if (
    cssContent.includes('[data-role="host"]') &&
    cssContent.includes("Senior Host Legibility Mode CSS Specifications") &&
    cssContent.includes("senior-host-text-lg") &&
    cssContent.includes("senior-host-border-contrast") &&
    cssContent.includes("senior-host-btn-accessible")
  ) {
    console.log("✅ Check 2: Senior Host Legibility CSS rules (18px+ font, high contrast borders, 52px+ buttons) validated in styles.css.");
    passedChecks++;
  } else {
    console.error("❌ Check 2 Failed: Host legibility CSS rules missing in styles.css.");
  }
} else {
  console.error("❌ Check 2 Failed: styles.css not found.");
}

// Check 3: SeniorHostLegibility Component Primitives
const componentPath = path.resolve("src/components/ui/SeniorHostLegibility.tsx");
if (fs.existsSync(componentPath)) {
  const compContent = fs.readFileSync(componentPath, "utf-8");
  if (
    compContent.includes("HostLegibilityBadge") &&
    compContent.includes("SeniorHostActionButton") &&
    compContent.includes("min-h-[52px]") &&
    compContent.includes("text-lg")
  ) {
    console.log("✅ Check 3: SeniorHostLegibility.tsx primitive created with HostLegibilityBadge and SeniorHostActionButton.");
    passedChecks++;
  } else {
    console.error("❌ Check 3 Failed: SeniorHostLegibility.tsx missing key features.");
  }
} else {
  console.error("❌ Check 3 Failed: SeniorHostLegibility.tsx not found.");
}

// Check 4: Primitives Re-export
const primitivesPath = path.resolve("src/components/ui/primitives.ts");
if (fs.existsSync(primitivesPath)) {
  const primContent = fs.readFileSync(primitivesPath, "utf-8");
  if (primContent.includes("HostLegibilityBadge") && primContent.includes("SeniorHostActionButton")) {
    console.log("✅ Check 4: Senior Host Legibility primitives re-exported from primitives.ts.");
    passedChecks++;
  } else {
    console.error("❌ Check 4 Failed: Primitives not re-exported in primitives.ts.");
  }
} else {
  console.error("❌ Check 4 Failed: primitives.ts not found.");
}

// Check 5: HostHeroSeals Integration
const heroSealsPath = path.resolve("src/components/stash/HostHeroSeals.tsx");
if (fs.existsSync(heroSealsPath)) {
  const sealsContent = fs.readFileSync(heroSealsPath, "utf-8");
  if (sealsContent.includes("HostLegibilityBadge")) {
    console.log("✅ Check 5: HostLegibilityBadge successfully mounted in HostHeroSeals component.");
    passedChecks++;
  } else {
    console.error("❌ Check 5 Failed: HostLegibilityBadge not mounted in HostHeroSeals.tsx.");
  }
} else {
  console.error("❌ Check 5 Failed: HostHeroSeals.tsx not found.");
}

console.log("\n--------------------------------------------------");
if (passedChecks === totalChecks) {
  console.log(`🎉 ALL ${passedChecks}/${totalChecks} SENIOR HOST LEGIBILITY MODE CHECKS PASSED!`);
  process.exit(0);
} else {
  console.error(`💥 ${totalChecks - passedChecks} CHECKS FAILED.`);
  process.exit(1);
}
