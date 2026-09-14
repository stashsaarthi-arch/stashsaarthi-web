import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

console.log("🔍 Verifying Floating Social Proof Avatars (Task 125)...");

const componentPath = resolve("src/components/stash/SocialProofAvatars.tsx");
if (!existsSync(componentPath)) {
  console.error("❌ SocialProofAvatars.tsx file missing!");
  process.exit(1);
}

const componentContent = readFileSync(componentPath, "utf-8");

// 1. Verify component export and avatar members
if (!componentContent.includes("export const SocialProofAvatars")) {
  console.error("❌ Missing export SocialProofAvatars!");
  process.exit(1);
}
if (!componentContent.includes("MEMBERS")) {
  console.error("❌ Missing MEMBERS array!");
  process.exit(1);
}
console.log("✅ Verified SocialProofAvatars export and member data.");

// 2. Verify Kakadeo, IIT Kanpur, HBTI member indicators
const requiredLocations = ["Kakadeo", "IIT Kanpur", "HBTI", "CSJMU"];
for (const loc of requiredLocations) {
  if (!componentContent.includes(loc)) {
    console.error(`❌ Missing verified community member location: ${loc}`);
    process.exit(1);
  }
}
console.log("✅ Verified member locations (Kakadeo, IIT Kanpur, HBTI, CSJMU).");

// 3. Verify real-time pulsing beacon and Web Audio micro-haptics
if (!componentContent.includes("animate-ping")) {
  console.error("❌ Missing live pulsing beacon animation (animate-ping)!");
  process.exit(1);
}
if (!componentContent.includes("playPop")) {
  console.error("❌ Missing Web Audio haptics (playPop)!");
  process.exit(1);
}
console.log("✅ Verified live pulsing beacon and Web Audio micro-haptics.");

// 4. Verify Hero.tsx integration
const heroPath = resolve("src/components/stash/Hero.tsx");
const heroContent = readFileSync(heroPath, "utf-8");
if (!heroContent.includes("SocialProofAvatars")) {
  console.error("❌ Hero.tsx missing SocialProofAvatars component integration!");
  process.exit(1);
}
console.log("✅ Verified Hero.tsx integration.");

console.log("🎉 ALL 5/5 FLOATING SOCIAL PROOF AVATARS CHECKS PASSED SUCCESSFULLY!");
