import fs from "fs";
import path from "path";

console.log("---------------------------------------------------------");
console.log("   STUDENT HERO OVERHAUL & FLOATING 3D LUGGAGE TEST      ");
console.log("---------------------------------------------------------");

const rootDir = process.cwd();

// 1. Verify Floating3DLuggage file & exports
const floatingLuggagePath = path.join(rootDir, "src", "components", "stash", "Floating3DLuggage.tsx");
if (!fs.existsSync(floatingLuggagePath)) {
  console.error("❌ FAILED: Floating3DLuggage.tsx does not exist!");
  process.exit(1);
}

const floatingContent = fs.readFileSync(floatingLuggagePath, "utf-8");
if (!floatingContent.includes("export const Floating3DLuggage")) {
  console.error("❌ FAILED: Floating3DLuggage export missing!");
  process.exit(1);
}
console.log("✅ CHECK 1: Floating3DLuggage.tsx component created & exported properly.");

// 2. Check 3D Card mockups details inside Floating3DLuggage
if (
  !floatingContent.includes("Card3D") ||
  !floatingContent.includes("₹300/mo") ||
  !floatingContent.includes("QR-SEAL")
) {
  console.error("❌ FAILED: Floating3DLuggage missing Card3D, ₹300 pricing or QR seal indicators!");
  process.exit(1);
}
console.log("✅ CHECK 2: Floating3DLuggage contains 3D Card tilt, ₹300/mo pricing, and QR tamper-proof seals.");

// 3. Verify Hero.tsx integration
const heroPath = path.join(rootDir, "src", "components", "stash", "Hero.tsx");
const heroContent = fs.readFileSync(heroPath, "utf-8");

if (!heroContent.includes("Floating3DLuggage")) {
  console.error("❌ FAILED: Hero.tsx does not import or render Floating3DLuggage!");
  process.exit(1);
}
console.log("✅ CHECK 3: Hero.tsx successfully imports & mounts Floating3DLuggage.");

// 4. Verify neon emerald headline glow
if (!heroContent.includes("text-gradient-mint") || !heroContent.includes("drop-shadow-[0_0_35px_rgba(0,245,160,0.55)]")) {
  console.error("❌ FAILED: Hero.tsx missing ultra-crisp neon emerald headline glow filter!");
  process.exit(1);
}
console.log("✅ CHECK 4: Student Hero title features ultra-crisp neon emerald headline glow drop-shadow.");

// 5. Verify Instant ₹300/mo value badge
if (!heroContent.includes("Instant Micro-Storage") || !heroContent.includes("₹300/bag/mo")) {
  console.error("❌ FAILED: Hero.tsx missing instant ₹300/bag/mo value badge!");
  process.exit(1);
}
console.log("✅ CHECK 5: Student Hero prominently features instant ₹300/bag/mo value badge.");

console.log("---------------------------------------------------------");
console.log("🎉 ALL STUDENT HERO OVERHAUL CHECKS PASSED SUCCESSFULLY!");
console.log("---------------------------------------------------------");
