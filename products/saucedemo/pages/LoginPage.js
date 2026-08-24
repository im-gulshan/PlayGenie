class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators strictly encapsulated within the Page Object
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
  }

  async navigate(url) {
    await this.page.goto(url);
  }

  async login(username, password) {
    // Relying on Playwright's auto-waiting instead of arbitrary timeouts
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
