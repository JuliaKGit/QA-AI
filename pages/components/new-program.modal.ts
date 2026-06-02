import type { Locator, Page } from '@playwright/test';
import { extractProgramId, waitForProgramCreate } from '../../support/delete-program';

export class NewProgramModal {
  readonly dialog: Locator;
  readonly programNameInput: Locator;
  readonly descriptionInput: Locator;
  readonly cancelButton: Locator;
  readonly createButton: Locator;
  readonly aiConfigToggle: Locator;
  readonly duplicateError: Locator;

  constructor(private readonly page: Page) {
    this.dialog = page.getByRole('dialog', { name: 'New Program' });
    this.programNameInput = this.dialog.getByLabel('Program Name');
    this.descriptionInput = this.dialog.getByLabel('Description');
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });
    this.createButton = this.dialog.getByRole('button', { name: 'Create', exact: true });
    this.aiConfigToggle = this.dialog.getByRole('button', { name: /Show AI Generation Config/i });
    this.duplicateError = this.dialog.getByText(/already exists/i);
  }

  async fillProgramName(name: string): Promise<void> {
    await this.programNameInput.fill(name);
  }

  async fillDescription(description: string): Promise<void> {
    await this.descriptionInput.fill(description);
  }

  async fill({ name, description }: { name: string; description?: string }): Promise<void> {
    await this.fillProgramName(name);
    if (description !== undefined) {
      await this.fillDescription(description);
    }
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async submitCreate(trackProgram?: (uuid: string) => void): Promise<void> {
    const createResponse = waitForProgramCreate(this.page);
    await this.createButton.click();
    const response = await createResponse;
    if (trackProgram) {
      trackProgram(extractProgramId(await response.json()));
    }
    await this.dialog.waitFor({ state: 'hidden' });
  }

  async attemptSubmitCreate(trackProgram?: (uuid: string) => void): Promise<void> {
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes('/api/programs') &&
        response.request().method() === 'POST',
    );
    await this.createButton.click();
    const response = await responsePromise;
    if (response.ok() && trackProgram) {
      trackProgram(extractProgramId(await response.json()));
    }
  }
}
