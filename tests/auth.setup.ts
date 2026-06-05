import fs from 'fs';
import path from 'path';
import { test as setup, expect } from '@playwright/test';

export const AUTH_FILE = 'playwright/.auth/user.json';

const baseUrl = process.env.DIDAXIS_URL;

setup('authenticate', async ({ page }) => {
  await page.goto(`${baseUrl}/login`);
  await page.getByLabel('Email').fill(process.env.DIDAXIS_EMAIL!);
  await page.getByLabel('Password').fill(process.env.DIDAXIS_PASSWORD!);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  fs.mkdirSync(path.dirname(path.resolve(AUTH_FILE)), { recursive: true });
  await page.context().storageState({ path: AUTH_FILE });
});
