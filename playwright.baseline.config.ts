import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/** Timing baseline: per-test UI login (no stored session). */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  reporter: 'line',
  use: {
    trace: 'on-first-retry',
    baseURL: process.env.DIDAXIS_URL ?? 'https://test.didaxis.studio',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /ds[123]-.*\.spec\.ts/,
    },
  ],
});
