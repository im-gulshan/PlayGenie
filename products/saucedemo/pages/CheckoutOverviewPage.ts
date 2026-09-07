import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';

export class CheckoutOverviewPage extends BasePage {
  readonly finishButton: Locator;
  readonly itemTotal: Locator;
  readonly summaryInfo: Locator;
  readonly productNames: Locator;
  constructor(page: Page) {
    super(page);

    // Locators
    this.finishButton = page.getByRole('button', { name: 'finish' });
    this.itemTotal = page.locator('[data-test="subtotal-label"]');
    this.summaryInfo = page.locator('[data-test="payment-info-value"]');
    this.productNames = page.locator('.inventory_item_name');
  }

  async clickFinish(): Promise<void> {
    await this.safeClick(this.finishButton);
  }

  async getItemTotal(): Promise<string> {
    return this.getText(this.itemTotal);
  }

  async getAllProductNames(): Promise<string[]> {
    return this.getTexts(this.productNames);
  }
}
