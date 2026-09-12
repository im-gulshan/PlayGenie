import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';
import { Logger } from '@core/utils/logger';

/**
 * EducationPage encapsulates the #education section.
 *
 * The education section shows academic history cards with:
 * - Institution name
 * - Degree / qualification
 * - Year range
 */
export class EducationPage extends BasePage {
  readonly educationSection: Locator;
  readonly sectionHeading: Locator;
  readonly sectionSubtitle: Locator;
  readonly educationCards: Locator;

  constructor(page: Page, logger?: Logger) {
    super(page, logger);

    this.educationSection = page.locator('#education');
    this.sectionHeading = page.locator('#education h2');
    this.sectionSubtitle = page.locator('#education p').first();
    // Cards are direct group/article children inside the grid
    this.educationCards = page.locator('#education [class*="group"]');
  }

  async isSectionVisible(): Promise<boolean> {
    return this.isVisible(this.educationSection);
  }

  async getSectionHeading(): Promise<string> {
    return this.getText(this.sectionHeading);
  }

  async getCardCount(): Promise<number> {
    return this.educationCards.count();
  }

  /**
   * Get the institution name from the nth education card (0-indexed).
   */
  async getInstitutionName(index: number): Promise<string> {
    const card = this.educationCards.nth(index);
    const name = card.locator('h3').first();
    return this.getText(name);
  }

  /**
   * Get the degree text from the nth education card (0-indexed).
   */
  async getDegree(index: number): Promise<string> {
    const card = this.educationCards.nth(index);
    const degree = card.locator('p').first();
    return this.getText(degree);
  }

  async waitForSectionVisible(): Promise<void> {
    await this.waitForVisible(this.educationSection);
  }
}
