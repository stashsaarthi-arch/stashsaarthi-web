import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Starting Task 166: UPI Payment Intent Modal Verification Test Suite...\n');

let passedChecks = 0;
let totalChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    console.log(`  ✅ PASSED: ${message}`);
    passedChecks++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
  }
}

// 1. Check designTokens.ts exports
const designTokensPath = path.join(rootDir, 'src', 'lib', 'designTokens.ts');
const designTokensContent = fs.readFileSync(designTokensPath, 'utf8');
assert(
  designTokensContent.includes('UPI_PAYMENT_INTENT_TOKENS') &&
    designTokensContent.includes('getUpiPaymentIntentTokens') &&
    designTokensContent.includes('gpay') &&
    designTokensContent.includes('phonepe') &&
    designTokensContent.includes('paytm') &&
    designTokensContent.includes('cred'),
  'designTokens.ts includes UPI_PAYMENT_INTENT_TOKENS and getUpiPaymentIntentTokens helper'
);

// 2. Check styles.css utility classes and keyframes
const stylesCssPath = path.join(rootDir, 'src', 'styles.css');
const stylesCssContent = fs.readFileSync(stylesCssPath, 'utf8');
assert(
  stylesCssContent.includes('.upi-modal-container') &&
    stylesCssContent.includes('.upi-app-tile') &&
    stylesCssContent.includes('.upi-qr-stage') &&
    stylesCssContent.includes('.upi-qr-scan-beam') &&
    stylesCssContent.includes('@keyframes upi-qr-sweep'),
  'styles.css includes UPI Payment Intent Modal utility classes and @keyframes upi-qr-sweep'
);

// 3. Check UpiPaymentIntentModal.tsx component implementation
const componentPath = path.join(rootDir, 'src', 'components', 'ui', 'UpiPaymentIntentModal.tsx');
assert(fs.existsSync(componentPath), 'UpiPaymentIntentModal.tsx primitive file exists');
if (fs.existsSync(componentPath)) {
  const componentContent = fs.readFileSync(componentPath, 'utf8');
  assert(
    componentContent.includes('export function UpiPaymentIntentModal') &&
      componentContent.includes('export function DynamicUpiQrCode') &&
      componentContent.includes('usePersona()') &&
      componentContent.includes('playPaymentConfirmation'),
    'UpiPaymentIntentModal.tsx contains UpiPaymentIntentModal, DynamicUpiQrCode, usePersona, and Web Audio feedback'
  );
}

// 4. Check primitives.ts re-exports
const primitivesPath = path.join(rootDir, 'src', 'components', 'ui', 'primitives.ts');
const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');
assert(
  primitivesContent.includes('UpiPaymentIntentModal') &&
    primitivesContent.includes('DynamicUpiQrCode') &&
    primitivesContent.includes('UpiPaymentIntentModalProps'),
  'primitives.ts re-exports UpiPaymentIntentModal and DynamicUpiQrCode'
);

// 5. Check BookingModal.tsx integration
const bookingModalPath = path.join(rootDir, 'src', 'components', 'stash', 'BookingModal.tsx');
const bookingModalContent = fs.readFileSync(bookingModalPath, 'utf8');
assert(
  bookingModalContent.includes('UpiPaymentIntentModal') &&
    bookingModalContent.includes('showUpiModal') &&
    bookingModalContent.includes('setShowUpiModal'),
  'BookingModal.tsx imports and mounts UpiPaymentIntentModal with state controls'
);

console.log(`\n📊 Task 166 Verification Summary: ${passedChecks}/${totalChecks} checks passed.`);

if (passedChecks !== totalChecks) {
  console.error('\n❌ Task 166 Verification Failed!');
  process.exit(1);
} else {
  console.log('\n🎉 Task 166 Verification PASSED 100%!');
}
