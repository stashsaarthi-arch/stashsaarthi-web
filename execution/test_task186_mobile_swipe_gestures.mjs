import { readFileSync } from "fs";
import { execSync } from "child_process";

console.log("=================================================");
console.log("   TASK 186 VERIFICATION: MOBILE CARD SWIPE GESTURES");
console.log("=================================================");

// 1. Verify design tokens in src/lib/designTokens.ts
const designTokensContent = readFileSync("src/lib/designTokens.ts", "utf-8");
if (!designTokensContent.includes("MOBILE_SWIPE_GESTURE_TOKENS")) {
  console.error("❌ FAILED: MOBILE_SWIPE_GESTURE_TOKENS missing in designTokens.ts");
  process.exit(1);
}
if (!designTokensContent.includes("getMobileSwipeGestureTokens")) {
  console.error("❌ FAILED: getMobileSwipeGestureTokens missing in designTokens.ts");
  process.exit(1);
}
console.log("✅ PASS: MOBILE_SWIPE_GESTURE_TOKENS defined in designTokens.ts");

// 2. Verify CSS utilities in src/styles.css
const stylesContent = readFileSync("src/styles.css", "utf-8");
if (!stylesContent.includes(".mobile-swipe-gesture-container")) {
  console.error("❌ FAILED: .mobile-swipe-gesture-container CSS class missing in styles.css");
  process.exit(1);
}
if (!stylesContent.includes(".mobile-swipe-inertia-snap")) {
  console.error("❌ FAILED: .mobile-swipe-inertia-snap CSS class missing in styles.css");
  process.exit(1);
}
console.log("✅ PASS: Mobile Swipe CSS utilities defined in styles.css");

// 3. Verify hook in src/hooks/useMobileSwipeGesture.ts
const hookContent = readFileSync("src/hooks/useMobileSwipeGesture.ts", "utf-8");
if (!hookContent.includes("export function useMobileSwipeGesture")) {
  console.error("❌ FAILED: useMobileSwipeGesture function missing in useMobileSwipeGesture.ts");
  process.exit(1);
}
console.log("✅ PASS: useMobileSwipeGesture custom hook created");

// 4. Verify primitive component in src/components/ui/MobileSwipeGallery.tsx
const galleryContent = readFileSync("src/components/ui/MobileSwipeGallery.tsx", "utf-8");
if (!galleryContent.includes("export const MobileSwipeGallery")) {
  console.error("❌ FAILED: MobileSwipeGallery component missing in MobileSwipeGallery.tsx");
  process.exit(1);
}
console.log("✅ PASS: MobileSwipeGallery component created");

// 5. Verify component integrations
const testimonialContent = readFileSync("src/components/ui/TestimonialCarousel2.tsx", "utf-8");
if (!testimonialContent.includes("useMobileSwipeGesture")) {
  console.error("❌ FAILED: TestimonialCarousel2 does not integrate useMobileSwipeGesture");
  process.exit(1);
}
console.log("✅ PASS: TestimonialCarousel2 integrated with mobile swipe gestures");

const spacesCardContent = readFileSync("src/components/ui/SaarthiSpacesCard2.tsx", "utf-8");
if (!spacesCardContent.includes("useMobileSwipeGesture")) {
  console.error("❌ FAILED: SaarthiSpacesCard2 does not integrate useMobileSwipeGesture");
  process.exit(1);
}
console.log("✅ PASS: SaarthiSpacesCard2 integrated with mobile swipe gestures");

// 6. Verify re-exports in primitives.ts and index.ts
const primitivesContent = readFileSync("src/components/ui/primitives.ts", "utf-8");
if (!primitivesContent.includes("MobileSwipeGallery") || !primitivesContent.includes("useMobileSwipeGesture")) {
  console.error("❌ FAILED: primitives.ts does not re-export MobileSwipeGallery or useMobileSwipeGesture");
  process.exit(1);
}
console.log("✅ PASS: primitives.ts re-exports MobileSwipeGallery and useMobileSwipeGesture");

// 7. Verify npm run build
console.log("\nRunning TypeScript & Vite build verification (npm run build)...");
try {
  execSync("npm run build", { stdio: "inherit" });
  console.log("\n🎉 ALL CHECKS PASSED SUCCESSFULLY FOR TASK 186!");
} catch (err) {
  console.error("\n❌ BUILD FAILED!");
  process.exit(1);
}
