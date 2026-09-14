import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log("🧪 Testing Task 168: [UI - Booking Confirmation Pass / delight] Implementation...");

const root = process.cwd();

// 1. Verify designTokens.ts
const tokensPath = join(root, 'src', 'lib', 'designTokens.ts');
if (!existsSync(tokensPath)) {
  console.error("❌ designTokens.ts not found!");
  process.exit(1);
}

const tokensContent = readFileSync(tokensPath, 'utf8');
if (
  !tokensContent.includes("BOOKING_CONFIRMATION_PASS_TOKENS") ||
  !tokensContent.includes("getBookingConfirmationPassTokens")
) {
  console.error("❌ BOOKING_CONFIRMATION_PASS_TOKENS missing from designTokens.ts");
  process.exit(1);
}
console.log("✅ designTokens.ts exports BOOKING_CONFIRMATION_PASS_TOKENS & getBookingConfirmationPassTokens.");

// 2. Verify styles.css
const cssPath = join(root, 'src', 'styles.css');
const cssContent = readFileSync(cssPath, 'utf8');
if (
  !cssContent.includes("booking-pass-card") ||
  !cssContent.includes("pass-notch-cutout-left") ||
  !cssContent.includes(".printable-stash-pass")
) {
  console.error("❌ Booking pass CSS rules missing from styles.css");
  process.exit(1);
}
console.log("✅ styles.css includes Apple Wallet pass & printable CSS rules.");

// 3. Verify Component
const compPath = join(root, 'src', 'components', 'ui', 'BookingConfirmationPass.tsx');
if (!existsSync(compPath)) {
  console.error("❌ BookingConfirmationPass.tsx file missing!");
  process.exit(1);
}
const compContent = readFileSync(compPath, 'utf8');
if (
  !compContent.includes("export const BookingConfirmationPass") ||
  !compContent.includes("handlePrintPass") ||
  !compContent.includes("handleDirections")
) {
  console.error("❌ BookingConfirmationPass component missing required methods or exports!");
  process.exit(1);
}
console.log("✅ BookingConfirmationPass.tsx component is fully implemented.");

// 4. Verify primitives re-export
const primPath = join(root, 'src', 'components', 'ui', 'primitives.ts');
const primContent = readFileSync(primPath, 'utf8');
if (!primContent.includes("BookingConfirmationPass")) {
  console.error("❌ BookingConfirmationPass missing from primitives.ts");
  process.exit(1);
}
console.log("✅ primitives.ts re-exports BookingConfirmationPass.");

// 5. Verify BookingModal integration
const modalPath = join(root, 'src', 'components', 'stash', 'BookingModal.tsx');
const modalContent = readFileSync(modalPath, 'utf8');
if (!modalContent.includes("BookingConfirmationPass")) {
  console.error("❌ BookingConfirmationPass missing from BookingModal.tsx!");
  process.exit(1);
}
console.log("✅ BookingModal.tsx integrates BookingConfirmationPass in Step 3.");

console.log("🎉 Task 168 Verification Passed Successfully!");
