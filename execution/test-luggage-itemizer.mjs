import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

console.log("=== VERIFYING TASK 163: LUGGAGE ITEMIZER VISUALIZER ===");

const root = process.cwd();

// 1. Verify Design Tokens
const designTokensPath = resolve(root, 'src/lib/designTokens.ts');
const designTokensContent = readFileSync(designTokensPath, 'utf8');

if (!designTokensContent.includes('LUGGAGE_ITEMIZER_TOKENS') || !designTokensContent.includes('getLuggageItemizerTokens')) {
  console.error("❌ FAILED: designTokens.ts missing LUGGAGE_ITEMIZER_TOKENS or getLuggageItemizerTokens export");
  process.exit(1);
}
console.log("✅ Check 1: designTokens.ts exports LUGGAGE_ITEMIZER_TOKENS & getLuggageItemizerTokens");

// 2. Verify CSS Rules
const stylesPath = resolve(root, 'src/styles.css');
const stylesContent = readFileSync(stylesPath, 'utf8');

const requiredCssRules = [
  '.luggage-itemizer-container',
  '.luggage-item-card',
  '.luggage-3d-icon-stage',
  '.luggage-count-badge',
  '@keyframes luggage-pop-bounce',
  '.luggage-vault-meter',
];

for (const rule of requiredCssRules) {
  if (!stylesContent.includes(rule)) {
    console.error(`❌ FAILED: styles.css missing CSS rule: ${rule}`);
    process.exit(1);
  }
}
console.log("✅ Check 2: styles.css contains all Luggage Itemizer Visualizer utility classes and keyframes");

// 3. Verify Component Implementation
const componentPath = resolve(root, 'src/components/ui/LuggageItemizerVisualizer.tsx');
if (!existsSync(componentPath)) {
  console.error("❌ FAILED: src/components/ui/LuggageItemizerVisualizer.tsx does not exist");
  process.exit(1);
}

const componentContent = readFileSync(componentPath, 'utf8');
if (!componentContent.includes('usePersona') || !componentContent.includes('LuggageItemizerVisualizer')) {
  console.error("❌ FAILED: LuggageItemizerVisualizer.tsx missing usePersona or main export");
  process.exit(1);
}
console.log("✅ Check 3: LuggageItemizerVisualizer.tsx component exists and handles persona context");

// 4. Verify Primitive Re-export
const primitivesPath = resolve(root, 'src/components/ui/primitives.ts');
const primitivesContent = readFileSync(primitivesPath, 'utf8');

if (!primitivesContent.includes('LuggageItemizerVisualizer')) {
  console.error("❌ FAILED: primitives.ts missing LuggageItemizerVisualizer re-export");
  process.exit(1);
}
console.log("✅ Check 4: primitives.ts re-exports LuggageItemizerVisualizer primitive");

// 5. Verify Build
console.log("Running npm run build...");
try {
  execSync('npm run build', { cwd: root, stdio: 'inherit' });
  console.log("✅ Check 5: npm run build completed cleanly with 0 errors!");
} catch (err) {
  console.error("❌ FAILED: npm run build failed");
  process.exit(1);
}

console.log("\n🎉 ALL TASK 163 LUGGAGE ITEMIZER VISUALIZER CHECKS PASSED 100%!");
