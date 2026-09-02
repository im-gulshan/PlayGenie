import { chromium, Page, Browser, BrowserContext } from '@playwright/test';
import { StorageManager } from '@core/auth/storage-manager';
import { LoginPage } from '../pages/LoginPage';

interface AuthCredentials {
  username: string;
  password: string;
}

/**
 * Executes a one-time login via the UI to generate storageState.json.
 * This script strictly handles SauceDemo's UI interaction for login.
 *
 * Usage: npm run auth:saucedemo
 */
export async function setupAuthState(
  env: string,
  persona: string,
  credentials: AuthCredentials,
): Promise<void> {
  if (StorageManager.hasStorageState('SauceDemo', env, persona)) {
    console.log(`[SauceDemo] Auth state already exists for ${persona} in ${env}.`);
    return;
  }

  console.log(`[SauceDemo] Generating auth state for ${persona} in ${env}...`);
  const browser: Browser = await chromium.launch({ headless: true });
  const context: BrowserContext = await browser.newContext();
  const page: Page = await context.newPage();

  const loginPage = new LoginPage(page);
  await loginPage.navigate('https://www.saucedemo.com/');
  await loginPage.login(credentials.username, credentials.password);

  // Wait for the UI state that proves authentication is complete
  await page.waitForLoadState('networkidle');

  const statePath = StorageManager.getStoragePath('SauceDemo', env, persona);
  await context.storageState({ path: statePath });
  console.log(`[SauceDemo] Auth state saved to ${statePath}`);

  await browser.close();
}

// Self-executing when run directly via `npm run auth:saucedemo`
const isDirectExecution = require.main === module;
if (isDirectExecution) {
  const env = process.env.TEST_ENV || 'qa';
  const username = process.env.SAUCE_USERNAME || 'standard_user';
  const password = process.env.SAUCE_PASSWORD;

  if (!password) {
    console.error('Missing SAUCE_PASSWORD. Check your .env file.');
    process.exit(1);
  }

  setupAuthState(env, 'default', { username, password })
    .then(() => console.log('Auth setup complete.'))
    .catch((err) => {
      console.error('Auth setup failed:', err);
      process.exit(1);
    });
}
