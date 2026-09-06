import {
  BeforeAll,
  AfterAll,
  Status,
  setDefaultTimeout,
  ITestCaseHookParameter,
  Before,
  After,
} from '@cucumber/cucumber';
import { chromium, firefox, webkit, request, Browser } from '@playwright/test';
import * as fs from 'fs';
import config from '@config/global.config';

setDefaultTimeout(config.defaultTimeout);

let globalBrowser: Browser | undefined;

BeforeAll(async function () {
  const browserType =
    config.browser === 'firefox' ? firefox : config.browser === 'webkit' ? webkit : chromium;
  globalBrowser = await browserType.launch({ headless: config.headless });

  if (!fs.existsSync(config.artifactsDir)) {
    fs.mkdirSync(config.artifactsDir, { recursive: true });
  }
});

/**
 * Core Before hook — sets up browser context, page, and API request context.
 *
 * This hook is registered in core/ which is loaded first via cucumber.js require order.
 * Product-level hooks (e.g., PageManager init) run after this because they are
 * loaded later in the require array. Cucumber executes Before hooks in registration order.
 */
Before(async function (scenario: ITestCaseHookParameter) {
  await this.init(scenario.pickle.name);

  // Check for auth storage state to skip repetitive UI logins.
  // Looks for a product/persona-specific file, not just the first .json in .state/
  const stateDir = config.stateDir;
  let storageStatePath: string | undefined;

  if (fs.existsSync(stateDir)) {
    // Product hooks can set product name and persona via sharedData
    const product = (this.sharedData.productName as string) || '';
    const env = process.env.TEST_ENV || 'qa';
    const persona = (this.sharedData.persona as string) || 'default';

    // Look for an exact match first: {product}_{env}_{persona}.json
    const exactFile = `${product}_${env}_${persona}.json`;
    const exactPath = `${stateDir}/${exactFile}`;

    if (fs.existsSync(exactPath)) {
      // TTL check — warn if storage state is older than 1 hour
      const stats = fs.statSync(exactPath);
      const ageMs = Date.now() - stats.mtimeMs;
      const ONE_HOUR = 60 * 60 * 1000;
      if (ageMs > ONE_HOUR) {
        this.logger.warn(
          `Storage state ${exactFile} is ${Math.round(ageMs / 60000)} minutes old. Consider regenerating with npm run auth:*`,
        );
      }
      storageStatePath = exactPath;
    } else {
      // Fallback: use any available .json file (backward compatibility)
      const files = fs.readdirSync(stateDir).filter((f) => f.endsWith('.json'));
      if (files.length > 0) {
        storageStatePath = `${stateDir}/${files[0]}`;
        this.logger.debug(
          `No exact storage state match for ${exactFile}, falling back to ${files[0]}`,
        );
      }
    }
  }

  // Create an isolated context for this scenario
  this.context = await globalBrowser!.newContext({
    recordVideo: config.recordVideo ? { dir: config.artifactsDir } : undefined,
    ...(storageStatePath ? { storageState: storageStatePath } : {}),
  });

  if (config.trace === 'on' || config.trace === 'retain-on-failure') {
    await this.context.tracing.start({ screenshots: true, snapshots: true });
  }

  this.page = await this.context.newPage();
  this.page.setDefaultNavigationTimeout(config.navigationTimeout);
  this.request = await request.newContext();
});

After(async function (scenario: ITestCaseHookParameter) {
  if (scenario.result?.status === Status.FAILED) {
    this.logger.error(`Scenario failed: ${scenario.pickle.name}`);

    // Capture screenshot on failure
    const screenshot = await this.page.screenshot({ fullPage: true });
    this.attach(screenshot, 'image/png');

    // Retain trace on failure
    if (config.trace === 'retain-on-failure' || config.trace === 'on') {
      const tracePath = `${config.artifactsDir}/trace-${scenario.pickle.id}.zip`;
      await this.context.tracing.stop({ path: tracePath });
      this.attach(`Trace saved to: ${tracePath}`, 'text/plain');
    }
  } else {
    // Stop tracing without saving if scenario passed and we only retain on failure
    if (config.trace === 'retain-on-failure') {
      await this.context.tracing.stop();
    } else if (config.trace === 'on') {
      const tracePath = `${config.artifactsDir}/trace-${scenario.pickle.id}.zip`;
      await this.context.tracing.stop({ path: tracePath });
      this.attach(`Trace saved to: ${tracePath}`, 'text/plain');
    }
  }

  await this.page.close();
  await this.context.close();
  await this.request.dispose();
});

AfterAll({ timeout: 15000 }, async function () {
  if (globalBrowser) {
    try {
      // Use Promise.race to prevent Playwright's browser.close() from hanging indefinitely.
      // This often happens in parallel mode when idle workers spin up and immediately shut down.
      await Promise.race([
        globalBrowser.close(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Browser close timed out')), 5000),
        ),
      ]);
    } catch {
      // Browser may already be closed, unresponsive, or timed out — safe to ignore
    }
  }
});
