import { Locator } from '@playwright/test';
import { BaseComponent } from '@core/pages/BaseComponent';

/**
 * Represents a product card in the SauceDemo inventory.
 *
 * Extracts the shared `.inventory_item_name` locator pattern that was
 * previously duplicated across ProductsPage and CheckoutOverviewPage.
 *
 * @example
 * ```typescript
 * // In a Page Object:
 * this.productCard = new ProductCard(page.locator('.inventory_item'));
 *
 * // In a step definition:
 * const name = await this.pages.productsPage.productCard.getFirstName();
 * ```
 */
export class ProductCard extends BaseComponent {
  /** Locator for product name within this card's scope. */
  get name(): Locator {
    return this.root.locator('.inventory_item_name');
  }

  /** Get the name of the first product card. */
  async getFirstName(): Promise<string> {
    return (await this.name.first().textContent()) ?? '';
  }

  /** Get names of all product cards. */
  async getAllNames(): Promise<string[]> {
    return this.name.allTextContents();
  }
}
