import fs from 'fs';
import path from 'path';

console.log('🧪 Running Task 108: Dark Obsidian Depth & Ambient Noise Textures Verification Suite...');

// 1. Verify src/lib/designTokens.ts exports
const designTokensPath = path.resolve('src/lib/designTokens.ts');
const designTokensContent = fs.readFileSync(designTokensPath, 'utf8');

const requiredExports = [
  'DEPTH_TEXTURE_TOKENS',
  'getPersonaRadialMesh',
  'getObsidianDepthTexture',
  'noiseDataUri',
  'radialMeshStudent',
  'radialMeshHost'
];

for (const exp of requiredExports) {
  if (!designTokensContent.includes(exp)) {
    console.error(`❌ Missing expected export or key "${exp}" in src/lib/designTokens.ts`);
    process.exit(1);
  }
}
console.log('  ✅ Verified src/lib/designTokens.ts exports DEPTH_TEXTURE_TOKENS & depth helpers');

// 2. Import designTokens module dynamically and test runtime functions
const designTokensModule = await import('../src/lib/designTokens.ts');

if (!designTokensModule.DEPTH_TEXTURE_TOKENS || !designTokensModule.DEPTH_TEXTURE_TOKENS.noiseDataUri) {
  console.error('❌ DEPTH_TEXTURE_TOKENS structure invalid');
  process.exit(1);
}

const studentMesh = designTokensModule.getPersonaRadialMesh('student');
const hostMesh = designTokensModule.getPersonaRadialMesh('host');

if (!studentMesh.includes('0.72 0.19 160') || !hostMesh.includes('0.809 0.165 76')) {
  console.error('❌ Persona radial mesh colors do not match expected Student Mint / Host Amber specs');
  process.exit(1);
}
console.log('  ✅ Verified runtime getPersonaRadialMesh() returns persona-calibrated gradients');

const studentDepth = designTokensModule.getObsidianDepthTexture('student');
const hostDepth = designTokensModule.getObsidianDepthTexture('host');

if (!studentDepth.backgroundImage.includes('noiseFilter') || !hostDepth.backgroundImage.includes('noiseFilter')) {
  console.error('❌ getObsidianDepthTexture() does not combine radial mesh with ambient noise SVG filter');
  process.exit(1);
}
console.log('  ✅ Verified runtime getObsidianDepthTexture() combines radial mesh & ambient noise background');

// 3. Verify CSS rules in src/styles.css
const cssPath = path.resolve('src/styles.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

const requiredCssUtilities = [
  '--color-radial-mesh-student',
  '--color-radial-mesh-host',
  '--radial-mesh-student:',
  '--radial-mesh-host:',
  '--radial-mesh-persona:',
  '@utility bg-noise',
  '@utility bg-noise-subtle',
  '@utility bg-noise-dense',
  '@utility radial-mesh',
  '@utility radial-mesh-student',
  '@utility radial-mesh-host',
  '@utility radial-mesh-persona',
  '@utility bg-obsidian-depth'
];

for (const cssRule of requiredCssUtilities) {
  if (!cssContent.includes(cssRule)) {
    console.error(`❌ Missing CSS rule or utility "${cssRule}" in src/styles.css`);
    process.exit(1);
  }
}
console.log('  ✅ Verified src/styles.css contains all noise, radial mesh & obsidian depth utility classes');

console.log('\n🎉 ALL DARK OBSIDIAN DEPTH & AMBIENT NOISE TEXTURES CHECKS PASSED SUCCESSFULLY!');
