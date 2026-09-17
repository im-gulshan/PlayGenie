# 04 — Configuration System

## Overview

The framework uses a **three-tier config merge** system. Every product gets a
fully resolved config object that starts from global defaults, applies
environment overrides, then applies product-specific values.

```
Global defaults  ←  Environment overrides  ←  Product overrides
(config/global.config.ts)   (config/env/*.ts)   (products/<name>/config/<name>.config.ts)
```

---

## File: `config/global.config.ts`

**Role:** The root of the entire config system. Exported as the default export
and also exports the factory function and all config interfaces.

**Default export:** A `GlobalConfig` object with these values:

| Field | Default | Env var override |
|---|---|---|
| `browser` | `'chromium'` | `BROWSER` |
| `headless` | `false` (headed locally) | `HEADLESS=true` |
| `defaultTimeout` | `30000` ms | — |
| `navigationTimeout` | `15000` ms | — |
| `apiTimeout` | `10000` ms | — |
| `recordVideo` | `false` | `RECORD_VIDEO=true` |
| `trace` | `'retain-on-failure'` | `TRACE` (`on`/`off`/`retain-on-failure`) |
| `screenshot` | `'only-on-failure'` | `SCREENSHOT` |
| `artifactsDir` | `reports/artifacts/` | — |
| `stateDir` | `.state/` | — |

**Named exports:**
- `GlobalConfig` — interface for the global config shape
- `EnvironmentConfig` — `Partial<GlobalConfig> & { envName: string }`
- `ProductConfigBase` — `GlobalConfig & { productName, baseUrl, envName }` (base for all product configs)
- `createProductConfig<T>()` — the config factory function (see below)

---

## The Factory Function: `createProductConfig<T>()`

```typescript
createProductConfig<T extends ProductConfigBase>(
  envConfig: EnvironmentConfig,
  productOverrides: Omit<T, keyof GlobalConfig | 'envName'> & Partial<GlobalConfig>
): T
```

Every product config file calls this function. It:
1. Spreads global defaults
2. Spreads env config overrides (can override browser, timeouts, etc. per env)
3. Spreads product-specific fields (name, baseUrl, and any product-specific fields)
4. Returns a fully typed `T` config object

---

## Environment Config Files

Location: `config/env/`

| File | `envName` | Purpose |
|---|---|---|
| `config/env/qa.ts` | `'qa'` | QA environment overrides (currently minimal — just sets `envName`) |

**How the env is selected:** The `TEST_ENV` environment variable (default: `'qa'`).
Each product config does:
```typescript
const envName = process.env.TEST_ENV || 'qa';
const envConfig = require(`../../../config/env/${envName}`).default;
```

To add a new environment (e.g., `staging`), create `config/env/staging.ts`
and run tests with `TEST_ENV=staging`.

---

## Product Config Files

Each product has its own config file that calls `createProductConfig<T>()`.

### `products/portfolio/config/portfolio.config.ts`
- Interface: `PortfolioConfig extends ProductConfigBase` (no extra fields currently)
- `productName: 'Portfolio'`
- `baseUrl`: `process.env.PORTFOLIO_URL || 'https://gulshan-sdet.in/'`
- Default export: the resolved `portfolioConfig` object

### `products/saucedemo/config/saucedemo.config.ts`
- Interface: `SauceDemoConfig extends ProductConfigBase` (no extra fields currently)
- `productName: 'SauceDemo'`
- `baseUrl`: `process.env.BASE_URL || 'https://www.saucedemo.com/'`
- Default export: the resolved `saucedemoConfig` object

---

## TypeScript Path Aliases

Defined in `tsconfig.json`. Always use these in imports — never traverse up
directories manually.

```json
"paths": {
  "@core/*": ["./core/*"],
  "@config/*": ["./config/*"],
  "@products/*": ["./products/*"]
}
```

---

## Key Environment Variables Summary

| Env Var | Used By | Effect |
|---|---|---|
| `TEST_ENV` | All product configs | Selects env config file (default: `qa`) |
| `BROWSER` | `global.config.ts` | Sets browser: `chromium` / `firefox` / `webkit` |
| `HEADLESS` | `global.config.ts` | `true` for headless mode (required in CI) |
| `PORTFOLIO_URL` | `portfolio.config.ts` | Overrides portfolio base URL |
| `BASE_URL` | `saucedemo.config.ts` | Overrides SauceDemo base URL |
| `SAUCE_USERNAME` | `saucedemo/auth/setup.ts` | SauceDemo login username |
| `SAUCE_PASSWORD` | `saucedemo/auth/setup.ts` | SauceDemo login password (from `.env`) |
| `RECORD_VIDEO` | `global.config.ts` | `true` to record video per scenario |
| `TRACE` | `global.config.ts` | `on` / `off` / `retain-on-failure` |
| `LOG_LEVEL` | `core/utils/logger.ts` | Winston log level: `error`/`warn`/`info`/`http`/`debug` |

> ⚠️ Never commit `.env`. It is in `.gitignore`. Use `.env.example` to show
> the required variable names without values.
