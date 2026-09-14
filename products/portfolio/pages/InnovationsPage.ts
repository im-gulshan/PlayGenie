import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';
import { Logger } from '@core/utils/logger';

/**
 * InnovationsPage encapsulates the #innovations section.
 *
 * The innovations section shows items in an accordion (expand/collapse).
 * Each item has a title and a description revealed on expansion.
 */
export class InnovationsPage extends BasePage {
  readonly innovationsSection: Locator;
  readonly sectionHeading: Locator;
  readonly sectionSubtitle: Locator;
  readonly accordionItems: Locator;
  readonly firtInnovationExpand: Locator;

  constructor(page: Page, logger?: Logger) {
    super(page, logger);

    this.innovationsSection = page.locator('#innovations');
    this.sectionHeading = page.locator('#innovations h2');
    this.sectionSubtitle = page.locator('#innovations p').first();
    // Each accordion item is a clickable container
    this.accordionItems = page.locator(
      "//span[contains(@class, 'text-sm sm:text-base leading-snug')]",
    );
    this.firtInnovationExpand = page.locator("//div[@class='overflow-hidden']");
  }

  async isSectionVisible(): Promise<boolean> {
    return this.isVisible(this.innovationsSection);
  }

  async getSectionHeading(): Promise<string> {
    return this.getText(this.sectionHeading);
  }

  async getItemCount(): Promise<number> {
    return this.accordionItems.count();
  }

  /**
   * Get the title of the nth innovation accordion item (0-indexed).
   */
  async getItemTitle(index: number): Promise<string> {
    const item = this.accordionItems.nth(index);
    return this.getText(item);
  }

  /**
   * Expand the nth accordion item.
   */
  async expandItem(index: number): Promise<void> {
    this.logger.info(`Expanding innovation item at index: ${index}`);
    await this.safeClick(this.accordionItems.nth(index));
  }

  /**
   * Check if the nth accordion item is expanded.
   * When expanded, a description paragraph appears inside the item.
   */
  async isItemExpanded(index: number): Promise<boolean> {
    const descEl = this.firtInnovationExpand;
    try {
      return await descEl.isVisible();
    } catch {
      return false;
    }
  }

  async waitForSectionVisible(): Promise<void> {
    await this.waitForVisible(this.innovationsSection);
  }
}
