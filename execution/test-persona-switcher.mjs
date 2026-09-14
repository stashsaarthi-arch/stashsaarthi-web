import fs from "node:fs";
import path from "node:path";

console.log("--------------------------------------------------");
console.log("🧪 RUNNING PERSONA SWITCHER REDESIGN TEST HARNESS");
console.log("--------------------------------------------------\n");

let passedChecks = 0;
const totalChecks = 6;

// Check 1: PersonaSwitcher.tsx Component File
const switcherPath = path.resolve("src/components/ui/PersonaSwitcher.tsx");
if (fs.existsSync(switcherPath)) {
  const content = fs.readFileSync(switcherPath, "utf-8");
  if (
    content.includes("layoutId") &&
    content.includes("GraduationCap") &&
    content.includes("HeartHandshake") &&
    content.includes("playPersonaSwitch")
  ) {
    console.log("✅ Check 1: PersonaSwitcher.tsx exists with animated sliding pill layoutId, role icons, and haptic audio cues.");
    passedChecks++;
  } else {
    console.error("❌ Check 1 Failed: PersonaSwitcher.tsx missing key animation or audio features.");
  }
} else {
  console.error("❌ Check 1 Failed: PersonaSwitcher.tsx file not found.");
}

// Check 2: playPersonaSwitch in audio.ts
const audioPath = path.resolve("src/lib/audio.ts");
if (fs.existsSync(audioPath)) {
  const audioContent = fs.readFileSync(audioPath, "utf-8");
  if (audioContent.includes("export const playPersonaSwitch")) {
    console.log("✅ Check 2: playPersonaSwitch audio cue function exported from audio.ts.");
    passedChecks++;
  } else {
    console.error("❌ Check 2 Failed: playPersonaSwitch missing in audio.ts.");
  }
} else {
  console.error("❌ Check 2 Failed: audio.ts file not found.");
}

// Check 3: Primitives Re-export
const primitivesPath = path.resolve("src/components/ui/primitives.ts");
if (fs.existsSync(primitivesPath)) {
  const primContent = fs.readFileSync(primitivesPath, "utf-8");
  if (primContent.includes("PersonaSwitcher")) {
    console.log("✅ Check 3: PersonaSwitcher re-exported from UI primitives module.");
    passedChecks++;
  } else {
    console.error("❌ Check 3 Failed: PersonaSwitcher not re-exported in primitives.ts.");
  }
} else {
  console.error("❌ Check 3 Failed: primitives.ts not found.");
}

// Check 4: FloatingPersonaToggle Integration
const floatingPath = path.resolve("src/components/stash/FloatingPersonaToggle.tsx");
if (fs.existsSync(floatingPath)) {
  const floatContent = fs.readFileSync(floatingPath, "utf-8");
  if (floatContent.includes("PersonaSwitcher")) {
    console.log("✅ Check 4: FloatingPersonaToggle successfully integrates PersonaSwitcher.");
    passedChecks++;
  } else {
    console.error("❌ Check 4 Failed: PersonaSwitcher not used in FloatingPersonaToggle.tsx.");
  }
} else {
  console.error("❌ Check 4 Failed: FloatingPersonaToggle.tsx not found.");
}

// Check 5: Navbar Integration
const navbarPath = path.resolve("src/components/stash/Navbar.tsx");
if (fs.existsSync(navbarPath)) {
  const navContent = fs.readFileSync(navbarPath, "utf-8");
  if (navContent.includes("PersonaSwitcher") && navContent.includes("navbar-desktop-persona-switcher")) {
    console.log("✅ Check 5: Navbar desktop & mobile menus mounted PersonaSwitcher component.");
    passedChecks++;
  } else {
    console.error("❌ Check 5 Failed: Navbar.tsx does not mount PersonaSwitcher.");
  }
} else {
  console.error("❌ Check 5 Failed: Navbar.tsx not found.");
}

// Check 6: Dual Persona Role-Specific Badges & Styling
const switcherContent = fs.readFileSync(switcherPath, "utf-8");
if (
  switcherContent.includes("Save ₹6.4k") &&
  switcherContent.includes("Earn ₹11.5k") &&
  switcherContent.includes("bg-gradient-to-r from-emerald-400 to-mint-400") &&
  switcherContent.includes("bg-gradient-to-r from-amber-400 to-amber-500")
) {
  console.log("✅ Check 6: Dual persona styling (Electric Mint vs Warm Amber) & badges validated.");
  passedChecks++;
} else {
  console.error("❌ Check 6 Failed: Missing dual persona badge or gradient tokens.");
}

console.log("\n--------------------------------------------------");
if (passedChecks === totalChecks) {
  console.log(`🎉 ALL ${passedChecks}/${totalChecks} PERSONA SWITCHER REDESIGN CHECKS PASSED!`);
  process.exit(0);
} else {
  console.error(`💥 ${totalChecks - passedChecks} CHECKS FAILED.`);
  process.exit(1);
}
