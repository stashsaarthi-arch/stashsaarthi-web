import fs from 'fs';
import path from 'path';

console.log("=== TASK 184 VERIFICATION SUITE: Touch Target 48px Minimum Audit ===");

let passedChecks = 0;
let totalChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [PASS ${passedChecks}/${totalChecks}] ${message}`);
  } else {
    console.error(`❌ [FAIL ${totalChecks}] ${message}`);
    process.exit(1);
  }
}

// 1. Verify Design Tokens
const tokensPath = path.resolve('src/lib/designTokens.ts');
assert(fs.existsSync(tokensPath), 'designTokens.ts exists');

const tokensContent = fs.readFileSync(tokensPath, 'utf8');
assert(tokensContent.includes('TOUCH_TARGET_AUDIT_TOKENS'), 'TOUCH_TARGET_AUDIT_TOKENS defined');
assert(tokensContent.includes('getTouchTargetAuditTokens'), 'getTouchTargetAuditTokens helper function exported');
assert(tokensContent.includes('minTouchTargetPx: 48'), 'minTouchTargetPx set to 48');
assert(tokensContent.includes('touch-target-min-48'), 'touch-target-min-48 utility class referenced in tokens');

// 2. Verify CSS Utility Rules
const stylesPath = path.resolve('src/styles.css');
assert(fs.existsSync(stylesPath), 'styles.css exists');

const stylesContent = fs.readFileSync(stylesPath, 'utf8');
assert(stylesContent.includes('.touch-target-min-48'), '.touch-target-min-48 CSS rule present');
assert(stylesContent.includes('.touch-target-min-48-icon'), '.touch-target-min-48-icon CSS rule present');
assert(stylesContent.includes('.touch-target-expand'), '.touch-target-expand CSS rule present');
assert(stylesContent.includes('min-width: 48px'), 'min-width: 48px specified in CSS rules');
assert(stylesContent.includes('.touch-target-pill'), '.touch-target-pill CSS rule present');
assert(stylesContent.includes('.touch-target-stepper'), '.touch-target-stepper CSS rule present');

// 3. Verify Primitive Component
const componentPath = path.resolve('src/components/ui/TouchTargetAudit.tsx');
assert(fs.existsSync(componentPath), 'TouchTargetAudit.tsx exists');

const componentContent = fs.readFileSync(componentPath, 'utf8');
assert(componentContent.includes('TouchTargetWrapper'), 'TouchTargetWrapper primitive component implemented');
assert(componentContent.includes('TouchTargetAuditBadge'), 'TouchTargetAuditBadge component implemented');
assert(componentContent.includes('useTouchTargetAudit'), 'useTouchTargetAudit hook implemented');

// 4. Verify Re-exports
const primitivesPath = path.resolve('src/components/ui/primitives.ts');
assert(fs.existsSync(primitivesPath), 'primitives.ts exists');

const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');
assert(primitivesContent.includes('TouchTargetWrapper'), 'TouchTargetWrapper re-exported in primitives.ts');
assert(primitivesContent.includes('useTouchTargetAudit'), 'useTouchTargetAudit re-exported in primitives.ts');

const indexPath = path.resolve('src/components/ui/index.ts');
assert(fs.existsSync(indexPath), 'ui/index.ts exists');
const indexContent = fs.readFileSync(indexPath, 'utf8');
assert(indexContent.includes('./TouchTargetAudit'), 'TouchTargetAudit re-exported in ui/index.ts');

// 5. Verify Component Enhancements
const iconBtnPath = path.resolve('src/components/ui/IconButton.tsx');
assert(fs.existsSync(iconBtnPath), 'IconButton.tsx exists');
const iconBtnContent = fs.readFileSync(iconBtnPath, 'utf8');
assert(iconBtnContent.includes('touch-target-expand'), 'IconButton enforces touch-target-expand');
assert(iconBtnContent.includes('min-h-[48px]'), 'IconButton enforces 48px min height target');

const chipPath = path.resolve('src/components/ui/Chip.tsx');
assert(fs.existsSync(chipPath), 'Chip.tsx exists');
const chipContent = fs.readFileSync(chipPath, 'utf8');
assert(chipContent.includes('touch-target-expand'), 'Chip remove button enforces touch-target-expand');

console.log(`\n🎉 ALL ${passedChecks}/${totalChecks} TASK 184 VERIFICATION CHECKS PASSED 100%!`);
