import fs from 'fs';
import path from 'path';

console.log('=== TEST: Tab Switching Indicator Glides Verification ===\n');

const projectRoot = process.cwd();

// 1. Check designTokens.ts for TAB_GLIDER_TOKENS
const tokensPath = path.join(projectRoot, 'src', 'lib', 'designTokens.ts');
const tokensContent = fs.readFileSync(tokensPath, 'utf8');
if (tokensContent.includes('TAB_GLIDER_TOKENS') && tokensContent.includes('getTabGliderTokens')) {
  console.log('✅ PASS: TAB_GLIDER_TOKENS and getTabGliderTokens defined in designTokens.ts');
} else {
  console.error('❌ FAIL: Missing TAB_GLIDER_TOKENS in designTokens.ts');
  process.exit(1);
}

// 2. Check styles.css for tab glider classes
const stylesPath = path.join(projectRoot, 'src', 'styles.css');
const stylesContent = fs.readFileSync(stylesPath, 'utf8');
if (stylesContent.includes('.tab-glider-container') && stylesContent.includes('.tab-glider-pill')) {
  console.log('✅ PASS: CSS classes .tab-glider-container & .tab-glider-pill defined in styles.css');
} else {
  console.error('❌ FAIL: Missing tab glider styles in styles.css');
  process.exit(1);
}

// 3. Check GlidingTabs.tsx component implementation
const componentPath = path.join(projectRoot, 'src', 'components', 'ui', 'GlidingTabs.tsx');
if (fs.existsSync(componentPath)) {
  const componentContent = fs.readFileSync(componentPath, 'utf8');
  if (componentContent.includes('layoutId') && componentContent.includes('motion.div')) {
    console.log('✅ PASS: GlidingTabs.tsx implements Framer Motion layoutId sliding pill indicator');
  } else {
    console.error('❌ FAIL: GlidingTabs.tsx missing motion layoutId logic');
    process.exit(1);
  }
} else {
  console.error('❌ FAIL: GlidingTabs.tsx file does not exist');
  process.exit(1);
}

// 4. Check primitives.ts re-export
const primitivesPath = path.join(projectRoot, 'src', 'components', 'ui', 'primitives.ts');
const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');
if (primitivesContent.includes('GlidingTabs')) {
  console.log('✅ PASS: GlidingTabs re-exported in primitives.ts');
} else {
  console.error('❌ FAIL: GlidingTabs not re-exported in primitives.ts');
  process.exit(1);
}

// 5. Check SolutionsHub.tsx integration
const hubPath = path.join(projectRoot, 'src', 'components', 'stash', 'SolutionsHub.tsx');
const hubContent = fs.readFileSync(hubPath, 'utf8');
if (hubContent.includes('GlidingTabs')) {
  console.log('✅ PASS: GlidingTabs integrated into SolutionsHub.tsx');
} else {
  console.error('❌ FAIL: GlidingTabs not integrated in SolutionsHub.tsx');
  process.exit(1);
}

console.log('\n✨ ALL TAB SWITCHING INDICATOR GLIDE VERIFICATIONS PASSED SUCCESSFULLY!');
