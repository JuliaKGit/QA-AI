import { test, expect } from '../fixtures/cleanup.fixture';
import { expectedDeleteMessage, ProgramsPage } from '../pages';
import { waitForProgramDelete } from '../support/delete-program';

let programsPage: ProgramsPage;

test.beforeEach(async ({ page }) => {
  programsPage = new ProgramsPage(page);
  await programsPage.goto();
  await expect(programsPage.newProgramButton).toBeVisible();
});

test.describe.configure({ timeout: 60_000 });

test.describe('Delete Program - Positive Flows', () => {
  test('TC-001: Confirming delete removes Test Program from the program list', async ({ trackProgram }) => {
    const programName = `Test Program ${Date.now()}`;
    await programsPage.createProgram(programName, 'Program for delete confirmation test', trackProgram);
    await expect(programsPage.programRow(programName).first()).toBeVisible();

    await programsPage.confirmDelete(programName);

    await expect(programsPage.programRow(programName)).toHaveCount(0);
  });

  test('TC-002: Canceling delete leaves the program in the list unchanged', async ({ trackProgram }) => {
    const programName = `Test Program ${Date.now()}`;
    await programsPage.createProgram(programName, 'Program for cancel delete test', trackProgram);
    await expect(programsPage.programRow(programName).first()).toBeVisible();

    await programsPage.cancelDelete(programName);

    await expect(programsPage.programRow(programName).first()).toBeVisible();
  });

  test('TC-003: Confirmation dialog appears before the program is removed', async ({ page, trackProgram }) => {
    const programName = `Test Program ${Date.now()}`;
    await programsPage.createProgram(programName, 'Program for pre-confirm check', trackProgram);

    const confirmation = await programsPage.openDeleteConfirmation(programName);
    expect(confirmation.type()).toBe('confirm');
    expect(confirmation.message()).toMatch(expectedDeleteMessage(programName));

    const deleteResponse = waitForProgramDelete(page);
    await confirmation.accept();
    await deleteResponse;

    await expect(programsPage.programRow(programName)).toHaveCount(0);
  });

  test('TC-004: Recreating a program with the same name after delete succeeds', async ({ trackProgram }) => {
    const programName = `Test Program ${Date.now()}`;
    await programsPage.createProgram(programName, 'First instance', trackProgram);
    await programsPage.confirmDelete(programName);
    await expect(programsPage.programRow(programName)).toHaveCount(0);

    await programsPage.createProgram(programName, 'Recreated after delete.', trackProgram);
    await expect(programsPage.programRow(programName).first()).toBeVisible();
  });
});

test.describe('Delete Program - Negative Flows', () => {
  test('TC-005: Deleting one program does not remove a different program', async ({ trackProgram }) => {
    const programToDelete = `Test Program ${Date.now()}`;
    const otherProgram = `Web Development 2026 ${Date.now()}`;

    await programsPage.createProgram(programToDelete, 'Delete target', trackProgram);
    await programsPage.createProgram(otherProgram, 'Should remain after delete', trackProgram);

    await programsPage.confirmDelete(programToDelete);

    await expect(programsPage.programRow(programToDelete)).toHaveCount(0);
    await expect(programsPage.programRow(otherProgram).first()).toBeVisible();
  });

  test('TC-008: Confirming delete completes without leaving the program in the list', async ({ trackProgram }) => {
    const programName = `Test Program ${Date.now()}`;
    await programsPage.createProgram(programName, 'Double confirm delete test', trackProgram);

    const confirmation = await programsPage.openDeleteConfirmation(programName);
    await confirmation.accept();

    await expect(programsPage.programRow(programName)).toHaveCount(0);
  });

  test('TC-009: Canceling delete does not remove the program from the list', async ({ trackProgram }) => {
    const programName = `Test Program ${Date.now()}`;
    await programsPage.createProgram(programName, 'Cancel should not delete', trackProgram);

    await programsPage.cancelDelete(programName);

    await expect(programsPage.programRow(programName).first()).toBeVisible();
  });
});

test.describe('Delete Program - Edge Cases', () => {
  test('TC-011: Program name with special characters appears correctly in confirmation and deletes the intended row', async ({
    trackProgram,
  }) => {
    const programName = `Informatique & IA - Niveau 2 ${Date.now()}`;
    await programsPage.createProgram(programName, 'French IT program', trackProgram);

    const confirmation = await programsPage.openDeleteConfirmation(programName);
    expect(confirmation.message()).toMatch(expectedDeleteMessage(programName));
    await confirmation.accept();

    await expect(programsPage.programRow(programName)).toHaveCount(0);
  });

  test('TC-013: Dismissing the confirmation dialog retains the program', async ({ trackProgram }) => {
    const programName = `Test Program ${Date.now()}`;
    await programsPage.createProgram(programName, 'Dismiss dialog test', trackProgram);

    const confirmation = await programsPage.openDeleteConfirmation(programName);
    await confirmation.dismiss();

    await expect(programsPage.programRow(programName).first()).toBeVisible();
  });

  test('TC-016: Delete control is reachable via keyboard and opens confirmation', async ({
    page,
    trackProgram,
  }) => {
    const programName = `Test Program ${Date.now()}`;
    await programsPage.createProgram(programName, 'Keyboard delete test', trackProgram);

    const deleteButton = programsPage.deleteButtonFor(programName);
    await deleteButton.focus();
    await expect(deleteButton).toBeFocused();

    const dialogPromise = page.waitForEvent('dialog');
    void deleteButton.click({ force: true });
    const confirmation = await dialogPromise;

    expect(confirmation.type()).toBe('confirm');
    expect(confirmation.message()).toMatch(expectedDeleteMessage(programName));
    await confirmation.dismiss();

    await expect(programsPage.programRow(programName).first()).toBeVisible();
  });
});
