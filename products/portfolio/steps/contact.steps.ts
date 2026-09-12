import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/steps';
import { portfolioData } from '../data';

When('I navigate to the Contact section', async function () {
  this.logger.info('Navigating to Contact section via tab');
  await this.pages.navigationPage.clickTab('Contact');
  await this.pages.contactPage.waitForSectionVisible();
});

When('I click the Telegram contact card', async function () {
  this.logger.info('Clicking the Telegram contact card');
  await this.pages.contactPage.clickTelegramCard();
});

When('I click the Back to Contact button', async function () {
  this.logger.info('Clicking Back to Contact button');
  await this.pages.contactPage.clickBackToContact();
});

Then('the Contact section should be visible', async function () {
  this.logger.info('Verifying Contact section is visible');
  const isVisible = await this.pages.contactPage.isSectionVisible();
  expect(isVisible).toBe(true);
});

Then('the Contact section heading should be {string}', async function (expected: string) {
  this.logger.info(`Verifying Contact heading: ${expected}`);
  const heading = await this.pages.contactPage.getSectionHeading();
  expect(heading.trim()).toContain(expected);
});

Then('the availability status badge should be visible', async function () {
  this.logger.info('Verifying availability status badge is visible');
  const isVisible = await this.pages.contactPage.isStatusBadgeVisible();
  expect(isVisible).toBe(true);
});

Then('the email contact card should be visible', async function () {
  this.logger.info('Verifying email contact card is visible');
  const isVisible = await this.pages.contactPage.isEmailCardVisible();
  expect(isVisible).toBe(true);
});

Then('the email contact link should point to {string}', async function (expectedEmail: string) {
  this.logger.info(`Verifying email contact link: ${expectedEmail}`);
  const href = await this.pages.contactPage.getEmailHref();
  expect(href).toBe(`mailto:${expectedEmail}`);
});

Then('the LinkedIn contact card should link to the correct profile', async function () {
  this.logger.info('Verifying LinkedIn contact card link');
  const href = await this.pages.contactPage.getLinkedInHref();
  expect(href).toContain('linkedin.com');
});

Then('the GitHub contact card should link to the correct profile', async function () {
  this.logger.info('Verifying GitHub contact card link');
  const href = await this.pages.contactPage.getGitHubHref();
  expect(href).toContain('github.com');
});

Then('the footer LinkedIn link should be correct', async function () {
  this.logger.info('Verifying footer LinkedIn link');
  const href = await this.pages.contactPage.getFooterLinkedInHref();
  expect(href).toBe(portfolioData.contact.linkedInUrl);
});

Then('the footer GitHub link should be correct', async function () {
  this.logger.info('Verifying footer GitHub link');
  const href = await this.pages.contactPage.getFooterGitHubHref();
  expect(href).toBe(portfolioData.contact.githubUrl);
});

Then('the copyright text should contain {string}', async function (expectedText: string) {
  this.logger.info(`Verifying copyright text contains: ${expectedText}`);
  const copyright = await this.pages.contactPage.getCopyrightText();
  expect(copyright).toContain(expectedText);
});
