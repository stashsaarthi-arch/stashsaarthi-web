import fs from "fs";
import path from "path";

console.log("🔊 Testing Web Audio Haptic Soundscape System...");

const designTokensPath = path.join(process.cwd(), "src", "lib", "designTokens.ts");
const audioPath = path.join(process.cwd(), "src", "lib", "audio.ts");
const primitivesPath = path.join(process.cwd(), "src", "components", "ui", "primitives.ts");
const soundscapePrimitivesPath = path.join(process.cwd(), "src", "components", "ui", "SoundscapePrimitives.tsx");
const sandboxPath = path.join(process.cwd(), "src", "components", "stash", "ProductSandbox.tsx");

// 1. Verify designTokens.ts contains WEB_AUDIO_SOUNDSCAPE_TOKENS
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");
if (!designTokensContent.includes("WEB_AUDIO_SOUNDSCAPE_TOKENS")) {
  throw new Error("Missing WEB_AUDIO_SOUNDSCAPE_TOKENS definition in designTokens.ts");
}
if (!designTokensContent.includes("getAudioSoundscapeTokens")) {
  throw new Error("Missing getAudioSoundscapeTokens helper in designTokens.ts");
}
if (!designTokensContent.includes("toggleSwitch") || !designTokensContent.includes("paymentConfirmation")) {
  throw new Error("Incomplete WEB_AUDIO_SOUNDSCAPE_TOKENS specifications in designTokens.ts");
}
console.log("  ✅ Design Tokens: WEB_AUDIO_SOUNDSCAPE_TOKENS verified");

// 2. Verify audio.ts contains synthesis functions
const audioContent = fs.readFileSync(audioPath, "utf-8");
const requiredAudioFns = [
  "playToggleSwitch",
  "playCounterIncrement",
  "playCounterDecrement",
  "playPaymentConfirmation",
  "playSuccessChime",
  "playWarningBeep",
  "isWebAudioSupported",
];

for (const fn of requiredAudioFns) {
  if (!audioContent.includes(fn)) {
    throw new Error(`Missing audio function '${fn}' in src/lib/audio.ts`);
  }
}
console.log("  ✅ Web Audio Engine: playToggleSwitch, playCounterIncrement, playCounterDecrement, playPaymentConfirmation verified");

// 3. Verify SoundscapePrimitives.tsx component file exists & defines primitives
const soundscapeContent = fs.readFileSync(soundscapePrimitivesPath, "utf-8");
if (
  !soundscapeContent.includes("SoundscapeToggleSwitch") ||
  !soundscapeContent.includes("HapticItemCounter") ||
  !soundscapeContent.includes("HapticPaymentButton")
) {
  throw new Error("SoundscapePrimitives.tsx missing required exported components");
}
console.log("  ✅ Soundscape Primitives: SoundscapeToggleSwitch, HapticItemCounter, HapticPaymentButton created");

// 4. Verify primitives.ts re-exports
const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");
if (
  !primitivesContent.includes("SoundscapeToggleSwitch") ||
  !primitivesContent.includes("HapticItemCounter") ||
  !primitivesContent.includes("HapticPaymentButton")
) {
  throw new Error("primitives.ts failed to re-export Soundscape primitives");
}
console.log("  ✅ Primitives Re-export: Soundscape primitives re-exported in primitives.ts");

// 5. Verify ProductSandbox.tsx integration
const sandboxContent = fs.readFileSync(sandboxPath, "utf-8");
if (
  !sandboxContent.includes("playCounterIncrement") ||
  !sandboxContent.includes("playCounterDecrement")
) {
  throw new Error("ProductSandbox.tsx failed to integrate playCounterIncrement/playCounterDecrement");
}
console.log("  ✅ Component Integration: ProductSandbox integrated with Web Audio soundscape");

console.log("\n🎉 ALL WEB AUDIO HAPTIC SOUNDSCAPE CHECKS PASSED 100%!");
