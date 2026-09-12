import { Page } from '@playwright/test';
import { Logger } from '@core/utils/logger';
import { LoginPage } from './LoginPage';
import { ProductsPage } from './ProductsPage';
import { CartPage } from './CartPage';
import { CheckoutInfoPage } from './CheckoutInfoPage';
import { CheckoutOverviewPage } from './CheckoutOverviewPage';
import { CheckoutCompletePage } from './CheckoutCompletePage';

/**
 * PageManager provides centralized access to all SauceDemo page objects.
 *
 * Instantiated once per scenario via the product-level Before hook.
 * All step files access pages via `this.pages.<pageName>` — no helper function needed.
 *
 * When adding a new page:
 * 1. Create the page class extending BasePage
 * 2. Import and register it here
 */
export class PageManager {
  readonly loginPage: LoginPage;
  readonly productsPage: ProductsPage;
  readonly cartPage: CartPage;
  readonly checkoutInfoPage: CheckoutInfoPage;
  readonly checkoutOverviewPage: CheckoutOverviewPage;
  readonly checkoutCompletePage: CheckoutCompletePage;

  constructor(
    public readonly page: Page,
    private readonly logger: Logger,
  ) {
    this.loginPage = new LoginPage(this.page, this.logger);
    this.productsPage = new ProductsPage(this.page, this.logger);
    this.cartPage = new CartPage(this.page, this.logger);
    this.checkoutInfoPage = new CheckoutInfoPage(this.page, this.logger);
    this.checkoutOverviewPage = new CheckoutOverviewPage(this.page, this.logger);
    this.checkoutCompletePage = new CheckoutCompletePage(this.page, this.logger);
  }
}
