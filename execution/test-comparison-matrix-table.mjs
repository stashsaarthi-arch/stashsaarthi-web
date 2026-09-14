import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Running Comparison Matrix Table (Task 149) Test Harness...\n');

let checksPassed = 0;
const totalChecks = 5;

// Check 1: designTokens.ts contains COMPARISON_MATRIX_TOKENS and helper functions
const designTokensPath = path.join(rootDir, 'src', 'lib', 'designTokens.ts');
const designTokensContent = fs.readFileSync(designTokensPath, 'utf8');

if (
  designTokensContent.includes('export const COMPARISON_MATRIX_TOKENS') &&
  designTokensContent.includes('export function getComparisonMatrixTokens') &&
  designTokensContent.includes('traditionalPg') &&
  designTokensContent.includes('commercialWarehouse') &&
  designTokensContent.includes('stashSaarthi')
) {
  console.log('✅ Check 1 PASSED: designTokens.ts defines COMPARISON_MATRIX_TOKENS with 3 comparison entities.');
  checksPassed++;
} else {
  console.error('❌ Check 1 FAILED: designTokens.ts missing COMPARISON_MATRIX_TOKENS.');
}

// Check 2: ComparisonMatrixTable.tsx exists and contains 3-way comparison matrix
const compPath = path.join(rootDir, 'src', 'components', 'ui', 'ComparisonMatrixTable.tsx');
if (fs.existsSync(compPath)) {
  const compContent = fs.readFileSync(compPath, 'utf8');
  if (
    compContent.includes('export const ComparisonMatrixTable') &&
    compContent.includes('COMPARISON_MATRIX_ROWS') &&
    compContent.includes('traditionalPg') &&
    compContent.includes('commercialWarehouse') &&
    compContent.includes('stashSaarthi') &&
    compContent.includes('WINNER')
  ) {
    console.log('✅ Check 2 PASSED: ComparisonMatrixTable.tsx exists and implements 3-way comparison.');
    checksPassed++;
  } else {
    console.error('❌ Check 2 FAILED: ComparisonMatrixTable.tsx missing required 3-way comparison logic.');
  }
} else {
  console.error('❌ Check 2 FAILED: ComparisonMatrixTable.tsx file missing.');
}

// Check 3: primitives.ts re-exports ComparisonMatrixTable
const primitivesPath = path.join(rootDir, 'src', 'components', 'ui', 'primitives.ts');
const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');

if (
  primitivesContent.includes('ComparisonMatrixTable') &&
  primitivesContent.includes('COMPARISON_MATRIX_ROWS')
) {
  console.log('✅ Check 3 PASSED: primitives.ts re-exports ComparisonMatrixTable primitive.');
  checksPassed++;
} else {
  console.error('❌ Check 3 FAILED: primitives.ts missing ComparisonMatrixTable re-exports.');
}

// Check 4: PgComparisonTable.tsx wraps/renders ComparisonMatrixTable
const pgCompPath = path.join(rootDir, 'src', 'components', 'stash', 'PgComparisonTable.tsx');
const pgCompContent = fs.readFileSync(pgCompPath, 'utf8');

if (
  pgCompContent.includes('ComparisonMatrixTable') &&
  pgCompContent.includes('PgComparisonTable')
) {
  console.log('✅ Check 4 PASSED: PgComparisonTable.tsx integrates ComparisonMatrixTable primitive.');
  checksPassed++;
} else {
  console.error('❌ Check 4 FAILED: PgComparisonTable.tsx missing ComparisonMatrixTable integration.');
}

// Check 5: Verify 7 comparison metrics rows defined with bilingual support
if (fs.existsSync(compPath)) {
  const compContent = fs.readFileSync(compPath, 'utf8');
  if (
    compContent.includes('vacation-rent') &&
    compContent.includes('brokerage-fees') &&
    compContent.includes('logistics-pickup') &&
    compContent.includes('campus-proximity') &&
    compContent.includes('luggage-security') &&
    compContent.includes('food-hygiene') &&
    compContent.includes('host-safety-governance')
  ) {
    console.log('✅ Check 5 PASSED: 7 comprehensive metric rows implemented contrasting PGs, Warehouses & StashSaarthi.');
    checksPassed++;
  } else {
    console.error('❌ Check 5 FAILED: Missing essential comparison metric rows.');
  }
} else {
  console.error('❌ Check 5 FAILED: ComparisonMatrixTable.tsx file missing.');
}

console.log(`\nResults: ${checksPassed}/${totalChecks} checks passed.`);
if (checksPassed === totalChecks) {
  console.log('🎉 COMPARISON MATRIX TABLE CHECKS PASSED 100%!\n');
  process.exit(0);
} else {
  console.error('💥 Test suite failed.\n');
  process.exit(1);
}
