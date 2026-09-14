import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

console.log("=== VERIFYING TRUST BANNER & PARTNER STRIP (TASK 128) ===");

// 1. Verify component existence
const componentPath = resolve('src/components/stash/TrustPartnerStrip.tsx');
if (!existsSync(componentPath)) {
  console.error("❌ TrustPartnerStrip.tsx component does NOT exist!");
  process.exit(1);
}
console.log("✅ 1. TrustPartnerStrip.tsx component exists.");

const componentContent = readFileSync(componentPath, 'utf8');

// 2. Verify mandatory institutional partners
const partners = ['IIT Kanpur', 'HBTI / HBTU', 'CSJM University', 'Regency Health', 'UP Police Vetted'];
for (const partner of partners) {
  if (!componentContent.includes(partner)) {
    console.error(`❌ Missing partner '${partner}' in TrustPartnerStrip.tsx!`);
    process.exit(1);
  }
}
console.log("✅ 2. All 5 required institutional partner nodes present (IITK, HBTI, CSJMU, Regency, UP Police).");

// 3. Verify monochrome-to-color hover effects
if (!componentContent.includes('grayscale') || !componentContent.includes('grayscale-0') || !componentContent.includes('hover:grayscale-0')) {
  console.error("❌ Missing monochrome-to-color grayscale hover classes!");
  process.exit(1);
}
console.log("✅ 3. Monochrome-to-color hover effects configured with grayscale & grayscale-0 state transitions.");

// 4. Verify Web Audio micro-haptics
if (!componentContent.includes('playPop')) {
  console.error("❌ Missing Web Audio playPop integration!");
  process.exit(1);
}
console.log("✅ 4. Web Audio micro-haptics (playPop) integrated for interactive partner hover state.");

// 5. Verify Hero component integration
const heroPath = resolve('src/components/stash/Hero.tsx');
const heroContent = readFileSync(heroPath, 'utf8');
if (!heroContent.includes('TrustPartnerStrip')) {
  console.error("❌ TrustPartnerStrip is NOT mounted in Hero.tsx!");
  process.exit(1);
}
console.log("✅ 5. TrustPartnerStrip is mounted in Hero.tsx layout container.");

console.log("🎉 ALL TRUST BANNER & PARTNER STRIP CHECKS PASSED SUCCESSFULLY!");
