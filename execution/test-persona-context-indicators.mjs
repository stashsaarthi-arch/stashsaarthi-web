import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log("==================================================================");
console.log("🧪 RUNNING VERIFICATION SUITE: PERSONA CONTEXT INDICATORS (TASK 140)");
console.log("==================================================================");

let checksPassed = 0;
const totalChecks = 6;

// Check 1: Design tokens in designTokens.ts
const designTokensPath = path.resolve('src/lib/designTokens.ts');
const designTokensContent = fs.readFileSync(designTokensPath, 'utf-8');

if (
  designTokensContent.includes('PERSONA_CONTEXT_INDICATOR_TOKENS') &&
  designTokensContent.includes('getPersonaContextIndicatorTokens') &&
  designTokensContent.includes('getPersonaHaloStyles') &&
  designTokensContent.includes('STUDENT MODE') &&
  designTokensContent.includes('SENIOR HOST MODE')
) {
  console.log("✅ Check 1 PASSED: Design tokens for Persona Context Indicators defined in designTokens.ts");
  checksPassed++;
} else {
  console.error("❌ Check 1 FAILED: Missing Persona Context Indicator tokens in designTokens.ts");
}

// Check 2: CSS utility definitions in styles.css
const stylesPath = path.resolve('src/styles.css');
const stylesContent = fs.readFileSync(stylesPath, 'utf-8');

if (
  stylesContent.includes('persona-context-halo-student') &&
  stylesContent.includes('persona-context-halo-host') &&
  stylesContent.includes('sticky-persona-corner-badge') &&
  stylesContent.includes('persona-indicator-pulse-dot')
) {
  console.log("✅ Check 2 PASSED: CSS utilities defined in styles.css");
  checksPassed++;
} else {
  console.error("❌ Check 2 FAILED: Missing CSS utilities in styles.css");
}

// Check 3: PersonaContextIndicator.tsx component file
const componentPath = path.resolve('src/components/ui/PersonaContextIndicator.tsx');
if (fs.existsSync(componentPath)) {
  const componentContent = fs.readFileSync(componentPath, 'utf-8');
  if (
    componentContent.includes('PersonaContextIndicator') &&
    componentContent.includes('usePersona') &&
    componentContent.includes('useLanguage') &&
    componentContent.includes('getPersonaContextIndicatorTokens') &&
    componentContent.includes('sticky-persona-corner-badge')
  ) {
    console.log("✅ Check 3 PASSED: PersonaContextIndicator.tsx component valid with context & tokens");
    checksPassed++;
  } else {
    console.error("❌ Check 3 FAILED: PersonaContextIndicator.tsx missing required hooks/styles");
  }
} else {
  console.error("❌ Check 3 FAILED: PersonaContextIndicator.tsx file does not exist");
}

// Check 4: Primitives re-export in primitives.ts
const primitivesPath = path.resolve('src/components/ui/primitives.ts');
const primitivesContent = fs.readFileSync(primitivesPath, 'utf-8');

if (
  primitivesContent.includes('PersonaContextIndicator') &&
  primitivesContent.includes('PersonaContextIndicatorProps')
) {
  console.log("✅ Check 4 PASSED: PersonaContextIndicator re-exported in primitives.ts");
  checksPassed++;
} else {
  console.error("❌ Check 4 FAILED: Missing re-export in primitives.ts");
}

// Check 5: Route mounting in routes/index.tsx
const indexPath = path.resolve('src/routes/index.tsx');
const indexContent = fs.readFileSync(indexPath, 'utf-8');

if (
  indexContent.includes('PersonaContextIndicator') &&
  indexContent.includes('<PersonaContextIndicator />')
) {
  console.log("✅ Check 5 PASSED: PersonaContextIndicator mounted in landing page route index.tsx");
  checksPassed++;
} else {
  console.error("❌ Check 5 FAILED: PersonaContextIndicator not mounted in index.tsx");
}

// Check 6: Production Build Compilation
try {
  console.log("⏳ Running npm run build...");
  execSync('npm run build', { stdio: 'pipe', encoding: 'utf-8' });
  console.log("✅ Check 6 PASSED: Production build compiled cleanly with 0 TypeScript/CSS errors");
  checksPassed++;
} catch (err) {
  console.error("❌ Check 6 FAILED: npm run build failed", err.stdout || err.message);
}

console.log("==================================================================");
if (checksPassed === totalChecks) {
  console.log(`🎉 ALL ${checksPassed}/${totalChecks} PERSONA CONTEXT INDICATOR CHECKS PASSED SUCCESSFULLY!`);
} else {
  console.error(`💥 ${totalChecks - checksPassed} CHECKS FAILED.`);
  process.exit(1);
}
