import { defineConfig } from '@playwright/test';

const live = !!process.env.BASE_URL;
export default defineConfig({
  testDir: 'e2e',
  timeout: 30000,
  use: { baseURL: process.env.BASE_URL || 'http://localhost:4319', headless: true },
  webServer: live ? undefined : { command: 'npm run build && npm run preview', port: 4319, reuseExistingServer: false, timeout: 120000 },
});
