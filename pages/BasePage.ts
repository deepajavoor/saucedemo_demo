import { Page } from '@playwright/test';

/**
 * Shared behaviour for every page object. Keeping the Page reference
 * and any cross-cutting helpers here avoids repeating boilerplate
 * in each concrete page class.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path = '/') {
    await this.page.goto(path);
  }
}
