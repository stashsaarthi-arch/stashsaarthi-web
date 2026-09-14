import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log("🧪 Testing Task 169: [UI - WhatsApp Quick-Checkout Fallback / distill] Implementation...");

const root = process.cwd();

// 1. Verify designTokens.ts
const tokensPath = join(root, 'src', 'lib', 'designTokens.ts');
if (!existsSync(tokensPath)) {
  console.error("❌ designTokens.ts not found!");
  process.exit(1);
}

const tokensContent = readFileSync(tokensPath, 'utf8');
if (
  !tokensContent.includes("WHATSAPP_CHECKOUT_FALLBACK_TOKENS") ||
  !tokensContent.includes("getWhatsAppCheckoutFallbackTokens")
) {
  console.error("❌ WHATSAPP_CHECKOUT_FALLBACK_TOKENS missing from designTokens.ts");
  process.exit(1);
}
console.log("✅ designTokens.ts exports WHATSAPP_CHECKOUT_FALLBACK_TOKENS & getWhatsAppCheckoutFallbackTokens.");

// 2. Verify styles.css
const cssPath = join(root, 'src', 'styles.css');
const cssContent = readFileSync(cssPath, 'utf8');
if (
  !cssContent.includes("whatsapp-fallback-modal-overlay") ||
  !cssContent.includes("whatsapp-fallback-card") ||
  !cssContent.includes("whatsapp-signal-badge")
) {
  console.error("❌ WhatsApp fallback CSS rules missing from styles.css");
  process.exit(1);
}
console.log("✅ styles.css includes WhatsApp fallback CSS rules.");

// 3. Verify Component
const compPath = join(root, 'src', 'components', 'ui', 'WhatsAppCheckoutFallbackModal.tsx');
if (!existsSync(compPath)) {
  console.error("❌ WhatsAppCheckoutFallbackModal.tsx file missing!");
  process.exit(1);
}
const compContent = readFileSync(compPath, 'utf8');
if (
  !compContent.includes("export const WhatsAppCheckoutFallbackModal") ||
  !compContent.includes("formattedWhatsAppText") ||
  !compContent.includes("whatsappUrl") ||
  !compContent.includes("handleCopyMessage")
) {
  console.error("❌ WhatsAppCheckoutFallbackModal component missing required methods or exports!");
  process.exit(1);
}
console.log("✅ WhatsAppCheckoutFallbackModal.tsx component is fully implemented.");

// 4. Verify primitives re-export
const primPath = join(root, 'src', 'components', 'ui', 'primitives.ts');
const primContent = readFileSync(primPath, 'utf8');
if (!primContent.includes("WhatsAppCheckoutFallbackModal")) {
  console.error("❌ WhatsAppCheckoutFallbackModal missing from primitives.ts");
  process.exit(1);
}
console.log("✅ primitives.ts re-exports WhatsAppCheckoutFallbackModal.");

// 5. Verify BookingModal integration
const bookingModalPath = join(root, 'src', 'components', 'stash', 'BookingModal.tsx');
const bookingModalContent = readFileSync(bookingModalPath, 'utf8');
if (
  !bookingModalContent.includes("WhatsAppCheckoutFallbackModal") ||
  !bookingModalContent.includes("showWhatsAppFallbackModal")
) {
  console.error("❌ WhatsAppCheckoutFallbackModal missing from BookingModal.tsx!");
  process.exit(1);
}
console.log("✅ BookingModal.tsx integrates WhatsAppCheckoutFallbackModal cleanly.");

console.log("🎉 TASK 169 VERIFICATION SUCCESSFUL!");
