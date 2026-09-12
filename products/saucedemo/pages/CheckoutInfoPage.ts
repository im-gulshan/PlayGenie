import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';
import { Logger } from '@core/utils/logger';

export class CheckoutInfoPage extends BasePage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly zipCode: Locator;
  readonly continueButton: Locator;

  constructor(page: Page, logger?: Logger) {
    super(page, logger);

    // Locators
    this.firstName = page.getByRole('textbox', { name: 'First Name' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name' });
    this.zipCode = page.getByRole('textbox', { name: 'Zip/Postal Code' });
    this.continueButton = page.locator('[data-test="continue"]');
  }

  async addCheckoutInfo(fName: string, lName: string, zCode: string): Promise<void> {
    await this.fillAndVerify(this.firstName, fName);
    await this.fillAndVerify(this.lastName, lName);
    await this.fillAndVerify(this.zipCode, zCode);
  }

  async clickContinue(): Promise<void> {
    await this.safeClick(this.continueButton);
  }
}
