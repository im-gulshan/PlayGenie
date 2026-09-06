import { Locator } from '@playwright/test';

/**
 * Abstract base class for reusable UI components.
 *
 * Components represent shared UI fragments (headers, modals, cards,
 * date pickers, tables) that appear across multiple page objects
 * within the same product.
 *
 * Each component is scoped to a root Locator, ensuring interactions
 * are isolated to that specific DOM subtree.
 *
 * @example
 * ```typescript
 * export class ProductCard extends BaseComponent {
 *   get name(): Locator {
 *     return this.root.locator('.inventory_item_name');
 *   }
 *
 *   async getName(): Promise<string> {
 *     return (await this.name.textContent()) ?? '';
 *   }
 * }
 *
 * // Usage in a Page Object:
 * export class ProductsPage extends BasePage {
 *   readonly productCards: ProductCard;
 *
 *   constructor(page: Page) {
 *     super(page);
 *     this.productCards = new ProductCard(page.locator('.inventory_item'));
 *   }
 * }
 * ```
 */
export abstract class BaseComponent {
  constructor(protected readonly root: Locator) {}

  /** Check if the component root element is visible. */
  async isVisible(): Promise<boolean> {
    try {
      return await this.root.first().isVisible();
    } catch {
      return false;
    }
  }

  /** Wait for the component root element to be attached to the DOM. */
  async waitForReady(): Promise<void> {
    await this.root.first().waitFor({ state: 'attached' });
  }

  /** Get the count of matching component instances on the page. */
  async count(): Promise<number> {
    return this.root.count();
  }
}
