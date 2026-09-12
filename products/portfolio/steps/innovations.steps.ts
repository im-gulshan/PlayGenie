import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/steps';
import { portfolioData } from '../data';

When('I navigate to the Innovations section', async function () {
  this.logger.info('Navigating to Innovations section via tab');
  await this.pages.navigationPage.clickTab('Innovations');
  await this.pages.innovationsPage.waitForSectionVisible();
});

When('I expand the first innovation item', async function () {
  this.logger.info('Expanding the first innovation item');
  await this.pages.innovationsPage.expandItem(0);
});

Then('the Innovations section should be visible', async function () {
  this.logger.info('Verifying Innovations section is visible');
  const isVisible = await this.pages.innovationsPage.isSectionVisible();
  expect(isVisible).toBe(true);
});

Then('the Innovations section heading should be {string}', async function (expected: string) {
  this.logger.info(`Verifying Innovations heading: ${expected}`);
  const heading = await this.pages.innovationsPage.getSectionHeading();
  expect(heading.trim()).toBe(expected);
});

Then('the innovations section should show at least {int} items', async function (minCount: number) {
  this.logger.info(`Verifying at least ${minCount} innovation items`);
  const count = await this.pages.innovationsPage.getItemCount();
  expect(count).toBeGreaterThanOrEqual(minCount);
});

Then('the first innovation item should be expanded', async function () {
  this.logger.info('Verifying first innovation item is expanded');
  const isExpanded = await this.pages.innovationsPage.isItemExpanded(0);
  expect(isExpanded).toBe(true);
});

Then('the innovation titles should include {string}', async function (expectedTitle: string) {
  this.logger.info(`Verifying innovation title includes: ${expectedTitle}`);
  const count = await this.pages.innovationsPage.getItemCount();
  const titles: string[] = [];
  for (let i = 0; i < count; i++) {
    titles.push(await this.pages.innovationsPage.getItemTitle(i));
  }
  expect(titles.some((t) => t.includes(expectedTitle))).toBe(true);
});

Then('all expected innovation titles should be present', async function () {
  this.logger.info('Verifying all expected innovation titles are present');
  const count = await this.pages.innovationsPage.getItemCount();
  const titles: string[] = [];
  for (let i = 0; i < count; i++) {
    titles.push(await this.pages.innovationsPage.getItemTitle(i));
  }
  for (const expected of portfolioData.innovations.items) {
    expect(titles.some((t) => t.includes(expected))).toBe(true);
  }
});
