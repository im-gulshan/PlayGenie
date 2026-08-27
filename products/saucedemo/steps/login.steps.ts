import { expect } from '@playwright/test';
import config from '../config/saucedemo.config';
import { Given, When, Then } from '@cucumber/cucumber';

Given('I navigate to the SauceDemo login page', async function () {
  await this.pages.loginPage.navigate(config.baseUrl);
});

When('I log in with valid credentials', async function () {
  const username = process.env.SAUCE_USERNAME;
  const password = process.env.SAUCE_PASSWORD;

  if (!username || !password) {
    throw new Error('Missing SAUCE_USERNAME or SAUCE_PASSWORD in environment variables. Please check your .env file.');
  }

  await this.pages.loginPage.login(username, password);
});

Then('the SauceDemo dashboard should be visible', async function () {
  // Validate if Swag Labs text is present after login
  await expect(this.pages.productsPage.dashboardHeading).toBeVisible({ timeout: 5000 });
});
