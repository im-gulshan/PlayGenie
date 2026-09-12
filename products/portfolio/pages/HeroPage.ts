import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';
import { Logger } from '@core/utils/logger';

/**
 * HeroPage encapsulates the #about (hero) section.
 *
 * The hero section contains:
 * - Profile image
 * - Name (in a <strong> inside a <p>)
 * - Role text (SDET-II at S&P Global)
 * - Stats counters: Years Experience, Domains, Innovations
 * - Email and LinkedIn action links
 * - Scroll-down indicator
 */
export class HeroPage extends BasePage {
  readonly heroSection: Locator;
  readonly profileImage: Locator;
  readonly nameBadge: Locator;
  readonly descriptionParagraph: Locator;
  readonly statsContainer: Locator;
  readonly yearsStatValue: Locator;
  readonly domainsStatValue: Locator;
  readonly innovationsStatValue: Locator;
  readonly emailLink: Locator;
  readonly linkedInLink: Locator;
  readonly scrollDownIndicator: Locator;

  constructor(page: Page, logger?: Logger) {
    super(page, logger);

    this.heroSection = page.locator('#about');
    this.profileImage = page.getByRole('img', { name: 'Gulshan Kumar Profile' });
    // Name is in a <strong> inside the description paragraph
    this.nameBadge = page.locator('#about strong').first();
    this.descriptionParagraph = page.locator('#about p').first();
    // Stats: the parent div contains three generic stat boxes
    this.statsContainer = page.locator('#about').getByText('Years Experience').locator('../..');
    this.yearsStatValue = page
      .locator('#about')
      .getByText('Years Experience')
      .locator('..')
      .locator('span');
    this.domainsStatValue = page
      .locator('#about')
      .getByText('Domains')
      .locator('..')
      .locator('span');
    this.innovationsStatValue = page
      .locator('#about')
      .getByText('Innovations')
      .locator('..')
      .locator('span');
    this.emailLink = page.getByRole('link', { name: 'gulshan.sdet@gmail.com' });
    this.linkedInLink = page.getByRole('link', { name: 'LinkedIn Profile' });
    this.scrollDownIndicator = page.getByText('Scroll Down');
  }

  async isHeroVisible(): Promise<boolean> {
    return this.isVisible(this.heroSection);
  }

  async getNameText(): Promise<string> {
    return this.getText(this.nameBadge);
  }

  async getDescriptionText(): Promise<string> {
    return this.getText(this.descriptionParagraph);
  }

  async getYearsExperience(): Promise<string> {
    return this.getText(this.yearsStatValue);
  }

  async getDomains(): Promise<string> {
    return this.getText(this.domainsStatValue);
  }

  async getInnovations(): Promise<string> {
    return this.getText(this.innovationsStatValue);
  }

  async getEmailHref(): Promise<string | null> {
    return this.emailLink.getAttribute('href');
  }

  async getLinkedInHref(): Promise<string | null> {
    return this.linkedInLink.getAttribute('href');
  }

  async isProfileImageVisible(): Promise<boolean> {
    return this.isVisible(this.profileImage);
  }

  async isScrollDownVisible(): Promise<boolean> {
    return this.isVisible(this.scrollDownIndicator);
  }

  async waitForHeroVisible(): Promise<void> {
    await this.waitForVisible(this.heroSection);
  }
}
