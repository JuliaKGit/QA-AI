import type { Dialog, Locator, Page } from '@playwright/test';
import { AppNavigation } from './components/app-navigation';
import { EditProgramModal } from './components/edit-program.modal';
import { NewProgramModal } from './components/new-program.modal';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class ProgramsPage {
  readonly path = '/programs';
  readonly newProgramButton: Locator;
  readonly heading: Locator;
  readonly subtitle: Locator;
  readonly programTable: Locator;
  readonly semesterHint: Locator;
  readonly emptyState: Locator;
  readonly emptyStateCreateButton: Locator;
  readonly nav: AppNavigation;
  readonly newProgramModal: NewProgramModal;
  readonly editProgramModal: EditProgramModal;

  constructor(private readonly page: Page) {
    this.newProgramButton = page.getByRole('button', { name: '+ New Program' });
    this.heading = page.getByRole('heading', { name: 'Programs', level: 2 });
    this.subtitle = page.getByText('Manage academic programs and semesters');
    this.programTable = page.getByRole('table');
    this.semesterHint = page.getByText('Select a program to manage semesters');
    // Empty-state copy shown when the list has no programs. The exact wording is
    // unspecified in DS-5, so this matches the "no programs" message broadly.
    this.emptyState = page.getByText(/no programs/i);
    // Distinct from the modal "Create" submit — this is the empty-state CTA.
    this.emptyStateCreateButton = page.getByRole('button', { name: 'Create Program' });
    this.nav = new AppNavigation(page);
    this.newProgramModal = new NewProgramModal(page);
    this.editProgramModal = new EditProgramModal(page);
  }

  programRow(programName: string): Locator {
    return this.page.getByRole('row', { name: new RegExp(`^${escapeRegExp(programName)}(?:\\s|$)`) });
  }

  programRowContaining(fragment: string): Locator {
    return this.page.getByRole('row').filter({ hasText: fragment });
  }

  /** The description text rendered inside a program's row. */
  programDescription(programName: string, description: string): Locator {
    return this.programRow(programName).first().getByText(description, { exact: true });
  }

  /** All cells of a program's row — useful for asserting a clean/empty cell render. */
  rowCells(programName: string): Locator {
    return this.programRow(programName).first().getByRole('cell');
  }

  editButtonFor(programName: string): Locator {
    return this.page.getByRole('button', { name: `Edit ${programName}` });
  }

  deleteButtonFor(programName: string): Locator {
    return this.programRow(programName)
      .first()
      .getByRole('button', { name: `Delete ${programName}` });
  }

  editProgramButton(row: Locator, programName: string): Locator {
    return row.getByRole('button', { name: `Edit ${programName}` });
  }

  deleteProgramButton(row: Locator, programName: string): Locator {
    return row.getByRole('button', { name: `Delete ${programName}` });
  }

  async goto(useUiLogin = process.env.BENCHMARK_UI_LOGIN === '1'): Promise<void> {
    if (useUiLogin) {
      const { LoginPage } = await import('./login.page');
      const loginPage = new LoginPage(this.page);
      await loginPage.goto();
      await loginPage.login(process.env.DIDAXIS_EMAIL!, process.env.DIDAXIS_PASSWORD!);
      await this.nav.goToPrograms();
    } else {
      await this.page.goto(this.path);
    }
  }

  async openNewProgram(): Promise<NewProgramModal> {
    await this.newProgramButton.click();
    return this.newProgramModal;
  }

  async openEditFor(programName: string): Promise<EditProgramModal> {
    await this.editButtonFor(programName).click();
    return this.editProgramModal;
  }

  async openEditFromRow(row: Locator, programName: string): Promise<EditProgramModal> {
    await this.editProgramButton(row, programName).click();
    return this.editProgramModal;
  }

  async createProgram(
    name: string,
    description?: string,
    trackProgram?: (uuid: string) => void,
  ): Promise<void> {
    await this.openNewProgram();
    await this.newProgramModal.fill({ name, description });
    await this.newProgramModal.submitCreate(trackProgram);
    await this.programRow(name).first().waitFor({ state: 'visible' });
  }

  async openDeleteConfirmation(programName: string): Promise<Dialog> {
    const row = this.programRow(programName).first();
    await row.scrollIntoViewIfNeeded();
    const deleteButton = this.deleteButtonFor(programName);
    await deleteButton.waitFor({ state: 'visible' });

    const dialogPromise = this.page.waitForEvent('dialog');
    void deleteButton.click({ force: true });
    return dialogPromise;
  }

  async confirmDelete(programName: string): Promise<void> {
    const dialog = await this.openDeleteConfirmation(programName);
    await dialog.accept();
  }

  async cancelDelete(programName: string): Promise<void> {
    const dialog = await this.openDeleteConfirmation(programName);
    await dialog.dismiss();
  }
}
