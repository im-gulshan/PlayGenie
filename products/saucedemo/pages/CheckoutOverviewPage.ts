import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';
import { ProductCard } from '../components/ProductCard';

export class CheckoutOverviewPage extends BasePage {
  readonly finishButton: Locator;
  readonly itemTotal: Locator;
  readonly summaryInfo: Locator;
  readonly productCard: ProductCard;

  constructor(page: Page) {
    super(page);

    // Locators
    this.finishButton = page.getByRole('button', { name: 'finish' });
    this.itemTotal = page.locator('[data-test="subtotal-label"]');
    this.summaryInfo = page.locator('[data-test="payment-info-value"]');

    // Compose the reusable ProductCard component
    this.productCard = new ProductCard(page.locator('.cart_item'));
  }

  async clickFinish(): Promise<void> {
    await this.safeClick(this.finishButton);
  }

  async getItemTotal(): Promise<string> {
    return (await this.itemTotal.textContent()) ?? '';
  }

  async getAllProductNames(): Promise<string[]> {
    return this.productCard.getAllNames();
  }
}
