import fs from 'fs';
import path from 'path';

console.log("=== Task 176 Verification: Live Booking Feed & Activity Stream ===");

const errors = [];

// 1. Check designTokens.ts
const designTokensPath = path.resolve('src/lib/designTokens.ts');
const designTokensContent = fs.readFileSync(designTokensPath, 'utf8');
if (!designTokensContent.includes('LIVE_ACTIVITY_FEED_TOKENS')) {
  errors.push('designTokens.ts missing LIVE_ACTIVITY_FEED_TOKENS');
}
if (!designTokensContent.includes('getLiveActivityFeedTokens')) {
  errors.push('designTokens.ts missing getLiveActivityFeedTokens');
}
if (!designTokensContent.includes('Live Operator Stream & Dispatch Radar')) {
  errors.push('designTokens.ts missing Live Operator Stream header definition');
}

// 2. Check styles.css
const stylesPath = path.resolve('src/styles.css');
const stylesContent = fs.readFileSync(stylesPath, 'utf8');
if (!stylesContent.includes('live-activity-feed-container')) {
  errors.push('styles.css missing .live-activity-feed-container class');
}
if (!stylesContent.includes('activity-feed-item-card')) {
  errors.push('styles.css missing .activity-feed-item-card class');
}
if (!stylesContent.includes('activity-beacon-pulse')) {
  errors.push('styles.css missing activity-beacon-pulse keyframes');
}

// 3. Check LiveActivityFeed.tsx
const componentPath = path.resolve('src/components/ui/LiveActivityFeed.tsx');
if (!fs.existsSync(componentPath)) {
  errors.push('LiveActivityFeed.tsx file does not exist');
} else {
  const compContent = fs.readFileSync(componentPath, 'utf8');
  if (!compContent.includes('export const LiveActivityFeed')) {
    errors.push('LiveActivityFeed.tsx does not export LiveActivityFeed');
  }
  if (!compContent.includes('statusBadgeEn') && !compContent.includes('tokens.header')) {
    errors.push('LiveActivityFeed.tsx missing telemetry header tokens');
  }
}

// 4. Check primitives.ts & index.ts
const primitivesPath = path.resolve('src/components/ui/primitives.ts');
const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');
if (!primitivesContent.includes('LiveActivityFeed')) {
  errors.push('primitives.ts missing LiveActivityFeed re-export');
}

const indexPath = path.resolve('src/components/ui/index.ts');
const indexContent = fs.readFileSync(indexPath, 'utf8');
if (!indexContent.includes('LiveActivityFeed')) {
  errors.push('index.ts missing LiveActivityFeed export');
}

// 5. Check admin.tsx integration
const adminPath = path.resolve('src/routes/admin.tsx');
const adminContent = fs.readFileSync(adminPath, 'utf8');
if (!adminContent.includes('<LiveActivityFeed />') && !adminContent.includes('<LiveActivityFeed')) {
  errors.push('admin.tsx missing LiveActivityFeed component integration');
}

if (errors.length > 0) {
  console.error("❌ VERIFICATION FAILED with errors:");
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log("✅ ALL TASK 176 VERIFICATION CHECKS PASSED 100%");
  process.exit(0);
}
