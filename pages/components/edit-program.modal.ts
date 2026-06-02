import type { Locator, Page } from '@playwright/test';

export class EditProgramModal {
  readonly dialog: Locator;
  readonly programNameInput: Locator;
  readonly descriptionInput: Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator;
  readonly duplicateError: Locator;

  constructor(private readonly page: Page) {
    this.dialog = page.getByRole('dialog', { name: 'Edit Program' });
    this.programNameInput = this.dialog.getByLabel('Program Name');
    this.descriptionInput = this.dialog.getByLabel('Description');
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });
    this.saveButton = this.dialog.getByRole('button', { name: 'Save' });
    this.duplicateError = this.dialog.getByText(/already exists/i);
  }

  async fillProgramName(name: string): Promise<void> {
    await this.programNameInput.fill(name);
  }

  async fillDescription(description: string): Promise<void> {
    await this.descriptionInput.fill(description);
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async submitSave(): Promise<void> {
    await this.saveButton.click();
    await this.dialog.waitFor({ state: 'hidden' });
  }

  async attemptSubmitSave(): Promise<void> {
    await this.saveButton.click();
  }
}
