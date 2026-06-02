import { expect, type Locator, type Page } from '@playwright/test';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function programRow(page: Page, programName: string): Locator {
  return page.getByRole('row', { name: new RegExp(`^${escapeRegExp(programName)}(?:\\s|$)`) });
}

/** When only a unique fragment of the program name is known (e.g. suffix). */
export function programRowContaining(page: Page, fragment: string): Locator {
  return page.getByRole('row').filter({ hasText: fragment });
}

/** Accessible name is "Edit {programName}" (replaces legacy ✏️ icon button). */
export function editProgramButton(row: Locator, programName: string): Locator {
  return row.getByRole('button', { name: `Edit ${programName}` });
}

export async function expectProgramInList(page: Page, programName: string): Promise<void> {
  await expect(programRow(page, programName).first()).toBeVisible();
}
