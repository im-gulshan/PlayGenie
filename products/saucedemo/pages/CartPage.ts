import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';
import { Logger } from '@core/utils/logger';

export class CartPage extends BasePage {
  readonly checkout: Locator;

  constructor(page: Page, logger?: Logger) {
    super(page, logger);

    // Locators
    this.checkout = page.getByRole('button', { name: 'Checkout' });
  }

  // Methods
  async clickOnCheckout(): Promise<void> {
    await this.safeClick(this.checkout);
  }
}
