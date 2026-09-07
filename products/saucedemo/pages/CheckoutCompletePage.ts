import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);

    // Locators
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  // Methods
  async getConfirmationHeader(): Promise<string> {
    return this.getText(this.completeHeader);
  }

  async getConfirmationText(): Promise<string> {
    return this.getText(this.completeText);
  }

  async clickBackHome(): Promise<void> {
    await this.safeClick(this.backHomeButton);
  }
}
