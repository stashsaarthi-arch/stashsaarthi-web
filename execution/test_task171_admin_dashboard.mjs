import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ ${message}`);
  }
}

console.log('🔍 Running Task 171 Admin Dashboard Modernization Verification...');

// 1. Verify designTokens.ts contains ADMIN_DASHBOARD_TOKENS & getAdminDashboardTokens
const designTokensPath = path.join(rootDir, 'src/lib/designTokens.ts');
const designTokensContent = fs.readFileSync(designTokensPath, 'utf8');
assert(designTokensContent.includes('ADMIN_DASHBOARD_TOKENS'), 'designTokens.ts contains ADMIN_DASHBOARD_TOKENS');
assert(designTokensContent.includes('getAdminDashboardTokens'), 'designTokens.ts exports getAdminDashboardTokens helper');
assert(designTokensContent.includes('consoleTitle'), 'designTokens.ts specifies consoleTitle');
assert(designTokensContent.includes('statusBadges'), 'designTokens.ts specifies statusBadges');

// 2. Verify styles.css contains Admin Dashboard utility rules
const stylesPath = path.join(rootDir, 'src/styles.css');
const stylesContent = fs.readFileSync(stylesPath, 'utf8');
assert(stylesContent.includes('.admin-dashboard-container'), 'styles.css contains .admin-dashboard-container');
assert(stylesContent.includes('.admin-metric-card-modern'), 'styles.css contains .admin-metric-card-modern');
assert(stylesContent.includes('.admin-status-badge-pulse'), 'styles.css contains .admin-status-badge-pulse');
assert(stylesContent.includes('.admin-node-meter-bar'), 'styles.css contains .admin-node-meter-bar');
assert(stylesContent.includes('.admin-node-meter-fill'), 'styles.css contains .admin-node-meter-fill');

// 3. Verify AdminStatusBadge.tsx primitive component exists and is re-exported
const adminBadgePath = path.join(rootDir, 'src/components/ui/AdminStatusBadge.tsx');
assert(fs.existsSync(adminBadgePath), 'src/components/ui/AdminStatusBadge.tsx exists');
const adminBadgeContent = fs.readFileSync(adminBadgePath, 'utf8');
assert(adminBadgeContent.includes('export const AdminStatusBadge'), 'AdminStatusBadge component exported');

const primitivesPath = path.join(rootDir, 'src/components/ui/primitives.ts');
const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');
assert(primitivesContent.includes('AdminStatusBadge'), 'primitives.ts re-exports AdminStatusBadge');

// 4. Verify admin.tsx route incorporates modernized features
const adminRoutePath = path.join(rootDir, 'src/routes/admin.tsx');
const adminRouteContent = fs.readFileSync(adminRoutePath, 'utf8');
assert(adminRouteContent.includes('AdminStatusBadge'), 'admin.tsx imports AdminStatusBadge');
assert(adminRouteContent.includes('ADMIN_DASHBOARD_TOKENS'), 'admin.tsx imports ADMIN_DASHBOARD_TOKENS');
assert(adminRouteContent.includes('admin-metric-card-modern'), 'admin.tsx uses admin-metric-card-modern');
assert(adminRouteContent.includes('NodeCapacityGauges'), 'admin.tsx renders NodeCapacityGauges');
assert(adminRouteContent.includes('Live Storage Node Utilization Gauges'), 'admin.tsx displays storage node utilization gauges header');

console.log('\n🎉 ALL TASK 171 ADMIN DASHBOARD MODERNIZATION VERIFICATIONS PASSED 100%!');
