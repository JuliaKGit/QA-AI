import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ValidationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  readonly path = '/validation';

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Validation', level: 2 });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await expect(this.heading).toBeVisible();
  }
}
