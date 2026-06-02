import { expect, type Locator, type Page } from '@playwright/test';
import { extractProgramId, waitForProgramCreate } from './delete-program';

export async function submitProgramCreate(
  page: Page,
  dialog: Locator,
  trackProgram: (uuid: string) => void,
): Promise<void> {
  const createResponse = waitForProgramCreate(page);
  await dialog.getByRole('button', { name: 'Create' }).click();
  trackProgram(extractProgramId(await (await createResponse).json()));
  await expect(dialog).not.toBeVisible();
}

export async function createProgramInDialog(
  page: Page,
  trackProgram: (uuid: string) => void,
  programName: string,
  description?: string,
): Promise<void> {
  await page.getByRole('button', { name: '+ New Program' }).click();
  const dialog = page.getByRole('dialog', { name: 'New Program' });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('Program Name').fill(programName);
  if (description !== undefined) {
    await dialog.getByLabel('Description').fill(description);
  }
  await submitProgramCreate(page, dialog, trackProgram);
}
