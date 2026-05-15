import { test, expect } from '@playwright/test';

const BASE_URL = 'https://test.didaxis.studio';

let testProgramName: string;

test.beforeEach(async ({ page }) => {
  testProgramName = `Edit Test Program ${Date.now()}`;

  await page.goto(`${BASE_URL}/login`);
  await page.getByLabel('Email').fill(process.env.DIDAXIS_EMAIL!);
  await page.getByLabel('Password').fill(process.env.DIDAXIS_PASSWORD!);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await page.getByRole('button', { name: 'Programs' }).click();
  await expect(page.getByRole('button', { name: '+ New Program' })).toBeVisible();

  await page.getByRole('button', { name: '+ New Program' }).click();
  const createDialog = page.getByRole('dialog', { name: 'New Program' });
  await expect(createDialog).toBeVisible();
  await createDialog.getByLabel('Program Name').fill(testProgramName);
  await createDialog.getByLabel('Description').fill('Original description for edit test');
  await createDialog.getByRole('button', { name: 'Create' }).click();
  await expect(createDialog).not.toBeVisible();
  await expect(page.getByRole('cell').filter({ hasText: testProgramName })).toBeVisible();
});

test.describe('Edit Program - Positive Flows', () => {
  test('TC-001: Edit form opens pre-populated with current program data', async ({ page }) => {
    const row = page.getByRole('row').filter({ hasText: testProgramName });
    await row.getByRole('button', { name: '✏️' }).click();

    const dialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(dialog).toBeVisible();

    const programName = dialog.getByLabel('Program Name');
    const description = dialog.getByLabel('Description');
    const saveButton = dialog.getByRole('button', { name: 'Save' });

    await expect(programName).toHaveValue(testProgramName);
    await expect(description).toHaveValue('Original description for edit test');
    await expect(saveButton).toBeVisible();
  });

  test('TC-002: Successfully editing a program name closes modal and updates the list', async ({ page }) => {
    const updatedName = `${testProgramName} - Updated`;

    const row = page.getByRole('row').filter({ hasText: testProgramName });
    await row.getByRole('button', { name: '✏️' }).click();

    const dialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill(updatedName);
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('cell').filter({ hasText: updatedName })).toBeVisible();
  });

  test('TC-003: Editing only the Description preserves the Name and other fields', async ({ page }) => {
    const row = page.getByRole('row').filter({ hasText: testProgramName });
    await row.getByRole('button', { name: '✏️' }).click();

    const dialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Description').fill('Updated description for testing');
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('cell').filter({ hasText: testProgramName })).toBeVisible();

    await page.getByRole('row').filter({ hasText: testProgramName }).getByRole('button', { name: '✏️' }).click();
    const reopenedDialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(reopenedDialog.getByLabel('Program Name')).toHaveValue(testProgramName);
    await expect(reopenedDialog.getByLabel('Description')).toHaveValue('Updated description for testing');
  });

  test('TC-004: Editing only the Name preserves the Description', async ({ page }) => {
    const renamedName = `${testProgramName} - Renamed`;

    const row = page.getByRole('row').filter({ hasText: testProgramName });
    await row.getByRole('button', { name: '✏️' }).click();

    const dialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill(renamedName);
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(dialog).not.toBeVisible();

    await page.getByRole('row').filter({ hasText: renamedName }).getByRole('button', { name: '✏️' }).click();
    const reopenedDialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(reopenedDialog.getByLabel('Program Name')).toHaveValue(renamedName);
    await expect(reopenedDialog.getByLabel('Description')).toHaveValue('Original description for edit test');
  });

  test('TC-005: Edited program data persists after page refresh', async ({ page }) => {
    const updatedName = `${testProgramName} - Persisted`;

    const row = page.getByRole('row').filter({ hasText: testProgramName });
    await row.getByRole('button', { name: '✏️' }).click();

    const dialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill(updatedName);
    await dialog.getByRole('button', { name: 'Save' }).click();
    await expect(dialog).not.toBeVisible();

    await page.reload();
    await page.getByRole('button', { name: 'Programs' }).click();
    await expect(page.getByRole('cell').filter({ hasText: updatedName })).toBeVisible();
  });

  test('TC-006: Save button is enabled when form opens with valid pre-populated data', async ({ page }) => {
    const row = page.getByRole('row').filter({ hasText: testProgramName });
    await row.getByRole('button', { name: '✏️' }).click();

    const dialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(dialog).toBeVisible();

    await expect(dialog.getByRole('button', { name: 'Save' })).toBeEnabled();
  });

  test('TC-007: Clearing and re-entering the Program Name allows save', async ({ page }) => {
    const newName = `Cybersecurity Fundamentals ${Date.now()}`;

    const row = page.getByRole('row').filter({ hasText: testProgramName });
    await row.getByRole('button', { name: '✏️' }).click();

    const dialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill('');
    await dialog.getByLabel('Program Name').fill(newName);
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('cell').filter({ hasText: newName })).toBeVisible();
    await expect(page.getByRole('cell').filter({ hasText: testProgramName })).not.toBeVisible();
  });
});

test.describe('Edit Program - Negative Flows', () => {
  test('TC-009: Saving with an empty Program Name is prevented', async ({ page }) => {
    const row = page.getByRole('row').filter({ hasText: testProgramName });
    await row.getByRole('button', { name: '✏️' }).click();

    const dialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill('');

    await expect(dialog.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  test('TC-012: HTML/script injection in edited fields does not execute', async ({ page }) => {
    const row = page.getByRole('row').filter({ hasText: testProgramName });
    await row.getByRole('button', { name: '✏️' }).click();

    const dialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill('<script>alert("XSS")</script>');
    await dialog.getByLabel('Description').fill('<img onerror=alert(1) src=x>');
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(dialog).not.toBeVisible();

    const dialogCount = await page.locator('role=alertdialog').count();
    expect(dialogCount).toBe(0);

    await expect(page.getByRole('cell').filter({ hasText: '<script>alert("XSS")</script>' })).toBeVisible();
  });

  test('TC-013: Closing the edit modal without saving discards changes', async ({ page }) => {
    const row = page.getByRole('row').filter({ hasText: testProgramName });
    await row.getByRole('button', { name: '✏️' }).click();

    const dialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill('Discarded Edit');
    await dialog.getByRole('button', { name: 'Cancel' }).click();

    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('cell').filter({ hasText: testProgramName })).toBeVisible();
    await expect(page.getByRole('cell').filter({ hasText: 'Discarded Edit' })).not.toBeVisible();
  });

  test('TC-014: Rapid double-click on Save does not produce duplicate updates or errors', async ({ page }) => {
    const doubleClickName = `Double Click Edit ${Date.now()}`;

    const row = page.getByRole('row').filter({ hasText: testProgramName });
    await row.getByRole('button', { name: '✏️' }).click();

    const dialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill(doubleClickName);

    const saveButton = dialog.getByRole('button', { name: 'Save' });
    await saveButton.dblclick();

    await expect(dialog).not.toBeVisible();

    const matchingCells = page.getByRole('cell').filter({ hasText: doubleClickName });
    await expect(matchingCells).toHaveCount(1);
  });
});

test.describe('Edit Program - Edge Cases', () => {
  test('TC-016: Edited Program Name at maximum allowed length saves and displays correctly', async ({ page }) => {
    const maxName = 'A'.repeat(245) + '...MAX_END';

    const row = page.getByRole('row').filter({ hasText: testProgramName });
    await row.getByRole('button', { name: '✏️' }).click();

    const dialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill(maxName);
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(dialog).not.toBeVisible();

    await page.getByRole('row').filter({ hasText: 'MAX_END' }).getByRole('button', { name: '✏️' }).click();
    const reopenedDialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(reopenedDialog.getByLabel('Program Name')).toHaveValue(maxName);
  });

  test('TC-018: Whitespace-only Program Name does not save', async ({ page }) => {
    const row = page.getByRole('row').filter({ hasText: testProgramName });
    await row.getByRole('button', { name: '✏️' }).click();

    const dialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill('   ');

    await expect(dialog.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  test('TC-020: Special characters and Unicode in edited fields persist correctly', async ({ page }) => {
    const unicodeName = `Développement Web — "Été" ${Date.now()}`;
    const unicodeDesc = 'Symbols: &<>"/\'; Accents: àéîõü';

    const row = page.getByRole('row').filter({ hasText: testProgramName });
    await row.getByRole('button', { name: '✏️' }).click();

    const dialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill(unicodeName);
    await dialog.getByLabel('Description').fill(unicodeDesc);
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(dialog).not.toBeVisible();

    await page.getByRole('row').filter({ hasText: 'Développement' }).getByRole('button', { name: '✏️' }).click();
    const reopenedDialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(reopenedDialog.getByLabel('Program Name')).toHaveValue(unicodeName);
    await expect(reopenedDialog.getByLabel('Description')).toHaveValue(unicodeDesc);
  });

  test('TC-022: Save button disables if Program Name is cleared during editing', async ({ page }) => {
    const row = page.getByRole('row').filter({ hasText: testProgramName });
    await row.getByRole('button', { name: '✏️' }).click();

    const dialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(dialog).toBeVisible();

    await expect(dialog.getByRole('button', { name: 'Save' })).toBeEnabled();

    await dialog.getByLabel('Program Name').fill('');

    await expect(dialog.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  test('TC-023: Save button re-enables after entering a valid name following a cleared field', async ({ page }) => {
    const row = page.getByRole('row').filter({ hasText: testProgramName });
    await row.getByRole('button', { name: '✏️' }).click();

    const dialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill('');
    await expect(dialog.getByRole('button', { name: 'Save' })).toBeDisabled();

    await dialog.getByLabel('Program Name').fill('Restored Program Name');
    await expect(dialog.getByRole('button', { name: 'Save' })).toBeEnabled();
  });

  test('TC-024: Edit form is accessible via keyboard navigation', async ({ page }) => {
    const row = page.getByRole('row').filter({ hasText: testProgramName });
    const editButton = row.getByRole('button', { name: '✏️' });
    await editButton.focus();
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(dialog).toBeVisible();

    const programNameField = dialog.getByLabel('Program Name');
    await programNameField.focus();
    await expect(programNameField).toBeFocused();

    await page.keyboard.press('Tab');
    const descriptionField = dialog.getByLabel('Description');
    await expect(descriptionField).toBeFocused();
  });
});
