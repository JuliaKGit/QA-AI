import { test, expect } from '../fixtures/cleanup.fixture';
import {
  AppNavigation,
  CalendarPage,
  DashboardPage,
  ExportPage,
  LoginPage,
  ProgramsPage,
  SchedulerPage,
  SettingsPage,
  ValidationPage,
} from '../pages';

test.describe('DS-17 Dashboard and navigation', () => {
  test('Dashboard renders welcome content', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await page.goto('/');
    await expect(dashboard.heading).toBeVisible();
    await expect(dashboard.subtitle).toBeVisible();
  });

  test('Sidebar navigates to Programs', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const programs = new ProgramsPage(page);
    const nav = new AppNavigation(page);

    await page.goto('/');
    await expect(dashboard.heading).toBeVisible();
    await nav.goToPrograms();
    await expect(programs.heading).toBeVisible();
  });

  test('Sidebar navigates to Calendar', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const calendar = new CalendarPage(page);
    const nav = new AppNavigation(page);

    await page.goto('/');
    await expect(dashboard.heading).toBeVisible();
    await nav.goToCalendar();
    await expect(calendar.heading).toBeVisible();
  });

  test('Sidebar navigates to Validation', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const validation = new ValidationPage(page);
    const nav = new AppNavigation(page);

    await page.goto('/');
    await expect(dashboard.heading).toBeVisible();
    await nav.goToValidation();
    await expect(validation.heading).toBeVisible();
  });

  test('Sidebar navigates to Scheduler', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const scheduler = new SchedulerPage(page);
    const nav = new AppNavigation(page);

    await page.goto('/');
    await expect(dashboard.heading).toBeVisible();
    await nav.goToScheduler();
    await expect(scheduler.heading).toBeVisible();
  });

  test('Sidebar navigates to Export', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const exportPage = new ExportPage(page);
    const nav = new AppNavigation(page);

    await page.goto('/');
    await expect(dashboard.heading).toBeVisible();
    await nav.goToExport();
    await expect(exportPage.heading).toBeVisible();
  });

  test('Sidebar navigates to Settings', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const settings = new SettingsPage(page);
    const nav = new AppNavigation(page);

    await page.goto('/');
    await expect(dashboard.heading).toBeVisible();
    await nav.goToSettings();
    await expect(settings.heading).toBeVisible();
  });

  test('Sign out returns to login', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const login = new LoginPage(page);
    const nav = new AppNavigation(page);

    await page.goto('/');
    await expect(dashboard.heading).toBeVisible();
    await nav.signOut();
    await expect(login.heading).toBeVisible();
  });
});
