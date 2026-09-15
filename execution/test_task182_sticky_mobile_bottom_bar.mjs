import fs from 'fs';
import path from 'path';

console.log('🧪 Running Task 182 Verification: Sticky Mobile Bottom Action Bar...');

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✅ PASSED: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
  }
}

// 1. Check design tokens in src/lib/designTokens.ts
const designTokensPath = path.resolve('src/lib/designTokens.ts');
const designTokensContent = fs.readFileSync(designTokensPath, 'utf8');

assert(
  designTokensContent.includes('export const STICKY_MOBILE_BOTTOM_BAR_TOKENS'),
  'src/lib/designTokens.ts exports STICKY_MOBILE_BOTTOM_BAR_TOKENS'
);
assert(
  designTokensContent.includes('export function getStickyMobileBottomBarTokens'),
  'src/lib/designTokens.ts exports getStickyMobileBottomBarTokens helper'
);
assert(
  designTokensContent.includes('labelEn: "Book Storage @ ₹300"') && designTokensContent.includes('labelHi: "₹300 में स्टोरेज बुक करें"'),
  'STICKY_MOBILE_BOTTOM_BAR_TOKENS contains bilingual primary action tokens @ ₹300'
);
assert(
  designTokensContent.includes('priceTag: "₹300/mo"'),
  'STICKY_MOBILE_BOTTOM_BAR_TOKENS contains ₹300/mo pricing tag'
);

// 2. Check CSS utility rules in src/styles.css
const stylesPath = path.resolve('src/styles.css');
const stylesContent = fs.readFileSync(stylesPath, 'utf8');

assert(
  stylesContent.includes('.sticky-mobile-bottom-bar-container'),
  'src/styles.css contains .sticky-mobile-bottom-bar-container rule with fixed bottom positioning'
);
assert(
  stylesContent.includes('.sticky-mobile-bottom-bar-panel'),
  'src/styles.css contains .sticky-mobile-bottom-bar-panel rule with backdrop-filter glassmorphism'
);
assert(
  stylesContent.includes('.sticky-mobile-bottom-bar-primary-cta'),
  'src/styles.css contains .sticky-mobile-bottom-bar-primary-cta rule'
);
assert(
  stylesContent.includes('safe-area-inset-bottom'),
  'src/styles.css handles iOS safe-area-inset-bottom'
);

// 3. Check StickyMobileBottomBar primitive component
const barComponentPath = path.resolve('src/components/ui/StickyMobileBottomBar.tsx');
assert(fs.existsSync(barComponentPath), 'src/components/ui/StickyMobileBottomBar.tsx exists');

const barContent = fs.readFileSync(barComponentPath, 'utf8');
assert(
  barContent.includes('getStickyMobileBottomBarTokens'),
  'StickyMobileBottomBar incorporates design tokens via getStickyMobileBottomBarTokens'
);
assert(
  barContent.includes('usePersona') && barContent.includes('useLanguage'),
  'StickyMobileBottomBar integrates dual-persona and bilingual language context'
);
assert(
  barContent.includes('playSuccessChime') || barContent.includes('playClick') || barContent.includes('playPop'),
  'StickyMobileBottomBar integrates Web Audio haptic feedback'
);
assert(
  barContent.includes('role="region"') || barContent.includes('aria-label'),
  'StickyMobileBottomBar enforces accessibility ARIA region attributes'
);

// 4. Check re-exports in primitives.ts & index.ts
const primitivesPath = path.resolve('src/components/ui/primitives.ts');
const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');
assert(
  primitivesContent.includes('StickyMobileBottomBar') && primitivesContent.includes('StickyMobileBottomBarProps'),
  'src/components/ui/primitives.ts re-exports StickyMobileBottomBar'
);

const uiIndexPath = path.resolve('src/components/ui/index.ts');
const uiIndexContent = fs.readFileSync(uiIndexPath, 'utf8');
assert(
  uiIndexContent.includes('./StickyMobileBottomBar'),
  'src/components/ui/index.ts exports StickyMobileBottomBar'
);

// 5. Check MobileStickyCTA integration
const mobileCtaPath = path.resolve('src/components/stash/MobileStickyCTA.tsx');
const mobileCtaContent = fs.readFileSync(mobileCtaPath, 'utf8');
assert(
  mobileCtaContent.includes('<StickyMobileBottomBar'),
  'src/components/stash/MobileStickyCTA.tsx renders <StickyMobileBottomBar />'
);

console.log(`\n📊 Task 182 Verification Summary: ${passed}/${total} checks passed.`);

if (passed === total) {
  console.log('✨ TASK 182 VERIFICATION PASSED 100%');
  process.exit(0);
} else {
  console.error('💥 TASK 182 VERIFICATION FAILED');
  process.exit(1);
}
