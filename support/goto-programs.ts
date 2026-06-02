import { expect, type Page } from '@playwright/test';

/** Opens Programs using the stored auth session from auth.setup.ts. */
export async function gotoPrograms(page: Page): Promise<void> {
  if (process.env.BENCHMARK_UI_LOGIN === '1') {
    await page.goto('/login');
    await page.getByLabel('Email').fill(process.env.DIDAXIS_EMAIL!);
    await page.getByLabel('Password').fill(process.env.DIDAXIS_PASSWORD!);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await page.getByRole('button', { name: 'Programs' }).click();
  } else {
    await page.goto('/programs');
  }
  await expect(page.getByRole('button', { name: '+ New Program' })).toBeVisible();
}
