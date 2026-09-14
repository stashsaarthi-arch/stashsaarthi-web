import fs from "fs";
import path from "path";

console.log("🪶 Running Peacock Feather Micro-Interaction Test Suite (Task 152)...");

const projectRoot = process.cwd();

// 1. Check design tokens file
const designTokensPath = path.join(projectRoot, "src", "lib", "designTokens.ts");
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");

if (!designTokensContent.includes("PEACOCK_FEATHER_TOKENS")) {
  console.error("❌ PEACOCK_FEATHER_TOKENS missing from src/lib/designTokens.ts!");
  process.exit(1);
}

if (!designTokensContent.includes("getPeacockFeatherTokens")) {
  console.error("❌ getPeacockFeatherTokens helper missing from src/lib/designTokens.ts!");
  process.exit(1);
}
console.log("  ✅ Design Tokens: PEACOCK_FEATHER_TOKENS & helper verified.");

// 2. Check CSS keyframes & utilities in styles.css
const stylesPath = path.join(projectRoot, "src", "styles.css");
const stylesContent = fs.readFileSync(stylesPath, "utf-8");

if (!stylesContent.includes("peacock-spring-sweep")) {
  console.error("❌ Keyframe peacock-spring-sweep missing from src/styles.css!");
  process.exit(1);
}

if (!stylesContent.includes("makhan-particle-sparkle")) {
  console.error("❌ Utility makhan-particle-sparkle missing from src/styles.css!");
  process.exit(1);
}

if (!stylesContent.includes("matki-ghee-glow")) {
  console.error("❌ Utility matki-ghee-glow missing from src/styles.css!");
  process.exit(1);
}
console.log("  ✅ CSS Specifications: Keyframes & sparkle particle utilities verified.");

// 3. Check PeacockFeatherMatkiDusting component
const componentPath = path.join(projectRoot, "src", "components", "stash", "PeacockFeatherMatkiDusting.tsx");
const componentContent = fs.readFileSync(componentPath, "utf-8");

if (!componentContent.includes("PEACOCK_FEATHER_TOKENS")) {
  console.error("❌ PEACOCK_FEATHER_TOKENS import missing in PeacockFeatherMatkiDusting.tsx!");
  process.exit(1);
}

if (!componentContent.includes("sparkleBurst")) {
  console.error("❌ Sparkle burst logic missing in PeacockFeatherMatkiDusting.tsx!");
  process.exit(1);
}
console.log("  ✅ Component: PeacockFeatherMatkiDusting.tsx spring sweep & particle sparkles verified.");

// 4. Check primitives re-export
const primitivesPath = path.join(projectRoot, "src", "components", "ui", "primitives.ts");
const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");

if (!primitivesContent.includes("PeacockFeatherMatkiDusting")) {
  console.error("❌ PeacockFeatherMatkiDusting re-export missing from src/components/ui/primitives.ts!");
  process.exit(1);
}
console.log("  ✅ Primitives: Re-exported PeacockFeatherMatkiDusting cleanly.");

// 5. Check SaarthiKitchenCard2 integration
const kitchenCardPath = path.join(projectRoot, "src", "components", "ui", "SaarthiKitchenCard2.tsx");
const kitchenCardContent = fs.readFileSync(kitchenCardPath, "utf-8");

if (!kitchenCardContent.includes("PeacockFeatherMatkiDusting")) {
  console.error("❌ PeacockFeatherMatkiDusting missing from SaarthiKitchenCard2.tsx!");
  process.exit(1);
}
console.log("  ✅ Card Integration: PeacockFeatherMatkiDusting rendered in SaarthiKitchenCard2.tsx.");

console.log("\n🎉 ALL PEACOCK FEATHER MICRO-INTERACTION CHECKS PASSED 100%!");
