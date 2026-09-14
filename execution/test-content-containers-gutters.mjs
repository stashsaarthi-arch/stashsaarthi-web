import fs from "fs";
import path from "path";

const rootDir = process.cwd();

console.log("=================================================");
console.log("RUNNING CONTENT CONTAINERS & GUTTERS VERIFICATION");
console.log("=================================================\n");

let passedChecks = 0;
let totalChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`✅ [PASS] ${message}`);
  } else {
    console.error(`❌ [FAIL] ${message}`);
  }
}

// 1. Check designTokens.ts exports & tokens
const designTokensPath = path.join(rootDir, "src", "lib", "designTokens.ts");
assert(fs.existsSync(designTokensPath), "src/lib/designTokens.ts exists");

const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");
assert(
  designTokensContent.includes("CONTAINER_GUTTER_TOKENS"),
  "designTokens.ts defines CONTAINER_GUTTER_TOKENS"
);
assert(
  designTokensContent.includes("getContainerGutterClasses"),
  "designTokens.ts exports getContainerGutterClasses helper"
);
assert(
  designTokensContent.includes("getMobileGutterSafetyClasses"),
  "designTokens.ts exports getMobileGutterSafetyClasses helper for narrow viewports"
);
assert(
  designTokensContent.includes("mobile-gutter-safe"),
  "CONTAINER_GUTTER_TOKENS incorporates mobile-gutter-safe padding rules"
);

// 2. Check styles.css utility definitions
const stylesCssPath = path.join(rootDir, "src", "styles.css");
assert(fs.existsSync(stylesCssPath), "src/styles.css exists");

const stylesCssContent = fs.readFileSync(stylesCssPath, "utf-8");
assert(
  stylesCssContent.includes("@utility section-container-gutter"),
  "styles.css defines @utility section-container-gutter"
);
assert(
  stylesCssContent.includes("@utility container-gutter-compact"),
  "styles.css defines @utility container-gutter-compact"
);
assert(
  stylesCssContent.includes("@utility container-gutter-standard"),
  "styles.css defines @utility container-gutter-standard"
);
assert(
  stylesCssContent.includes("@utility container-gutter-relaxed"),
  "styles.css defines @utility container-gutter-relaxed"
);
assert(
  stylesCssContent.includes("@utility mobile-gutter-safe"),
  "styles.css defines @utility mobile-gutter-safe with env(safe-area-inset)"
);
assert(
  stylesCssContent.includes("@media (max-width: 380px)"),
  "styles.css contains narrow mobile viewport (<380px iPhone SE) text-to-edge protection rules"
);

// 3. Check SectionWrapper.tsx integration
const sectionWrapperPath = path.join(rootDir, "src", "components", "ui", "SectionWrapper.tsx");
assert(fs.existsSync(sectionWrapperPath), "src/components/ui/SectionWrapper.tsx exists");

const sectionWrapperContent = fs.readFileSync(sectionWrapperPath, "utf-8");
assert(
  sectionWrapperContent.includes("section-container-gutter mobile-gutter-safe"),
  "SectionWrapper primitive includes section-container-gutter and mobile-gutter-safe"
);
assert(
  sectionWrapperContent.includes("SectionContainer"),
  "SectionContainer primitive is defined and exported"
);

// 4. Check component integrations
const heroPath = path.join(rootDir, "src", "components", "stash", "Hero.tsx");
const heroContent = fs.readFileSync(heroPath, "utf-8");
assert(
  heroContent.includes("section-container-gutter") && heroContent.includes("mobile-gutter-safe"),
  "Hero component applies section-container-gutter and mobile-gutter-safe padding"
);

const navbarPath = path.join(rootDir, "src", "components", "stash", "Navbar.tsx");
const navbarContent = fs.readFileSync(navbarPath, "utf-8");
assert(
  navbarContent.includes("section-container-gutter") && navbarContent.includes("mobile-gutter-safe"),
  "Navbar component applies section-container-gutter and mobile-gutter-safe padding"
);

const footerPath = path.join(rootDir, "src", "components", "stash", "FooterSection.tsx");
const footerContent = fs.readFileSync(footerPath, "utf-8");
assert(
  footerContent.includes("section-container-gutter") && footerContent.includes("mobile-gutter-safe"),
  "FooterSection component applies section-container-gutter and mobile-gutter-safe padding"
);

console.log(`\nResults: ${passedChecks}/${totalChecks} checks passed.`);

if (passedChecks === totalChecks) {
  console.log("🎉 ALL CONTENT CONTAINERS & GUTTERS CHECKS PASSED SUCCESSFULLY!");
  process.exit(0);
} else {
  console.error("💥 CONTENT CONTAINERS & GUTTERS VERIFICATION FAILED!");
  process.exit(1);
}
