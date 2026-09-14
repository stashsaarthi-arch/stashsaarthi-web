import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Running Visual Text Hierarchy Verification Suite...\n');

let failures = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failures++;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

// 1. Inspect designTokens.ts
const designTokensPath = path.join(rootDir, 'src', 'lib', 'designTokens.ts');
const designTokensContent = fs.readFileSync(designTokensPath, 'utf8');

assert(
  designTokensContent.includes('TEXT_HIERARCHY_TOKENS'),
  'TEXT_HIERARCHY_TOKENS exported in designTokens.ts'
);
assert(
  designTokensContent.includes('getHeadingHierarchyClasses'),
  'getHeadingHierarchyClasses helper function exported in designTokens.ts'
);
assert(
  designTokensContent.includes('display-contrast') &&
  designTokensContent.includes('heading-contrast') &&
  designTokensContent.includes('body-contrast') &&
  designTokensContent.includes('muted-contrast'),
  'Contrast role mappings defined across text levels'
);

// 2. Inspect styles.css
const stylesCssPath = path.join(rootDir, 'src', 'styles.css');
const stylesCssContent = fs.readFileSync(stylesCssPath, 'utf8');

const requiredCssUtilities = [
  '@utility heading-display',
  '@utility heading-h1',
  '@utility heading-h2',
  '@utility heading-h3',
  '@utility heading-h4',
  '@utility text-overline',
  '@utility text-caption',
  '@utility section-header-wrapper',
];

for (const util of requiredCssUtilities) {
  assert(
    stylesCssContent.includes(util),
    `styles.css contains required utility rule: ${util}`
  );
}

// 3. Inspect base HTML heading rules
assert(
  stylesCssContent.includes('font-family: var(--font-display);') &&
  stylesCssContent.includes('font-weight: 800;'),
  'Base h1 element applies display font-family and 800 font-weight'
);

// 4. Inspect Typography.tsx
const typographyPath = path.join(rootDir, 'src', 'components', 'ui', 'Typography.tsx');
const typographyContent = fs.readFileSync(typographyPath, 'utf8');

assert(
  typographyContent.includes('getHeadingHierarchyClasses'),
  'Typography.tsx leverages getHeadingHierarchyClasses helper'
);
assert(
  typographyContent.includes('export const SectionHeader'),
  'SectionHeader component exported in Typography.tsx'
);
assert(
  typographyContent.includes('section-header-wrapper'),
  'SectionHeader applies section-header-wrapper utility'
);

// 5. Inspect primitives.ts
const primitivesPath = path.join(rootDir, 'src', 'components', 'ui', 'primitives.ts');
const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');

assert(
  primitivesContent.includes('SectionHeader'),
  'SectionHeader re-exported in primitives.ts'
);

console.log('\n--- Test Summary ---');
if (failures === 0) {
  console.log('🎉 ALL VISUAL TEXT HIERARCHY CHECKS PASSED SUCCESSFULLY!');
  process.exit(0);
} else {
  console.error(`💥 ${failures} CHECKS FAILED.`);
  process.exit(1);
}
