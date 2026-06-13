import { test, expect } from '../fixtures/cleanup.fixture';
import { ProgramsPage } from '../pages';

let programsPage: ProgramsPage;

test.beforeEach(async ({ page }) => {
  programsPage = new ProgramsPage(page);
  await programsPage.goto();
  await expect(programsPage.newProgramButton).toBeVisible();
});

test.describe.configure({ timeout: 60_000 });

test.describe('DS-5 Program List - Display', () => {
  test('Display program list with name and description', async ({ trackProgram }) => {
    const programName = `Web Development 2026 ${Date.now()}`;
    const description = 'Full-stack web track';

    await programsPage.createProgram(programName, description, trackProgram);

    await expect(programsPage.programTable).toBeVisible();
    await expect(programsPage.programRow(programName).first()).toBeVisible();
    await expect(programsPage.programDescription(programName, description)).toBeVisible();
  });

  test('Multiple programs are all listed', async ({ trackProgram }) => {
    const ts = Date.now();
    const webDev = `Web Development 2026 ${ts}`;
    const dataAnalytics = `Data Analytics 2026 ${ts}`;

    await programsPage.createProgram(webDev, 'Full-stack web track', trackProgram);
    await programsPage.createProgram(dataAnalytics, 'Data analytics track', trackProgram);

    await expect(programsPage.programRow(webDev).first()).toBeVisible();
    await expect(programsPage.programRow(dataAnalytics).first()).toBeVisible();
  });

  test('Each listed program exposes Edit and Delete controls', async ({ trackProgram }) => {
    const programName = `Web Development 2026 ${Date.now()}`;
    await programsPage.createProgram(programName, 'Managed program', trackProgram);

    await expect(programsPage.editButtonFor(programName)).toBeVisible();
    await expect(programsPage.deleteButtonFor(programName)).toBeVisible();
  });
});

test.describe('DS-5 Program List - Empty state', () => {
  // The list endpoint is mocked to return zero programs so the empty state can be
  // asserted deterministically, without mutating the shared environment's global
  // program set (which parallel tests also rely on).
  test('Empty state when no programs exist', async ({ page }) => {
    await page.route('**/api/programs*', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [] }),
        });
      } else {
        await route.fallback();
      }
    });
    await programsPage.goto();

    await expect(programsPage.emptyState).toBeVisible();
    await expect(programsPage.emptyStateCreateButton).toBeVisible();
  });

  test('Empty state is not shown while programs exist', async ({ trackProgram }) => {
    const programName = `Web Development 2026 ${Date.now()}`;
    await programsPage.createProgram(programName, 'Existing program', trackProgram);

    await expect(programsPage.programRow(programName).first()).toBeVisible();
    await expect(programsPage.emptyState).toBeHidden();
  });

  // Requires a genuine, global empty state (zero programs anywhere) and then a real
  // create round-trip. Forcing a true global empty state is unreliable in the shared
  // test environment (other specs run in parallel), and mocking the create flow end to
  // end would not exercise the real list refresh. Left as fixme pending a dedicated,
  // isolated environment or a reset hook.
  test.fixme('Creating the first program clears the empty state', async () => {});

  // Requires being the *only* program in the system before deleting it, which cannot be
  // guaranteed in the shared/parallel environment. See note above.
  test.fixme('Deleting the last program returns the empty state', async () => {});
});

test.describe('DS-5 Program List - Mutations', () => {
  test('Deleted program no longer appears in the list', async ({ trackProgram }) => {
    const programName = `Temp Program ${Date.now()}`;
    await programsPage.createProgram(programName, 'To be deleted', trackProgram);
    await expect(programsPage.programRow(programName).first()).toBeVisible();

    await programsPage.confirmDelete(programName);

    await expect(programsPage.programRow(programName)).toHaveCount(0);
  });

  test('Program list survives a page refresh', async ({ page, trackProgram }) => {
    // DS-76 tracks an intermittent refresh-consistency timeout; if this becomes flaky
    // it should be investigated against that ticket rather than retried blindly.
    const programName = `Persistent Program ${Date.now()}`;
    await programsPage.createProgram(programName, 'Should survive refresh', trackProgram);
    await expect(programsPage.programRow(programName).first()).toBeVisible();

    await page.reload();
    await expect(programsPage.newProgramButton).toBeVisible();

    await expect(programsPage.programRow(programName).first()).toBeVisible();
  });
});

test.describe('DS-5 Program List - Edge cases', () => {
  test('Program with no description still renders cleanly', async ({ page, trackProgram }) => {
    const programName = `No Desc Program ${Date.now()}`;
    await programsPage.createProgram(programName, '', trackProgram);

    await expect(programsPage.programRow(programName).first()).toBeVisible();
    // The exact column layout is unspecified in DS-5, so rather than asserting a
    // specific empty cell we verify the row renders and the page chrome is intact
    // (no layout crash) when the description is empty.
    await expect(programsPage.rowCells(programName).first()).toBeVisible();
    await expect(programsPage.newProgramButton).toBeVisible();
    expect(await page.locator('role=alertdialog').count()).toBe(0);
  });

  test('Special characters in name and description display intact', async ({ page, trackProgram }) => {
    const programName = `Informatique & IA - Niveau 2 ${Date.now()}`;
    const description = 'Très complet — <démo>';

    await programsPage.createProgram(programName, description, trackProgram);

    await expect(programsPage.programRow(programName).first()).toBeVisible();
    await expect(programsPage.programDescription(programName, description)).toBeVisible();
    // Markup in the description must render as plain text, not execute.
    expect(await page.locator('role=alertdialog').count()).toBe(0);
  });

  test('Long program name does not break the row layout', async ({ trackProgram }) => {
    const suffix = 'MAX';
    const ts = Date.now().toString();
    const longName = ts + 'A'.repeat(100 - ts.length - suffix.length) + suffix;
    expect(longName).toHaveLength(100);

    await programsPage.createProgram(longName, 'Long name layout check', trackProgram);

    await expect(programsPage.programRowContaining(ts).first()).toBeVisible();
    await expect(programsPage.newProgramButton).toBeVisible();
  });

  test('Two programs with the same name are individually distinguishable', async ({ trackProgram }) => {
    test.fail(true, 'DS-75 — duplicate program names are currently indistinguishable in the list.');

    const name = `Duplicate Name ${Date.now()}`;
    const descriptionA = 'First duplicate description';
    const descriptionB = 'Second duplicate description';

    await programsPage.createProgram(name, descriptionA, trackProgram);
    await programsPage.createProgram(name, descriptionB, trackProgram);

    await expect(programsPage.programRow(name)).toHaveCount(2);
    await expect(programsPage.programDescription(name, descriptionA)).toBeVisible();
    await expect(programsPage.programDescription(name, descriptionB)).toBeVisible();
  });

  test('List remains usable when the programs API fails', async ({ page }) => {
    test.fail(true, 'DS-72 — a misleading empty state is shown when the programs API returns 500.');

    await page.route('**/api/programs*', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal Server Error' }),
        });
      } else {
        await route.fallback();
      }
    });
    await programsPage.goto();

    // Page should not crash and must not present the empty state as if no programs exist.
    await expect(programsPage.heading).toBeVisible();
    await expect(programsPage.emptyState).toBeHidden();
  });
});
