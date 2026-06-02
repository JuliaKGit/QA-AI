import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ExportPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  readonly path = '/export';

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Export Schedule', level: 2 });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await expect(this.heading).toBeVisible();
  }
}
