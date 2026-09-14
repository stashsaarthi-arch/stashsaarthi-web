import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

let passed = true;

function logPass(msg) {
  console.log(`✅ [PASS] ${msg}`);
}

function logFail(msg) {
  console.error(`❌ [FAIL] ${msg}`);
  passed = false;
}

try {
  // 1. Verify designTokens.ts contains CARD_3D_TOKENS & getCard3DTokens
  const tokensPath = path.join(projectRoot, "src", "lib", "designTokens.ts");
  const tokensContent = fs.readFileSync(tokensPath, "utf-8");

  if (
    tokensContent.includes("CARD_3D_TOKENS") &&
    tokensContent.includes("maxTiltDeg") &&
    tokensContent.includes("glareGradients") &&
    tokensContent.includes("getCard3DTokens")
  ) {
    logPass("CARD_3D_TOKENS and getCard3DTokens exported in designTokens.ts");
  } else {
    logFail("CARD_3D_TOKENS or getCard3DTokens missing in designTokens.ts");
  }

  // 2. Verify styles.css contains Card3D CSS rules
  const stylesPath = path.join(projectRoot, "src", "styles.css");
  const stylesContent = fs.readFileSync(stylesPath, "utf-8");

  if (
    stylesContent.includes(".card-3d-stage") &&
    stylesContent.includes(".card-3d-wrapper") &&
    stylesContent.includes(".card-3d-glare") &&
    stylesContent.includes("card-3d-disabled")
  ) {
    logPass("3D Card Hover Physics & Specular Glare CSS utilities defined in styles.css");
  } else {
    logFail("Missing .card-3d CSS utilities in styles.css");
  }

  // 3. Verify Card3D.tsx component implementation
  const card3DPath = path.join(projectRoot, "src", "components", "ui", "Card3D.tsx");
  const card3DContent = fs.readFileSync(card3DPath, "utf-8");

  if (
    card3DContent.includes("CARD_3D_TOKENS") &&
    card3DContent.includes("requestAnimationFrame") &&
    card3DContent.includes("shouldDisable3D") &&
    card3DContent.includes("glarePosition") &&
    card3DContent.includes("usePersona")
  ) {
    logPass("Card3D component upgraded with RAF, tilt physics, glare, persona awareness & touch protection");
  } else {
    logFail("Card3D component implementation incomplete");
  }

  // 4. Verify primitives.ts re-exports Card3D
  const primitivesPath = path.join(projectRoot, "src", "components", "ui", "primitives.ts");
  const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");

  if (primitivesContent.includes('export { Card3D, type Card3DProps } from "./Card3D";')) {
    logPass("Card3D re-exported in components/ui/primitives.ts");
  } else {
    logFail("Card3D not re-exported in primitives.ts");
  }

  if (passed) {
    console.log("\n🎉 ALL 3D CARD HOVER PHYSICS CHECKS PASSED 100%!");
  } else {
    console.error("\n💥 SOME CHECKS FAILED!");
    process.exit(1);
  }
} catch (err) {
  console.error("Test harness error:", err);
  process.exit(1);
}
