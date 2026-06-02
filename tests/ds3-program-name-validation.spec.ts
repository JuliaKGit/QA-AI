import { test, expect } from '../fixtures/cleanup.fixture';
import { ProgramsPage } from '../pages';

let programsPage: ProgramsPage;

test.beforeEach(async ({ page }) => {
  programsPage = new ProgramsPage(page);
  await programsPage.goto();
  await expect(programsPage.newProgramButton).toBeVisible();
});

test.describe('Program Name Validation - Positive Flows', () => {
  test('TC-001: Program name with special characters is accepted and created successfully', async ({
    trackProgram,
  }) => {
    const specialName = `Informatique & IA - Niveau 2 ${Date.now()}`;
    await programsPage.createProgram(specialName, 'French IT and AI program', trackProgram);
    await expect(programsPage.programRow(specialName).first()).toBeVisible();
  });

  test('TC-002: Program name with accented characters creates successfully', async ({ trackProgram }) => {
    const accentedName = `Développement Été ${Date.now()}`;
    await programsPage.createProgram(accentedName, undefined, trackProgram);
    await expect(programsPage.programRow(accentedName).first()).toBeVisible();
  });

  test('TC-003: Program name with mixed Unicode, emoji, and symbols creates successfully', async ({
    page,
    trackProgram,
  }) => {
    const ts = Date.now();
    const unicodeName = `プログラム "2026" — Test & <Demo> ${ts}`;
    await programsPage.createProgram(unicodeName, undefined, trackProgram);

    const dialogCount = await page.locator('role=alertdialog').count();
    expect(dialogCount).toBe(0);

    await expect(programsPage.programRow(unicodeName).first()).toBeVisible();
  });

  test('TC-004: Program name with leading/trailing spaces is trimmed before saving', async ({
    trackProgram,
  }) => {
    const baseName = `Web Analytics ${Date.now()}`;

    await programsPage.openNewProgram();
    await programsPage.newProgramModal.fillProgramName(`   ${baseName}   `);
    await programsPage.newProgramModal.submitCreate(trackProgram);

    await expect(programsPage.programRow(baseName).first()).toBeVisible();

    await programsPage.openEditFor(baseName);
    await expect(programsPage.editProgramModal.programNameInput).toHaveValue(baseName);
  });

  test('TC-005: Unique program name is accepted without duplicate error', async ({ trackProgram }) => {
    const uniqueName = `Unique Program Test ${Date.now()}`;
    await programsPage.createProgram(uniqueName, undefined, trackProgram);
    await expect(programsPage.programRow(uniqueName).first()).toBeVisible();
  });
});

test.describe('Program Name Validation - Negative Flows', () => {
  test('TC-006: Whitespace-only program name is rejected (form not submitted)', async () => {
    await programsPage.openNewProgram();
    await programsPage.newProgramModal.fillProgramName('   ');
    await expect(programsPage.newProgramModal.createButton).toBeDisabled();
  });

  test('TC-007: Single space in program name is rejected', async () => {
    await programsPage.openNewProgram();
    await programsPage.newProgramModal.fillProgramName(' ');
    await expect(programsPage.newProgramModal.createButton).toBeDisabled();
  });

  test('TC-008: Tab characters in program name are treated as whitespace and rejected', async () => {
    await programsPage.openNewProgram();
    await programsPage.newProgramModal.fillProgramName('\t\t');
    await expect(programsPage.newProgramModal.createButton).toBeDisabled();
  });

  test('TC-009: Duplicate program name on create shows an error', async ({ trackProgram }) => {
    test.fail(true, 'DS-3 duplicate prevention is not yet implemented — app currently allows duplicates');

    const duplicateName = `Duplicate Test ${Date.now()}`;
    await programsPage.createProgram(duplicateName, undefined, trackProgram);
    await expect(programsPage.programRow(duplicateName).first()).toBeVisible();

    await programsPage.openNewProgram();
    await programsPage.newProgramModal.fillProgramName(duplicateName);
    await programsPage.newProgramModal.attemptSubmitCreate(trackProgram);

    await expect(programsPage.newProgramModal.dialog).toBeVisible();
    await expect(programsPage.newProgramModal.duplicateError).toBeVisible();
  });

  test('TC-010: Duplicate name check is case-insensitive', async ({ trackProgram }) => {
    test.fail(true, 'DS-3 duplicate prevention is not yet implemented — app currently allows duplicates');

    const originalName = `Case Sensitive Test ${Date.now()}`;
    await programsPage.createProgram(originalName, undefined, trackProgram);

    await programsPage.openNewProgram();
    await programsPage.newProgramModal.fillProgramName(originalName.toLowerCase());
    await programsPage.newProgramModal.attemptSubmitCreate(trackProgram);

    await expect(programsPage.newProgramModal.dialog).toBeVisible();
    await expect(programsPage.newProgramModal.duplicateError).toBeVisible();
  });

  test('TC-011: Duplicate name with extra spaces is still rejected', async ({ trackProgram }) => {
    test.fail(true, 'DS-3 duplicate prevention is not yet implemented — app currently allows duplicates');

    const baseName = `Spaces Dup Test ${Date.now()}`;
    await programsPage.createProgram(baseName, undefined, trackProgram);

    await programsPage.openNewProgram();
    await programsPage.newProgramModal.fillProgramName(`  ${baseName}  `);
    await programsPage.newProgramModal.attemptSubmitCreate(trackProgram);

    await expect(programsPage.newProgramModal.dialog).toBeVisible();
    await expect(programsPage.newProgramModal.duplicateError).toBeVisible();
  });

  test('TC-012: Duplicate program name on edit (rename) shows an error', async ({ trackProgram }) => {
    test.fail(true, 'DS-3 duplicate prevention is not yet implemented — app currently allows duplicates');

    const programA = `Edit Dup A ${Date.now()}`;
    const programB = `Edit Dup B ${Date.now()}`;

    await programsPage.createProgram(programA, undefined, trackProgram);
    await programsPage.createProgram(programB, undefined, trackProgram);

    await programsPage.openEditFor(programB);
    await programsPage.editProgramModal.fillProgramName(programA);
    await programsPage.editProgramModal.attemptSubmitSave();

    await expect(programsPage.editProgramModal.dialog).toBeVisible();
    await expect(programsPage.editProgramModal.duplicateError).toBeVisible();
  });

  test('TC-013: Whitespace-only name is rejected in the edit form', async ({ trackProgram }) => {
    const programName = `Edit WS Test ${Date.now()}`;
    await programsPage.createProgram(programName, undefined, trackProgram);

    await programsPage.openEditFor(programName);
    await programsPage.editProgramModal.fillProgramName('   ');
    await expect(programsPage.editProgramModal.saveButton).toBeDisabled();
  });

  test('TC-014: HTML/script injection in program name does not execute', async ({ page, trackProgram }) => {
    const xssName = `<script>alert("XSS")</script> ${Date.now()}`;
    await programsPage.createProgram(xssName, undefined, trackProgram);

    const dialogCount = await page.locator('role=alertdialog').count();
    expect(dialogCount).toBe(0);

    await expect(programsPage.programRow(xssName).first()).toBeVisible();
  });

  test('TC-015: SQL injection attempt in program name is safely handled', async ({ trackProgram }) => {
    const sqlPayload = `'; DROP TABLE programs; -- ${Date.now()}`;
    await programsPage.createProgram(sqlPayload, undefined, trackProgram);

    await expect(programsPage.programRow(sqlPayload).first()).toBeVisible();
    await expect(programsPage.newProgramButton).toBeVisible();
  });
});

test.describe('Program Name Validation - Edge Cases', () => {
  test('TC-016: Program name at maximum allowed length is accepted', async ({ trackProgram }) => {
    const ts = Date.now().toString();
    const maxName = ts + 'A'.repeat(245 - ts.length) + '...MAX_END';
    await programsPage.createProgram(maxName, undefined, trackProgram);

    await programsPage.openEditFromRow(programsPage.programRowContaining(`${ts}A`), maxName);
    await expect(programsPage.editProgramModal.programNameInput).toHaveValue(maxName);
  });

  test('TC-018: Single-character program name is accepted', async ({ trackProgram }) => {
    await programsPage.createProgram('Q', undefined, trackProgram);
    await expect(programsPage.programRow('Q').first()).toBeVisible();
  });

  test('TC-019: Program name with only numbers is accepted', async ({ trackProgram }) => {
    const numericName = `${Date.now()}`;
    await programsPage.createProgram(numericName, undefined, trackProgram);
    await expect(programsPage.programRow(numericName).first()).toBeVisible();
  });

  test('TC-022: Duplicate error message clears when the name is changed to a unique value', async ({
    trackProgram,
  }) => {
    test.fail(true, 'DS-3 duplicate prevention is not yet implemented — app currently allows duplicates');

    const existingName = `Error Clear Test ${Date.now()}`;
    const fixedName = `${existingName} - v2`;

    await programsPage.createProgram(existingName, undefined, trackProgram);

    await programsPage.openNewProgram();
    await programsPage.newProgramModal.fillProgramName(existingName);
    await programsPage.newProgramModal.attemptSubmitCreate(trackProgram);
    await expect(programsPage.newProgramModal.dialog).toBeVisible();
    await expect(programsPage.newProgramModal.duplicateError).toBeVisible();

    await programsPage.newProgramModal.fillProgramName(fixedName);
    await programsPage.newProgramModal.submitCreate(trackProgram);
    await expect(programsPage.programRow(fixedName).first()).toBeVisible();
  });

  test('TC-023: Very similar but distinct program names are allowed', async ({ trackProgram }) => {
    const baseName = `Similar Name Test ${Date.now()}`;
    await programsPage.createProgram(baseName, undefined, trackProgram);

    await programsPage.openNewProgram();
    await programsPage.newProgramModal.fillProgramName(`${baseName}!`);
    await programsPage.newProgramModal.submitCreate(trackProgram);
    await expect(programsPage.programRow(`${baseName}!`).first()).toBeVisible();
  });
});
