import { test, expect } from '../fixtures/cleanup.fixture';
import { ProgramsPage } from '../pages';

let programsPage: ProgramsPage;

test.beforeEach(async ({ page }) => {
  programsPage = new ProgramsPage(page);
  await programsPage.goto();
  await expect(programsPage.newProgramButton).toBeVisible();
});

test.describe('Create Program', () => {
  test('TC-001: Program creation form displays with correct fields after clicking "+ New Program"', async () => {
    await programsPage.openNewProgram();
    const modal = programsPage.newProgramModal;

    await expect(modal.dialog).toBeVisible();
    await expect(modal.programNameInput).toBeVisible();
    await expect(modal.descriptionInput).toBeVisible();
    await expect(modal.createButton).toBeVisible();

    await expect(modal.programNameInput).toBeEmpty();
    await expect(modal.descriptionInput).toBeEmpty();
    await expect(modal.createButton).toBeDisabled();
  });

  test('TC-002: Successfully creating a program closes the modal and shows the new program in the list', async ({
    trackProgram,
  }) => {
    const uniqueName = `Web Development 2026 ${Date.now()}`;

    await programsPage.openNewProgram();
    await programsPage.newProgramModal.fill({
      name: uniqueName,
      description: 'Full-stack web development program',
    });
    await programsPage.newProgramModal.submitCreate(trackProgram);

    await expect(programsPage.newProgramModal.dialog).not.toBeVisible();
    await expect(programsPage.programRow(uniqueName).first()).toBeVisible();
  });
});
