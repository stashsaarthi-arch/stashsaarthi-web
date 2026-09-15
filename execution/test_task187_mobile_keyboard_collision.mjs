import fs from "fs";
import path from "path";

console.log("🚀 Starting Task 187 Mobile Keyboard Collision Prevention verification suite...\n");

const baseDir = process.cwd();

// 1. Verify Design Tokens
const tokensFile = path.join(baseDir, "src", "lib", "designTokens.ts");
const tokensContent = fs.readFileSync(tokensFile, "utf-8");
if (!tokensContent.includes("MOBILE_KEYBOARD_COLLISION_TOKENS") || !tokensContent.includes("getMobileKeyboardCollisionTokens")) {
  console.error("❌ Failed: MOBILE_KEYBOARD_COLLISION_TOKENS missing in designTokens.ts");
  process.exit(1);
}
console.log("✅ Check 1 passed: MOBILE_KEYBOARD_COLLISION_TOKENS present in designTokens.ts");

// 2. Verify CSS Utilities
const cssFile = path.join(baseDir, "src", "styles.css");
const cssContent = fs.readFileSync(cssFile, "utf-8");
if (!cssContent.includes("Mobile Virtual Keyboard Collision Prevention Engine") || !cssContent.includes(".mobile-keyboard-collision-container")) {
  console.error("❌ Failed: Mobile Keyboard Collision CSS utilities missing in styles.css");
  process.exit(1);
}
console.log("✅ Check 2 passed: Mobile Keyboard Collision CSS utility rules present in styles.css");

// 3. Verify Custom Hook
const hookFile = path.join(baseDir, "src", "lib", "useMobileKeyboardCollision.ts");
if (!fs.existsSync(hookFile)) {
  console.error("❌ Failed: useMobileKeyboardCollision.ts hook file does not exist");
  process.exit(1);
}
const hookContent = fs.readFileSync(hookFile, "utf-8");
if (!hookContent.includes("export function useMobileKeyboardCollision")) {
  console.error("❌ Failed: useMobileKeyboardCollision function missing in hook file");
  process.exit(1);
}
console.log("✅ Check 3 passed: useMobileKeyboardCollision custom hook present");

// 4. Verify Primitive Component
const compFile = path.join(baseDir, "src", "components", "ui", "MobileKeyboardCollision.tsx");
if (!fs.existsSync(compFile)) {
  console.error("❌ Failed: MobileKeyboardCollision.tsx component file does not exist");
  process.exit(1);
}
const compContent = fs.readFileSync(compFile, "utf-8");
if (!compContent.includes("MobileKeyboardCollisionContainer") || !compContent.includes("KeyboardCollisionAuditBadge")) {
  console.error("❌ Failed: MobileKeyboardCollision primitives missing in component file");
  process.exit(1);
}
console.log("✅ Check 4 passed: MobileKeyboardCollision primitive components present");

// 5. Verify Primitive Re-exports
const primFile = path.join(baseDir, "src", "components", "ui", "primitives.ts");
const primContent = fs.readFileSync(primFile, "utf-8");
if (!primContent.includes("MobileKeyboardCollisionContainer") || !primContent.includes("useMobileKeyboardCollision")) {
  console.error("❌ Failed: MobileKeyboardCollision primitives not re-exported in primitives.ts");
  process.exit(1);
}
console.log("✅ Check 5 passed: MobileKeyboardCollision re-exported in primitives.ts");

// 6. Verify Index Re-exports
const indexFile = path.join(baseDir, "src", "components", "ui", "index.ts");
const indexContent = fs.readFileSync(indexFile, "utf-8");
if (!indexContent.includes("./MobileKeyboardCollision")) {
  console.error("❌ Failed: MobileKeyboardCollision module not re-exported in index.ts");
  process.exit(1);
}
console.log("✅ Check 6 passed: MobileKeyboardCollision re-exported in index.ts");

// 7. Verify Root Layout Integration
const rootFile = path.join(baseDir, "src", "routes", "__root.tsx");
const rootContent = fs.readFileSync(rootFile, "utf-8");
if (!rootContent.includes("useMobileKeyboardCollision")) {
  console.error("❌ Failed: useMobileKeyboardCollision hook not integrated in __root.tsx");
  process.exit(1);
}
console.log("✅ Check 7 passed: useMobileKeyboardCollision integrated in __root.tsx");

console.log("\n🎉 ALL TASK 187 VERIFICATION CHECKS PASSED (7/7 100%)!\n");
