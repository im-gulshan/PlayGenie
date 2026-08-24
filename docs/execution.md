# Execution Guide

This framework relies on environment variables and Cucumber CLI arguments to dynamically construct the test execution context.

## 0. Local Credentials (.env)
Before running tests locally, ensure you have created a `.env` file at the root of the repository. You can copy the structure from `.env.example`.
This file is used to securely inject sensitive data (like `SAUCE_USERNAME` and `SAUCE_PASSWORD`) without exposing them in the Git repository. Do not commit your `.env` file!


## Base Execution (Product Selection)
Execution is strictly isolated by product via `cucumber.js` profiles.
```bash
# Execute SauceDemo
npm run test:saucedemo
```

*(These map to `npx cucumber-js -p saucedemo` internally).*

---

## 1. Environment Selection
Change the target environment by setting `TEST_ENV`. This determines which config file from `config/env/` is merged.

**Linux / Mac:**
```bash
TEST_ENV=uat npm run test:saucedemo
```

**Windows (PowerShell):**
```powershell
$env:TEST_ENV="uat"; npm run test:saucedemo
```

---

## 2. Browser Selection
Switch browsers without altering source code using `BROWSER` (`chromium` | `firefox` | `webkit`).

```bash
BROWSER=firefox npm run test:saucedemo
```

---

## 3. Headed vs. Headless Mode
The framework runs headless by default for CI safety. For local visual debugging, disable headless mode:

```bash
HEADLESS=false npm run test:saucedemo
```

---

## 4. Tag Execution
Use Cucumber's `--tags` argument to filter which scenarios run. To avoid npm argument parsing bugs on Windows, it is safest to use `npx` directly for tag execution.

```bash
# Run only smoke tests
npx cucumber-js -p saucedemo --tags "@smoke"

# Run scenarios that are EITHER admin or sales
npx cucumber-js -p saucedemo --tags "@admin or @sales"

# Exclude regression tests
npx cucumber-js -p saucedemo --tags "not @regression"
```

---

## 5. Parallel Execution
Because each scenario receives a fresh Playwright Context, you can safely execute tests in parallel to drastically reduce execution time.

```bash
# Run with 4 parallel workers
npm run test:saucedemo -- --parallel 4
```

---

## 6. Diagnostics (Traces & Video)
By default, Playwright Traces are saved *only on failure*. You can override this behavior or enable video recording.

```bash
# Force traces on for ALL scenarios, and record video
TRACE=on RECORD_VIDEO=true npm run test:saucedemo
```

---

## 7. Reporting
Following test execution, Cucumber outputs a JSON file to `reports/cucumber-report.json`. To generate the rich HTML report with attached screenshots and traces:

```bash
npm run report
```
*(This will generate `reports/cucumber-report.html`)*
