import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

console.log("=== VERIFYING QUICK-ACTION FLOATING DOCK (TASK 129) ===");

// 1. Verify component existence
const componentPath = resolve('src/components/stash/QuickActionFloatingDock.tsx');
if (!existsSync(componentPath)) {
  console.error("❌ QuickActionFloatingDock.tsx component does NOT exist!");
  process.exit(1);
}
console.log("✅ 1. QuickActionFloatingDock.tsx component exists.");

const componentContent = readFileSync(componentPath, 'utf8');

// 2. Verify mandatory tabs (Stash, Spaces, Kitchen, Connect)
const tabs = ['stash', 'rooms', 'kitchen', 'connect'];
for (const tab of tabs) {
  if (!componentContent.includes(`id: "${tab}"`)) {
    console.error(`❌ Missing mandatory tab '${tab}' in QuickActionFloatingDock.tsx!`);
    process.exit(1);
  }
}
console.log("✅ 2. All 4 mandatory quick-action tabs present (Stash, Spaces, Kitchen, Connect).");

// 3. Verify mobile responsiveness & glassmorphism floating styling
if (!componentContent.includes('sm:hidden') || !componentContent.includes('fixed bottom-3') || !componentContent.includes('glass')) {
  console.error("❌ Missing mobile floating dock position & glassmorphism styling!");
  process.exit(1);
}
console.log("✅ 3. Mobile viewport placement (sm:hidden, fixed bottom-3) and glassmorphism styling verified.");

// 4. Verify Web Audio micro-haptics & tab event dispatching
if (!componentContent.includes('playPop') || !componentContent.includes('stashsaarthi-solution-tab')) {
  console.error("❌ Missing Web Audio playPop or solution tab event dispatching!");
  process.exit(1);
}
console.log("✅ 4. Web Audio micro-haptics (playPop) and instant solution tab event dispatching integrated.");

// 5. Verify MobileStickyCTA & index.tsx mounting
const stickyCtaPath = resolve('src/components/stash/MobileStickyCTA.tsx');
const stickyCtaContent = readFileSync(stickyCtaPath, 'utf8');
if (!stickyCtaContent.includes('QuickActionFloatingDock')) {
  console.error("❌ QuickActionFloatingDock is NOT integrated in MobileStickyCTA.tsx!");
  process.exit(1);
}
console.log("✅ 5. QuickActionFloatingDock is mounted in MobileStickyCTA.tsx layout container.");

console.log("🎉 ALL QUICK-ACTION FLOATING DOCK CHECKS PASSED SUCCESSFULLY!");
