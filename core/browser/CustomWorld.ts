import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Page, Browser, BrowserContext, APIRequestContext } from '@playwright/test';
import { Logger } from '@core/utils/logger';

/**
 * CustomWorld extends Cucumber's World with Playwright primitives.
 *
 * This class is 100% product-agnostic. Products attach their own
 * PageManager via product-level Before hooks (e.g., products/saucedemo/support/hooks.ts).
 *
 * The `pages` property is typed as `Record<string, any>` so any product
 * can set its own strongly-typed PageManager without modifying core.
 */
declare module '@cucumber/cucumber' {
  interface IWorld {
    logger: Logger;
    browser: Browser;
    context: BrowserContext;
    page: Page;
    request: APIRequestContext;
    pages: Record<string, any>;
    init(scenarioName: string): Promise<void>;
  }
}

export class CustomWorld extends World {
  logger: Logger;
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  request!: APIRequestContext;
  pages!: Record<string, any>;

  constructor(options: IWorldOptions) {
    super(options);
    this.logger = new Logger('Scenario');
  }

  async init(scenarioName: string): Promise<void> {
    this.logger = new Logger(scenarioName);
    this.logger.debug('Initializing Playwright context variables...');
  }
}

setWorldConstructor(CustomWorld);
