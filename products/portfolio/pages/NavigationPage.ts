import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';
import { Logger } from '@core/utils/logger';

/**
 * NavigationPage handles the top header nav and bottom sticky tab navigation.
 *
 * The site uses two navigation systems:
 * 1. Header nav (visible on desktop): buttons inside the <header> element.
 * 2. Tab navigation (sticky bar below hero): buttons inside #sections-container.
 *
 * This page object exposes a unified navigate() for initial URL loading and
 * clickTab() to switch between sections via the sticky tab bar.
 */
export class NavigationPage extends BasePage {
  readonly headerNav: Locator;
  readonly stickyTabBar: Locator;
  readonly themeToggleButton: Locator;
  readonly scrollToTopButton: Locator;
  readonly brandHeading: Locator;

  constructor(page: Page, logger?: Logger) {
    super(page, logger);

    this.headerNav = page.locator('header nav');
    this.stickyTabBar = page.locator('#sections-container');
    this.themeToggleButton = page.getByRole('button', { name: 'Toggle theme' });
    this.scrollToTopButton = page.getByRole('button', { name: 'Scroll to top' });
    this.brandHeading = page.locator('header').getByRole('heading', { level: 1 });
  }

  async navigate(url: string): Promise<void> {
    await this.navigateTo(url);
  }

  /**
   * Click a tab in the sticky navigation bar to switch the active section.
   * @param tabName - e.g. 'Skills', 'Projects', 'Experience'
   */
  async clickTab(tabName: string): Promise<void> {
    this.logger.info(`Clicking tab: ${tabName}`);
    const tab = this.stickyTabBar.getByRole('button', { name: tabName, exact: true });
    await this.safeClick(tab);
  }

  /**
   * Click a nav link in the header (desktop nav).
   * @param linkName - e.g. 'Experience', 'Skills'
   */
  async clickHeaderNavLink(linkName: string): Promise<void> {
    this.logger.info(`Clicking header nav link: ${linkName}`);
    const link = this.headerNav.getByRole('button', { name: linkName, exact: true });
    await this.safeClick(link);
  }

  async toggleTheme(): Promise<void> {
    this.logger.info('Toggling theme');
    await this.safeClick(this.themeToggleButton);
  }

  async clickScrollToTop(): Promise<void> {
    this.logger.info('Clicking scroll-to-top button');
    await this.safeClick(this.scrollToTopButton);
  }

  async isStickyTabBarVisible(): Promise<boolean> {
    return this.isVisible(this.stickyTabBar);
  }

  async isScrollToTopVisible(): Promise<boolean> {
    return this.isVisible(this.scrollToTopButton);
  }

  async isThemeToggleVisible(): Promise<boolean> {
    return this.isVisible(this.themeToggleButton);
  }

  async getBrandName(): Promise<string> {
    return this.getText(this.brandHeading);
  }

  async getTabNames(): Promise<string[]> {
    const tabs = this.stickyTabBar.getByRole('button');
    return this.getTexts(tabs);
  }
}
