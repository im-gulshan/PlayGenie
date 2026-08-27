import { Page } from '@playwright/test';
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

  constructor(public readonly page: Page) {
    this.loginPage = new LoginPage(this.page);
    this.productsPage = new ProductsPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.checkoutInfoPage = new CheckoutInfoPage(this.page);
    this.checkoutOverviewPage = new CheckoutOverviewPage(this.page);
    this.checkoutCompletePage = new CheckoutCompletePage(this.page);
  }
}
