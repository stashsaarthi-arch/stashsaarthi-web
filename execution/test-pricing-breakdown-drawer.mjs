import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const projectRoot = process.cwd();

function runChecks() {
  console.log('🧪 Starting Task 165 Verification: Dynamic Pricing Breakdown Drawer...');

  const designTokensPath = resolve(projectRoot, 'src/lib/designTokens.ts');
  const cssPath = resolve(projectRoot, 'src/styles.css');
  const componentPath = resolve(projectRoot, 'src/components/ui/PricingBreakdownDrawer.tsx');
  const primitivesPath = resolve(projectRoot, 'src/components/ui/primitives.ts');

  // Check 1: Design Tokens
  if (!existsSync(designTokensPath)) throw new Error('designTokens.ts missing!');
  const tokensContent = readFileSync(designTokensPath, 'utf8');
  if (!tokensContent.includes('PRICING_BREAKDOWN_DRAWER_TOKENS') || !tokensContent.includes('getPricingBreakdownDrawerTokens')) {
    throw new Error('PRICING_BREAKDOWN_DRAWER_TOKENS or helper missing in designTokens.ts');
  }
  console.log('✅ Check 1 Passed: PRICING_BREAKDOWN_DRAWER_TOKENS & helper verified.');

  // Check 2: CSS Rules
  if (!existsSync(cssPath)) throw new Error('styles.css missing!');
  const cssContent = readFileSync(cssPath, 'utf8');
  if (!cssContent.includes('.pricing-drawer-container') || !cssContent.includes('.pricing-breakdown-row')) {
    throw new Error('Pricing Breakdown Drawer CSS utilities missing in styles.css');
  }
  console.log('✅ Check 2 Passed: Pricing Breakdown Drawer CSS utility rules verified.');

  // Check 3: Component Implementation
  if (!existsSync(componentPath)) throw new Error('PricingBreakdownDrawer.tsx missing!');
  const componentContent = readFileSync(componentPath, 'utf8');
  if (
    !componentContent.includes('export const PricingBreakdownDrawer') ||
    !componentContent.includes('100% Transparent Price Summary') ||
    !componentContent.includes('Dead-Rent Savings Shield') ||
    !componentContent.includes('usePersona')
  ) {
    throw new Error('PricingBreakdownDrawer component structural checks failed.');
  }
  console.log('✅ Check 3 Passed: PricingBreakdownDrawer primitive component implementation verified.');

  // Check 4: Primitives Re-export
  if (!existsSync(primitivesPath)) throw new Error('primitives.ts missing!');
  const primitivesContent = readFileSync(primitivesPath, 'utf8');
  if (!primitivesContent.includes('PricingBreakdownDrawer') || !primitivesContent.includes('PricingBreakdownDrawerProps')) {
    throw new Error('PricingBreakdownDrawer re-export missing in primitives.ts');
  }
  console.log('✅ Check 4 Passed: PricingBreakdownDrawer primitive re-exports verified.');

  console.log('🎉 Task 165 Verification Completed 100% Successfully!');
}

runChecks();
