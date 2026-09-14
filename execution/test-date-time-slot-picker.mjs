import fs from "fs";
import path from "path";

console.log("🔍 Verifying Task 164: Date & Time Slot Picker Integration...");

// 1. Verify design tokens in src/lib/designTokens.ts
const designTokensPath = path.resolve("src/lib/designTokens.ts");
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");

if (
  !designTokensContent.includes("DATE_TIME_SLOT_PICKER_TOKENS") ||
  !designTokensContent.includes("getDateTimeSlotPickerTokens")
) {
  console.error("❌ ERROR: DATE_TIME_SLOT_PICKER_TOKENS missing in designTokens.ts");
  process.exit(1);
}
console.log("✅ designTokens.ts contains DATE_TIME_SLOT_PICKER_TOKENS and helper function.");

// 2. Verify styles in src/styles.css
const stylesPath = path.resolve("src/styles.css");
const stylesContent = fs.readFileSync(stylesPath, "utf-8");

if (
  !stylesContent.includes(".date-time-picker-stage") ||
  !stylesContent.includes(".preset-holiday-chip") ||
  !stylesContent.includes(".time-slot-card")
) {
  console.error("❌ ERROR: Date & Time Slot Picker CSS classes missing in styles.css");
  process.exit(1);
}
console.log("✅ styles.css contains Date & Time Slot Picker utility classes.");

// 3. Verify DateTimeSlotPicker component implementation
const componentPath = path.resolve("src/components/ui/DateTimeSlotPicker.tsx");
if (!fs.existsSync(componentPath)) {
  console.error("❌ ERROR: src/components/ui/DateTimeSlotPicker.tsx file does not exist.");
  process.exit(1);
}

const componentContent = fs.readFileSync(componentPath, "utf-8");
if (
  !componentContent.includes("export function DateTimeSlotPicker") ||
  !componentContent.includes("usePersona") ||
  !componentContent.includes("useLanguage")
) {
  console.error("❌ ERROR: DateTimeSlotPicker.tsx missing required exports or context hooks.");
  process.exit(1);
}
console.log("✅ DateTimeSlotPicker.tsx component is properly implemented.");

// 4. Verify re-export in src/components/ui/primitives.ts
const primitivesPath = path.resolve("src/components/ui/primitives.ts");
const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");

if (!primitivesContent.includes("DateTimeSlotPicker")) {
  console.error("❌ ERROR: DateTimeSlotPicker missing from primitives.ts re-exports.");
  process.exit(1);
}
console.log("✅ DateTimeSlotPicker re-exported from primitives.ts.");

console.log("🎉 Task 164 verification checks passed!");
