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

## 1. Auth State Generation (Optional)
Generate auth storage state to skip repetitive UI logins and reduce execution time:
```bash
npm run auth:saucedemo
```
This creates a `storageState.json` file in `.state/` that is automatically injected into the browser context for each scenario.

---

## 2. Environment Selection
Change the target environment by setting `TEST_ENV`. This dynamically loads the correct config file from `config/env/`.

**Linux / Mac:**
```bash
TEST_ENV=uat npm run test:saucedemo
```

**Windows (PowerShell):**
```powershell
$env:TEST_ENV="uat"; npm run test:saucedemo
```

---

## 3. Browser Selection
Switch browsers without altering source code using `BROWSER` (`chromium` | `firefox` | `webkit`).

```bash
BROWSER=firefox npm run test:saucedemo
```

---

## 4. Headed vs. Headless Mode
The framework runs headless by default for CI safety. For local visual debugging, disable headless mode:

```bash
HEADLESS=false npm run test:saucedemo
```

---

## 5. Tag Execution
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

## 6. Parallel Execution
Because each scenario receives a fresh Playwright Context, you can safely execute tests in parallel to drastically reduce execution time.

```bash
# Run with 4 parallel workers
npm run test:saucedemo -- --parallel 4
```

---

## 7. Diagnostics (Traces & Video)
By default, Playwright Traces are saved *only on failure*. You can override this behavior or enable video recording.

```bash
# Force traces on for ALL scenarios, and record video
TRACE=on RECORD_VIDEO=true npm run test:saucedemo
```

---

## 8. Reporting
Following test execution, Cucumber outputs a JSON file to `reports/`. To generate the rich HTML report:

```bash
npm run report
```
*(This auto-discovers all `*-report.json` files and generates a report in `reports/html-report/`)*

---

## 9. Docker Execution
For consistent, containerized execution:

```bash
# Build
docker build -t playgenie .

# Run all saucedemo tests
docker run --rm playgenie

# Run with custom tags
docker run --rm playgenie npm run test:saucedemo -- --tags "@smoke"
```

---

## 10. Logging
Winston logs are written to:
- **Console** — colorized, timestamped output
- `logs/error.log` — errors only
- `logs/combined.log` — all log levels

Control log level via `LOG_LEVEL` environment variable:
```bash
LOG_LEVEL=debug npm run test:saucedemo
```
