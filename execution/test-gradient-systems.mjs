import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('🧪 Starting Gradient Systems Verification Suite...');

// 1. Verify src/lib/designTokens.ts exports
const designTokensPath = path.resolve('src/lib/designTokens.ts');
const designTokensContent = fs.readFileSync(designTokensPath, 'utf8');

assert.ok(designTokensContent.includes('GRADIENT_TOKENS'), 'designTokens.ts must export GRADIENT_TOKENS');
assert.ok(designTokensContent.includes('mintEmerald'), 'GRADIENT_TOKENS must include mintEmerald');
assert.ok(designTokensContent.includes('amberGold'), 'GRADIENT_TOKENS must include amberGold');
assert.ok(designTokensContent.includes('cyanEmerald'), 'GRADIENT_TOKENS must include cyanEmerald');
assert.ok(designTokensContent.includes('obsidianMesh'), 'GRADIENT_TOKENS must include obsidianMesh');
assert.ok(designTokensContent.includes('getPersonaGradient'), 'designTokens.ts must export getPersonaGradient function');

console.log('  ✅ designTokens.ts exports validated.');

// 2. Verify src/styles.css declarations
const stylesCssPath = path.resolve('src/styles.css');
const stylesCssContent = fs.readFileSync(stylesCssPath, 'utf8');

assert.ok(stylesCssContent.includes('--gradient-mint-emerald'), 'styles.css must declare --gradient-mint-emerald');
assert.ok(stylesCssContent.includes('--gradient-amber-gold'), 'styles.css must declare --gradient-amber-gold');
assert.ok(stylesCssContent.includes('--gradient-cyan-emerald'), 'styles.css must declare --gradient-cyan-emerald');
assert.ok(stylesCssContent.includes('--gradient-obsidian-mesh'), 'styles.css must declare --gradient-obsidian-mesh');
assert.ok(stylesCssContent.includes('--gradient-persona-radiant'), 'styles.css must declare --gradient-persona-radiant');

assert.ok(stylesCssContent.includes('@utility gradient-mint-emerald'), 'styles.css must define @utility gradient-mint-emerald');
assert.ok(stylesCssContent.includes('@utility gradient-amber-gold'), 'styles.css must define @utility gradient-amber-gold');
assert.ok(stylesCssContent.includes('@utility gradient-persona-radiant'), 'styles.css must define @utility gradient-persona-radiant');
assert.ok(stylesCssContent.includes('@utility text-gradient-mint'), 'styles.css must define @utility text-gradient-mint');
assert.ok(stylesCssContent.includes('@utility text-gradient-amber'), 'styles.css must define @utility text-gradient-amber');
assert.ok(stylesCssContent.includes('@utility text-gradient-persona'), 'styles.css must define @utility text-gradient-persona');

console.log('  ✅ styles.css gradient variables and @utility rules validated.');

// 3. Test tsx runtime import
const { GRADIENT_TOKENS, getPersonaGradient } = await import('../src/lib/designTokens.ts');

assert.strictEqual(getPersonaGradient('student'), GRADIENT_TOKENS.mintEmerald, 'Student gradient must match mintEmerald');
assert.strictEqual(getPersonaGradient('host'), GRADIENT_TOKENS.amberGold, 'Host gradient must match amberGold');

console.log('  ✅ Runtime helper functions validated.');
console.log('🎉 ALL GRADIENT SYSTEMS CHECKS PASSED SUCCESSFULLY!');
