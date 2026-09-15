import fs from 'fs';
import path from 'path';

console.log('🧪 Running Task 183 Verification: iOS Safari 100dvh & Bottom Safe Area Engine...');

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
  designTokensContent.includes('export const IOS_SAFARI_VIEWPORT_TOKENS'),
  'src/lib/designTokens.ts exports IOS_SAFARI_VIEWPORT_TOKENS'
);
assert(
  designTokensContent.includes('export function getIosSafariViewportTokens'),
  'src/lib/designTokens.ts exports getIosSafariViewportTokens helper'
);
assert(
  designTokensContent.includes('dvh: "100dvh"') && designTokensContent.includes('webkitFillAvailable: "-webkit-fill-available"'),
  'IOS_SAFARI_VIEWPORT_TOKENS contains 100dvh and -webkit-fill-available viewport units'
);
assert(
  designTokensContent.includes('bottom: "env(safe-area-inset-bottom, 0px)"'),
  'IOS_SAFARI_VIEWPORT_TOKENS contains env(safe-area-inset-bottom, 0px) tokens'
);

// 2. Check CSS utility rules in src/styles.css
const stylesPath = path.resolve('src/styles.css');
const stylesContent = fs.readFileSync(stylesPath, 'utf8');

assert(
  stylesContent.includes('.h-screen-dvh'),
  'src/styles.css contains .h-screen-dvh utility rule'
);
assert(
  stylesContent.includes('.min-h-screen-dvh'),
  'src/styles.css contains .min-h-screen-dvh utility rule with 100dvh and -webkit-fill-available'
);
assert(
  stylesContent.includes('.ios-safari-viewport-fix'),
  'src/styles.css contains .ios-safari-viewport-fix utility rule'
);
assert(
  stylesContent.includes('.pb-safe') && stylesContent.includes('.pt-safe'),
  'src/styles.css contains safe area inset padding utility rules (.pb-safe, .pt-safe)'
);
assert(
  stylesContent.includes('.safe-area-inset-container'),
  'src/styles.css contains .safe-area-inset-container wrapper rule'
);

// 3. Check custom hook useIosSafariViewport
const hookPath = path.resolve('src/lib/useIosSafariViewport.ts');
assert(fs.existsSync(hookPath), 'src/lib/useIosSafariViewport.ts exists');

const hookContent = fs.readFileSync(hookPath, 'utf8');
assert(
  hookContent.includes('export function useIosSafariViewport'),
  'useIosSafariViewport.ts exports useIosSafariViewport hook'
);
assert(
  hookContent.includes('document.documentElement.style.setProperty("--vh"') || hookContent.includes('--dvh'),
  'useIosSafariViewport injects dynamic --vh or --dvh CSS variables'
);

// 4. Check primitive component IosViewportContainer
const componentPath = path.resolve('src/components/ui/IosSafariViewport.tsx');
assert(fs.existsSync(componentPath), 'src/components/ui/IosSafariViewport.tsx exists');

const componentContent = fs.readFileSync(componentPath, 'utf8');
assert(
  componentContent.includes('IosViewportContainer'),
  'IosSafariViewport.tsx exports IosViewportContainer component'
);
assert(
  componentContent.includes('useIosSafariViewport'),
  'IosViewportContainer component invokes useIosSafariViewport hook'
);

// 5. Check re-exports in primitives.ts & index.ts
const primitivesPath = path.resolve('src/components/ui/primitives.ts');
const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');
assert(
  primitivesContent.includes('IosViewportContainer') && primitivesContent.includes('useIosSafariViewport'),
  'src/components/ui/primitives.ts re-exports IosViewportContainer & useIosSafariViewport'
);

const uiIndexPath = path.resolve('src/components/ui/index.ts');
const uiIndexContent = fs.readFileSync(uiIndexPath, 'utf8');
assert(
  uiIndexContent.includes('./IosSafariViewport'),
  'src/components/ui/index.ts exports IosSafariViewport'
);

// 6. Check root layout integration in src/routes/__root.tsx
const rootPath = path.resolve('src/routes/__root.tsx');
const rootContent = fs.readFileSync(rootPath, 'utf8');
assert(
  rootContent.includes('useIosSafariViewport'),
  'src/routes/__root.tsx imports and invokes useIosSafariViewport in root layout'
);

console.log(`\n📊 Task 183 Verification Summary: ${passed}/${total} checks passed.`);

if (passed === total) {
  console.log('✨ TASK 183 VERIFICATION PASSED 100%');
  process.exit(0);
} else {
  console.error('💥 TASK 183 VERIFICATION FAILED');
  process.exit(1);
}
