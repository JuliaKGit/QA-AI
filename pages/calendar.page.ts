import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CalendarPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  readonly path = '/calendar';

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Calendar', level: 2 });
  }

  get subtitle(): Locator {
    return this.page.getByText('Schedule sessions with drag-and-drop across month, week, and day views');
  }

  get programSelect(): Locator {
    return this.page.getByRole('textbox', { name: 'Program' });
  }

  get semesterSelect(): Locator {
    return this.page.getByRole('textbox', { name: 'Semester' });
  }

  get emptyState(): Locator {
    return this.page.getByText('Select a program and semester to view the calendar');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await expect(this.heading).toBeVisible();
  }
}
