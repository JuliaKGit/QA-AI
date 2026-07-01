import type { Locator, Page } from '@playwright/test';

export type SemesterFormData = {
  name: string;
  startDate: string;
  endDate: string;
};

export class EditSemesterModal {
  readonly dialog: Locator;
  readonly semesterNameInput: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator;

  constructor(private readonly page: Page) {
    this.dialog = page.getByRole('dialog').filter({
      has: page.getByRole('heading', { name: 'Edit Semester' }),
    });
    this.semesterNameInput = this.dialog.getByLabel('Semester Name');
    this.startDateInput = this.dialog.getByLabel('Start Date');
    this.endDateInput = this.dialog.getByLabel('End Date');
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });
    this.saveButton = this.dialog.getByRole('button', { name: 'Save' });
  }

  weekdayToggle(day: string): Locator {
    return this.dialog.getByRole('checkbox', { name: day });
  }

  async fill({ name, startDate, endDate }: SemesterFormData): Promise<void> {
    await this.semesterNameInput.fill(name);
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async submitSave(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) =>
        /\/api\/programs\/[^/]+\/semesters\/[^/]+$/.test(response.url()) &&
        response.request().method() === 'PATCH' &&
        response.ok(),
    );
    await this.saveButton.click();
    await saveResponse;
    await this.dialog.waitFor({ state: 'hidden' });
  }
}
