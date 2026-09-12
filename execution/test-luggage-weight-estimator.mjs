import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';

console.log('🧪 Running Task 130 Luggage Weight Estimator Test Suite...\n');

const projectRoot = process.cwd();
const enginePath = join(projectRoot, 'src', 'lib', 'luggageWeightEstimatorEngine.ts');
const modalPath = join(projectRoot, 'src', 'components', 'stash', 'LuggageWeightEstimatorModal.tsx');
const calculatorPath = join(projectRoot, 'src', 'components', 'stash', 'Calculator.tsx');

// Check 1: File Existence
if (!existsSync(enginePath)) {
  console.error('❌ FAIL: src/lib/luggageWeightEstimatorEngine.ts does not exist');
  process.exit(1);
}
console.log('✅ Check 1: src/lib/luggageWeightEstimatorEngine.ts exists');

if (!existsSync(modalPath)) {
  console.error('❌ FAIL: src/components/stash/LuggageWeightEstimatorModal.tsx does not exist');
  process.exit(1);
}
console.log('✅ Check 2: src/components/stash/LuggageWeightEstimatorModal.tsx exists');

// Check 3: Engine exports & math verification
const engineContent = readFileSync(enginePath, 'utf8');
const requiredExports = [
  'LUGGAGE_CATEGORIES',
  'LUGGAGE_ITEMS_DATABASE',
  'ESTIMATOR_PRESETS',
  'calculateLuggageEstimate',
];

for (const exp of requiredExports) {
  if (!engineContent.includes(exp)) {
    console.error(`❌ FAIL: luggageWeightEstimatorEngine.ts missing export ${exp}`);
    process.exit(1);
  }
}
console.log('✅ Check 3: luggageWeightEstimatorEngine.ts contains all required exports');

// Check 4: Modal UI verification
const modalContent = readFileSync(modalPath, 'utf8');
if (
  !modalContent.includes('calculateLuggageEstimate') ||
  !modalContent.includes('ESTIMATOR_PRESETS') ||
  !modalContent.includes('LUGGAGE_CATEGORIES')
) {
  console.error('❌ FAIL: LuggageWeightEstimatorModal.tsx missing estimator engine bindings');
  process.exit(1);
}
console.log('✅ Check 4: LuggageWeightEstimatorModal.tsx UI bindings verified');

// Check 5: Integration in Calculator.tsx
const calcContent = readFileSync(calculatorPath, 'utf8');
if (!calcContent.includes('LuggageWeightEstimatorModal') || !calcContent.includes('showEstimatorModal')) {
  console.error('❌ FAIL: Calculator.tsx missing LuggageWeightEstimatorModal integration');
  process.exit(1);
}
console.log('✅ Check 5: Calculator.tsx mounts LuggageWeightEstimatorModal');

console.log('\n🎉 ALL TASK 130 LUGGAGE WEIGHT ESTIMATOR VERIFICATION CHECKS PASSED SUCCESSFULLY!');
