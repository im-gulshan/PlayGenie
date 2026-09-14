import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';
import { Logger } from '@core/utils/logger';

/**
 * ContactPage encapsulates the #contact section and footer.
 *
 * The contact section contains:
 * - A status badge ("Available for Opportunities")
 * - Heading and location info
 * - Social/contact cards: Email, LinkedIn, GitHub, Telegram
 * - The Telegram card performs a CSS flip animation revealing a QR code
 * - A "Back to Contact" button resets the Telegram card flip
 * - Footer links (LinkedIn, GitHub, Email) and copyright text
 */
export class ContactPage extends BasePage {
  readonly contactSection: Locator;
  readonly sectionHeading: Locator;
  readonly statusBadge: Locator;
  readonly emailCard: Locator;
  readonly linkedInCard: Locator;
  readonly githubCard: Locator;
  readonly telegramCard: Locator;
  readonly telegramQRBack: Locator;
  readonly backToContactButton: Locator;
  readonly footerLinkedIn: Locator;
  readonly footerGitHub: Locator;
  readonly footerEmail: Locator;
  readonly copyrightText: Locator;

  constructor(page: Page, logger?: Logger) {
    super(page, logger);

    this.contactSection = page.locator('#contact');
    this.sectionHeading = page.locator('#contact h2');
    this.statusBadge = page.locator('#contact');
    // Social contact cards — identified by their link hrefs or aria labels
    this.emailCard = page.locator('#contact a[href^="mailto"]').first();
    this.linkedInCard = page.locator('#contact a[href*="linkedin.com"]').first();
    this.githubCard = page.locator('#contact a[href*="github.com"]').first();
    // Telegram card is clickable but may not be an <a> tag — it's a div/button
    this.telegramCard = page.locator('#contact').getByText('Telegram').first();
    // After Telegram flip: QR section is on the "back" face
    this.telegramQRBack = page.locator('#contact [class*="rotate"]');
    this.backToContactButton = page.locator('#contact').getByText('Back to Contact');
    // Footer
    this.footerLinkedIn = page.locator('footer').getByRole('link', { name: 'LinkedIn' });
    this.footerGitHub = page.locator('footer').getByRole('link', { name: 'GitHub' });
    this.footerEmail = page.locator('footer').getByRole('link', { name: 'Email' });
    this.copyrightText = page.locator('footer p');
  }

  async isSectionVisible(): Promise<boolean> {
    return this.isVisible(this.contactSection);
  }

  async getSectionHeading(): Promise<string> {
    return this.getText(this.sectionHeading);
  }

  async getEmailHref(): Promise<string | null> {
    return this.emailCard.getAttribute('href');
  }

  async getLinkedInHref(): Promise<string | null> {
    return this.linkedInCard.getAttribute('href');
  }

  async getGitHubHref(): Promise<string | null> {
    return this.githubCard.getAttribute('href');
  }

  async clickTelegramCard(): Promise<void> {
    this.logger.info('Clicking Telegram card to trigger QR flip');
    await this.safeClick(this.telegramCard);
  }

  async clickBackToContact(): Promise<void> {
    this.logger.info('Clicking Back to Contact button');
    await this.safeClick(this.backToContactButton);
  }

  async isStatusBadgeVisible(): Promise<boolean> {
    return this.isVisible(this.statusBadge);
  }

  async isEmailCardVisible(): Promise<boolean> {
    return this.isVisible(this.emailCard);
  }

  async isLinkedInCardVisible(): Promise<boolean> {
    return this.isVisible(this.linkedInCard);
  }

  async isGitHubCardVisible(): Promise<boolean> {
    return this.isVisible(this.githubCard);
  }

  async getCopyrightText(): Promise<string> {
    return this.getText(this.copyrightText);
  }

  async getFooterLinkedInHref(): Promise<string | null> {
    return this.footerLinkedIn.getAttribute('href');
  }

  async getFooterGitHubHref(): Promise<string | null> {
    return this.footerGitHub.getAttribute('href');
  }

  async waitForSectionVisible(): Promise<void> {
    await this.waitForVisible(this.contactSection);
  }
}
