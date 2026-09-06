import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);
const nameArgIndex = args.indexOf('--name');

if (nameArgIndex === -1 || !args[nameArgIndex + 1]) {
  console.error('Usage: npm run generate:product -- --name <productName>');
  process.exit(1);
}

const productName = args[nameArgIndex + 1].toLowerCase();
const productDir = path.resolve(process.cwd(), 'products', productName);

if (fs.existsSync(productDir)) {
  console.error(`Product '${productName}' already exists at ${productDir}`);
  process.exit(1);
}

// 1. Create directory structure
const dirs = ['auth', 'config', 'data', 'features', 'pages', 'steps', 'support'];

dirs.forEach((dir) => {
  fs.mkdirSync(path.join(productDir, dir), { recursive: true });
});

// 2. Create template files
const templates: Record<string, string> = {
  'auth/setup.ts': `import { chromium } from '@playwright/test';
import config from '../config/${productName}.config';
import * as path from 'path';

async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // TODO: Implement login logic here to save state
  // await page.goto(config.baseUrl);
  
  // const statePath = path.join(config.stateDir, \`${productName}_\${config.envName}_default.json\`);
  // await context.storageState({ path: statePath });
  
  await browser.close();
}

globalSetup().catch(console.error);
`,

  [`config/${productName}.config.ts`]: `import { createProductConfig, ProductConfigBase, EnvironmentConfig } from '@config/global.config';

export interface ${productName.charAt(0).toUpperCase() + productName.slice(1)}Config extends ProductConfigBase {
  // Add product-specific fields here
}

const envName = process.env.TEST_ENV || 'qa';
const envConfig: EnvironmentConfig = require(\`@config/env/\${envName}\`).default;

const config = createProductConfig<${productName.charAt(0).toUpperCase() + productName.slice(1)}Config>(envConfig, {
  productName: '${productName}',
  baseUrl: 'https://example.com/',
});

export default config;
`,

  'data/index.ts': `// Data resolver
const envName = process.env.TEST_ENV || 'qa';
export const data = require(\`./\${envName}.data\`).default;
`,

  'data/qa.data.ts': `export default {
  sampleUser: 'standard_user',
};
`,

  'features/sample.feature': `@${productName} @smoke
Feature: Sample Feature
  As a user
  I want to interact with the application
  So that I can verify it works

  Scenario: Sample scenario
    Given I navigate to the sample page
    When I perform an action
    Then I should see the expected result
`,

  'pages/PageManager.ts': `import { Page } from '@playwright/test';
import { SamplePage } from './SamplePage';

export class PageManager {
  readonly samplePage: SamplePage;

  constructor(page: Page) {
    this.samplePage = new SamplePage(page);
  }
}
`,

  'pages/SamplePage.ts': `import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';

export class SamplePage extends BasePage {
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1');
  }
}
`,

  'steps/sample.steps.ts': `import { Given, When, Then } from '../support/steps';
import { expect } from '@playwright/test';

Given('I navigate to the sample page', async function () {
  await this.pages.samplePage.navigateTo('https://example.com');
});

When('I perform an action', async function () {
  await this.logger.info('Performing action');
});

Then('I should see the expected result', async function () {
  await expect(this.page).toHaveTitle(/Example/);
});
`,

  'support/hooks.ts': `import { Before } from '@cucumber/cucumber';
import { PageManager } from '../pages/PageManager';

Before(async function () {
  this.sharedData.productName = '${productName}';
  this.pages = new PageManager(this.page);
});
`,

  'support/steps.ts': `import {
  Given as CucumberGiven,
  When as CucumberWhen,
  Then as CucumberThen,
} from '@cucumber/cucumber';
import { ${productName.charAt(0).toUpperCase() + productName.slice(1)}World } from './types';

interface StepOptions {
  timeout?: number;
  wrapperOptions?: Record<string, unknown>;
}

interface TypedStepFn {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pattern: string | RegExp, code: (this: ${productName.charAt(0).toUpperCase() + productName.slice(1)}World, ...args: any[]) => void | Promise<void>): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pattern: string | RegExp, options: StepOptions, code: (this: ${productName.charAt(0).toUpperCase() + productName.slice(1)}World, ...args: any[]) => void | Promise<void>): void;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const Given: TypedStepFn = (...args: any[]) => (CucumberGiven as any)(...args);
export const When: TypedStepFn = (...args: any[]) => (CucumberWhen as any)(...args);
export const Then: TypedStepFn = (...args: any[]) => (CucumberThen as any)(...args);
/* eslint-enable @typescript-eslint/no-explicit-any */
`,

  'support/types.ts': `import { CustomWorld } from '@core/browser/CustomWorld';
import { PageManager } from '../pages/PageManager';

export interface ${productName.charAt(0).toUpperCase() + productName.slice(1)}World extends CustomWorld {
  pages: PageManager;
}
`,
};

Object.entries(templates).forEach(([filePath, content]) => {
  fs.writeFileSync(path.join(productDir, filePath), content);
});

// 3. Update cucumber.js
const cucumberJsPath = path.resolve(process.cwd(), 'cucumber.js');
if (fs.existsSync(cucumberJsPath)) {
  let cucumberJs = fs.readFileSync(cucumberJsPath, 'utf8');

  const newProfile = `  ${productName}: {
    parallel: 3,
    requireModule: ['tsx/cjs'],
    retry: 1,
    paths: [
      "products/${productName}/features/**/*.feature"
    ],
    require: [
      "core/browser/**/*.ts",
      "core/utils/**/*.ts",
      "products/${productName}/steps/**/*.ts",
      "products/${productName}/support/**/*.ts"
    ],
    format: [
      "progress",
      "json:reports/${productName}-report.json"
    ]
  }`;

  // Simply insert before the last closing brace
  if (cucumberJs.includes(productName + ':')) {
    console.warn(`Profile '${productName}' already exists in cucumber.js`);
  } else {
    // Find the last closing brace
    const lastBraceIndex = cucumberJs.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
      cucumberJs =
        cucumberJs.slice(0, lastBraceIndex) +
        `,\n` +
        newProfile +
        `\n` +
        cucumberJs.slice(lastBraceIndex);
      fs.writeFileSync(cucumberJsPath, cucumberJs);
    }
  }
}

// 4. Update package.json scripts
const packageJsonPath = path.resolve(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts[`test:${productName}`] = `cucumber-js -p ${productName}`;
  pkg.scripts[`auth:${productName}`] = `tsx products/${productName}/auth/setup.ts`;
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
}

console.log(`✅ Successfully scaffolded product '${productName}'`);
console.log(`Run tests: npm run test:${productName}`);
