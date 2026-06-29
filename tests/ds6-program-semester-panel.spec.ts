import { test, expect } from '../fixtures/cleanup.fixture';
import { ProgramsPage } from '../pages';

let programsPage: ProgramsPage;

test.beforeEach(async ({ page }) => {
  programsPage = new ProgramsPage(page);
  await programsPage.goto();
  await expect(programsPage.newProgramButton).toBeVisible();
});

test.describe('Program Semester Panel - Selection', () => {
  test('Selecting a program reveals the semester panel', async ({ trackProgram }) => {
    const programName = `Semester Panel Program ${Date.now()}`;

    await programsPage.createProgram(programName, 'Program for semester panel test', trackProgram);
    await expect(programsPage.programRow(programName).first()).toBeVisible();
    await expect(programsPage.semesterHint).toBeVisible();

    await programsPage.selectProgram(programName);

    await expect(programsPage.semesterHint).toBeHidden();
    await expect(programsPage.semesterPanelHeading(programName)).toBeVisible();
    await expect(programsPage.semesterPanelSubtitle).toBeVisible();
    await expect(programsPage.newSemesterButton).toBeVisible();
    await expect(programsPage.noSemestersMessage).toBeVisible();
  });

  test('Switching selection updates the semester panel', async ({ trackProgram }) => {
    const ts = Date.now();
    const alpha = `Semester Alpha ${ts}`;
    const beta = `Semester Beta ${ts}`;

    await programsPage.createProgram(alpha, 'First program for selection switch', trackProgram);
    await programsPage.createProgram(beta, 'Second program for selection switch', trackProgram);

    await programsPage.selectProgram(alpha);
    await expect(programsPage.semesterPanelHeading(alpha)).toBeVisible();

    await programsPage.selectProgram(beta);

    await expect(programsPage.semesterPanelHeading(beta)).toBeVisible();
    await expect(programsPage.semesterPanelHeading(alpha)).toBeHidden();
  });
});
