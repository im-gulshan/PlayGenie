import { expect } from '@playwright/test';
import config from '../config/saucedemo.config';
import { Given, When, Then } from '../support/steps';
import { sauceDemoData } from '../data/saucedemo.data';

Given('I navigate to the SauceDemo login page', async function () {
  this.logger.info(`Navigating to SauceDemo login page: ${config.baseUrl}`);
  await this.pages.loginPage.navigate(config.baseUrl);
});

When('I log in as {string}', async function (username: string) {
  const password = process.env.SAUCE_PASSWORD;

  if (!password) {
    this.logger.error('Missing SAUCE_PASSWORD in environment variables.');
    throw new Error('Missing SAUCE_PASSWORD in environment variables. Please check your .env file.');
  }

  this.logger.info(`Attempting login with username: ${username}`);
  await this.pages.loginPage.login(username, password);
  this.logger.info('Login submitted.');
});

Then('the SauceDemo dashboard should be visible', async function () {
  this.logger.info('Validating that the Swag Labs dashboard heading is visible...');
  await expect(this.pages.productsPage.dashboardHeading).toBeVisible({ timeout: 5000 });
  this.logger.info('Dashboard is successfully visible.');
});

Then('I should see a locked out error message', async function () {
  this.logger.info('Validating locked out error message...');
  await expect(this.pages.loginPage.errorMessage).toBeVisible({ timeout: 5000 });
  await expect(this.pages.loginPage.errorMessage).toHaveText(sauceDemoData.messages.lockedOutError);
  this.logger.info('Locked out error message validated successfully.');
});
