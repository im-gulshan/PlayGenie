import { Page } from '@playwright/test';

/**
 * Abstract base class for all Page Objects.
 *
 * Provides a shared constructor contract and common utility methods.
 * Every product-level page object must extend this class to ensure
 * consistency across the framework.
 *
 * @example
 * ```typescript
 * export class LoginPage extends BasePage {
 *   readonly usernameInput: Locator;
 *
 *   constructor(page: Page) {
 *     super(page);
 *     this.usernameInput = page.locator('[data-test="username"]');
 *   }
 * }
 * ```
 */
export abstract class BasePage {
  constructor(public readonly page: Page) {}

  /** Wait until the DOM content is fully loaded. */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Return the current page URL. */
  async getPageUrl(): Promise<string> {
    return this.page.url();
  }

  /** Return the current page title. */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }
}
