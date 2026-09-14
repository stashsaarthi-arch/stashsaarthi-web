import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

console.log("=================================================");
console.log("🧪 TASK 162: PHONE & 6-DIGIT OTP INPUT VERIFICATION");
console.log("=================================================\n");

let passed = true;

// 1. Verify Design Tokens
const designTokensPath = resolve("src/lib/designTokens.ts");
if (existsSync(designTokensPath)) {
  const code = readFileSync(designTokensPath, "utf-8");
  if (
    code.includes("PHONE_OTP_INPUT_TOKENS") &&
    code.includes("getPhoneOtpInputTokens") &&
    code.includes("countryCode: \"+91\"") &&
    code.includes("otpLength: 6")
  ) {
    console.log("✅ [1/5] Design Tokens: PHONE_OTP_INPUT_TOKENS & getPhoneOtpInputTokens verified.");
  } else {
    console.error("❌ [1/5] Design Tokens: Missing PHONE_OTP_INPUT_TOKENS or helper in designTokens.ts.");
    passed = false;
  }
} else {
  console.error("❌ [1/5] File missing: src/lib/designTokens.ts");
  passed = false;
}

// 2. Verify CSS Utilities
const stylesCssPath = resolve("src/styles.css");
if (existsSync(stylesCssPath)) {
  const css = readFileSync(stylesCssPath, "utf-8");
  if (
    css.includes(".phone-input-wrapper") &&
    css.includes(".phone-prefix-pill") &&
    css.includes(".otp-digit-grid") &&
    css.includes(".otp-digit-cell") &&
    css.includes(".otp-digit-error") &&
    css.includes("@keyframes otp-shake")
  ) {
    console.log("✅ [2/5] CSS Utilities: .phone-input-wrapper, .phone-prefix-pill, .otp-digit-cell, & @keyframes otp-shake verified.");
  } else {
    console.error("❌ [2/5] CSS Utilities: Missing rules in src/styles.css");
    passed = false;
  }
} else {
  console.error("❌ [2/5] File missing: src/styles.css");
  passed = false;
}

// 3. Verify Primitive Component
const phoneOtpInputPath = resolve("src/components/ui/PhoneOtpInput.tsx");
if (existsSync(phoneOtpInputPath)) {
  const componentCode = readFileSync(phoneOtpInputPath, "utf-8");
  if (
    componentCode.includes("export function IndianPhoneInput") &&
    componentCode.includes("export function OtpSixDigitInput") &&
    componentCode.includes("export function PhoneOtpAuthFlow") &&
    componentCode.includes("handlePaste") &&
    componentCode.includes("inputRefs")
  ) {
    console.log("✅ [3/5] Component: IndianPhoneInput, OtpSixDigitInput, & PhoneOtpAuthFlow primitives verified.");
  } else {
    console.error("❌ [3/5] Component: Missing required functions or features in PhoneOtpInput.tsx");
    passed = false;
  }
} else {
  console.error("❌ [3/5] File missing: src/components/ui/PhoneOtpInput.tsx");
  passed = false;
}

// 4. Verify Primitives Re-export
const primitivesPath = resolve("src/components/ui/primitives.ts");
if (existsSync(primitivesPath)) {
  const primCode = readFileSync(primitivesPath, "utf-8");
  if (
    primCode.includes("IndianPhoneInput") &&
    primCode.includes("OtpSixDigitInput") &&
    primCode.includes("PhoneOtpAuthFlow")
  ) {
    console.log("✅ [4/5] Primitives Re-export: Exported in src/components/ui/primitives.ts.");
  } else {
    console.error("❌ [4/5] Primitives Re-export: Missing PhoneOtpInput re-exports in primitives.ts.");
    passed = false;
  }
} else {
  console.error("❌ [4/5] File missing: src/components/ui/primitives.ts");
  passed = false;
}

// 5. Verify BookingModal Integration
const bookingModalPath = resolve("src/components/stash/BookingModal.tsx");
if (existsSync(bookingModalPath)) {
  const modalCode = readFileSync(bookingModalPath, "utf-8");
  if (
    modalCode.includes("IndianPhoneInput")
  ) {
    console.log("✅ [5/5] BookingModal Integration: IndianPhoneInput integrated into BookingModal.tsx.");
  } else {
    console.error("❌ [5/5] BookingModal Integration: Missing IndianPhoneInput in BookingModal.tsx.");
    passed = false;
  }
} else {
  console.error("❌ [5/5] File missing: src/components/stash/BookingModal.tsx");
  passed = false;
}

if (passed) {
  console.log("\n=================================================");
  console.log("🎉 ALL PHONE & 6-DIGIT OTP INPUT CHECKS PASSED!");
  console.log("=================================================\n");
  process.exit(0);
} else {
  console.error("\n❌ VERIFICATION FAILED.");
  process.exit(1);
}
