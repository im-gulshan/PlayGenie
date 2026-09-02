# PlayGenie

**PlayGenie** is a UI Automation framework for multiple independent products, built on **Playwright** and **Cucumber.js (BDD)**.

## Core Architectural Principle: Strict Product Isolation
This framework is a monorepo containing multiple products. The golden rule of this architecture is **Strict Product Isolation**. 
Products **must never** share Page Objects, Components, or Locators. If Product A and Product B have an identical DatePicker, they must each own a copy of it. Generic framework utilities (browser lifecycle, reporting, base configuration) live in `core/`.

---

## 📁 Folder Structure
```text
/
├── core/                    # 100% Product-Agnostic logic
│   ├── api/                 # API helper utilities (ApiHelper)
│   ├── auth/                # Storage state management
│   ├── browser/             # CustomWorld, lifecycle hooks
│   ├── pages/               # BasePage abstract class
│   ├── reporting/           # Report generation
│   └── utils/               # Winston logger
├── config/                  # Global & Environment configurations
│   ├── env/                 # Per-environment config files (qa.ts, uat.ts, etc.)
│   └── global.config.ts     # Framework-wide settings
├── products/                # Isolated Product implementations
│   └── saucedemo/
│       ├── auth/            # Persona login state generation scripts
│       ├── config/          # Product-specific URLs and overrides
│       ├── data/            # Test data fixtures
│       ├── features/        # BDD feature files
│       ├── pages/           # Page Objects (extend BasePage)
│       ├── steps/           # Step definitions
│       └── support/         # Product-level hooks
├── Dockerfile               # Containerized execution
├── Jenkinsfile              # Declarative CI/CD pipeline
└── cucumber.js              # Profiles enforcing step definition isolation
```

---

## 🏗️ Architecture Highlights

### BasePage Pattern
All page objects extend `BasePage` (from `core/pages/BasePage.ts`), which provides:
- Consistent constructor signature (`page: Page`)
- Shared utility methods: `waitForPageLoad()`, `getPageUrl()`, `getPageTitle()`
- A contract that ensures consistency across all products

### PageManager
Each product has a `PageManager` that centralizes access to all page objects. Step definitions access pages via `this.pages.<pageName>`.

### Winston Logger
Industry-standard logging with 5 levels (`error`, `warn`, `info`, `http`, `debug`), timestamps, colorized console output, and file output (`logs/error.log`, `logs/combined.log`).

### Path Aliases
Clean imports using TypeScript path aliases:
- `@core/*` → `core/*`
- `@config/*` → `config/*`
- `@products/*` → `products/*`

---

## 🚀 How to Add a New Product (e.g., Product C)
Adding a new product does **not** require modifying `core`, or any other product.

1. **Create the Directory Structure:**
   Create `products/product-c/` and replicate the standard subfolders (`config`, `data`, `features`, `steps`, `pages`, `support`, `auth`).
2. **Create Page Objects:**
   Each page object should extend `BasePage`:
   ```typescript
   import { BasePage } from '@core/pages/BasePage';
   export class MyPage extends BasePage { ... }
   ```
3. **Create a PageManager:**
   Register all page objects in a `PageManager` class.
4. **Create Support Hooks:**
   Add a `support/hooks.ts` with `Before({ order: 1 })` to initialize your PageManager.
5. **Register the Profile:**
   Open `cucumber.js` at the root and add a new profile block:
   ```javascript
   productC: {
     requireModule: ['tsx/cjs'],
     paths: ["products/product-c/features/**/*.feature"],
     require: [
       "core/browser/**/*.ts",
       "core/utils/**/*.ts",
       "products/product-c/steps/**/*.ts",
       "products/product-c/support/**/*.ts"
     ],
     format: ["progress", "json:reports/product-c-report.json"]
   }
   ```
6. **Add the NPM Script:**
   Open `package.json` and add `"test:productC": "cucumber-js -p productC"`.

---

## 🏗️ Authoring Tests

### 1. Creating a Feature
Create a `.feature` file in your product's `features/` directory. 
**Rule:** Write declarative, business-focused behavior. Do not use XPaths or CSS locators in the Gherkin text.

### 2. Adding a Page Object & Component
Create a class in your product's `pages/` directory extending `BasePage`.
**Rule:** Encapsulate all locators and UI interactions here. Do not put `expect()` assertions in Page Objects.
*If a UI element (like a Header) is shared across multiple pages in YOUR product, extract it to `components/`.*

### 3. Creating Step Definitions
Create a `.steps.ts` file in your product's `steps/` directory.
**Rule:** Access Page Objects via `this.pages.<pageName>` (from Cucumber World). Perform your assertions here using Playwright's web-first assertions (e.g., `expect(locator).toBeVisible()`).

### 4. Test Data
Store test data fixtures in your product's `data/` directory using typed TypeScript objects. Reference them in step definitions instead of hardcoding strings.

### 5. Data-Driven Testing
When testing multiple input combinations (e.g., testing various user roles or validation messages), use Cucumber's `Scenario Outline` with an `Examples` table in your `.feature` file.
**Rule:** Keep the `.feature` file clean. Do not store sensitive data (like passwords) in the `Examples` table. Instead, pass non-sensitive keys (like `username` or `userRole`) through the step parameters, and resolve sensitive data via `.env` or centralized `data/` fixtures in the step definitions.

---

## 🔐 Authentication, Sessions, and Personas
To save time, the framework skips repetitive UI logins by leveraging Playwright's `storageState.json`.
1. **How it works:** A pre-test script in `products/product-x/auth/setup.ts` drives the browser to log in and saves the session cookie/token as a JSON file.
2. **Generate auth state:** Run `npm run auth:saucedemo` before test execution. The core `Before` hook automatically detects and injects available storage state files.
3. **Adding a Persona:** If you need a new persona (e.g., `manager`), add the credentials to your secure CI store, and call your product's `setup.ts` with the new persona name. It will generate `ProductX_Env_manager.json`.

---

## 💻 Execution Guide

### Local Configuration & Credentials
Configuration cascades from `global` -> `environment` -> `product`.

**Credentials (.env file):**
For local testing, you must create a `.env` file at the root of the project (copy `.env.example`). This file securely holds your credentials (e.g., `SAUCE_USERNAME`, `SAUCE_PASSWORD`) and is excluded from source control.

To change configurations on the fly, use Environment Variables:

* **Product:** `npm run test:saucedemo`
* **Environment:** `$env:TEST_ENV="uat"; npm run test:saucedemo` (PowerShell) or `TEST_ENV=uat npm run test:saucedemo` (Bash)
* **Browser:** `$env:BROWSER="firefox"; npm run test:saucedemo`
* **Headless Mode:** `$env:HEADLESS="true"; npm run test:saucedemo` (By default, the framework runs in Headed mode locally).

### Test Filtering & Parallelism
* **Tags:** `npx cucumber-js -p saucedemo --tags "@smoke"`
* **Parallel:** `npm run test:saucedemo -- --parallel 4`

*(Because the `core` hooks generate a fresh incognito context for every scenario, parallel execution within a product is 100% safe).*

---

## 🐳 Docker Execution
Build and run tests in a containerized environment for consistent execution:

```bash
# Build the image
docker build -t playgenie .

# Run tests
docker run --rm playgenie

# Run with custom product/tags
docker run --rm playgenie npm run test:saucedemo -- --tags "@smoke"
```

---

## ⚙️ Jenkins CI/CD
The `Jenkinsfile` maps Jenkins parameters directly to the environment variables listed above. 
The pipeline includes:
1. **Lint** — enforces code quality before test execution
2. **Auth State Generation** — generates session state for faster test runs
3. **UI Test Execution** — runs tests with `catchError` for report continuity
4. **Report Generation** — generates the HTML dashboard

---

## 📊 Reporting & Troubleshooting
1. **HTML Report:** After execution, run `npm run report`. This auto-discovers all product JSON reports and generates a rich HTML dashboard in `reports/html-report/`.
2. **Screenshots:** If a scenario fails, a screenshot is automatically taken and attached directly to the report.
3. **Playwright Traces:** By default, a Trace ZIP is saved to `reports/artifacts/` on failure. You can view this trace by uploading it to [trace.playwright.dev](https://trace.playwright.dev) to time-travel through the DOM state of the failure.
4. **Logs:** Winston logs are written to `logs/error.log` (errors only) and `logs/combined.log` (all levels).

---

## 🛡️ Code Quality
- **ESLint + Prettier** enforce consistent code style
- **Husky + lint-staged** run lint and format checks on every `git commit`
  - *(Note: Until `@typescript-eslint` supports TypeScript 7.0, you may need to commit using `git commit --no-verify` to bypass the pre-commit hook).*
- **TypeScript strict mode** catches type errors at compile time
