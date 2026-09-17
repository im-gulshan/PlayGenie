# 05 — Established Patterns

This file is the coding rulebook for PlayGenie. Every pattern here reflects the
actual implementation in the codebase. Follow these patterns exactly — do not
invent alternatives.

---

## Pattern 1: Adding a New Page Object to an Existing Product

**When:** You need to test a new section/page of an existing product.

**Steps:**

1. Create `products/<name>/pages/<PageName>.ts`:
```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';
import { Logger } from '@core/utils/logger';

export class MyNewPage extends BasePage {
  readonly someElement: Locator;

  constructor(page: Page, logger: Logger) {
    super(page, logger);
    this.someElement = page.locator('[data-testid="element"]');
  }

  async doSomething(): Promise<void> {
    await this.safeClick(this.someElement);
  }
}
```

2. Import and register in `products/<name>/pages/PageManager.ts`:
```typescript
import { MyNewPage } from './MyNewPage';

export class PageManager {
  readonly myNewPage: MyNewPage;  // add property

  constructor(page: Page, logger: Logger) {
    this.myNewPage = new MyNewPage(page, logger);  // instantiate
  }
}
```

3. After adding to `PageManager`, it is accessible in step files as
   `this.pages.myNewPage`.

**Rules:**
- MUST extend `BasePage`
- Constructor MUST accept `(page: Page, logger: Logger)` and call `super(page, logger)`
- Use `BasePage` methods (`safeClick`, `fillAndVerify`, `getText`, etc.) — read the source file for the current list
- Locators are defined as `readonly` class properties in the constructor

---

## Pattern 2: Adding a New Feature + Step File

**When:** You need to test a new area of functionality in an existing product.

**Steps:**

1. Create the feature file `products/<name>/features/<area>.feature`:
```gherkin
@<product> @<suite>
Feature: My New Feature
  As a user
  I want to...
  So that...

  Scenario: My scenario
    Given some precondition
    When I do something
    Then I should see something
```

2. Create the step file `products/<name>/steps/<area>.steps.ts`:
```typescript
import { Given, When, Then } from '../support/steps';  // ← ALWAYS from here
import { expect } from '@playwright/test';

Given('some precondition', async function () {
  // this.pages, this.logger, this.sharedData are all available
  await this.pages.myNewPage.navigateTo('https://example.com');
});

When('I do something', async function () {
  this.logger.info('Doing something');
  await this.pages.myNewPage.doSomething();
});

Then('I should see something', async function () {
  const text = await this.pages.myNewPage.getText(this.pages.myNewPage.someElement);
  expect(text).toBe('Expected Value');
});
```

**Rules:**
- Import `{ Given, When, Then }` from `../support/steps` — NEVER from `@cucumber/cucumber`
- Access pages via `this.pages.<pageName>.<method>()`
- Access logger via `this.logger.info(...)` / `.debug(...)` / `.error(...)`
- Access shared scenario state via `this.sharedData.<key>`
- No `console.log` — always use `this.logger`

---

## Pattern 3: Adding a New Product (Full Scaffold)

**When:** You need to test a completely new web application.

**Command:**
```bash
npm run generate:product -- --name <productname>
```

This command automatically:
- Creates the full directory structure: `auth/`, `config/`, `data/`, `features/`, `pages/`, `steps/`, `support/`
- Scaffolds template files for every layer with correct imports
- Adds a new profile to `cucumber.js`
- Adds `test:<name>` and `auth:<name>` scripts to `package.json`

After scaffolding, update:
- `config/<name>.config.ts` — set the real `baseUrl` and `productName`
- `data/qa.data.ts` — add real test data
- `features/sample.feature` — write real scenarios
- `pages/SamplePage.ts` → rename and implement real page objects
- `support/types.ts` — define `<Name>SharedState` with the fields your steps need

---

## Pattern 4: Typed World (Module Augmentation)

**Why it exists:** `CustomWorld.pages` is typed as `unknown` at the core level.
Each product narrows it to their specific `PageManager` type so `this.pages` is
fully typed in step files.

**Pattern in `support/types.ts`:**
```typescript
import { CustomWorld } from '@core/browser/CustomWorld';
import { PageManager } from '../pages/PageManager';

export interface MyProductSharedState {
  someKey?: string;
  anotherKey?: string;
}

export interface MyProductWorld extends Omit<CustomWorld, 'sharedData'> {
  pages: PageManager;                    // narrows from unknown to PageManager
  sharedData: MyProductSharedState;      // narrows from Record<string,unknown>
}
```

**Pattern in `support/steps.ts`:**
```typescript
import { Given as CucumberGiven, /* ... */ } from '@cucumber/cucumber';
import { MyProductWorld } from './types';

// Typed wrappers — step callbacks receive `this: MyProductWorld`
export const Given: TypedStepFn = (...args: any[]) => (CucumberGiven as any)(...args);
// (same for When, Then)
```

---

## Pattern 5: Data Layer (Env-Keyed Resolver)

**Why it exists:** Different environments (qa, uat, staging) may have different
base data. The resolver picks the right file automatically from `TEST_ENV`.

**Pattern in `data/index.ts`:**
```typescript
const envName = process.env.TEST_ENV || 'qa';
export const portfolioData = require(`./${envName}.data`).default;
// OR for saucedemo: export const data = require(`./${envName}.data`).default;
```

**Usage in step files:**
```typescript
import { portfolioData } from '../data';

Then('the page title should be correct', async function () {
  const title = await this.page.title();
  expect(title).toBe(portfolioData.hero.pageTitle);
});
```

---

## Pattern 6: `sharedData` — Passing State Between Steps

`this.sharedData` is the correct way to pass values between step definitions
within the same scenario. It is reset for every scenario.

**Usage:**
```typescript
// In a When step — store something
When('I click the {string} tab', async function (tabName: string) {
  await this.pages.navigationPage.clickTab(tabName);
  this.sharedData.activeTab = tabName;   // store for later steps
});

// In a Then step — read it back
Then('the {string} tab content should be visible', async function (expectedTab: string) {
  expect(this.sharedData.activeTab).toBe(expectedTab);
});
```

**Real examples in this codebase:**
- `portfolio`: `sharedData.activeTab`, `sharedData.activeSkillCategory`
- `saucedemo`: `sharedData.productName`, `sharedData.firstProdName`, `sharedData.allProductsName`

---

## Pattern 7: Auth State (Products with Login)

For products that require authentication, use `StorageManager` to avoid logging
in via UI in every scenario.

**Auth setup script (`auth/setup.ts`):**
```typescript
import { StorageManager } from '@core/auth/storage-manager';

// Idempotent: only generates if not already present
if (StorageManager.hasStorageState('ProductName', env, persona)) {
  console.log('Auth state already exists. Skipping.');
  return;
}

// Perform UI login, then:
const statePath = StorageManager.getStoragePath('ProductName', env, persona);
await context.storageState({ path: statePath });
```

**How it works in tests:** The core `Before` hook in `core/browser/hooks.ts`
automatically looks for a matching `.state/{product}_{env}_{persona}.json` file
and injects it into the `BrowserContext` if found. No product-level code is
needed to consume the auth state.

**TTL warning:** The core hook warns (via logger) if the auth state file is
older than 1 hour. It does not auto-delete it.

---

## Pattern 8: Tagging Convention

Every scenario MUST have at minimum a **product tag** and a **suite tag**.
See [`docs/tagging-convention.md`](../../../docs/tagging-convention.md) for the
full reference.

**Required:**
- `@portfolio` or `@saucedemo` — identifies which product
- `@smoke`, `@regression`, or `@e2e` — identifies when/where it runs

**Optional but recommended:**
- `@p0`, `@p1`, `@p2` — priority for triage
- `@login`, `@checkout`, `@inventory`, etc. — feature area

**Special:**
- `@flaky` — opts into higher retry count
- `@skip` / `@wip` — excludes from CI runs

**Good example:**
```gherkin
@saucedemo @smoke @p0 @login
Feature: User Authentication
```
