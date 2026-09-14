import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';
import { Logger } from '@core/utils/logger';

/**
 * ProjectsPage encapsulates the #projects section.
 *
 * Each project card shows:
 * - Project name / title
 * - Description
 * - Technology tags
 * - GitHub link
 */
export class ProjectsPage extends BasePage {
  readonly projectsSection: Locator;
  readonly sectionHeading: Locator;
  readonly sectionSubtitle: Locator;
  readonly projectCards: Locator;
  readonly githubLinks: Locator;

  constructor(page: Page, logger?: Logger) {
    super(page, logger);

    this.projectsSection = page.locator('#projects');
    this.sectionHeading = page.locator('#projects h2');
    this.sectionSubtitle = page.locator('#projects p').first();
    // Each project card is a group/article element inside the grid
    this.projectCards = page.locator('#projects [class*="group"]');
    // GitHub links within the section
    this.githubLinks = page.locator('#projects a[href*="github.com"]');
  }

  async isSectionVisible(): Promise<boolean> {
    return this.isVisible(this.projectsSection);
  }

  async getSectionHeading(): Promise<string> {
    return this.getText(this.sectionHeading);
  }

  async getProjectCardCount(): Promise<number> {
    return this.projectCards.count();
  }

  /**
   * Get the heading text of the nth project card (0-indexed).
   */
  async getProjectName(index: number): Promise<string> {
    const card = this.projectCards.nth(index);
    const heading = card.locator('h3').first();
    return this.getText(heading);
  }

  /**
   * Get the GitHub link href of the nth project card (0-indexed).
   */
  async getProjectGitHubHref(index: number): Promise<string | null> {
    return this.githubLinks.nth(index).getAttribute('href');
  }

  async getGitHubLinkCount(): Promise<number> {
    return this.githubLinks.count();
  }

  async waitForSectionVisible(): Promise<void> {
    await this.waitForVisible(this.projectsSection);
  }
}
