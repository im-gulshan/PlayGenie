import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';

export class CheckoutInfoPage extends BasePage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly zipCode: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);

    // Locators
    this.firstName = page.getByRole('textbox', { name: 'First Name' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name' });
    this.zipCode = page.getByRole('textbox', { name: 'Zip/Postal Code' });
    this.continueButton = page.locator('[data-test="continue"]');
  }

  // Page related methods
  async addCheckoutInfo(fName: string, lName: string, zCode: string): Promise<void> {
    await this.firstName.fill(fName);
    await this.lastName.fill(lName);
    await this.zipCode.fill(zCode);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }
}
