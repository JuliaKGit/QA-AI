import type { Page } from '@playwright/test';
import { AppNavigation } from './components/app-navigation';

export class BasePage {
  readonly nav: AppNavigation;

  constructor(protected readonly page: Page) {
    this.nav = new AppNavigation(page);
  }
}
