import fs from 'fs';
import path from 'path';

console.log("=== Running Task 144 Deterministic Verification: Saarthi Connect Card 2.0 ===");

const rootDir = process.cwd();

// 1. Verify Design Tokens
const designTokensPath = path.join(rootDir, 'src', 'lib', 'designTokens.ts');
const designTokensContent = fs.readFileSync(designTokensPath, 'utf8');

if (!designTokensContent.includes('SAARTHI_CONNECT_CARD_TOKENS')) {
  console.error("FAIL: SAARTHI_CONNECT_CARD_TOKENS missing from designTokens.ts");
  process.exit(1);
}
if (!designTokensContent.includes('getSaarthiConnectCardTokens')) {
  console.error("FAIL: getSaarthiConnectCardTokens missing from designTokens.ts");
  process.exit(1);
}
console.log("PASS: SAARTHI_CONNECT_CARD_TOKENS & helper present in designTokens.ts");

// 2. Verify CSS Utilities
const stylesCssPath = path.join(rootDir, 'src', 'styles.css');
const stylesCssContent = fs.readFileSync(stylesCssPath, 'utf8');

const requiredCssTokens = ['senior-hobby-chip', 'student-skill-chip', 'karma-points-counter-glow'];
for (const cssToken of requiredCssTokens) {
  if (!stylesCssContent.includes(cssToken)) {
    console.error(`FAIL: CSS utility ${cssToken} missing from src/styles.css`);
    process.exit(1);
  }
}
console.log("PASS: Saarthi Connect Card 2.0 CSS utilities verified in src/styles.css");

// 3. Verify Primitive Component
const componentPath = path.join(rootDir, 'src', 'components', 'ui', 'SaarthiConnectCard2.tsx');
if (!fs.existsSync(componentPath)) {
  console.error("FAIL: SaarthiConnectCard2.tsx missing");
  process.exit(1);
}
const componentContent = fs.readFileSync(componentPath, 'utf8');
if (!componentContent.includes('export const SaarthiConnectCard2')) {
  console.error("FAIL: SaarthiConnectCard2 export missing from component file");
  process.exit(1);
}
console.log("PASS: SaarthiConnectCard2.tsx verified");

// 4. Verify Primitives Export
const primitivesPath = path.join(rootDir, 'src', 'components', 'ui', 'primitives.ts');
const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');
if (!primitivesContent.includes('SaarthiConnectCard2')) {
  console.error("FAIL: SaarthiConnectCard2 missing from primitives.ts");
  process.exit(1);
}
console.log("PASS: SaarthiConnectCard2 re-exported in primitives.ts");

// 5. Verify Integration in Connect.tsx
const connectPath = path.join(rootDir, 'src', 'components', 'stash', 'Connect.tsx');
const connectContent = fs.readFileSync(connectPath, 'utf8');
if (!connectContent.includes('SaarthiConnectCard2')) {
  console.error("FAIL: SaarthiConnectCard2 missing from Connect.tsx");
  process.exit(1);
}
console.log("PASS: SaarthiConnectCard2 integrated into Connect.tsx");

console.log("=== All Task 144 Checks PASSED! ===");
