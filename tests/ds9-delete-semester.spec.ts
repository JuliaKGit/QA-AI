import { test, expect } from '../fixtures/cleanup.fixture';
import { expectedDeleteSemesterMessage } from '../pages/components/delete-semester.confirmation';
import { ProgramsPage } from '../pages';

let programsPage: ProgramsPage;

test.beforeEach(async ({ page }) => {
  programsPage = new ProgramsPage(page);
  await programsPage.goto();
  await expect(programsPage.newProgramButton).toBeVisible();
});

async function createProgramWithSemester(
  trackProgram: (uuid: string) => void,
  semesterName: string,
): Promise<void> {
  const programName = `Delete Semester Program ${Date.now()}`;
  await programsPage.createProgram(programName, 'Program for semester delete test', trackProgram);
  await programsPage.selectProgram(programName);
  await programsPage.createSemester(semesterName, '2026-09-01', '2026-12-15');
  await expect(programsPage.semesterEntry(semesterName)).toBeVisible();
}

test.describe('DS-9 Delete Semester - Happy paths', () => {
  test('Delete confirmation shows semester name', async ({ trackProgram }) => {
    await createProgramWithSemester(trackProgram, 'Fall 2026');

    const dialog = await programsPage.openDeleteSemesterConfirmation('Fall 2026');
    expect(dialog.message()).toMatch(expectedDeleteSemesterMessage('Fall 2026'));
    await dialog.dismiss();
  });

  test('Confirming delete removes the semester', async ({ trackProgram }) => {
    await createProgramWithSemester(trackProgram, 'Fall 2026');

    await programsPage.confirmDeleteSemester('Fall 2026');

    await expect(programsPage.semesterEntry('Fall 2026')).toBeHidden();
    await expect(programsPage.noSemestersMessage).toBeVisible();
  });

  test('Canceling delete keeps the semester', async ({ trackProgram }) => {
    await createProgramWithSemester(trackProgram, 'Fall 2026');

    await programsPage.cancelDeleteSemester('Fall 2026');

    await expect(programsPage.semesterEntry('Fall 2026')).toBeVisible();
  });
});

test.describe('DS-9 Delete Semester - Edge cases', () => {
  test('Deleting one semester leaves others intact', async ({ trackProgram }) => {
    const programName = `Multi Delete Program ${Date.now()}`;
    await programsPage.createProgram(programName, 'Program for multi-semester delete test', trackProgram);
    await programsPage.selectProgram(programName);
    await programsPage.createSemester('Fall 2026', '2026-09-01', '2026-12-15');
    await programsPage.createSemester('Winter 2027', '2027-01-05', '2027-04-30');

    await programsPage.confirmDeleteSemester('Fall 2026');

    await expect(programsPage.semesterEntry('Fall 2026')).toBeHidden();
    await expect(programsPage.semesterEntry('Winter 2027')).toBeVisible();
  });
});
