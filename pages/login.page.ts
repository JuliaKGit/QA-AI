import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  readonly path = '/login';

  get emailInput(): Locator {
    return this.page.getByLabel('Email');
  }

  get passwordInput(): Locator {
    return this.page.getByLabel('Password');
  }

  get signInButton(): Locator {
    return this.page.getByRole('button', { name: 'Sign In' });
  }

  get heading(): Locator {
    return this.page.getByText('Sign in to your account');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await expect(this.heading).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
    await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  }
}
