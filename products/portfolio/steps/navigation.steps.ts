import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/steps';
import { portfolioData } from '../data';

When('I click the {string} tab in the section navigation', async function (tabName: string) {
  this.logger.info(`Clicking section tab: ${tabName}`);
  await this.pages.navigationPage.clickTab(tabName);
  this.sharedData.activeTab = tabName;
});

When('I click the {string} link in the header navigation', async function (linkName: string) {
  this.logger.info(`Clicking header nav link: ${linkName}`);
  await this.pages.navigationPage.clickHeaderNavLink(linkName);
});

When('I click the theme toggle button', async function () {
  this.logger.info('Toggling theme');
  await this.pages.navigationPage.toggleTheme();
});

When('I click the scroll to top button', async function () {
  this.logger.info('Clicking scroll to top');
  await this.pages.navigationPage.clickScrollToTop();
});

Then('the sticky tab navigation should be visible', async function () {
  this.logger.info('Verifying sticky tab navigation is visible');
  const isVisible = await this.pages.navigationPage.isStickyTabBarVisible();
  expect(isVisible).toBe(true);
});

Then('the theme toggle button should be visible', async function () {
  this.logger.info('Verifying theme toggle button is visible');
  const isVisible = await this.pages.navigationPage.isThemeToggleVisible();
  expect(isVisible).toBe(true);
});

Then('the scroll to top button should be visible', async function () {
  this.logger.info('Verifying scroll to top button is visible');
  const isVisible = await this.pages.navigationPage.isScrollToTopVisible();
  expect(isVisible).toBe(true);
});

Then('the tab navigation should contain all expected tabs', async function () {
  this.logger.info('Verifying all expected tabs are present in sticky nav');
  const tabNames = await this.pages.navigationPage.getTabNames();
  for (const expectedTab of portfolioData.navigation.tabs) {
    expect(tabNames).toContain(expectedTab);
  }
});

Then('the brand name {string} should appear in the header', async function (expected: string) {
  this.logger.info(`Verifying brand name: ${expected}`);
  const brand = await this.pages.navigationPage.getBrandName();
  expect(brand.trim()).toBe(expected);
});
