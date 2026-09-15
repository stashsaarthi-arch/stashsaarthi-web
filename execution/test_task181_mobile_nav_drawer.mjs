import fs from 'fs';
import path from 'path';

console.log('🧪 Running Task 181 Verification: Mobile Navigation Drawer 2.0...');

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
  designTokensContent.includes('export const MOBILE_NAV_DRAWER_TOKENS'),
  'src/lib/designTokens.ts exports MOBILE_NAV_DRAWER_TOKENS'
);
assert(
  designTokensContent.includes('export function getMobileNavDrawerTokens'),
  'src/lib/designTokens.ts exports getMobileNavDrawerTokens helper'
);
assert(
  designTokensContent.includes('titleEn: "Navigation Hub"') && designTokensContent.includes('titleHi: "नेविगेशन हब"'),
  'MOBILE_NAV_DRAWER_TOKENS contains bilingual header tokens'
);
assert(
  designTokensContent.includes('categories: [') && designTokensContent.includes('key: "core"') && designTokensContent.includes('key: "tools"'),
  'MOBILE_NAV_DRAWER_TOKENS contains structured link category groupings'
);

// 2. Check CSS utility rules in src/styles.css
const stylesPath = path.resolve('src/styles.css');
const stylesContent = fs.readFileSync(stylesPath, 'utf8');

assert(
  stylesContent.includes('.mobile-nav-drawer-backdrop'),
  'src/styles.css contains .mobile-nav-drawer-backdrop rule with backdrop-filter'
);
assert(
  stylesContent.includes('.mobile-nav-drawer-panel'),
  'src/styles.css contains .mobile-nav-drawer-panel rule'
);
assert(
  stylesContent.includes('.mobile-nav-drawer-link-card'),
  'src/styles.css contains .mobile-nav-drawer-link-card rule'
);

// 3. Check MobileNavDrawer primitive component
const drawerComponentPath = path.resolve('src/components/ui/MobileNavDrawer.tsx');
assert(fs.existsSync(drawerComponentPath), 'src/components/ui/MobileNavDrawer.tsx exists');

const drawerContent = fs.readFileSync(drawerComponentPath, 'utf8');
assert(
  drawerContent.includes('useScrollLock(open)'),
  'MobileNavDrawer incorporates body scroll locking via useScrollLock(open)'
);
assert(
  drawerContent.includes('motion.aside') && drawerContent.includes('AnimatePresence'),
  'MobileNavDrawer utilizes motion.aside with AnimatePresence for spring slide-in transitions'
);
assert(
  drawerContent.includes('aria-modal="true"') && drawerContent.includes('role="dialog"'),
  'MobileNavDrawer enforces WCAG accessibility dialog ARIA roles'
);
assert(
  drawerContent.includes('PersonaSwitcher') && drawerContent.includes('LanguageContext'),
  'MobileNavDrawer integrates persona and language toggles'
);

// 4. Check re-exports in primitives.ts & index.ts
const primitivesPath = path.resolve('src/components/ui/primitives.ts');
const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');
assert(
  primitivesContent.includes('MobileNavDrawer') && primitivesContent.includes('MobileNavDrawerProps'),
  'src/components/ui/primitives.ts re-exports MobileNavDrawer'
);

const uiIndexPath = path.resolve('src/components/ui/index.ts');
const uiIndexContent = fs.readFileSync(uiIndexPath, 'utf8');
assert(
  uiIndexContent.includes('./MobileNavDrawer'),
  'src/components/ui/index.ts exports MobileNavDrawer'
);

// 5. Check Navbar.tsx integration
const navbarPath = path.resolve('src/components/stash/Navbar.tsx');
const navbarContent = fs.readFileSync(navbarPath, 'utf8');
assert(
  navbarContent.includes('<MobileNavDrawer'),
  'src/components/stash/Navbar.tsx renders <MobileNavDrawer />'
);

console.log(`\n📊 Task 181 Verification Summary: ${passed}/${total} checks passed.`);

if (passed === total) {
  console.log('✨ TASK 181 VERIFICATION PASSED 100%');
  process.exit(0);
} else {
  console.error('💥 TASK 181 VERIFICATION FAILED');
  process.exit(1);
}
