import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("🔍 Running Test Suite for Task 135: Dynamic Persona Themed Navbar...\n");

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
  }
}

// 1. Check designTokens.ts for DYNAMIC_PERSONA_NAVBAR_TOKENS and helpers
const designTokensPath = path.join(rootDir, "src/lib/designTokens.ts");
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");

assert(
  designTokensContent.includes("DYNAMIC_PERSONA_NAVBAR_TOKENS"),
  "designTokens.ts exports DYNAMIC_PERSONA_NAVBAR_TOKENS"
);

assert(
  designTokensContent.includes("getPersonaNavbarTokens"),
  "designTokens.ts exports getPersonaNavbarTokens helper"
);

assert(
  designTokensContent.includes("getNavbarBrandGlowClasses"),
  "designTokens.ts exports getNavbarBrandGlowClasses helper"
);

assert(
  designTokensContent.includes("getNavbarLinkIndicatorClasses"),
  "designTokens.ts exports getNavbarLinkIndicatorClasses helper"
);

// 2. Check styles.css for navbar persona rules
const stylesPath = path.join(rootDir, "src/styles.css");
const stylesContent = fs.readFileSync(stylesPath, "utf-8");

assert(
  stylesContent.includes('data-persona="student"') && stylesContent.includes('data-persona="host"'),
  "styles.css contains [data-persona] selectors for navbar branding"
);

assert(
  stylesContent.includes("navbar-brand-glow-student") && stylesContent.includes("navbar-brand-glow-host"),
  "styles.css contains brand glow utility classes for Student & Host mode"
);

assert(
  stylesContent.includes("navbar-top-accent-line-student") && stylesContent.includes("navbar-top-accent-line-host"),
  "styles.css contains top accent line gradient utility classes"
);

assert(
  stylesContent.includes("navbar-scrolled-student") && stylesContent.includes("navbar-scrolled-host"),
  "styles.css contains scrolled navbar border & shadow utilities"
);

// 3. Check Navbar.tsx for dynamic persona attributes and sliding indicator
const navbarPath = path.join(rootDir, "src/components/stash/Navbar.tsx");
const navbarContent = fs.readFileSync(navbarPath, "utf-8");

assert(
  navbarContent.includes('data-persona={role}'),
  "Navbar.tsx attaches data-persona={role} to root header element"
);

assert(
  navbarContent.includes("topAccentLine"),
  "Navbar.tsx renders top accent gradient line synchronized with persona palette"
);

assert(
  navbarContent.includes("getNavbarBrandGlowClasses"),
  "Navbar.tsx applies persona brand logo glow"
);

assert(
  navbarContent.includes('layoutId="navbar-active-link-indicator"'),
  "Navbar.tsx mounts dynamic sliding active indicator bar with spring physics"
);

assert(
  navbarContent.includes("tokens.ctaButton"),
  "Navbar.tsx applies persona-specific CTA button gradient & shadow token"
);

assert(
  navbarContent.includes("tokens.mobileDrawerBorder"),
  "Navbar.tsx applies persona-themed mobile drawer top border"
);

console.log(`\n📊 Test Summary: ${passed}/${total} checks passed.\n`);

if (passed !== total) {
  console.error("❌ Some verification checks failed!");
  process.exit(1);
} else {
  console.log("🎉 ALL DYNAMIC PERSONA THEMED NAVBAR CHECKS PASSED SUCCESSFULLY!");
}
