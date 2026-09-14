import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

console.log("🚀 Starting Organic Spring Modal Entrances Verification Suite (Task 153)...\n");

const rootDir = process.cwd();

// 1. Verify designTokens.ts
const designTokensPath = path.join(rootDir, "src", "lib", "designTokens.ts");
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");

if (!designTokensContent.includes("SPRING_MODAL_TOKENS")) {
  console.error("❌ ERROR: SPRING_MODAL_TOKENS not found in src/lib/designTokens.ts");
  process.exit(1);
}
if (!designTokensContent.includes("cubic-bezier(0.16, 1, 0.3, 1)")) {
  console.error("❌ ERROR: Spring bezier curve missing in designTokens.ts");
  process.exit(1);
}
if (!designTokensContent.includes("getSpringModalTokens")) {
  console.error("❌ ERROR: getSpringModalTokens helper function missing in designTokens.ts");
  process.exit(1);
}
console.log("✅ 1. SPRING_MODAL_TOKENS & getSpringModalTokens validated in designTokens.ts");

// 2. Verify styles.css
const stylesCssPath = path.join(rootDir, "src", "styles.css");
const stylesCssContent = fs.readFileSync(stylesCssPath, "utf-8");

if (!stylesCssContent.includes("@keyframes modal-spring-enter")) {
  console.error("❌ ERROR: @keyframes modal-spring-enter missing in src/styles.css");
  process.exit(1);
}
if (!stylesCssContent.includes("modal-spring-entrance")) {
  console.error("❌ ERROR: .modal-spring-entrance class missing in src/styles.css");
  process.exit(1);
}
console.log("✅ 2. Spring Modal Entrance CSS keyframes & utilities validated in styles.css");

// 3. Verify dialog.tsx
const dialogPath = path.join(rootDir, "src", "components", "ui", "dialog.tsx");
const dialogContent = fs.readFileSync(dialogPath, "utf-8");

if (!dialogContent.includes("cubic-bezier(0.16,1,0.3,1)")) {
  console.error("❌ ERROR: cubic-bezier(0.16,1,0.3,1) timing missing in src/components/ui/dialog.tsx");
  process.exit(1);
}
if (!dialogContent.includes("modal-spring-entrance")) {
  console.error("❌ ERROR: modal-spring-entrance class missing in src/components/ui/dialog.tsx");
  process.exit(1);
}
console.log("✅ 3. DialogOverlay & DialogContent spring transition timing validated in dialog.tsx");

// 4. Verify SpringModal.tsx
const springModalPath = path.join(rootDir, "src", "components", "ui", "SpringModal.tsx");
if (!fs.existsSync(springModalPath)) {
  console.error("❌ ERROR: src/components/ui/SpringModal.tsx does not exist!");
  process.exit(1);
}
const springModalContent = fs.readFileSync(springModalPath, "utf-8");
if (!springModalContent.includes("SpringModalContent") || !springModalContent.includes("SpringModal")) {
  console.error("❌ ERROR: SpringModal / SpringModalContent exports missing in SpringModal.tsx");
  process.exit(1);
}
console.log("✅ 4. SpringModal & SpringModalContent components validated in SpringModal.tsx");

// 5. Verify primitives.ts re-export
const primitivesPath = path.join(rootDir, "src", "components", "ui", "primitives.ts");
const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");

if (!primitivesContent.includes("SpringModal")) {
  console.error("❌ ERROR: SpringModal primitive re-export missing in primitives.ts");
  process.exit(1);
}
console.log("✅ 5. SpringModal re-exported in src/components/ui/primitives.ts");

// 6. Production Build Check
console.log("\n📦 Running TypeScript & Production Build Verification (npm run build)...");
try {
  const buildOutput = execSync("npm run build", { cwd: rootDir, encoding: "utf-8" });
  console.log("✅ 6. Production Build Succeeded cleanly!\n");
} catch (err) {
  console.error("❌ ERROR: npm run build failed during spring modal verification:", err);
  process.exit(1);
}

console.log("🎉 ALL ORGANIC SPRING MODAL ENTRANCE CHECKS PASSED 100%!");
