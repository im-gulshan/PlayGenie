import { Before } from '@cucumber/cucumber';
import { PageManager } from '../pages/PageManager';

/**
 * Initialize PageManager once before each scenario.
 * All step files access pages via `this.pages` — no helper function needed.
 *
 * Hook ordering guarantee: Cucumber executes Before hooks in registration order.
 * The cucumber.js require array loads core files BEFORE product support files,
 * so the core Before hook (which sets this.page) always runs first.
 */
Before(async function () {
  this.pages = new PageManager(this.page);
});
