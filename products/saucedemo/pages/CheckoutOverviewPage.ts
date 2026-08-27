import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';

export class CheckoutOverviewPage extends BasePage {
  readonly finishButton: Locator;
  readonly itemTotal: Locator;
  readonly summaryInfo: Locator;

  constructor(page: Page) {
    super(page);

    // Locators
    this.finishButton = page.locator('[data-test="finish"]');
    this.itemTotal = page.locator('[data-test="subtotal-label"]');
    this.summaryInfo = page.locator('[data-test="payment-info-value"]');
  }

  // Page related methods
  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }

  async getItemTotal(): Promise<string> {
    return (await this.itemTotal.textContent()) ?? '';
  }
}
