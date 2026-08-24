const { chromium } = require('@playwright/test');
const { StorageManager } = require('../../../core/auth/storage-manager');
const config = require('../config/product-a.config');
const { LoginPage } = require('../pages/LoginPage');

/**
 * Executes a one-time login via the UI to generate storageState.json
 * This script strictly handles Product A's UI interaction for login.
 */
async function setupAuthState(env, persona, credentials) {
  if (StorageManager.hasStorageState('ProductA', env, persona)) {
    console.log(`[Product A] Auth state already exists for ${persona} in ${env}.`);
    return;
  }

  console.log(`[Product A] Generating auth state for ${persona} in ${env}...`);
  const browser = await chromium.launch({ headless: config.headless });
  const context = await browser.newContext();
  const page = await context.newPage();

  const loginPage = new LoginPage(page);
  await loginPage.navigate(config.baseUrl);
  await loginPage.login(credentials.username, credentials.password);

  // Wait for the UI state that proves authentication is complete
  await page.waitForLoadState('networkidle');

  const statePath = StorageManager.getStoragePath('ProductA', env, persona);
  await context.storageState({ path: statePath });
  console.log(`[Product A] Auth state saved to ${statePath}`);

  await browser.close();
}

module.exports = { setupAuthState };
