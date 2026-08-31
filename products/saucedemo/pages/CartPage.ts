import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';

export class CartPage extends BasePage {
  readonly checkout: Locator;

  constructor(page: Page) {
    super(page);

    // Locators
    this.checkout = page.getByRole('button', { name: 'Checkout' });
  }

  // Methods
  async clickOnCheckout(): Promise<void> {
    await this.checkout.click();
  }
}
