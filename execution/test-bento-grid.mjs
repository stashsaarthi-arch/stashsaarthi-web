import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('--- Task 115 Bento Grid Architecture Verification ---');

// 1. Verify BENTO_GRID_TOKENS in designTokens.ts
const designTokensPath = path.join(projectRoot, 'src', 'lib', 'designTokens.ts');
const designTokensContent = fs.readFileSync(designTokensPath, 'utf8');

if (!designTokensContent.includes('BENTO_GRID_TOKENS') || !designTokensContent.includes('getBentoSpanClasses')) {
  console.error('❌ Failed: BENTO_GRID_TOKENS or getBentoSpanClasses missing in designTokens.ts');
  process.exit(1);
}
console.log('✅ Passed: BENTO_GRID_TOKENS & helper present in designTokens.ts');

// 2. Verify Bento Grid CSS utilities in styles.css
const stylesPath = path.join(projectRoot, 'src', 'styles.css');
const stylesContent = fs.readFileSync(stylesPath, 'utf8');

if (!stylesContent.includes('@utility bento-grid') || !stylesContent.includes('@utility bento-span-featured')) {
  console.error('❌ Failed: @utility bento-grid or bento-span-featured missing in styles.css');
  process.exit(1);
}
console.log('✅ Passed: Bento Grid CSS utility rules present in styles.css');

// 3. Verify BentoGrid.tsx component file
const bentoComponentPath = path.join(projectRoot, 'src', 'components', 'ui', 'BentoGrid.tsx');
if (!fs.existsSync(bentoComponentPath)) {
  console.error('❌ Failed: src/components/ui/BentoGrid.tsx does not exist');
  process.exit(1);
}
console.log('✅ Passed: src/components/ui/BentoGrid.tsx created successfully');

// 4. Verify re-export in primitives.ts
const primitivesPath = path.join(projectRoot, 'src', 'components', 'ui', 'primitives.ts');
const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');

if (!primitivesContent.includes('BentoGrid') || !primitivesContent.includes('BentoCard')) {
  console.error('❌ Failed: BentoGrid components not re-exported in primitives.ts');
  process.exit(1);
}
console.log('✅ Passed: BentoGrid primitive re-exports present in primitives.ts');

// 5. Verify Ecosystem.tsx using BentoGrid
const ecosystemPath = path.join(projectRoot, 'src', 'components', 'stash', 'Ecosystem.tsx');
const ecosystemContent = fs.readFileSync(ecosystemPath, 'utf8');

if (!ecosystemContent.includes('BentoGrid') || !ecosystemContent.includes('BentoCard')) {
  console.error('❌ Failed: Ecosystem.tsx not refactored to BentoGrid layout');
  process.exit(1);
}
console.log('✅ Passed: Ecosystem.tsx successfully refactored to Bento Grid architecture');

console.log('--- All Bento Grid checks passed successfully ---');
