import fs from 'fs';
import path from 'path';

console.log("=== Task 175 Verification: Host Passive Income Analytics ===");

const errors = [];

// 1. Check designTokens.ts
const designTokensPath = path.resolve('src/lib/designTokens.ts');
const designTokensContent = fs.readFileSync(designTokensPath, 'utf8');
if (!designTokensContent.includes('HOST_PASSIVE_INCOME_TOKENS')) {
  errors.push('designTokens.ts missing HOST_PASSIVE_INCOME_TOKENS');
}
if (!designTokensContent.includes('getHostPassiveIncomeTokens')) {
  errors.push('designTokens.ts missing getHostPassiveIncomeTokens');
}
if (!designTokensContent.includes('Section 80TTB Shield')) {
  errors.push('designTokens.ts missing Section 80TTB Shield definition');
}

// 2. Check styles.css
const stylesPath = path.resolve('src/styles.css');
const stylesContent = fs.readFileSync(stylesPath, 'utf8');
if (!stylesContent.includes('host-income-analytics-container')) {
  errors.push('styles.css missing .host-income-analytics-container class');
}
if (!stylesContent.includes('host-transfer-row')) {
  errors.push('styles.css missing .host-transfer-row class');
}
if (!stylesContent.includes('host-tax-shield-card')) {
  errors.push('styles.css missing .host-tax-shield-card class');
}

// 3. Check HostPassiveIncomeAnalytics.tsx
const componentPath = path.resolve('src/components/ui/HostPassiveIncomeAnalytics.tsx');
if (!fs.existsSync(componentPath)) {
  errors.push('HostPassiveIncomeAnalytics.tsx file does not exist');
} else {
  const compContent = fs.readFileSync(componentPath, 'utf8');
  if (!compContent.includes('export function HostPassiveIncomeAnalytics')) {
    errors.push('HostPassiveIncomeAnalytics.tsx does not export HostPassiveIncomeAnalytics');
  }
  if (!compContent.includes('Senior Citizen Mode')) {
    errors.push('HostPassiveIncomeAnalytics.tsx missing senior legibility mode');
  }
}

// 4. Check primitives.ts & index.ts
const primitivesPath = path.resolve('src/components/ui/primitives.ts');
const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');
if (!primitivesContent.includes('HostPassiveIncomeAnalytics')) {
  errors.push('primitives.ts missing HostPassiveIncomeAnalytics re-export');
}

const indexPath = path.resolve('src/components/ui/index.ts');
const indexContent = fs.readFileSync(indexPath, 'utf8');
if (!indexContent.includes('HostPassiveIncomeAnalytics')) {
  errors.push('index.ts missing HostPassiveIncomeAnalytics export');
}

// 5. Check HostIncomeChart.tsx integration
const chartPath = path.resolve('src/components/stash/HostIncomeChart.tsx');
const chartContent = fs.readFileSync(chartPath, 'utf8');
if (!chartContent.includes('HostPassiveIncomeAnalytics')) {
  errors.push('HostIncomeChart.tsx missing HostPassiveIncomeAnalytics integration');
}

if (errors.length > 0) {
  console.error("❌ Task 175 Verification Failed:");
  errors.forEach(err => console.error(` - ${err}`));
  process.exit(1);
} else {
  console.log("✅ All Task 175 checks passed successfully!");
}
