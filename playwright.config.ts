import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

// Load .env.test supaya semua E2E env vars (credentials, base URL, dll)
// tersedia saat Playwright dijalankan, tanpa perlu export manual di CLI.
config({ path: '.env.test' });

/**
 * Playwright Configuration for Arthaloka Portal Prestasi Mahasiswa
 * UAT Strategy: Comprehensive E2E testing for all user roles
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // Run sequentially to avoid race conditions on shared DB
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker for sequential execution (shared database state)
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    // Default timeout per action
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Start dev server if not running
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
