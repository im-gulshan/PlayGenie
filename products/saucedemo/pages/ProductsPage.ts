import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';
import { Logger } from '@core/utils/logger';

export class ProductsPage extends BasePage {
  readonly dashboardHeading: Locator;
  readonly addToCart: Locator;
  readonly clickOnCart: Locator;
  readonly productName: Locator;
  constructor(page: Page, logger?: Logger) {
    super(page, logger);

    // Locators strictly encapsulated within the Page Object
    this.dashboardHeading = page.getByText('Swag Labs');
    this.addToCart = page.getByRole('button', { name: 'Add to cart' });
    this.clickOnCart = page.locator('[data-test="shopping-cart-link"]');
    this.productName = page.locator('.inventory_item_name');
  }

  async selectFirstProduct(): Promise<string> {
    const name = await this.getText(this.productName.first());
    await this.safeClick(this.addToCart.first());
    return name;
  }

  async openCart(): Promise<void> {
    await this.safeClick(this.clickOnCart);
  }

  async isDashboardVisible(): Promise<boolean> {
    return this.isVisible(this.dashboardHeading);
  }

  async waitForDashboard(): Promise<void> {
    await this.waitForVisible(this.dashboardHeading, 5000);
  }

  async selectMultipleProduct(n: number): Promise<string[]> {
    const names: string[] = [];

    for (let i = 0; i < n; i++) {
      // productName indices are stable (names never re-order in the DOM).
      // addToCart.first() always targets the first remaining "Add to cart" button
      // since each click converts that button to "Remove", re-indexing the rest.
      const name = await this.getText(this.productName.nth(i));
      await this.safeClick(this.addToCart.first());
      names.push(name);
    }

    return names;
  }
}
