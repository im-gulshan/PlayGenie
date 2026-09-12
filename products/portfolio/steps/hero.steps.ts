import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/steps';
import { portfolioData } from '../data';

Given('I am on the portfolio homepage', async function () {
  this.logger.info('Portfolio homepage is already loaded via Before hook');
  await this.pages.heroPage.waitForHeroVisible();
});

Then('the hero section should be visible', async function () {
  this.logger.info('Verifying hero section is visible');
  const isVisible = await this.pages.heroPage.isHeroVisible();
  expect(isVisible).toBe(true);
});

Then('the name {string} should be displayed', async function (expectedName: string) {
  this.logger.info(`Verifying name: ${expectedName}`);
  const nameText = await this.pages.heroPage.getNameText();
  expect(nameText.trim()).toBe(expectedName);
});

Then('the stats should show {string} years of experience', async function (expected: string) {
  this.logger.info(`Verifying years of experience stat: ${expected}`);
  const years = await this.pages.heroPage.getYearsExperience();
  expect(years.trim()).toContain(expected);
});

Then('the stats should show {string} domains', async function (expected: string) {
  this.logger.info(`Verifying domains stat: ${expected}`);
  const domains = await this.pages.heroPage.getDomains();
  expect(domains.trim()).toContain(expected);
});

Then('the stats should show {string} innovations', async function (expected: string) {
  this.logger.info(`Verifying innovations stat: ${expected}`);
  const innovations = await this.pages.heroPage.getInnovations();
  expect(innovations.trim()).toContain(expected);
});

Then('the profile image should be visible', async function () {
  this.logger.info('Verifying profile image is visible');
  const isVisible = await this.pages.heroPage.isProfileImageVisible();
  expect(isVisible).toBe(true);
});

Then('the email link should point to {string}', async function (expectedEmail: string) {
  this.logger.info(`Verifying email link href: ${expectedEmail}`);
  const href = await this.pages.heroPage.getEmailHref();
  expect(href).toBe(`mailto:${expectedEmail}`);
});

Then('the LinkedIn link should be visible in the hero section', async function () {
  this.logger.info('Verifying LinkedIn link is visible in hero section');
  const href = await this.pages.heroPage.getLinkedInHref();
  expect(href).toBe(portfolioData.hero.linkedInUrl);
});

Then('the page title should be {string}', async function (expectedTitle: string) {
  this.logger.info(`Verifying page title: ${expectedTitle}`);
  const title = await this.pages.heroPage.getPageTitle();
  expect(title).toBe(expectedTitle);
});
