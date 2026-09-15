import fs from 'fs';
import path from 'path';

console.log('--- Testing Task 178: Data Table Ergonomics ---');

const projectRoot = process.cwd();

// 1. Verify design tokens in designTokens.ts
const designTokensPath = path.join(projectRoot, 'src', 'lib', 'designTokens.ts');
const designTokensContent = fs.readFileSync(designTokensPath, 'utf8');

if (!designTokensContent.includes('DATA_TABLE_ERGONOMICS_TOKENS')) {
  console.error('FAILED: DATA_TABLE_ERGONOMICS_TOKENS not found in designTokens.ts');
  process.exit(1);
}
if (!designTokensContent.includes('getDataTableErgonomicsTokens')) {
  console.error('FAILED: getDataTableErgonomicsTokens helper function not found in designTokens.ts');
  process.exit(1);
}
console.log('✓ Design tokens for Data Table Ergonomics verified in designTokens.ts');

// 2. Verify CSS rules in styles.css
const stylesPath = path.join(projectRoot, 'src', 'styles.css');
const stylesContent = fs.readFileSync(stylesPath, 'utf8');

if (!stylesContent.includes('.admin-data-table-container')) {
  console.error('FAILED: .admin-data-table-container CSS rule not found in styles.css');
  process.exit(1);
}
if (!stylesContent.includes('.admin-sticky-table-header')) {
  console.error('FAILED: .admin-sticky-table-header CSS rule not found in styles.css');
  process.exit(1);
}
if (!stylesContent.includes('.data-table-sort-button')) {
  console.error('FAILED: .data-table-sort-button CSS rule not found in styles.css');
  process.exit(1);
}
if (!stylesContent.includes('.data-table-pagination-bar')) {
  console.error('FAILED: .data-table-pagination-bar CSS rule not found in styles.css');
  process.exit(1);
}
console.log('✓ CSS utilities for Data Table Ergonomics verified in styles.css');

// 3. Verify component in DataTableErgonomics.tsx
const componentPath = path.join(projectRoot, 'src', 'components', 'ui', 'DataTableErgonomics.tsx');
if (!fs.existsSync(componentPath)) {
  console.error('FAILED: src/components/ui/DataTableErgonomics.tsx does not exist');
  process.exit(1);
}
const componentContent = fs.readFileSync(componentPath, 'utf8');
if (!componentContent.includes('export function DataTableErgonomics')) {
  console.error('FAILED: DataTableErgonomics component export missing');
  process.exit(1);
}
if (!componentContent.includes('export function exportToCsv')) {
  console.error('FAILED: exportToCsv function export missing');
  process.exit(1);
}
console.log('✓ DataTableErgonomics component file verified');

// 4. Verify re-exports in primitives.ts and index.ts
const primitivesPath = path.join(projectRoot, 'src', 'components', 'ui', 'primitives.ts');
const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');
if (!primitivesContent.includes('DataTableErgonomics')) {
  console.error('FAILED: DataTableErgonomics not re-exported in primitives.ts');
  process.exit(1);
}

const indexPath = path.join(projectRoot, 'src', 'components', 'ui', 'index.ts');
const indexContent = fs.readFileSync(indexPath, 'utf8');
if (!indexContent.includes('./DataTableErgonomics')) {
  console.error('FAILED: DataTableErgonomics not re-exported in index.ts');
  process.exit(1);
}
console.log('✓ Component re-exports verified in primitives.ts & index.ts');

// 5. Verify admin.tsx route integration
const adminPath = path.join(projectRoot, 'src', 'routes', 'admin.tsx');
const adminContent = fs.readFileSync(adminPath, 'utf8');
if (!adminContent.includes('DataTableErgonomics')) {
  console.error('FAILED: DataTableErgonomics not integrated into admin.tsx');
  process.exit(1);
}
if (!adminContent.includes('waitlistColumns')) {
  console.error('FAILED: waitlistColumns not configured in admin.tsx');
  process.exit(1);
}
console.log('✓ Route integration verified in admin.tsx');

console.log('🎉 Task 178 Data Table Ergonomics verification PASSED successfully!');
