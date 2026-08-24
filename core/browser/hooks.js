const { BeforeAll, AfterAll, Before, After, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, firefox, webkit, request } = require('@playwright/test');
const fs = require('fs');
const config = require('../../config/global.config');

setDefaultTimeout(config.defaultTimeout);

let globalBrowser;

BeforeAll(async function () {
  const browserType = config.browser === 'firefox' ? firefox : config.browser === 'webkit' ? webkit : chromium;
  globalBrowser = await browserType.launch({ headless: config.headless });
  
  if (!fs.existsSync(config.artifactsDir)) {
    fs.mkdirSync(config.artifactsDir, { recursive: true });
  }
});

Before(async function (scenario) {
  await this.init(scenario.pickle.name);
  
  // Create an isolated context for this scenario
  this.context = await globalBrowser.newContext({
    recordVideo: config.recordVideo ? { dir: config.artifactsDir } : undefined
  });

  if (config.trace === 'on' || config.trace === 'retain-on-failure') {
    await this.context.tracing.start({ screenshots: true, snapshots: true });
  }

  this.page = await this.context.newPage();
  this.request = await request.newContext();
});

After(async function (scenario) {
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

AfterAll(async function () {
  if (globalBrowser) {
    await globalBrowser.close();
  }
});
