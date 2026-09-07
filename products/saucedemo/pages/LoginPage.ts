import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Locators strictly encapsulated within the Page Object
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async navigate(url: string): Promise<void> {
    await this.navigateTo(url);
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillAndVerify(this.usernameInput, username);
    await this.fillAndVerify(this.passwordInput, password);
    await this.safeClick(this.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }

  async waitForErrorMessage(): Promise<void> {
    await this.waitForVisible(this.errorMessage, 5000);
  }
}
