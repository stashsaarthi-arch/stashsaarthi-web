import fs from "fs";
import path from "path";

console.log("🔍 Running verification harness for FAQ Accordion 2.0 (Task 145)...");

let passed = true;

// 1. Verify design tokens in src/lib/designTokens.ts
const designTokensPath = path.resolve("src/lib/designTokens.ts");
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");

if (
  designTokensContent.includes("FAQ_ACCORDION_TOKENS") &&
  designTokensContent.includes("getFaqAccordionTokens") &&
  designTokensContent.includes("getFaqAccordionItemClasses")
) {
  console.log("✅ FAQ_ACCORDION_TOKENS & helpers present in designTokens.ts");
} else {
  console.error("❌ Missing FAQ_ACCORDION_TOKENS or helpers in designTokens.ts");
  passed = false;
}

// 2. Verify styles in src/styles.css
const stylesPath = path.resolve("src/styles.css");
const stylesContent = fs.readFileSync(stylesPath, "utf-8");

if (
  stylesContent.includes("accordion-smooth-down") &&
  stylesContent.includes("accordion-glowing-outline-student") &&
  stylesContent.includes("accordion-glowing-outline-host")
) {
  console.log("✅ Accordion 2.0 keyframes & utilities present in styles.css");
} else {
  console.error("❌ Missing Accordion 2.0 styles in styles.css");
  passed = false;
}

// 3. Verify component primitive in src/components/ui/FaqAccordion2.tsx
const componentPath = path.resolve("src/components/ui/FaqAccordion2.tsx");
if (fs.existsSync(componentPath)) {
  const componentContent = fs.readFileSync(componentPath, "utf-8");
  if (
    componentContent.includes("export const FaqAccordion2") &&
    componentContent.includes("getFaqAccordionItemClasses") &&
    componentContent.includes("getWhatsAppUrl")
  ) {
    console.log("✅ FaqAccordion2 primitive component implemented cleanly");
  } else {
    console.error("❌ FaqAccordion2 primitive missing key exports or handlers");
    passed = false;
  }
} else {
  console.error("❌ src/components/ui/FaqAccordion2.tsx does not exist");
  passed = false;
}

// 4. Verify re-export in src/components/ui/primitives.ts
const primitivesPath = path.resolve("src/components/ui/primitives.ts");
const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");

if (
  primitivesContent.includes("FaqAccordion2") &&
  primitivesContent.includes("FaqAccordion2Props")
) {
  console.log("✅ FaqAccordion2 re-exported in primitives.ts");
} else {
  console.error("❌ FaqAccordion2 missing from primitives.ts re-exports");
  passed = false;
}

// 5. Verify FAQ.tsx integration
const faqPath = path.resolve("src/components/stash/FAQ.tsx");
const faqContent = fs.readFileSync(faqPath, "utf-8");

if (faqContent.includes("FaqAccordion2")) {
  console.log("✅ FAQ.tsx updated to use FaqAccordion2 primitive");
} else {
  console.error("❌ FAQ.tsx does not import FaqAccordion2");
  passed = false;
}

if (!passed) {
  console.error("💥 Verification failed for Task 145.");
  process.exit(1);
} else {
  console.log("🎉 Task 145 Verification Passed 100%!");
}
