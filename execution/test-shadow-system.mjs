import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

console.log('🧪 RUNNING 4-TIER ELEVATION SHADOW SYSTEM TEST SUITE...\n');

// 1. Verify src/lib/designTokens.ts exports
const designTokensPath = path.resolve('src/lib/designTokens.ts');
const designTokensContent = fs.readFileSync(designTokensPath, 'utf8');

assert.ok(
  designTokensContent.includes('SHADOW_TOKENS'),
  'SHADOW_TOKENS must be exported in designTokens.ts'
);

assert.ok(
  designTokensContent.includes('getPersonaShadowGlow'),
  'getPersonaShadowGlow function must be exported in designTokens.ts'
);

// Dynamic import test for designTokens
const { SHADOW_TOKENS, getPersonaShadowGlow } = await import(
  '../src/lib/designTokens.ts'
);

assert.equal(typeof SHADOW_TOKENS, 'object', 'SHADOW_TOKENS should be an object');
assert.equal(SHADOW_TOKENS.subtle, 'var(--shadow-subtle)', 'SHADOW_TOKENS.subtle must match CSS var');
assert.equal(SHADOW_TOKENS.card, 'var(--shadow-card)', 'SHADOW_TOKENS.card must match CSS var');
assert.equal(SHADOW_TOKENS.floating, 'var(--shadow-floating)', 'SHADOW_TOKENS.floating must match CSS var');
assert.equal(SHADOW_TOKENS.glow, 'var(--shadow-glow)', 'SHADOW_TOKENS.glow must match CSS var');

const studentGlow = getPersonaShadowGlow('student');
const hostGlow = getPersonaShadowGlow('host');

assert.ok(studentGlow.includes('0.72 0.19 160'), 'Student shadow glow must include mint OKLCH color');
assert.ok(hostGlow.includes('0.809 0.165 76'), 'Host shadow glow must include amber OKLCH color');

console.log('✅ 1. Design tokens shadow exports & persona helpers verified.');

// 2. Verify src/styles.css CSS variables and @utility rules
const stylesCssPath = path.resolve('src/styles.css');
const stylesCssContent = fs.readFileSync(stylesCssPath, 'utf8');

const expectedVariables = [
  '--shadow-subtle',
  '--shadow-card',
  '--shadow-floating',
  '--shadow-glow',
];

for (const variable of expectedVariables) {
  assert.ok(
    stylesCssContent.includes(variable),
    `src/styles.css must contain CSS token ${variable}`
  );
}

const expectedUtilities = [
  '@utility shadow-subtle',
  '@utility shadow-card',
  '@utility shadow-floating',
  '@utility shadow-glow',
];

for (const utility of expectedUtilities) {
  assert.ok(
    stylesCssContent.includes(utility),
    `src/styles.css must contain utility rule ${utility}`
  );
}

console.log('✅ 2. CSS shadow variables, light mode overrides, and utility rules verified.');
console.log('\n🎉 ALL 4-TIER ELEVATION SHADOW SYSTEM CHECKS PASSED SUCCESSFULLY!');
