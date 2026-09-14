import fs from 'node:fs';
import path from 'node:path';

console.log('🧪 RUNNING HERO MICRO-STATS COUNTER VERIFICATION SUITE...');

const rootDir = process.cwd();
const microStatsFile = path.join(rootDir, 'src', 'components', 'stash', 'HeroMicroStats.tsx');
const heroFile = path.join(rootDir, 'src', 'components', 'stash', 'Hero.tsx');
const animatedStatFile = path.join(rootDir, 'src', 'components', 'stash', 'AnimatedStat.tsx');
const countUpFile = path.join(rootDir, 'src', 'hooks', 'useCountUp.ts');

let passedChecks = 0;
const totalChecks = 6;

// Check 1: HeroMicroStats.tsx exists
if (fs.existsSync(microStatsFile)) {
  console.log('✅ Check 1: src/components/stash/HeroMicroStats.tsx exists.');
  passedChecks++;
} else {
  console.error('❌ Check 1 FAIL: HeroMicroStats.tsx does not exist.');
}

// Check 2: Micro-stats data includes required statistics (Dead Rent Saved, Senior Hosts, Luggage Vaulted, Zero Brokerage)
const microStatsContent = fs.readFileSync(microStatsFile, 'utf8');
const requiredStats = ['₹42,00,000+', '450+', '1,280+', '100%', '₹11,500/mo', '₹10,000'];
const hasRequiredStats = requiredStats.every(s => microStatsContent.includes(s));
if (hasRequiredStats) {
  console.log('✅ Check 2: HeroMicroStats contains required count-up stat values (₹42,00,000+, 450+, 1,280+, etc.).');
  passedChecks++;
} else {
  console.error('❌ Check 2 FAIL: Missing expected count-up stat values in HeroMicroStats.tsx.');
}

// Check 3: Web Audio micro-haptics integration (playPop)
if (microStatsContent.includes('playPop')) {
  console.log('✅ Check 3: HeroMicroStats integrates Web Audio micro-haptics (playPop).');
  passedChecks++;
} else {
  console.error('❌ Check 3 FAIL: playPop audio feedback missing in HeroMicroStats.tsx.');
}

// Check 4: Mounted in Hero.tsx
const heroContent = fs.readFileSync(heroFile, 'utf8');
if (heroContent.includes('HeroMicroStats') && heroContent.includes('<HeroMicroStats role={role}')) {
  console.log('✅ Check 4: HeroMicroStats component is properly mounted inside Hero.tsx.');
  passedChecks++;
} else {
  console.error('❌ Check 4 FAIL: HeroMicroStats is not mounted inside Hero.tsx.');
}

// Check 5: AnimatedStat uses useCountUp hook with IntersectionObserver
const animatedStatContent = fs.readFileSync(animatedStatFile, 'utf8');
const countUpContent = fs.readFileSync(countUpFile, 'utf8');
if (animatedStatContent.includes('useCountUp') && countUpContent.includes('IntersectionObserver')) {
  console.log('✅ Check 5: AnimatedStat leverages useCountUp with IntersectionObserver triggers.');
  passedChecks++;
} else {
  console.error('❌ Check 5 FAIL: IntersectionObserver count-up binding missing.');
}

// Check 6: Dual Persona support (Student & Host mode stats)
if (microStatsContent.includes('isStudent') && microStatsContent.includes('studentStats') && microStatsContent.includes('hostStats')) {
  console.log('✅ Check 6: Dual-persona support (Student Mint vs Senior Host Amber stats) implemented.');
  passedChecks++;
} else {
  console.error('❌ Check 6 FAIL: Dual-persona stats logic missing.');
}

console.log(`\n📊 HERO MICRO-STATS VERIFICATION RESULT: ${passedChecks}/${totalChecks} CHECKS PASSED.`);

if (passedChecks === totalChecks) {
  console.log('🎉 ALL HERO MICRO-STATS COUNTER CHECKS PASSED SUCCESSFULLY!');
  process.exit(0);
} else {
  console.error('❌ SOME CHECKS FAILED!');
  process.exit(1);
}
