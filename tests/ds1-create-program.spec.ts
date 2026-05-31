import { test, expect } from '../fixtures/cleanup.fixture';
import { extractProgramId, waitForProgramCreate } from '../support/delete-program';

const BASE_URL = 'https://test.didaxis.studio';

test.beforeEach(async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.getByLabel('Email').fill(process.env.DIDAXIS_EMAIL!);
  await page.getByLabel('Password').fill(process.env.DIDAXIS_PASSWORD!);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await page.getByRole('button', { name: 'Programs' }).click();
  await expect(page.getByRole('button', { name: '+ New Program' })).toBeVisible();
});

test.describe('Create Program', () => {
  test('TC-001: Program creation form displays with correct fields after clicking "+ New Program"', async ({ page }) => {
    await page.getByRole('button', { name: '+ New Program' }).click();

    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();

    const programName = dialog.getByLabel('Program Name');
    const description = dialog.getByLabel('Description');
    const createButton = dialog.getByRole('button', { name: 'Create' });

    await expect(programName).toBeVisible();
    await expect(description).toBeVisible();
    await expect(createButton).toBeVisible();

    await expect(programName).toBeEmpty();
    await expect(description).toBeEmpty();
    await expect(createButton).toBeDisabled();
  });

  test('TC-002: Successfully creating a program closes the modal and shows the new program in the list', async ({
    page,
    trackProgram,
  }) => {
    const uniqueName = `Web Development 2026 ${Date.now()}`;

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill(uniqueName);
    await dialog.getByLabel('Description').fill('Full-stack web development program');

    const createResponse = waitForProgramCreate(page);
    await dialog.getByRole('button', { name: 'Create' }).click();
    const response = await createResponse;
    trackProgram(extractProgramId(await response.json()));

    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('cell', { name: uniqueName })).toBeVisible();
  });
});
