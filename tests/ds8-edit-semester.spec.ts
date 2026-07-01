import { test, expect } from '../fixtures/cleanup.fixture';
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
  startDate = '2026-09-01',
  endDate = '2026-12-15',
): Promise<string> {
  const programName = `Edit Semester Program ${Date.now()}`;
  await programsPage.createProgram(programName, 'Program for semester edit test', trackProgram);
  await programsPage.selectProgram(programName);
  await programsPage.createSemester(semesterName, startDate, endDate);
  await expect(programsPage.semesterEntry(semesterName)).toBeVisible();
  return programName;
}

test.describe('DS-8 Edit Semester - Happy paths', () => {
  test('Open edit semester form from semester panel', async ({ trackProgram }) => {
    await createProgramWithSemester(trackProgram, 'Fall 2026');

    await programsPage.openEditSemester('Fall 2026');
    const modal = programsPage.editSemesterModal;

    await expect(modal.dialog).toBeVisible();
    await expect(modal.semesterNameInput).toBeVisible();
    await expect(modal.startDateInput).toBeVisible();
    await expect(modal.endDateInput).toBeVisible();
    await expect(modal.saveButton).toBeVisible();
    await expect(modal.semesterNameInput).toHaveValue('Fall 2026');
  });

  test('Successfully edit a semester name', async ({ trackProgram }) => {
    await createProgramWithSemester(trackProgram, 'Fall 2026');

    const modal = await programsPage.openEditSemester('Fall 2026');
    await modal.fill({
      name: 'Fall 2026 Updated',
      startDate: '2026-09-01',
      endDate: '2026-12-15',
    });
    await modal.submitSave();

    await expect(modal.dialog).toBeHidden();
    await expect(programsPage.semesterEntry('Fall 2026 Updated')).toBeVisible();
    await expect(programsPage.semesterEntry('Fall 2026')).toBeHidden();
  });

  test('Edit semester dates', async ({ trackProgram }) => {
    await createProgramWithSemester(trackProgram, 'Spring 2027', '2027-01-10', '2027-05-20');

    const modal = await programsPage.openEditSemester('Spring 2027');
    await modal.fill({
      name: 'Spring 2027',
      startDate: '2027-01-15',
      endDate: '2027-05-01',
    });
    await modal.submitSave();

    await expect(modal.dialog).toBeHidden();
    await expect(programsPage.semesterEntry('Spring 2027')).toBeVisible();
  });

  test('Save button enables when required fields are valid', async ({ trackProgram }) => {
    await createProgramWithSemester(trackProgram, 'Fall 2026');

    const modal = await programsPage.openEditSemester('Fall 2026');
    await expect(modal.saveButton).toBeEnabled();
  });
});

test.describe('DS-8 Edit Semester - Negative flows', () => {
  test('Cancel does not persist semester changes', async ({ trackProgram }) => {
    await createProgramWithSemester(trackProgram, 'Fall 2026');

    const modal = await programsPage.openEditSemester('Fall 2026');
    await modal.semesterNameInput.fill('Abandoned Edit');
    await modal.cancel();

    await expect(modal.dialog).toBeHidden();
    await expect(programsPage.semesterEntry('Fall 2026')).toBeVisible();
    await expect(programsPage.semesterEntry('Abandoned Edit')).toBeHidden();
  });

  test('Save stays disabled when semester name is cleared', async ({ trackProgram }) => {
    await createProgramWithSemester(trackProgram, 'Fall 2026');

    const modal = await programsPage.openEditSemester('Fall 2026');
    await modal.semesterNameInput.fill('');
    await expect(modal.saveButton).toBeDisabled();
  });
});

test.describe('DS-8 Edit Semester - Edge cases', () => {
  test('Special characters in edited semester name display intact', async ({ trackProgram }) => {
    await createProgramWithSemester(trackProgram, 'Fall 2026');

    const modal = await programsPage.openEditSemester('Fall 2026');
    await modal.fill({
      name: 'Hiver 2026 — Groupe A',
      startDate: '2026-09-01',
      endDate: '2026-12-15',
    });
    await modal.submitSave();

    await expect(programsPage.semesterEntry('Hiver 2026 — Groupe A')).toBeVisible();
  });
});
