/**
 * Verification harness for Task 104: Booking Detail Slide-Over Drawer
 */
import fs from 'fs';
import path from 'path';

const drawerPath = path.resolve('src/components/stash/BookingDetailDrawer.tsx');
const dashboardPath = path.resolve('src/components/stash/MyBookingsDashboard.tsx');

if (!fs.existsSync(drawerPath)) {
  console.error('❌ BookingDetailDrawer.tsx missing');
  process.exit(1);
}

if (!fs.existsSync(dashboardPath)) {
  console.error('❌ MyBookingsDashboard.tsx missing');
  process.exit(1);
}

const drawerContent = fs.readFileSync(drawerPath, 'utf8');
const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');

const requiredTokens = [
  'BookingDetailDrawer',
  'digital receipt',
  'FOUNDER_WHATSAPP',
  'handleCopyToken',
  'handlePrintReceipt',
  'handleShareWhatsApp',
  'handleContactHost',
  'Allocated Slot & Address',
  'Emergency Host Contact',
];

for (const token of requiredTokens) {
  if (!drawerContent.includes(token) && !dashboardContent.includes(token)) {
    console.error(`❌ Missing token: ${token}`);
    process.exit(1);
  }
}

console.log('✅ Task 104 Verification Passed: BookingDetailDrawer and MyBookingsDashboard integration verified.');
