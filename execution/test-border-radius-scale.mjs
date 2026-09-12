import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

console.log('🧪 RUNNING BORDER RADIUS SCALE & RING UNIFICATION TEST SUITE...\n');

// 1. Verify src/lib/designTokens.ts exports
const designTokensPath = path.resolve('src/lib/designTokens.ts');
const designTokensContent = fs.readFileSync(designTokensPath, 'utf8');

assert.ok(
  designTokensContent.includes('GLOBAL_RADIUS_SCALE'),
  'GLOBAL_RADIUS_SCALE must be exported in designTokens.ts'
);

assert.ok(
  designTokensContent.includes('SEMANTIC_RADIUS_TOKENS'),
  'SEMANTIC_RADIUS_TOKENS must be exported in designTokens.ts'
);

assert.ok(
  designTokensContent.includes('getSemanticRadius'),
  'getSemanticRadius function must be exported in designTokens.ts'
);

// Dynamic import test for designTokens
const { GLOBAL_RADIUS_SCALE, SEMANTIC_RADIUS_TOKENS, getSemanticRadius } = await import(
  '../src/lib/designTokens.ts'
);

assert.equal(typeof GLOBAL_RADIUS_SCALE, 'object', 'GLOBAL_RADIUS_SCALE should be an object');
assert.ok(GLOBAL_RADIUS_SCALE.xs, 'GLOBAL_RADIUS_SCALE.xs must exist');
assert.ok(GLOBAL_RADIUS_SCALE.sm, 'GLOBAL_RADIUS_SCALE.sm must exist');
assert.ok(GLOBAL_RADIUS_SCALE.md, 'GLOBAL_RADIUS_SCALE.md must exist');
assert.ok(GLOBAL_RADIUS_SCALE.lg, 'GLOBAL_RADIUS_SCALE.lg must exist');
assert.ok(GLOBAL_RADIUS_SCALE.xl, 'GLOBAL_RADIUS_SCALE.xl must exist');
assert.ok(GLOBAL_RADIUS_SCALE['2xl'], 'GLOBAL_RADIUS_SCALE["2xl"] must exist');
assert.ok(GLOBAL_RADIUS_SCALE['3xl'], 'GLOBAL_RADIUS_SCALE["3xl"] must exist');
assert.ok(GLOBAL_RADIUS_SCALE['4xl'], 'GLOBAL_RADIUS_SCALE["4xl"] must exist');
assert.equal(GLOBAL_RADIUS_SCALE.full, '9999px', 'GLOBAL_RADIUS_SCALE.full must be 9999px');

assert.equal(getSemanticRadius('badge'), GLOBAL_RADIUS_SCALE.sm, 'getSemanticRadius("badge") must match sm');
assert.equal(getSemanticRadius('button'), GLOBAL_RADIUS_SCALE.md, 'getSemanticRadius("button") must match md');
assert.equal(getSemanticRadius('input'), GLOBAL_RADIUS_SCALE.md, 'getSemanticRadius("input") must match md');
assert.equal(getSemanticRadius('card'), GLOBAL_RADIUS_SCALE.xl, 'getSemanticRadius("card") must match xl');
assert.equal(getSemanticRadius('panel'), GLOBAL_RADIUS_SCALE['2xl'], 'getSemanticRadius("panel") must match 2xl');
assert.equal(getSemanticRadius('modal'), GLOBAL_RADIUS_SCALE['3xl'], 'getSemanticRadius("modal") must match 3xl');
assert.equal(getSemanticRadius('pill'), GLOBAL_RADIUS_SCALE.full, 'getSemanticRadius("pill") must match full');

console.log('✅ 1. Design tokens exports & semantic helpers verified.');

// 2. Verify src/styles.css CSS variables and @utility rules
const stylesCssPath = path.resolve('src/styles.css');
const stylesCssContent = fs.readFileSync(stylesCssPath, 'utf8');

const expectedVariables = [
  '--radius-xs',
  '--radius-sm',
  '--radius-md',
  '--radius-lg',
  '--radius-xl',
  '--radius-2xl',
  '--radius-3xl',
  '--radius-4xl',
  '--radius-full',
];

for (const variable of expectedVariables) {
  assert.ok(
    stylesCssContent.includes(variable),
    `src/styles.css must contain CSS token ${variable}`
  );
}

const expectedUtilities = [
  '@utility rounded-badge',
  '@utility rounded-btn',
  '@utility rounded-input',
  '@utility rounded-card-ui',
  '@utility rounded-panel-ui',
  '@utility rounded-modal-ui',
  '@utility ring-focus-persona',
];

for (const utility of expectedUtilities) {
  assert.ok(
    stylesCssContent.includes(utility),
    `src/styles.css must contain utility rule ${utility}`
  );
}

assert.ok(
  stylesCssContent.includes('border-radius: var(--radius-md)'),
  'src/styles.css :focus-visible rule must use var(--radius-md)'
);

console.log('✅ 2. CSS variables, utility rules, and focus ring tokens verified.');
console.log('\n🎉 ALL BORDER RADIUS & RING SCALE CHECKS PASSED SUCCESSFULLY!');
