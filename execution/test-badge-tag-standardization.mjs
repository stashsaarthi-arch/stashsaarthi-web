import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Running Badge & Tag Standardization (Task 148) Test Harness...\n');

let checksPassed = 0;
const totalChecks = 5;

// Check 1: designTokens.ts defines METADATA_TAG_TOKENS and helpers
const designTokensPath = path.join(rootDir, 'src', 'lib', 'designTokens.ts');
const designTokensContent = fs.readFileSync(designTokensPath, 'utf8');

if (
  designTokensContent.includes('export const METADATA_TAG_TOKENS') &&
  designTokensContent.includes('export function getMetadataTagTokens') &&
  designTokensContent.includes('export function getMetadataTagClasses') &&
  designTokensContent.includes('verifiedHost') &&
  designTokensContent.includes('campusProximity') &&
  designTokensContent.includes('lifestyle') &&
  designTokensContent.includes('amenity')
) {
  console.log('✅ Check 1 PASSED: designTokens.ts contains METADATA_TAG_TOKENS and helper functions.');
  checksPassed++;
} else {
  console.error('❌ Check 1 FAILED: designTokens.ts missing METADATA_TAG_TOKENS.');
}

// Check 2: styles.css contains metadata tag utility classes
const stylesPath = path.join(rootDir, 'src', 'styles.css');
const stylesContent = fs.readFileSync(stylesPath, 'utf8');

if (
  stylesContent.includes('metadata-tag-base') &&
  stylesContent.includes('metadata-tag-micro-padding') &&
  stylesContent.includes('metadata-tag-verified-host') &&
  stylesContent.includes('metadata-tag-campus-proximity') &&
  stylesContent.includes('metadata-tag-lifestyle') &&
  stylesContent.includes('metadata-tag-amenity')
) {
  console.log('✅ Check 2 PASSED: styles.css contains metadata tag CSS utility classes.');
  checksPassed++;
} else {
  console.error('❌ Check 2 FAILED: styles.css missing metadata tag utility classes.');
}

// Check 3: StandardMetadataTag.tsx exists and defines component
const tagCompPath = path.join(rootDir, 'src', 'components', 'ui', 'StandardMetadataTag.tsx');
if (fs.existsSync(tagCompPath)) {
  const tagCompContent = fs.readFileSync(tagCompPath, 'utf8');
  if (
    tagCompContent.includes('export function StandardMetadataTag') &&
    tagCompContent.includes('export const MetadataTag = StandardMetadataTag') &&
    tagCompContent.includes('preset')
  ) {
    console.log('✅ Check 3 PASSED: StandardMetadataTag.tsx component created with presets and aliases.');
    checksPassed++;
  } else {
    console.error('❌ Check 3 FAILED: StandardMetadataTag.tsx invalid implementation.');
  }
} else {
  console.error('❌ Check 3 FAILED: StandardMetadataTag.tsx does not exist.');
}

// Check 4: primitives.ts re-exports StandardMetadataTag & MetadataTag
const primitivesPath = path.join(rootDir, 'src', 'components', 'ui', 'primitives.ts');
const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');

if (
  primitivesContent.includes('StandardMetadataTag') &&
  primitivesContent.includes('MetadataTag')
) {
  console.log('✅ Check 4 PASSED: primitives.ts re-exports StandardMetadataTag & MetadataTag.');
  checksPassed++;
} else {
  console.error('❌ Check 4 FAILED: primitives.ts missing StandardMetadataTag re-exports.');
}

// Check 5: SaarthiSpacesCard2.tsx integrates StandardMetadataTag
const spacesCardPath = path.join(rootDir, 'src', 'components', 'ui', 'SaarthiSpacesCard2.tsx');
const spacesCardContent = fs.readFileSync(spacesCardPath, 'utf8');

if (
  spacesCardContent.includes('StandardMetadataTag') &&
  spacesCardContent.includes('preset="pricingSave"') &&
  spacesCardContent.includes('preset="campusProximity"')
) {
  console.log('✅ Check 5 PASSED: SaarthiSpacesCard2.tsx integrates StandardMetadataTag.');
  checksPassed++;
} else {
  console.error('❌ Check 5 FAILED: SaarthiSpacesCard2.tsx missing StandardMetadataTag integration.');
}

console.log(`\nResults: ${checksPassed}/${totalChecks} checks passed.`);
if (checksPassed === totalChecks) {
  console.log('🎉 BADGE & TAG STANDARDIZATION CHECKS PASSED 100%!\n');
  process.exit(0);
} else {
  console.error('💥 Test suite failed.\n');
  process.exit(1);
}
