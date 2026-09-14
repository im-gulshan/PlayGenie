import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';
import { Logger } from '@core/utils/logger';

/**
 * SkillsPage encapsulates the #skills section.
 *
 * Layout:
 * - The section has a heading "Skills" and a subtitle.
 * - On desktop: category filter buttons (Programming Languages, Automation Testing, etc.)
 *   are shown as pill-shaped buttons in a flex row (hidden md:flex).
 * - On mobile: a dropdown selector is used instead.
 * - The active category button has a different visual style (blue background + scale-105).
 * - Skill tags (technologies) are rendered as a list after selecting a category.
 */
export class SkillsPage extends BasePage {
  readonly skillsSection: Locator;
  readonly sectionHeading: Locator;
  readonly sectionSubtitle: Locator;
  readonly desktopCategoryButtons: Locator;
  readonly skillTagsContainer: Locator;
  readonly skillTags: Locator;

  constructor(page: Page, logger?: Logger) {
    super(page, logger);

    this.skillsSection = page.locator('#skills');
    this.sectionHeading = page.locator('#skills h2');
    this.sectionSubtitle = page.locator('#skills p').first();
    // Desktop pill category buttons — the hidden md:flex container
    this.desktopCategoryButtons = page.locator('#skills .hidden.md\\:flex button');
    // Skill tags container (rendered items after category is selected)
    this.skillTagsContainer = page.locator('#skills div.flex-1');
    // Individual skill tags
    this.skillTags = this.skillTagsContainer.locator('span');
  }

  async isSectionVisible(): Promise<boolean> {
    return this.isVisible(this.skillsSection);
  }

  async getSectionHeading(): Promise<string> {
    return this.getText(this.sectionHeading);
  }

  async getCategoryNames(): Promise<string[]> {
    return this.getTexts(this.desktopCategoryButtons);
  }

  async getCategoryCount(): Promise<number> {
    return this.desktopCategoryButtons.count();
  }

  /**
   * Click a skill category button by its exact name.
   * @param categoryName - e.g. 'Automation Testing'
   */
  async clickCategory(categoryName: string): Promise<void> {
    this.logger.info(`Clicking skill category: ${categoryName}`);
    const btn = this.desktopCategoryButtons.filter({ hasText: categoryName }).first();
    await this.safeClick(btn);
  }

  async getSkillTagTexts(): Promise<string[]> {
    return this.getTexts(this.skillTags);
  }

  async getSkillTagCount(): Promise<number> {
    return this.skillTags.count();
  }

  async waitForSectionVisible(): Promise<void> {
    await this.waitForVisible(this.skillsSection);
  }
}
