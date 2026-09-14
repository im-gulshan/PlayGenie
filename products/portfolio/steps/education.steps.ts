import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/steps';
import { portfolioData } from '../data';

When('I navigate to the Education section', async function () {
  this.logger.info('Navigating to Education section via tab');
  await this.pages.navigationPage.clickTab('Education');
  await this.pages.educationPage.waitForSectionVisible();
});

Then('the Education section should be visible', async function () {
  this.logger.info('Verifying Education section is visible');
  await this.pages.educationPage.waitForSectionVisible();
});

Then('the Education section heading should be {string}', async function (expected: string) {
  this.logger.info(`Verifying Education heading: ${expected}`);
  const heading = await this.pages.educationPage.getSectionHeading();
  expect(heading.trim()).toBe(expected);
});

Then('the education section should display {int} cards', async function (expectedCount: number) {
  this.logger.info(`Verifying ${expectedCount} education cards`);
  const count = await this.pages.educationPage.getCardCount();
  expect(count).toBe(expectedCount);
});

Then('the first institution should be {string}', async function (expectedName: string) {
  this.logger.info(`Verifying first institution: ${expectedName}`);
  const name = await this.pages.educationPage.getInstitutionName(0);
  expect(name.trim()).toContain(expectedName);
});

Then('all expected institution names should be present', async function () {
  this.logger.info('Verifying all expected institution names are present');
  const count = await this.pages.educationPage.getCardCount();
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    names.push(await this.pages.educationPage.getInstitutionName(i));
  }
  for (const expected of portfolioData.education.institutions) {
    expect(names.some((n) => n.includes(expected.split(',')[0]))).toBe(true);
  }
});
