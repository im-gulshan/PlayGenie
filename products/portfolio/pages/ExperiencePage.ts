import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';
import { Logger } from '@core/utils/logger';

/**
 * ExperiencePage encapsulates the #experience section.
 *
 * The experience section shows a list of company cards in a timeline.
 * Each card is click-to-expand (accordion style).
 *
 * Key locator strategy:
 * - The section root: #experience
 * - Company name within a card: first element with font-bold/semibold text
 * - The first card (S&P Global) is expanded by default
 * - Clicking a collapsed card header toggles it open
 */
export class ExperiencePage extends BasePage {
  readonly experienceSection: Locator;
  readonly sectionHeading: Locator;
  readonly sectionSubtitle: Locator;
  readonly companyCards: Locator;

  constructor(page: Page, logger?: Logger) {
    super(page, logger);

    this.experienceSection = page.locator('#experience');
    this.sectionHeading = page.locator('#experience h2');
    this.sectionSubtitle = page.locator('#experience p').first();
    // Each company card is a clickable div (cursor-pointer) inside the section
    this.companyCards = page.locator('#experience [class*="cursor-pointer"]');
  }

  async isSectionVisible(): Promise<boolean> {
    return this.isVisible(this.experienceSection);
  }

  async getSectionHeading(): Promise<string> {
    return this.getText(this.sectionHeading);
  }

  async getSectionSubtitle(): Promise<string> {
    return this.getText(this.sectionSubtitle);
  }

  async getCompanyCardCount(): Promise<number> {
    return this.companyCards.count();
  }

  /**
   * Get the company name from the nth card (0-indexed).
   */
  async getCompanyName(index: number): Promise<string> {
    const card = this.companyCards.nth(index);
    // Company name is in the first child div of the card header
    const companyNameEl = card.locator('div').first();
    return this.getText(companyNameEl);
  }

  /**
   * Get the role/title from the nth card (0-indexed).
   */
  async getCompanyRole(index: number): Promise<string> {
    const card = this.companyCards.nth(index);
    const roleEl = card.locator('p').first();
    return this.getText(roleEl);
  }

  /**
   * Click the nth card header to expand/collapse it.
   */
  async toggleCard(index: number): Promise<void> {
    this.logger.info(`Toggling experience card at index: ${index}`);
    await this.safeClick(this.companyCards.nth(index));
  }

  /**
   * Check if the nth card is expanded by looking for a list of bullet points.
   * The experience section renders card groups as sibling divs inside the wrapper.
   * When expanded, the adjacent sibling contains a <ul> list.
   */
  async isCardExpanded(index: number): Promise<boolean> {
    try {
      // Each experience entry is a pair: the clickable header div + a sibling <ul>
      // The list is a sibling of the card in the parent wrapper
      const list = this.experienceSection.locator('ul').nth(index);
      return await list.isVisible();
    } catch {
      return false;
    }
  }

  async waitForSectionVisible(): Promise<void> {
    await this.waitForVisible(this.experienceSection);
  }
}
