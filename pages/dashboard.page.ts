import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  readonly path = '/';

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Dashboard', level: 2 });
  }

  get subtitle(): Locator {
    return this.page.getByText('Welcome to Didaxis Studio');
  }

  get connectedStatus(): Locator {
    return this.page.getByText('Connected');
  }

  get programsCard(): Locator {
    return this.page.getByText('Manage academic programs');
  }

  get calendarCard(): Locator {
    return this.page.getByText('Schedule & drag-drop');
  }

  get validationCard(): Locator {
    return this.page.getByText('Check for conflicts');
  }

  get aiAssistCard(): Locator {
    return this.page.getByText('AI-powered editing');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await expect(this.heading).toBeVisible();
  }
}
