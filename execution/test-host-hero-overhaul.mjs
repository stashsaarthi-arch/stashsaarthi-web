import fs from 'fs';
import path from 'path';

console.log("=== RUNNING HOST HERO OVERHAUL VERIFICATION SUITE ===");

const hostHeroSealsPath = path.resolve('src/components/stash/HostHeroSeals.tsx');
const heroPath = path.resolve('src/components/stash/Hero.tsx');

let checksPassed = 0;
const totalChecks = 5;

// Check 1: HostHeroSeals.tsx file exists
if (fs.existsSync(hostHeroSealsPath)) {
  console.log("✅ CHECK 1 PASSED: src/components/stash/HostHeroSeals.tsx exists");
  checksPassed++;
} else {
  console.error("❌ CHECK 1 FAILED: src/components/stash/HostHeroSeals.tsx does not exist");
}

// Check 2: HostHeroSeals contents contain ₹11,500+/mo passive income badge & trust seals
const hostHeroSealsCode = fs.existsSync(hostHeroSealsPath) ? fs.readFileSync(hostHeroSealsPath, 'utf8') : '';
if (
  hostHeroSealsCode.includes('₹11,500+/mo') &&
  hostHeroSealsCode.includes('₹10,000 Property Cover') &&
  hostHeroSealsCode.includes('TPA Sec 105 Protection') &&
  hostHeroSealsCode.includes('Verified Student Guests')
) {
  console.log("✅ CHECK 2 PASSED: HostHeroSeals contains passive income badge & 4-tier host trust seals");
  checksPassed++;
} else {
  console.error("❌ CHECK 2 FAILED: HostHeroSeals missing passive income badge or host trust seals");
}

// Check 3: Hero.tsx imports HostHeroSeals
const heroCode = fs.readFileSync(heroPath, 'utf8');
if (heroCode.includes('HostHeroSeals')) {
  console.log("✅ CHECK 3 PASSED: Hero.tsx imports HostHeroSeals");
  checksPassed++;
} else {
  console.error("❌ CHECK 3 FAILED: Hero.tsx does not import HostHeroSeals");
}

// Check 4: Hero.tsx renders HostHeroSeals for Host Persona Mode (!student)
if (heroCode.includes('student ? <Floating3DLuggage /> : <HostHeroSeals />')) {
  console.log("✅ CHECK 4 PASSED: Hero.tsx renders HostHeroSeals for Senior Host mode");
  checksPassed++;
} else {
  console.error("❌ CHECK 4 FAILED: Hero.tsx does not conditionally render HostHeroSeals");
}

// Check 5: Hero.tsx contains warm sunset gold title illumination glow
if (heroCode.includes('text-gradient-amber drop-shadow-[0_0_45px_rgba(251,191,36,0.7)]')) {
  console.log("✅ CHECK 5 PASSED: Hero.tsx contains warm sunset gold headline illumination glow");
  checksPassed++;
} else {
  console.error("❌ CHECK 5 FAILED: Hero.tsx missing warm sunset gold headline illumination glow");
}

console.log(`\nRESULTS: ${checksPassed}/${totalChecks} CHECKS PASSED.`);
if (checksPassed === totalChecks) {
  console.log("🎉 ALL HOST HERO OVERHAUL CHECKS PASSED SUCCESSFULLY!");
  process.exit(0);
} else {
  console.error("💥 SOME CHECKS FAILED!");
  process.exit(1);
}
