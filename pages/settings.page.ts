import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class SettingsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  readonly path = '/settings';

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Settings', level: 2 });
  }

  get calendarViewSection(): Locator {
    return this.page.getByRole('heading', { name: 'Calendar View', level: 4 });
  }

  get visibleDaysLabel(): Locator {
    return this.page.getByText('Visible Days');
  }

  dayCheckbox(day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'): Locator {
    return this.page.getByRole('checkbox', { name: day });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await expect(this.heading).toBeVisible();
  }
}
