import type { Locator, Page } from '@playwright/test';

export class AppNavigation {
  readonly dashboardNav: Locator;
  readonly programsNav: Locator;
  readonly calendarNav: Locator;
  readonly validationNav: Locator;
  readonly schedulerNav: Locator;
  readonly exportNav: Locator;
  readonly settingsNav: Locator;
  readonly signOutButton: Locator;

  constructor(private readonly page: Page) {
    this.dashboardNav = page.getByRole('button', { name: '📊 Dashboard' });
    this.programsNav = page.getByRole('button', { name: '🎓 Programs' });
    this.calendarNav = page.getByRole('button', { name: '📅 Calendar' });
    this.validationNav = page.getByRole('button', { name: '✅ Validation' });
    this.schedulerNav = page.getByRole('button', { name: '⚡ Scheduler' });
    this.exportNav = page.getByRole('button', { name: '📤 Export' });
    this.settingsNav = page.getByRole('button', { name: '⚙️ Settings' });
    this.signOutButton = page.getByRole('button', { name: 'Sign out' });
  }

  async goToDashboard(): Promise<void> {
    await this.dashboardNav.click();
  }

  async goToPrograms(): Promise<void> {
    await this.programsNav.click();
  }

  async goToCalendar(): Promise<void> {
    await this.calendarNav.click();
  }

  async goToValidation(): Promise<void> {
    await this.validationNav.click();
  }

  async goToScheduler(): Promise<void> {
    await this.schedulerNav.click();
  }

  async goToExport(): Promise<void> {
    await this.exportNav.click();
  }

  async goToSettings(): Promise<void> {
    await this.settingsNav.click();
  }

  async signOut(): Promise<void> {
    await this.signOutButton.click();
  }
}
