import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/steps';
import { portfolioData } from '../data';

When('I navigate to the Skills section', async function () {
  this.logger.info('Navigating to Skills section via tab');
  await this.pages.navigationPage.clickTab('Skills');
  await this.pages.skillsPage.waitForSectionVisible();
});

When('I click the {string} skills category', async function (categoryName: string) {
  this.logger.info(`Clicking skills category: ${categoryName}`);
  await this.pages.skillsPage.clickCategory(categoryName);
  this.sharedData.activeSkillCategory = categoryName;
});

Then('the Skills section should be visible', async function () {
  this.logger.info('Verifying Skills section is visible');
  const isVisible = await this.pages.skillsPage.isSectionVisible();
  expect(isVisible).toBe(true);
});

Then('the Skills section heading should be {string}', async function (expected: string) {
  this.logger.info(`Verifying Skills heading: ${expected}`);
  const heading = await this.pages.skillsPage.getSectionHeading();
  expect(heading.trim()).toBe(expected);
});

Then('the skills category tabs should contain all expected categories', async function () {
  this.logger.info('Verifying all expected skill category tabs are present');
  const categories = await this.pages.skillsPage.getCategoryNames();
  for (const expected of portfolioData.skills.categories) {
    expect(categories.some((c) => c.includes(expected))).toBe(true);
  }
});

Then('there should be {int} skill category tabs', async function (expectedCount: number) {
  this.logger.info(`Verifying ${expectedCount} skill category tabs`);
  const count = await this.pages.skillsPage.getCategoryCount();
  expect(count).toBe(expectedCount);
});

Then('the skill tags should be displayed', async function () {
  this.logger.info('Verifying skill tags are displayed');
  const count = await this.pages.skillsPage.getSkillTagCount();
  expect(count).toBeGreaterThan(0);
});

Then('the skill tags should include {string}', async function (expectedSkill: string) {
  this.logger.info(`Verifying skill tag includes: ${expectedSkill}`);
  const tags = await this.pages.skillsPage.getSkillTagTexts();
  expect(tags.some((t) => t.includes(expectedSkill))).toBe(true);
});
