import { test, expect } from '../fixtures/cleanup.fixture';
import { ProgramsPage } from '../pages';

let programsPage: ProgramsPage;

test.beforeEach(async ({ page }) => {
  programsPage = new ProgramsPage(page);
  await programsPage.goto();
  await expect(programsPage.newProgramButton).toBeVisible();
});

test.describe('DS-7 Create Semester - Happy paths', () => {
  test('Open new semester form from semester panel', async ({ trackProgram }) => {
    const programName = `Semester Form Program ${Date.now()}`;
    await programsPage.createProgram(programName, 'Program for semester form test', trackProgram);
    await programsPage.selectProgram(programName);

    await programsPage.openNewSemester();
    const modal = programsPage.newSemesterModal;

    await expect(modal.dialog).toBeVisible();
    await expect(modal.semesterNameInput).toBeVisible();
    await expect(modal.startDateInput).toBeVisible();
    await expect(modal.endDateInput).toBeVisible();
    await expect(modal.createButton).toBeVisible();
  });

  test('Successfully create a semester', async ({ trackProgram }) => {
    const programName = `Semester Create Program ${Date.now()}`;
    await programsPage.createProgram(programName, 'Program for semester create test', trackProgram);
    await programsPage.selectProgram(programName);
    await expect(programsPage.noSemestersMessage).toBeVisible();

    await programsPage.createSemester('Fall 2026', '2026-09-01', '2026-12-15');

    await expect(programsPage.newSemesterModal.dialog).toBeHidden();
    await expect(programsPage.semesterEntry('Fall 2026')).toBeVisible();
    await expect(programsPage.noSemestersMessage).toBeHidden();
  });

  test('Create Semester button enables after required fields are filled', async ({ trackProgram }) => {
    const programName = `Semester Enable Program ${Date.now()}`;
    await programsPage.createProgram(programName, 'Program for enable button test', trackProgram);
    await programsPage.selectProgram(programName);

    await programsPage.openNewSemester();
    const modal = programsPage.newSemesterModal;

    await expect(modal.createButton).toBeDisabled();
    await modal.fill({
      name: 'Spring 2027',
      startDate: '2027-01-10',
      endDate: '2027-05-20',
    });
    await expect(modal.createButton).toBeEnabled();
  });

  test('Weekday defaults are Mon through Fri', async ({ trackProgram }) => {
    const programName = `Semester Weekday Program ${Date.now()}`;
    await programsPage.createProgram(programName, 'Program for weekday defaults test', trackProgram);
    await programsPage.selectProgram(programName);

    await programsPage.openNewSemester();
    const modal = programsPage.newSemesterModal;

    for (const day of ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']) {
      await expect(modal.weekdayToggle(day)).toBeChecked();
    }
    for (const day of ['Sat', 'Sun']) {
      await expect(modal.weekdayToggle(day)).not.toBeChecked();
    }
  });
});

test.describe('DS-7 Create Semester - Negative flows', () => {
  test('Create Semester stays disabled with empty semester name', async ({ trackProgram }) => {
    const programName = `Semester Empty Name Program ${Date.now()}`;
    await programsPage.createProgram(programName, 'Program for empty name test', trackProgram);
    await programsPage.selectProgram(programName);

    await programsPage.openNewSemester();
    const modal = programsPage.newSemesterModal;

    await modal.startDateInput.fill('2026-09-01');
    await modal.endDateInput.fill('2026-12-15');
    await expect(modal.createButton).toBeDisabled();
  });

  test('Cancel does not create a semester', async ({ trackProgram }) => {
    const programName = `Semester Cancel Program ${Date.now()}`;
    await programsPage.createProgram(programName, 'Program for cancel test', trackProgram);
    await programsPage.selectProgram(programName);
    await expect(programsPage.noSemestersMessage).toBeVisible();

    await programsPage.openNewSemester();
    const modal = programsPage.newSemesterModal;
    await modal.fill({
      name: 'Abandoned Semester',
      startDate: '2026-09-01',
      endDate: '2026-12-15',
    });
    await modal.cancel();

    await expect(modal.dialog).toBeHidden();
    await expect(programsPage.semesterEntry('Abandoned Semester')).toBeHidden();
    await expect(programsPage.noSemestersMessage).toBeVisible();
  });
});

test.describe('DS-7 Create Semester - Edge cases', () => {
  test('Multiple semesters can be created for one program', async ({ trackProgram }) => {
    const programName = `Semester Multi Program ${Date.now()}`;
    await programsPage.createProgram(programName, 'Program for multiple semesters test', trackProgram);
    await programsPage.selectProgram(programName);

    await programsPage.createSemester('Fall 2026', '2026-09-01', '2026-12-15');
    await programsPage.createSemester('Winter 2027', '2027-01-05', '2027-04-30');

    await expect(programsPage.semesterEntry('Fall 2026')).toBeVisible();
    await expect(programsPage.semesterEntry('Winter 2027')).toBeVisible();
  });
});
