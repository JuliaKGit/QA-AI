import { test, expect } from '../fixtures/cleanup.fixture';
import { ProgramsPage } from '../pages';

let programsPage: ProgramsPage;
let testProgramName: string;

test.beforeEach(async ({ page, trackProgram }) => {
  programsPage = new ProgramsPage(page);
  testProgramName = `Edit Test Program ${Date.now()}`;

  await programsPage.goto();
  await expect(programsPage.newProgramButton).toBeVisible();
  await programsPage.createProgram(
    testProgramName,
    'Original description for edit test',
    trackProgram,
  );
  await expect(programsPage.programRow(testProgramName).first()).toBeVisible();
});

test.describe('Edit Program - Positive Flows', () => {
  test('TC-001: Edit form opens pre-populated with current program data', async () => {
    await programsPage.openEditFor(testProgramName);
    const modal = programsPage.editProgramModal;

    await expect(modal.dialog).toBeVisible();
    await expect(modal.programNameInput).toHaveValue(testProgramName);
    await expect(modal.descriptionInput).toHaveValue('Original description for edit test');
    await expect(modal.saveButton).toBeVisible();
  });

  test('TC-002: Successfully editing a program name closes modal and updates the list', async () => {
    const updatedName = `${testProgramName} - Updated`;

    await programsPage.openEditFor(testProgramName);
    await programsPage.editProgramModal.fillProgramName(updatedName);
    await programsPage.editProgramModal.submitSave();

    await expect(programsPage.editProgramModal.dialog).not.toBeVisible();
    await expect(programsPage.programRow(updatedName).first()).toBeVisible();
  });

  test('TC-003: Editing only the Description preserves the Name and other fields', async () => {
    await programsPage.openEditFor(testProgramName);
    await programsPage.editProgramModal.fillDescription('Updated description for testing');
    await programsPage.editProgramModal.submitSave();

    await expect(programsPage.programRow(testProgramName).first()).toBeVisible();

    await programsPage.openEditFor(testProgramName);
    const modal = programsPage.editProgramModal;
    await expect(modal.programNameInput).toHaveValue(testProgramName);
    await expect(modal.descriptionInput).toHaveValue('Updated description for testing');
  });

  test('TC-004: Editing only the Name preserves the Description', async () => {
    const renamedName = `${testProgramName} - Renamed`;

    await programsPage.openEditFor(testProgramName);
    await programsPage.editProgramModal.fillProgramName(renamedName);
    await programsPage.editProgramModal.submitSave();

    await programsPage.openEditFor(renamedName);
    const modal = programsPage.editProgramModal;
    await expect(modal.programNameInput).toHaveValue(renamedName);
    await expect(modal.descriptionInput).toHaveValue('Original description for edit test');
  });

  test('TC-005: Edited program data persists after page refresh', async ({ page }) => {
    const updatedName = `${testProgramName} - Persisted`;

    await programsPage.openEditFor(testProgramName);
    await programsPage.editProgramModal.fillProgramName(updatedName);
    await programsPage.editProgramModal.submitSave();

    await page.reload();
    await programsPage.goto();
    await expect(programsPage.programRow(updatedName).first()).toBeVisible();
  });

  test('TC-006: Save button is enabled when form opens with valid pre-populated data', async () => {
    await programsPage.openEditFor(testProgramName);
    await expect(programsPage.editProgramModal.saveButton).toBeEnabled();
  });

  test('TC-007: Clearing and re-entering the Program Name allows save', async () => {
    const newName = `Cybersecurity Fundamentals ${Date.now()}`;

    await programsPage.openEditFor(testProgramName);
    await programsPage.editProgramModal.fillProgramName('');
    await programsPage.editProgramModal.fillProgramName(newName);
    await programsPage.editProgramModal.submitSave();

    await expect(programsPage.programRow(newName).first()).toBeVisible();
    await expect(programsPage.programRow(testProgramName)).not.toBeVisible();
  });
});

test.describe('Edit Program - Negative Flows', () => {
  test('TC-009: Saving with an empty Program Name is prevented', async () => {
    await programsPage.openEditFor(testProgramName);
    await programsPage.editProgramModal.fillProgramName('');
    await expect(programsPage.editProgramModal.saveButton).toBeDisabled();
  });

  test('TC-012: HTML/script injection in edited fields does not execute', async ({ page }) => {
    await programsPage.openEditFor(testProgramName);

    const xssName = `<script>alert("XSS")</script> ${Date.now()}`;
    await programsPage.editProgramModal.fillProgramName(xssName);
    await programsPage.editProgramModal.fillDescription('<img onerror=alert(1) src=x>');
    await programsPage.editProgramModal.submitSave();

    await expect(page.getByRole('alertdialog')).toHaveCount(0);

    await expect(programsPage.programRow(xssName).first()).toBeVisible();
  });

  test('TC-013: Closing the edit modal without saving discards changes', async () => {
    await programsPage.openEditFor(testProgramName);
    await programsPage.editProgramModal.fillProgramName('Discarded Edit');
    await programsPage.editProgramModal.cancel();

    await expect(programsPage.editProgramModal.dialog).not.toBeVisible();
    await expect(programsPage.programRow(testProgramName).first()).toBeVisible();
    await expect(programsPage.programRow('Discarded Edit')).not.toBeVisible();
  });

  test('TC-014: Rapid double-click on Save does not produce duplicate updates or errors', async () => {
    const doubleClickName = `Double Click Edit ${Date.now()}`;

    await programsPage.openEditFor(testProgramName);
    await programsPage.editProgramModal.fillProgramName(doubleClickName);
    await programsPage.editProgramModal.saveButton.dblclick();

    await expect(programsPage.editProgramModal.dialog).not.toBeVisible();
    await expect(programsPage.programRow(doubleClickName)).toHaveCount(1);
  });
});

test.describe('Edit Program - Edge Cases', () => {
  test('TC-016: Edited Program Name at maximum allowed length saves and displays correctly', async () => {
    const maxName = 'A'.repeat(245) + '...MAX_END';

    await programsPage.openEditFor(testProgramName);
    await programsPage.editProgramModal.fillProgramName(maxName);
    await programsPage.editProgramModal.submitSave();

    await programsPage.openEditFromRow(programsPage.programRowContaining('MAX_END'), maxName);
    await expect(programsPage.editProgramModal.programNameInput).toHaveValue(maxName);
  });

  test('TC-018: Whitespace-only Program Name does not save', async () => {
    await programsPage.openEditFor(testProgramName);
    await programsPage.editProgramModal.fillProgramName('   ');
    await expect(programsPage.editProgramModal.saveButton).toBeDisabled();
  });

  test('TC-020: Special characters and Unicode in edited fields persist correctly', async () => {
    const unicodeName = `Développement Web — "Été" ${Date.now()}`;
    const unicodeDesc = 'Symbols: &<>"/\'; Accents: àéîõü';

    await programsPage.openEditFor(testProgramName);
    await programsPage.editProgramModal.fillProgramName(unicodeName);
    await programsPage.editProgramModal.fillDescription(unicodeDesc);
    await programsPage.editProgramModal.submitSave();

    await programsPage.openEditFromRow(programsPage.programRowContaining('Développement'), unicodeName);
    const modal = programsPage.editProgramModal;
    await expect(modal.programNameInput).toHaveValue(unicodeName);
    await expect(modal.descriptionInput).toHaveValue(unicodeDesc);
  });

  test('TC-022: Save button disables if Program Name is cleared during editing', async () => {
    await programsPage.openEditFor(testProgramName);

    await expect(programsPage.editProgramModal.saveButton).toBeEnabled();
    await programsPage.editProgramModal.fillProgramName('');
    await expect(programsPage.editProgramModal.saveButton).toBeDisabled();
  });

  test('TC-023: Save button re-enables after entering a valid name following a cleared field', async () => {
    await programsPage.openEditFor(testProgramName);

    await programsPage.editProgramModal.fillProgramName('');
    await expect(programsPage.editProgramModal.saveButton).toBeDisabled();

    await programsPage.editProgramModal.fillProgramName('Restored Program Name');
    await expect(programsPage.editProgramModal.saveButton).toBeEnabled();
  });

  test('TC-024: Edit form is accessible via keyboard navigation', async ({ page }) => {
    const row = programsPage.programRow(testProgramName);
    const editButton = programsPage.editProgramButton(row, testProgramName);
    await editButton.focus();
    await page.keyboard.press('Enter');

    const modal = programsPage.editProgramModal;
    await expect(modal.dialog).toBeVisible();

    await modal.programNameInput.focus();
    await expect(modal.programNameInput).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(modal.descriptionInput).toBeFocused();
  });
});
