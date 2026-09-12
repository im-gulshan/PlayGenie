import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/steps';
import { portfolioData } from '../data';

When('I navigate to the Experience section', async function () {
  this.logger.info('Navigating to Experience section via tab');
  // Experience is the default section — already visible after page load
  // but we click the tab to ensure it is active
  await this.pages.navigationPage.clickTab('Experience');
});

Then('the Experience section should be visible', async function () {
  this.logger.info('Verifying Experience section is visible');
  const isVisible = await this.pages.experiencePage.isSectionVisible();
  expect(isVisible).toBe(true);
});

Then('the Experience section heading should be {string}', async function (expected: string) {
  this.logger.info(`Verifying Experience heading: ${expected}`);
  const heading = await this.pages.experiencePage.getSectionHeading();
  expect(heading.trim()).toBe(expected);
});

Then(
  'the Experience section should show {int} company cards',
  async function (expectedCount: number) {
    this.logger.info(`Verifying ${expectedCount} experience cards are shown`);
    const count = await this.pages.experiencePage.getCompanyCardCount();
    expect(count).toBe(expectedCount);
  },
);

Then('the first company should be {string}', async function (expectedCompany: string) {
  this.logger.info(`Verifying first company: ${expectedCompany}`);
  const company = await this.pages.experiencePage.getCompanyName(0);
  expect(company.trim()).toContain(expectedCompany);
});

Then('the second company should be {string}', async function (expectedCompany: string) {
  this.logger.info(`Verifying second company: ${expectedCompany}`);
  const company = await this.pages.experiencePage.getCompanyName(1);
  expect(company.trim()).toContain(expectedCompany);
});

Then('the third company should be {string}', async function (expectedCompany: string) {
  this.logger.info(`Verifying third company: ${expectedCompany}`);
  const company = await this.pages.experiencePage.getCompanyName(2);
  expect(company.trim()).toContain(expectedCompany);
});

When('I click on the second experience card', async function () {
  this.logger.info('Expanding second experience card');
  await this.pages.experiencePage.toggleCard(1);
});

Then('the second experience card should be expanded', async function () {
  this.logger.info('Verifying second experience card is expanded');
  const isExpanded = await this.pages.experiencePage.isCardExpanded(1);
  expect(isExpanded).toBe(true);
});

Then('all company names from the expected list should be present', async function () {
  this.logger.info('Verifying all expected company names appear');
  const count = await this.pages.experiencePage.getCompanyCardCount();
  expect(count).toBe(portfolioData.experience.companies.length);

  for (let i = 0; i < portfolioData.experience.companies.length; i++) {
    const name = await this.pages.experiencePage.getCompanyName(i);
    expect(name.trim()).toContain(portfolioData.experience.companies[i].name);
  }
});
