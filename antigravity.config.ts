/**
 * Antigravity Configuration & GSD Bridge Integration
 * StashSaarthi Autonomous System
 */
import { defineConfig, antigravityGsd } from './lib/plugins/antigravity-gsd';

export default defineConfig({
  appName: 'StashSaarthi',
  env: process.env.NODE_ENV,
  plugins: [
    antigravityGsd({
      configFile: './gsd.config.json',
      enableAlerts: true,
      activeWorkflows: ['storage-matching', 'analytics-worker'],
    }),
  ],
});
