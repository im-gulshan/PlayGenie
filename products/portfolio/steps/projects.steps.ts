import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/steps';

When('I navigate to the Projects section', async function () {
  this.logger.info('Navigating to Projects section via tab');
  await this.pages.navigationPage.clickTab('Projects');
  await this.pages.projectsPage.waitForSectionVisible();
});

Then('the Projects section should be visible', async function () {
  this.logger.info('Verifying Projects section is visible');
  await this.pages.projectsPage.waitForSectionVisible();
});

Then('the Projects section heading should be {string}', async function (expected: string) {
  this.logger.info(`Verifying Projects heading: ${expected}`);
  const heading = await this.pages.projectsPage.getSectionHeading();
  expect(heading.trim()).toBe(expected);
});

Then('the projects section should display at least one project card', async function () {
  this.logger.info('Verifying at least one project card is displayed');
  const count = await this.pages.projectsPage.getProjectCardCount();
  expect(count).toBeGreaterThan(0);
});

Then('each project card should have a GitHub link', async function () {
  this.logger.info('Verifying every project card has a GitHub link');
  const cardCount = await this.pages.projectsPage.getProjectCardCount();
  const linkCount = await this.pages.projectsPage.getGitHubLinkCount();
  expect(linkCount).toBe(cardCount);
});

Then('the first project should have a GitHub link pointing to github.com', async function () {
  this.logger.info('Verifying first project GitHub link is valid');
  const href = await this.pages.projectsPage.getProjectGitHubHref(0);
  expect(href).toContain('github.com');
});
