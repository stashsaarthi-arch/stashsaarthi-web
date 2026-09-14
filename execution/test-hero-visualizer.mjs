import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log("🧪 Running Hero Video & Interactive Visualizer Verification Test...");

const visualizerPath = path.join(rootDir, 'src', 'components', 'stash', 'HeroVisualizer.tsx');
const heroPath = path.join(rootDir, 'src', 'components', 'stash', 'Hero.tsx');

// Check 1: HeroVisualizer.tsx file exists
if (!fs.existsSync(visualizerPath)) {
  console.error("❌ FAIL: src/components/stash/HeroVisualizer.tsx does not exist!");
  process.exit(1);
}
console.log("✅ CHECK 1 PASSED: src/components/stash/HeroVisualizer.tsx exists.");

const visualizerContent = fs.readFileSync(visualizerPath, 'utf8');

// Check 2: HeroVisualizer exports component and defines transition stages
if (!visualizerContent.includes("export const HeroVisualizer")) {
  console.error("❌ FAIL: HeroVisualizer component export missing!");
  process.exit(1);
}
if (!visualizerContent.includes("1. Hostel Room Packing") ||
    !visualizerContent.includes("2. Doorstep Saarthi Transit") ||
    !visualizerContent.includes("3. Secured Senior Host Vault")) {
  console.error("❌ FAIL: Required 3 transition stages missing in HeroVisualizer!");
  process.exit(1);
}
console.log("✅ CHECK 2 PASSED: HeroVisualizer exports component and defines all 3 transition stages.");

// Check 3: Web Audio micro-haptics integration
if (!visualizerContent.includes("playPop")) {
  console.error("❌ FAIL: Web Audio micro-haptics (playPop) missing in HeroVisualizer!");
  process.exit(1);
}
console.log("✅ CHECK 3 PASSED: Web Audio micro-haptics integrated into HeroVisualizer.");

// Check 4: Hero.tsx mounts HeroVisualizer
const heroContent = fs.readFileSync(heroPath, 'utf8');
if (!heroContent.includes("HeroVisualizer")) {
  console.error("❌ FAIL: Hero.tsx does not import or mount HeroVisualizer!");
  process.exit(1);
}
console.log("✅ CHECK 4 PASSED: Hero.tsx imports and mounts HeroVisualizer.");

console.log("\n🎉 ALL HERO VIDEO & INTERACTIVE VISUALIZER CHECKS PASSED SUCCESSFULLY!");
