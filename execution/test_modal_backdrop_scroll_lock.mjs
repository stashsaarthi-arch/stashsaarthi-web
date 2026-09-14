import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ ${message}`);
  }
}

console.log('🔍 Running Task 170 Modal Backdrop Blur & Body Scroll Lock Verification...');

// 1. Verify designTokens.ts
const designTokensPath = path.join(rootDir, 'src/lib/designTokens.ts');
const designTokensContent = fs.readFileSync(designTokensPath, 'utf8');
assert(designTokensContent.includes('MODAL_BACKDROP_SCROLL_LOCK_TOKENS'), 'designTokens.ts contains MODAL_BACKDROP_SCROLL_LOCK_TOKENS');
assert(designTokensContent.includes('getModalBackdropTokens'), 'designTokens.ts exports getModalBackdropTokens helper');
assert(designTokensContent.includes('backdrop-blur-md bg-black/60'), 'designTokens.ts specifies backdrop-blur-md bg-black/60 backdrop classes');
assert(designTokensContent.includes('modal-scroll-lock-active'), 'designTokens.ts specifies modal-scroll-lock-active token');

// 2. Verify useScrollLock.ts
const scrollLockHookPath = path.join(rootDir, 'src/lib/useScrollLock.ts');
assert(fs.existsSync(scrollLockHookPath), 'src/lib/useScrollLock.ts exists');
const scrollLockHookContent = fs.readFileSync(scrollLockHookPath, 'utf8');
assert(scrollLockHookContent.includes('export function useScrollLock'), 'useScrollLock hook exported');
assert(scrollLockHookContent.includes('getScrollbarWidth'), 'scrollbar width calculator implemented');
assert(scrollLockHookContent.includes('activeScrollLockCount'), 'nested modal scroll lock count safety implemented');

// 3. Verify styles.css
const stylesPath = path.join(rootDir, 'src/styles.css');
const stylesContent = fs.readFileSync(stylesPath, 'utf8');
assert(stylesContent.includes('.modal-backdrop-overlay'), 'styles.css contains .modal-backdrop-overlay CSS class');
assert(stylesContent.includes('backdrop-filter: blur(12px)'), 'styles.css specifies backdrop blur 12px');
assert(stylesContent.includes('.modal-scroll-lock-active'), 'styles.css contains .modal-scroll-lock-active body scroll lock class');
assert(stylesContent.includes('.modal-backdrop-student'), 'styles.css contains .modal-backdrop-student persona tint');
assert(stylesContent.includes('.modal-backdrop-host'), 'styles.css contains .modal-backdrop-host persona tint');

// 4. Verify ModalBackdrop.tsx
const modalBackdropPath = path.join(rootDir, 'src/components/ui/ModalBackdrop.tsx');
assert(fs.existsSync(modalBackdropPath), 'src/components/ui/ModalBackdrop.tsx primitive exists');
const modalBackdropContent = fs.readFileSync(modalBackdropPath, 'utf8');
assert(modalBackdropContent.includes('export const ModalBackdrop'), 'ModalBackdrop component exported');
assert(modalBackdropContent.includes('useScrollLock(open)'), 'ModalBackdrop incorporates useScrollLock');

// 5. Verify SpringModal.tsx and dialog.tsx
const springModalPath = path.join(rootDir, 'src/components/ui/SpringModal.tsx');
const springModalContent = fs.readFileSync(springModalPath, 'utf8');
assert(springModalContent.includes('useScrollLock(open)'), 'SpringModal uses useScrollLock hook');
assert(springModalContent.includes('modal-backdrop-overlay'), 'SpringModal uses modal-backdrop-overlay');

const dialogPath = path.join(rootDir, 'src/components/ui/dialog.tsx');
const dialogContent = fs.readFileSync(dialogPath, 'utf8');
assert(dialogContent.includes('modal-backdrop-overlay'), 'dialog.tsx Overlay incorporates modal-backdrop-overlay');

// 6. Verify primitives.ts re-exports
const primitivesPath = path.join(rootDir, 'src/components/ui/primitives.ts');
const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');
assert(primitivesContent.includes('ModalBackdrop'), 'primitives.ts re-exports ModalBackdrop');
assert(primitivesContent.includes('useScrollLock'), 'primitives.ts re-exports useScrollLock');

console.log('\n🎉 ALL TASK 170 MODAL BACKDROP & SCROLL LOCK CHECKS PASSED 100%!');
