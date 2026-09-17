# 01 — Framework Architecture

## What is PlayGenie?

PlayGenie is a **multi-product UI test automation framework** that lets you test
multiple independent web applications from a single codebase. Each application
is called a **product** and is fully isolated from every other product at the
file, config, and execution level.

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| `@playwright/test` | ^1.40.0 | Browser automation engine |
| `@cucumber/cucumber` | ^10.0.0 | BDD test runner (Gherkin feature files) |
| TypeScript | ~5.7.0 | Language (run directly via `tsx`, no compile step) |
| `tsx` | ^4.23.12 | `requireModule: ['tsx/cjs']` — executes `.ts` files without compiling |
| `winston` | ^3.17.0 | Structured logging |
| `multiple-cucumber-html-reporter` | ^3.7.0 | HTML test report generation |
| `husky` + `lint-staged` | ^9 / ^15 | Pre-commit hooks (ESLint + Prettier) |
| `dotenv` | ^16.4.5 | `.env` file injection for local secrets |

---

## Three-Layer Architecture

```
config/                    ← Layer 1: Global defaults + environment configs
core/                      ← Layer 2: Product-agnostic primitives
products/<name>/           ← Layer 3: Everything product-specific
```

**Layer 1 — `config/`**
Global configuration (browser, timeouts, diagnostics, paths) and per-environment
overrides. Nothing in `config/` knows about any specific product.

**Layer 2 — `core/`**
Reusable framework primitives: `BasePage`, `CustomWorld`, lifecycle hooks,
`Logger`, `StorageManager`, `ApiHelper`, and the report generator.
`core/` files are strictly product-agnostic — they must never import from
`products/` or reference product-specific URLs.

**Layer 3 — `products/<name>/`**
Everything that belongs to one specific product: feature files, page objects,
step definitions, support hooks, types, test data, product config, and auth setup.
Products are completely isolated from each other.

---

## Product Isolation Model

Each product maps to a named **Cucumber profile** in `cucumber.js`.

```javascript
// cucumber.js (simplified)
module.exports = {
  portfolio:  { paths: ['products/portfolio/features/**/*.feature'],  require: [...] },
  saucedemo:  { paths: ['products/saucedemo/features/**/*.feature'],  require: [...] },
};
```

Running `npm run test:portfolio` only loads portfolio features and portfolio
step/support files. SauceDemo files are never touched.

**`require` array load order (critical for hook sequencing):**
```
core/browser/**/*.ts       ← Loaded first (CustomWorld + global hooks)
core/utils/**/*.ts         ← Loaded second (Logger)
products/<name>/steps/**   ← Loaded third (step definitions)
products/<name>/support/** ← Loaded last (product hooks + types)
```

---

## Parallel Execution Model

- One **global `Browser` instance** is created in `BeforeAll` and closed in
  `AfterAll`.
- Each **scenario** gets its own isolated `BrowserContext` (not a new browser).
  This is the Playwright equivalent of a fresh incognito session.
- Scenarios are safe to run in parallel because they share zero mutable state.
- The `Logger` uses a singleton root + child logger pattern — one set of file
  handles shared across all parallel workers, no duplicate writes.

**Parallelism per product:**
- `portfolio`: 2 parallel workers
- `saucedemo`: 3 parallel workers

---

## TypeScript Path Aliases

Defined in `tsconfig.json`. Use these in imports everywhere — never use relative
paths that traverse multiple levels up (e.g., `../../../core/`).

| Alias | Resolves To |
|---|---|
| `@core/*` | `./core/*` |
| `@config/*` | `./config/*` |
| `@products/*` | `./products/*` |

**Examples:**
```typescript
import { BasePage } from '@core/pages/BasePage';
import { Logger } from '@core/utils/logger';
import config from '@config/global.config';
```

---

## Key Design Decisions

| Decision | Reason |
|---|---|
| `tsx` instead of `tsc` compile step | Faster dev loop; no `dist/` folder to manage |
| One `Browser`, many `BrowserContext`s | Avoids expensive browser launch per scenario while keeping full isolation |
| `pages: unknown` in core `CustomWorld` | Core stays product-agnostic; each product narrows the type via `support/types.ts` |
| Typed `Given`/`When`/`Then` wrappers in `support/steps.ts` | Gives full `this` type inference in step files without casting |
| `createProductConfig<T>()` factory | One merge function handles all config layering; new products get type safety for free |
