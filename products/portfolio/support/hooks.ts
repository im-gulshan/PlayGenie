import { Before } from '@cucumber/cucumber';
import { PageManager } from '../pages/PageManager';
import config from '../config/portfolio.config';
import { PortfolioWorld } from './types';

/**
 * Initialize PageManager and navigate to the portfolio site before each scenario.
 *
 * The portfolio site has no login — the Before hook simply navigates to
 * the base URL so every scenario starts cleanly on the home page.
 *
 * Hook ordering guarantee: Cucumber executes Before hooks in registration order.
 * The cucumber.js require array loads core files BEFORE product support files,
 * so the core Before hook (which sets this.page) always runs first.
 */
Before(async function (this: PortfolioWorld) {
  this.pages = new PageManager(this.page, this.logger);
  this.logger.info(`Navigating to Portfolio: ${config.baseUrl}`);
  await this.pages.navigationPage.navigate(config.baseUrl);
});
