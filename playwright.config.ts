import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/** Saved by tests/auth.setup.ts — loaded by browser projects below. */
const AUTH_STORAGE = 'playwright/.auth/user.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    baseURL: process.env.DIDAXIS_URL || 'https://test.didaxis.studio',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_STORAGE,
      },
      dependencies: ['setup'],
    },
  ],
});
