import { readFileSync, existsSync } from "fs";
import { join } from "path";

console.log("🚀 Running UI Component Primitives Verification Suite (Task 107)...\n");

const baseDir = process.cwd();
const filesToCheck = [
  "src/components/ui/button.tsx",
  "src/components/ui/IconButton.tsx",
  "src/components/ui/PillBadge.tsx",
  "src/components/ui/Chip.tsx",
  "src/components/ui/primitives.ts",
];

let errors = 0;

for (const relPath of filesToCheck) {
  const fullPath = join(baseDir, relPath);
  if (!existsSync(fullPath)) {
    console.error(`❌ File missing: ${relPath}`);
    errors++;
  } else {
    console.log(`  ✓ Found primitive file: ${relPath}`);
  }
}

// Inspect primitives exports
const primitivesContent = readFileSync(join(baseDir, "src/components/ui/primitives.ts"), "utf-8");
const expectedExports = ["Button", "IconButton", "PillBadge", "Chip"];

for (const exp of expectedExports) {
  if (!primitivesContent.includes(exp)) {
    console.error(`❌ primitives.ts missing export: ${exp}`);
    errors++;
  } else {
    console.log(`  ✓ primitives.ts correctly re-exports: ${exp}`);
  }
}

// Inspect Button file for persona variant
const buttonContent = readFileSync(join(baseDir, "src/components/ui/button.tsx"), "utf-8");
if (!buttonContent.includes("persona:") || !buttonContent.includes("isLoading")) {
  console.error("❌ button.tsx missing persona variant or isLoading property");
  errors++;
} else {
  console.log("  ✓ button.tsx includes persona variant and isLoading property");
}

// Inspect IconButton file
const iconButtonContent = readFileSync(join(baseDir, "src/components/ui/IconButton.tsx"), "utf-8");
if (!iconButtonContent.includes("aria-label") || !iconButtonContent.includes("IconButton")) {
  console.error("❌ IconButton.tsx missing aria-label or export");
  errors++;
} else {
  console.log("  ✓ IconButton.tsx enforces accessibility aria-label");
}

// Inspect PillBadge file
const pillBadgeContent = readFileSync(join(baseDir, "src/components/ui/PillBadge.tsx"), "utf-8");
if (!pillBadgeContent.includes("pulseDot") || !pillBadgeContent.includes("PillBadge")) {
  console.error("❌ PillBadge.tsx missing pulseDot or export");
  errors++;
} else {
  console.log("  ✓ PillBadge.tsx includes pulseDot live indicator support");
}

// Inspect Chip file
const chipContent = readFileSync(join(baseDir, "src/components/ui/Chip.tsx"), "utf-8");
if (!chipContent.includes("isSelected") || !chipContent.includes("onRemove")) {
  console.error("❌ Chip.tsx missing isSelected or onRemove handler");
  errors++;
} else {
  console.log("  ✓ Chip.tsx includes selection state and onRemove handler");
}

if (errors > 0) {
  console.error(`\n❌ VERIFICATION FAILED: Found ${errors} error(s).`);
  process.exit(1);
} else {
  console.log("\n✅ ALL UI COMPONENT PRIMITIVES CHECKS PASSED!");
}
