# 06 — Commands & Execution Guide

All commands assume you are in the project root:
`d:\GoogleAntiGravity\Playwright-Framework\`

---

## Running Tests

```bash
# Run portfolio tests (2 parallel workers)
npm run test:portfolio

# Run saucedemo tests (3 parallel workers)
npm run test:saucedemo
```

These map internally to `cucumber-js -p <profile>`.

---

## Environment Selection

Set `TEST_ENV` to switch the target environment. This loads the corresponding
file from `config/env/`.

```powershell
# Windows PowerShell
$env:TEST_ENV="uat"; npm run test:saucedemo

# Linux / Mac
TEST_ENV=uat npm run test:saucedemo
TEST_ENV=qa npm run test:portfolio
```

Default: `qa`

---

## Browser Selection

```bash
# Supported: chromium (default) | firefox | webkit
BROWSER=firefox npm run test:saucedemo
BROWSER=webkit npm run test:portfolio
```

---

## Headed vs. Headless Mode

The framework runs **headed by default** for local visual debugging.
CI (Jenkins) explicitly sets `HEADLESS=true`.

```bash
# Headless mode (required for CI)
HEADLESS=true npm run test:saucedemo
HEADLESS=true npm run test:portfolio
```

> ℹ️ The `Jenkinsfile` already sets `HEADLESS=true` — no manual change needed
> for CI runs.

---

## Tag Execution

Use `npx cucumber-js` directly (not `npm run`) to avoid argument parsing issues
on Windows PowerShell.

```bash
# Run only smoke tests
npx cucumber-js -p saucedemo --tags "@smoke"
npx cucumber-js -p portfolio --tags "@smoke"

# Run multiple tags (OR)
npx cucumber-js -p saucedemo --tags "@admin or @sales"

# Exclude a tag (NOT)
npx cucumber-js -p saucedemo --tags "not @regression"

# Combine tags (AND)
npx cucumber-js -p portfolio --tags "@portfolio and @smoke"

# Run a specific feature area
npx cucumber-js -p portfolio --tags "@navigation"
```

---

## Parallel Execution

Override the parallelism defined in `cucumber.js`:

```bash
# Run with 4 parallel workers
npm run test:saucedemo -- --parallel 4

# Run serially (1 worker) for debugging
npm run test:portfolio -- --parallel 1
```

---

## Auth State Generation

SauceDemo requires credentials for login. Generate a stored auth state to skip
repetitive UI logins and speed up test execution.

```bash
# Generate .state/SauceDemo_qa_default.json
npm run auth:saucedemo
```

**Prerequisites:** `SAUCE_USERNAME` and `SAUCE_PASSWORD` must be set in `.env`.
The script is idempotent — it skips generation if the file already exists.
The core framework auto-loads this file for every scenario.

---

## Diagnostics: Traces & Video

```bash
# Force traces on for ALL scenarios (default is retain-on-failure)
TRACE=on npm run test:saucedemo

# Record video for all scenarios
RECORD_VIDEO=true npm run test:portfolio

# Both at once
TRACE=on RECORD_VIDEO=true npm run test:saucedemo
```

Artifacts (screenshots, traces, videos) are saved to `reports/artifacts/`.

---

## Logging

```bash
# Set log level (error | warn | info | http | debug)
LOG_LEVEL=debug npm run test:portfolio
LOG_LEVEL=info npm run test:saucedemo
```

Log output locations:
- **Console** — colorized locally, plain text in CI
- **`logs/error.log`** — error level only (5MB max, 5 file rotations)
- **`logs/combined.log`** — all log levels (5MB max, 5 file rotations)

---

## Generating the HTML Report

After running tests, generate a rich HTML report from the Cucumber JSON output:

```bash
npm run report
```

- Input: auto-discovers all `reports/*-report.json` files
- Output: `reports/html-report/`

JSON reports are generated automatically at end of each test run:
- Portfolio: `reports/portfolio-report.json`
- SauceDemo: `reports/saucedemo-report.json`

---

## Scaffold a New Product

```bash
npm run generate:product -- --name <productname>
```

This creates the full product directory structure, scaffolds all template files,
and updates both `cucumber.js` and `package.json` automatically.

---

## Lint & Format

```bash
# Run ESLint
npm run lint

# Run Prettier (auto-fix)
npm run format
```

Pre-commit hooks (Husky + lint-staged) run these automatically on staged files.

---

## Docker Execution

```bash
# Build the image
docker build -t playgenie .

# Run default command (check Dockerfile for default)
docker run --rm playgenie

# Run specific product tests
docker run --rm playgenie npm run test:portfolio

# Run with tag filter
docker run --rm playgenie npx cucumber-js -p saucedemo --tags "@smoke"
```

---

## All npm Scripts Reference

| Script | Command | Purpose |
|---|---|---|
| `npm run test:portfolio` | `cucumber-js -p portfolio` | Run portfolio tests |
| `npm run test:saucedemo` | `cucumber-js -p saucedemo` | Run saucedemo tests |
| `npm run auth:saucedemo` | `tsx products/saucedemo/auth/setup.ts` | Generate saucedemo auth state |
| `npm run report` | `tsx core/reporting/generate-report.ts` | Generate HTML report |
| `npm run generate:product` | `tsx scripts/generate-product.ts` | Scaffold a new product |
| `npm run lint` | `eslint .` | Run ESLint |
| `npm run format` | `prettier --write` | Run Prettier |
| `npm run prepare` | `husky` | Install Husky pre-commit hooks |
