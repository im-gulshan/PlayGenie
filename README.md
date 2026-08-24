# PlayGenie

**PlayGenie** is a UI Automation framework for multiple independent products, built on **Playwright** and **Cucumber.js (BDD)**.

## Core Architectural Principle: Strict Product Isolation
This framework is a monorepo containing multiple products. The golden rule of this architecture is **Strict Product Isolation**. 
Products **must never** share Page Objects, Components, or Locators. If Product A and Product B have an identical DatePicker, they must each own a copy of it. Generic framework utilities (browser lifecycle, reporting, base configuration) live in `core/`.

---

## 📁 Folder Structure
```text
/
├── core/                # 100% Product-Agnostic logic (CustomWorld, hooks, loggers)
├── config/              # Global & Environment configurations
├── products/            # Isolated Product implementations
│   ├── product-a/
│   │   ├── config/      # Product-specific URLs
│   │   ├── features/    # BDD feature files
│   │   ├── steps/       # Step definitions
│   │   ├── pages/       # Page Objects
│   │   ├── components/  # Reusable UI components (ONLY within Product A)
│   │   └── auth/        # Persona login state generation scripts
│   └── product-b/       # Completely isolated from Product A
├── Jenkinsfile          # Declarative CI/CD pipeline
└── cucumber.js          # Profiles enforcing step definition isolation
```

---

## 🚀 How to Add a New Product (e.g., Product C)
Adding a new product does **not** require modifying `core`, `Product A`, or `Product B`.

1. **Create the Directory Structure:**
   Create `products/product-c/` and replicate the standard subfolders (`config`, `features`, `steps`, `pages`, `auth`).
2. **Register the Profile:**
   Open `cucumber.js` at the root and add a new profile block:
   ```javascript
   productC: {
     paths: ["products/product-c/features/**/*.feature"],
     require: [
       "core/**/*.js",
       "products/product-c/steps/**/*.js"
     ],
     format: ["progress", "json:reports/product-c-report.json"]
   }
   ```
3. **Add the NPM Script:**
   Open `package.json` and add `"test:productC": "cucumber-js -p productC"`.

---

## 🏗️ Authoring Tests

### 1. Creating a Feature
Create a `.feature` file in your product's `features/` directory. 
**Rule:** Write declarative, business-focused behavior. Do not use XPaths or CSS locators in the Gherkin text.

### 2. Adding a Page Object & Component
Create a class in your product's `pages/` directory.
**Rule:** Encapsulate all locators and UI interactions here. Do not put `expect()` assertions in Page Objects.
*If a UI element (like a Header) is shared across multiple pages in YOUR product, extract it to `components/`.*

### 3. Creating Step Definitions
Create a `.steps.js` file in your product's `steps/` directory.
**Rule:** Instantiate your Page Objects here (passing `this.page` from the Cucumber World). Perform your assertions here using Playwright's web-first assertions (e.g., `expect(locator).toBeVisible()`).

---

## 🔐 Authentication, Sessions, and Personas
To save time, the framework skips repetitive UI logins by leveraging Playwright's `storageState.json`.
1. **How it works:** A pre-test script in `products/product-x/auth/setup.js` drives the browser to log in and saves the session cookie/token as a JSON file.
2. **Injection:** The `CustomWorld` in `core` automatically injects this JSON state into the browser context for every scenario.
3. **Adding a Persona:** If you need a new persona (e.g., `manager`), add the credentials to your secure CI store, and call your product's `setup.js` with the new persona name. It will generate `ProductX_Env_manager.json`.

---

## 💻 Execution Guide

### Local Configuration & Credentials
Configuration cascades from `global` -> `environment` -> `product`.

**Credentials (.env file):**
For local testing, you must create a `.env` file at the root of the project (copy `.env.example`). This file securely holds your credentials (e.g., `SAUCE_USERNAME`, `SAUCE_PASSWORD`) and is excluded from source control.

To change configurations on the fly, use Environment Variables:

* **Product:** `npm run test:productA`
* **Environment:** `TEST_ENV=uat npm run test:productA`
* **Browser:** `BROWSER=firefox npm run test:productA`
* **Headed Mode (Visual):** `HEADLESS=false npm run test:productA`

### Test Filtering & Parallelism
* **Tags:** `npm run test:productA -- --tags "@smoke"`
* **Parallel:** `npm run test:productA -- --parallel 4`

*(Because the `core` hooks generate a fresh incognito context for every scenario, parallel execution within a product is 100% safe).*

---

## ⚙️ Jenkins CI/CD
The `Jenkinsfile` maps Jenkins parameters directly to the environment variables listed above. 
The pipeline uses a `catchError` block to ensure that even if UI tests fail, the pipeline will continue to the post-actions to archive the HTML reports and Traces.

---

## 📊 Reporting & Troubleshooting
1. **HTML Report:** After execution, run `npm run report`. This generates a bootstrap HTML dashboard in `reports/cucumber-report.html`.
2. **Screenshots:** If a scenario fails, a screenshot is automatically taken and attached directly to the Cucumber HTML report.
3. **Playwright Traces:** By default, a Trace ZIP is saved to `reports/artifacts/` on failure. You can view this trace by uploading it to [trace.playwright.dev](https://trace.playwright.dev) to time-travel through the DOM state of the failure.
