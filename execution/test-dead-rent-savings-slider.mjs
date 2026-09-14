import fs from "fs";
import path from "path";

console.log("=== StashSaarthi Task 157: Interactive Dead Rent Savings Slider Test Suite ===");

const rootDir = process.cwd();
const designTokensPath = path.join(rootDir, "src", "lib", "designTokens.ts");
const stylesCssPath = path.join(rootDir, "src", "styles.css");
const sliderComponentPath = path.join(rootDir, "src", "components", "ui", "DeadRentSavingsSlider.tsx");
const primitivesPath = path.join(rootDir, "src", "components", "ui", "primitives.ts");
const valueSwitcherPath = path.join(rootDir, "src", "components", "stash", "InteractiveValueSwitcher.tsx");

// 1. Verify Design Tokens
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");
if (!designTokensContent.includes("DEAD_RENT_SLIDER_TOKENS") || !designTokensContent.includes("getDeadRentSliderTokens")) {
  console.error("❌ FAILED: DEAD_RENT_SLIDER_TOKENS or getDeadRentSliderTokens missing in designTokens.ts");
  process.exit(1);
}
console.log("✓ PASSED: DEAD_RENT_SLIDER_TOKENS & getDeadRentSliderTokens helper found in designTokens.ts");

// 2. Verify Keyframes & CSS Utilities
const stylesCssContent = fs.readFileSync(stylesCssPath, "utf-8");
if (!stylesCssContent.includes("@keyframes note-float-up") || !stylesCssContent.includes("currency-note-particle")) {
  console.error("❌ FAILED: @keyframes note-float-up or .currency-note-particle missing in styles.css");
  process.exit(1);
}
console.log("✓ PASSED: @keyframes note-float-up & currency-note-particle class found in styles.css");

// 3. Verify Primitive Component
if (!fs.existsSync(sliderComponentPath)) {
  console.error("❌ FAILED: DeadRentSavingsSlider.tsx does not exist");
  process.exit(1);
}
const sliderContent = fs.readFileSync(sliderComponentPath, "utf-8");
if (!sliderContent.includes("DeadRentSavingsSlider") || !sliderContent.includes("currency-note-particle")) {
  console.error("❌ FAILED: DeadRentSavingsSlider component structure invalid");
  process.exit(1);
}
console.log("✓ PASSED: DeadRentSavingsSlider.tsx component created successfully");

// 4. Verify Primitive Re-export
const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");
if (!primitivesContent.includes("DeadRentSavingsSlider")) {
  console.error("❌ FAILED: DeadRentSavingsSlider not re-exported in primitives.ts");
  process.exit(1);
}
console.log("✓ PASSED: DeadRentSavingsSlider re-exported in primitives.ts");

// 5. Verify Integration in InteractiveValueSwitcher
const valueSwitcherContent = fs.readFileSync(valueSwitcherPath, "utf-8");
if (!valueSwitcherContent.includes("DeadRentSavingsSlider")) {
  console.error("❌ FAILED: DeadRentSavingsSlider not integrated in InteractiveValueSwitcher.tsx");
  process.exit(1);
}
console.log("✓ PASSED: DeadRentSavingsSlider integrated into InteractiveValueSwitcher.tsx");

console.log("\n🎉 ALL TASK 157 CHECKS PASSED PERFECTLY!");
