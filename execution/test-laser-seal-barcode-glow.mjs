import fs from 'fs';
import path from 'path';

console.log('=== TEST: Laser Seal Barcode Glow Verification ===\n');

const projectRoot = process.cwd();

// 1. Check designTokens.ts for LASER_BARCODE_SEAL_TOKENS
const tokensPath = path.join(projectRoot, 'src', 'lib', 'designTokens.ts');
const tokensContent = fs.readFileSync(tokensPath, 'utf8');
if (tokensContent.includes('LASER_BARCODE_SEAL_TOKENS') && tokensContent.includes('getLaserBarcodeSealTokens')) {
  console.log('✅ PASS: LASER_BARCODE_SEAL_TOKENS and getLaserBarcodeSealTokens defined in designTokens.ts');
} else {
  console.error('❌ FAIL: Missing LASER_BARCODE_SEAL_TOKENS in designTokens.ts');
  process.exit(1);
}

// 2. Check styles.css for laser barcode glow keyframes and classes
const stylesPath = path.join(projectRoot, 'src', 'styles.css');
const stylesContent = fs.readFileSync(stylesPath, 'utf8');
if (
  stylesContent.includes('@keyframes laser-barcode-beam-sweep') &&
  stylesContent.includes('.laser-barcode-seal-container') &&
  stylesContent.includes('.laser-barcode-beam')
) {
  console.log('✅ PASS: Keyframes and CSS classes defined in styles.css');
} else {
  console.error('❌ FAIL: Missing laser seal barcode CSS rules in styles.css');
  process.exit(1);
}

// 3. Check LaserSealBarcode.tsx primitive component
const componentPath = path.join(projectRoot, 'src', 'components', 'ui', 'LaserSealBarcode.tsx');
if (fs.existsSync(componentPath)) {
  const componentContent = fs.readFileSync(componentPath, 'utf8');
  if (
    componentContent.includes('LaserSealBarcode') &&
    componentContent.includes('laser-barcode-beam') &&
    componentContent.includes('barcode-lines-svg')
  ) {
    console.log('✅ PASS: LaserSealBarcode.tsx primitive component implemented');
  } else {
    console.error('❌ FAIL: LaserSealBarcode.tsx missing required component logic');
    process.exit(1);
  }
} else {
  console.error('❌ FAIL: LaserSealBarcode.tsx file does not exist');
  process.exit(1);
}

// 4. Check primitives.ts re-export
const primitivesPath = path.join(projectRoot, 'src', 'components', 'ui', 'primitives.ts');
const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');
if (primitivesContent.includes('LaserSealBarcode')) {
  console.log('✅ PASS: LaserSealBarcode re-exported in primitives.ts');
} else {
  console.error('❌ FAIL: LaserSealBarcode not re-exported in primitives.ts');
  process.exit(1);
}

// 5. Check SaarthiStashCard2.tsx integration
const cardPath = path.join(projectRoot, 'src', 'components', 'ui', 'SaarthiStashCard2.tsx');
const cardContent = fs.readFileSync(cardPath, 'utf8');
if (cardContent.includes('LaserSealBarcode')) {
  console.log('✅ PASS: LaserSealBarcode integrated into SaarthiStashCard2.tsx');
} else {
  console.error('❌ FAIL: LaserSealBarcode not integrated into SaarthiStashCard2.tsx');
  process.exit(1);
}

console.log('\n✨ ALL LASER SEAL BARCODE GLOW VERIFICATIONS PASSED SUCCESSFULLY!');
