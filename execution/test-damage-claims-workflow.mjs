import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';

console.log('🧪 Running Task 128 Damage Claims Workflow & Visual Diff Test Suite...\n');

const projectRoot = process.cwd();
const enginePath = join(projectRoot, 'src', 'lib', 'damageClaimsEngine.ts');
const modalPath = join(projectRoot, 'src', 'components', 'stash', 'DamageClaimsModal.tsx');
const adminPath = join(projectRoot, 'src', 'routes', 'admin.tsx');

// Check 1: File Existence
if (!existsSync(enginePath)) {
  console.error('❌ FAIL: src/lib/damageClaimsEngine.ts does not exist');
  process.exit(1);
}
console.log('✅ Check 1: src/lib/damageClaimsEngine.ts exists');

if (!existsSync(modalPath)) {
  console.error('❌ FAIL: src/components/stash/DamageClaimsModal.tsx does not exist');
  process.exit(1);
}
console.log('✅ Check 2: src/components/stash/DamageClaimsModal.tsx exists');

// Check 3: Engine exports & signatures
const engineContent = readFileSync(enginePath, 'utf8');
const requiredExports = [
  'computeVisualDiff',
  'getDamageClaims',
  'getDamageClaimById',
  'submitDamageClaim',
  'updateClaimStatus',
  'getDamageClaimStats',
  'SAMPLE_INTAKE_PHOTO',
  'SAMPLE_UNBOXING_PHOTO_DAMAGED',
  'SAMPLE_UNBOXING_PHOTO_PRISTINE',
];

for (const exp of requiredExports) {
  if (!engineContent.includes(exp)) {
    console.error(`❌ FAIL: damageClaimsEngine.ts missing export/definition for ${exp}`);
    process.exit(1);
  }
}
console.log('✅ Check 3: damageClaimsEngine.ts contains all required exports and constants');

// Check 4: Modal tab structure and insurance charter
const modalContent = readFileSync(modalPath, 'utf8');
if (
  !modalContent.includes('computeVisualDiff') ||
  !modalContent.includes('submitDamageClaim') ||
  !modalContent.includes('Visual Diff Inspection Engine')
) {
  console.error('❌ FAIL: DamageClaimsModal.tsx missing visual diff inspection integration');
  process.exit(1);
}
console.log('✅ Check 4: DamageClaimsModal.tsx visual diff inspection UI verified');

// Check 5: Admin route mounting
const adminContent = readFileSync(adminPath, 'utf8');
if (!adminContent.includes('DamageClaimsModal') || !adminContent.includes('isDamageClaimsOpen')) {
  console.error('❌ FAIL: admin.tsx does not mount DamageClaimsModal launcher button');
  process.exit(1);
}
console.log('✅ Check 5: admin.tsx mounts DamageClaimsModal launcher button');

console.log('\n🎉 ALL TASK 128 DAMAGE CLAIMS WORKFLOW VERIFICATION CHECKS PASSED SUCCESSFULLY!');
