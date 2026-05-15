import { test, expect } from '@playwright/test';

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

test.describe('Program Name Validation - Positive Flows', () => {
  test('TC-001: Program name with special characters is accepted and created successfully', async ({ page }) => {
    const specialName = `Informatique & IA - Niveau 2 ${Date.now()}`;

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill(specialName);
    await dialog.getByLabel('Description').fill('French IT and AI program');
    await dialog.getByRole('button', { name: 'Create' }).click();

    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('cell').filter({ hasText: specialName })).toBeVisible();
  });

  test('TC-002: Program name with accented characters creates successfully', async ({ page }) => {
    const accentedName = `Développement Été ${Date.now()}`;

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill(accentedName);
    await dialog.getByRole('button', { name: 'Create' }).click();

    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('cell').filter({ hasText: accentedName })).toBeVisible();
  });

  test('TC-003: Program name with mixed Unicode, emoji, and symbols creates successfully', async ({ page }) => {
    const ts = Date.now();
    const unicodeName = `プログラム "2026" — Test & <Demo> ${ts}`;

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill(unicodeName);
    await dialog.getByRole('button', { name: 'Create' }).click();

    await expect(dialog).not.toBeVisible();

    const dialogCount = await page.locator('role=alertdialog').count();
    expect(dialogCount).toBe(0);

    await expect(page.getByRole('cell').filter({ hasText: `Demo> ${ts}` })).toBeVisible();
  });

  test('TC-004: Program name with leading/trailing spaces is trimmed before saving', async ({ page }) => {
    const baseName = `Web Analytics ${Date.now()}`;

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill(`   ${baseName}   `);
    await dialog.getByRole('button', { name: 'Create' }).click();

    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('cell').filter({ hasText: baseName })).toBeVisible();

    await page.getByRole('row').filter({ hasText: baseName }).getByRole('button', { name: '✏️' }).click();
    const editDialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(editDialog.getByLabel('Program Name')).toHaveValue(baseName);
  });

  test('TC-005: Unique program name is accepted without duplicate error', async ({ page }) => {
    const uniqueName = `Unique Program Test ${Date.now()}`;

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill(uniqueName);
    await dialog.getByRole('button', { name: 'Create' }).click();

    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('cell').filter({ hasText: uniqueName })).toBeVisible();
  });
});

test.describe('Program Name Validation - Negative Flows', () => {
  test('TC-006: Whitespace-only program name is rejected (form not submitted)', async ({ page }) => {
    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill('   ');

    await expect(dialog.getByRole('button', { name: 'Create' })).toBeDisabled();
  });

  test('TC-007: Single space in program name is rejected', async ({ page }) => {
    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill(' ');

    await expect(dialog.getByRole('button', { name: 'Create' })).toBeDisabled();
  });

  test('TC-008: Tab characters in program name are treated as whitespace and rejected', async ({ page }) => {
    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill('\t\t');

    await expect(dialog.getByRole('button', { name: 'Create' })).toBeDisabled();
  });

  test('TC-009: Duplicate program name on create shows an error', async ({ page }) => {
    test.fail(true, 'DS-3 duplicate prevention is not yet implemented — app currently allows duplicates');

    const duplicateName = `Duplicate Test ${Date.now()}`;

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('Program Name').fill(duplicateName);
    await dialog.getByRole('button', { name: 'Create' }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('cell').filter({ hasText: duplicateName })).toBeVisible();

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog2 = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog2).toBeVisible();
    await dialog2.getByLabel('Program Name').fill(duplicateName);
    await dialog2.getByRole('button', { name: 'Create' }).click();

    await expect(dialog2).toBeVisible();
    await expect(dialog2.getByText(/already exists/i)).toBeVisible();
  });

  test('TC-010: Duplicate name check is case-insensitive', async ({ page }) => {
    test.fail(true, 'DS-3 duplicate prevention is not yet implemented — app currently allows duplicates');

    const originalName = `Case Sensitive Test ${Date.now()}`;

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('Program Name').fill(originalName);
    await dialog.getByRole('button', { name: 'Create' }).click();
    await expect(dialog).not.toBeVisible();

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog2 = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog2).toBeVisible();
    await dialog2.getByLabel('Program Name').fill(originalName.toLowerCase());
    await dialog2.getByRole('button', { name: 'Create' }).click();

    await expect(dialog2).toBeVisible();
    await expect(dialog2.getByText(/already exists/i)).toBeVisible();
  });

  test('TC-011: Duplicate name with extra spaces is still rejected', async ({ page }) => {
    test.fail(true, 'DS-3 duplicate prevention is not yet implemented — app currently allows duplicates');

    const baseName = `Spaces Dup Test ${Date.now()}`;

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('Program Name').fill(baseName);
    await dialog.getByRole('button', { name: 'Create' }).click();
    await expect(dialog).not.toBeVisible();

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog2 = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog2).toBeVisible();
    await dialog2.getByLabel('Program Name').fill(`  ${baseName}  `);
    await dialog2.getByRole('button', { name: 'Create' }).click();

    await expect(dialog2).toBeVisible();
    await expect(dialog2.getByText(/already exists/i)).toBeVisible();
  });

  test('TC-012: Duplicate program name on edit (rename) shows an error', async ({ page }) => {
    test.fail(true, 'DS-3 duplicate prevention is not yet implemented — app currently allows duplicates');

    const programA = `Edit Dup A ${Date.now()}`;
    const programB = `Edit Dup B ${Date.now()}`;

    await page.getByRole('button', { name: '+ New Program' }).click();
    let dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('Program Name').fill(programA);
    await dialog.getByRole('button', { name: 'Create' }).click();
    await expect(dialog).not.toBeVisible();

    await page.getByRole('button', { name: '+ New Program' }).click();
    dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('Program Name').fill(programB);
    await dialog.getByRole('button', { name: 'Create' }).click();
    await expect(dialog).not.toBeVisible();

    const rowB = page.getByRole('row').filter({ hasText: programB });
    await rowB.getByRole('button', { name: '✏️' }).click();

    const editDialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(editDialog).toBeVisible();
    await editDialog.getByLabel('Program Name').fill(programA);
    await editDialog.getByRole('button', { name: 'Save' }).click();

    await expect(editDialog).toBeVisible();
    await expect(editDialog.getByText(/already exists/i)).toBeVisible();
  });

  test('TC-013: Whitespace-only name is rejected in the edit form', async ({ page }) => {
    const programName = `Edit WS Test ${Date.now()}`;

    await page.getByRole('button', { name: '+ New Program' }).click();
    const createDialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(createDialog).toBeVisible();
    await createDialog.getByLabel('Program Name').fill(programName);
    await createDialog.getByRole('button', { name: 'Create' }).click();
    await expect(createDialog).not.toBeVisible();

    const row = page.getByRole('row').filter({ hasText: programName });
    await row.getByRole('button', { name: '✏️' }).click();

    const editDialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(editDialog).toBeVisible();
    await editDialog.getByLabel('Program Name').fill('   ');

    await expect(editDialog.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  test('TC-014: HTML/script injection in program name does not execute', async ({ page }) => {
    const xssName = `<script>alert("XSS")</script> ${Date.now()}`;

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill(xssName);
    await dialog.getByRole('button', { name: 'Create' }).click();

    await expect(dialog).not.toBeVisible();

    const dialogCount = await page.locator('role=alertdialog').count();
    expect(dialogCount).toBe(0);

    await expect(page.getByRole('cell').filter({ hasText: xssName })).toBeVisible();
  });

  test('TC-015: SQL injection attempt in program name is safely handled', async ({ page }) => {
    const sqlPayload = `'; DROP TABLE programs; -- ${Date.now()}`;

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill(sqlPayload);
    await dialog.getByRole('button', { name: 'Create' }).click();

    await expect(dialog).not.toBeVisible();

    await expect(page.getByRole('cell').filter({ hasText: sqlPayload })).toBeVisible();
    await expect(page.getByRole('button', { name: '+ New Program' })).toBeVisible();
  });
});

test.describe('Program Name Validation - Edge Cases', () => {
  test('TC-016: Program name at maximum allowed length is accepted', async ({ page }) => {
    const ts = Date.now().toString();
    const maxName = ts + 'A'.repeat(245 - ts.length) + '...MAX_END';

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill(maxName);
    await dialog.getByRole('button', { name: 'Create' }).click();

    await expect(dialog).not.toBeVisible();

    await page.getByRole('row').filter({ hasText: `${ts}A` }).getByRole('button', { name: '✏️' }).first().click();
    const editDialog = page.getByRole('dialog', { name: 'Edit Program' });
    await expect(editDialog.getByLabel('Program Name')).toHaveValue(maxName);
  });

  test('TC-018: Single-character program name is accepted', async ({ page }) => {
    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill('Q');
    await dialog.getByRole('button', { name: 'Create' }).click();

    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'Q', exact: true })).toBeVisible();
  });

  test('TC-019: Program name with only numbers is accepted', async ({ page }) => {
    const numericName = `${Date.now()}`;

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Program Name').fill(numericName);
    await dialog.getByRole('button', { name: 'Create' }).click();

    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('cell').filter({ hasText: numericName })).toBeVisible();
  });

  test('TC-022: Duplicate error message clears when the name is changed to a unique value', async ({ page }) => {
    test.fail(true, 'DS-3 duplicate prevention is not yet implemented — app currently allows duplicates');

    const existingName = `Error Clear Test ${Date.now()}`;
    const fixedName = `${existingName} - v2`;

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('Program Name').fill(existingName);
    await dialog.getByRole('button', { name: 'Create' }).click();
    await expect(dialog).not.toBeVisible();

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog2 = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog2).toBeVisible();
    await dialog2.getByLabel('Program Name').fill(existingName);
    await dialog2.getByRole('button', { name: 'Create' }).click();
    await expect(dialog2).toBeVisible();
    await expect(dialog2.getByText(/already exists/i)).toBeVisible();

    await dialog2.getByLabel('Program Name').fill(fixedName);
    await dialog2.getByRole('button', { name: 'Create' }).click();

    await expect(dialog2).not.toBeVisible();
    await expect(page.getByRole('cell').filter({ hasText: fixedName })).toBeVisible();
  });

  test('TC-023: Very similar but distinct program names are allowed', async ({ page }) => {
    const baseName = `Similar Name Test ${Date.now()}`;

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('Program Name').fill(baseName);
    await dialog.getByRole('button', { name: 'Create' }).click();
    await expect(dialog).not.toBeVisible();

    await page.getByRole('button', { name: '+ New Program' }).click();
    const dialog2 = page.getByRole('dialog', { name: 'New Program' });
    await expect(dialog2).toBeVisible();
    await dialog2.getByLabel('Program Name').fill(`${baseName}!`);
    await dialog2.getByRole('button', { name: 'Create' }).click();

    await expect(dialog2).not.toBeVisible();
    await expect(page.getByRole('cell').filter({ hasText: `${baseName}!` })).toBeVisible();
  });
});
