import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';

export class ProductsPage extends BasePage {
  readonly dashboardHeading: Locator;
  readonly addToCart: Locator;
  readonly clickOnCart: Locator;
  readonly productName: Locator;

  constructor(page: Page) {
    super(page);

    // Locators strictly encapsulated within the Page Object
    this.dashboardHeading = page.getByText('Swag Labs');
    this.addToCart = page.getByRole('button', { name: 'Add to cart' });
    this.clickOnCart = page.locator('[data-test="shopping-cart-link"]');
    this.productName = page.locator('.inventory_item_name');
  }

  async selectFirstProduct(): Promise<void> {
    await this.addToCart.nth(0).click();
  }

  async openCart(): Promise<void> {
    await this.clickOnCart.click();
  }

  async getFirstProductName(): Promise<string | null> {
    const prod = await this.productName.nth(0).textContent();
    return prod;
  }
}
