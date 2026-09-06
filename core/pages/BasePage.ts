import { Page, Locator, expect } from '@playwright/test';

/**
 * Abstract base class for all Page Objects.
 *
 * Provides a shared constructor contract and common utility methods
 * that eliminate boilerplate across product-level page objects.
 * Every product-level page object must extend this class.
 *
 * Methods follow Playwright's auto-waiting philosophy but add:
 * - Scroll-into-view before interactions
 * - Null-safe text extraction
 * - Navigation + wait composition
 * - Boolean visibility checks (non-throwing)
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
 *
 *   async login(user: string, pass: string): Promise<void> {
 *     await this.fillAndVerify(this.usernameInput, user);
 *     // ...
 *   }
 * }
 * ```
 */
export abstract class BasePage {
  constructor(public readonly page: Page) {}

  // ─── Navigation ─────────────────────────────────────────────────────────────

  /** Navigate to a URL and wait for DOM content to be loaded. */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Wait until the DOM content is fully loaded. */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Wait until there are no pending network requests for 500ms. */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /** Return the current page URL. */
  getPageUrl(): string {
    return this.page.url();
  }

  /** Return the current page title. */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  // ─── Click Helpers ──────────────────────────────────────────────────────────

  /**
   * Scroll an element into view, wait for it to be visible, then click.
   * Handles off-screen elements that Playwright's default click may miss.
   */
  async safeClick(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await locator.click(options);
  }

  /**
   * Click an element and wait for navigation to settle.
   * Useful for links and buttons that trigger page transitions.
   */
  async clickAndWait(
    locator: Locator,
    waitState: 'domcontentloaded' | 'networkidle' | 'load' = 'domcontentloaded',
  ): Promise<void> {
    await locator.click();
    await this.page.waitForLoadState(waitState);
  }

  // ─── Input Helpers ──────────────────────────────────────────────────────────

  /**
   * Clear an input field, fill it with a value, and verify it was set correctly.
   * Prevents stale-value bugs from partial fills or autofill interference.
   */
  async fillAndVerify(locator: Locator, value: string): Promise<void> {
    await locator.clear();
    await locator.fill(value);
    await expect(locator).toHaveValue(value);
  }

  /** Select a dropdown option by its visible text. */
  async selectByText(locator: Locator, text: string): Promise<void> {
    await locator.selectOption({ label: text });
  }

  // ─── Text Extraction ───────────────────────────────────────────────────────

  /** Get text content of a single element, returning empty string if null. */
  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) ?? '';
  }

  /** Get text content of all matching elements. */
  async getTexts(locator: Locator): Promise<string[]> {
    return locator.allTextContents();
  }

  // ─── Visibility Helpers ─────────────────────────────────────────────────────

  /**
   * Wait for an element to be visible.
   * @param timeout - Override the default timeout (ms).
   */
  async waitForVisible(locator: Locator, timeout?: number): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  /** Wait for an element to disappear from the DOM or become hidden. */
  async waitForHidden(locator: Locator, timeout?: number): Promise<void> {
    await expect(locator).toBeHidden({ timeout });
  }

  /**
   * Non-throwing boolean check for element visibility.
   * Returns `true` if visible, `false` otherwise — never throws.
   */
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible();
    } catch {
      return false;
    }
  }

  // ─── Scroll ─────────────────────────────────────────────────────────────────

  /** Scroll an element into the visible viewport. */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }
}
