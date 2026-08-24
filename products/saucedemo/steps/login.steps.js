const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { PageManager } = require('../pages/PageManager');
const config = require('../config/saucedemo.config');

/** @returns {PageManager} */
const getPages = (world) => {
  if (!world.pages) world.pages = new PageManager(world.page);
  return world.pages;
};

Given('I navigate to the SauceDemo login page', async function () {
  await getPages(this).loginPage.navigate(config.baseUrl);
});

When('I log in with valid credentials', async function () {
  const username = process.env.SAUCE_USERNAME;
  const password = process.env.SAUCE_PASSWORD;

  if (!username || !password) {
    throw new Error('Missing SAUCE_USERNAME or SAUCE_PASSWORD in environment variables. Please check your .env file.');
  }

  await getPages(this).loginPage.login(username, password);
});

Then('the SauceDemo dashboard should be visible', async function () {
  // Validate if Swag Labs text is present after login
  await expect(getPages(this).homePage.dashboardHeading).toBeVisible({ timeout: 5000 });
});
