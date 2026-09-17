# 03 — Core Layer

The `core/` directory contains all **product-agnostic** framework primitives.
Nothing in `core/` imports from `products/` or contains product-specific logic.

This document covers **what each file is** and **why it exists**. Method listings
are intentionally excluded — they change with normal development. The agent is
directed to read the actual source file for current method signatures.

---

## `core/pages/BasePage.ts`

**What it is:** An `abstract class BasePage` that every product page object in
the framework MUST extend. It is the foundation of the Page Object Model.

**Why it exists:** Eliminates boilerplate across all page objects and enforces
consistent, reliable interaction patterns across all products. Key patterns it
enforces: scroll-into-view before clicks, null-safe text extraction, non-throwing
visibility checks, and navigation with proper wait states.

**Constructor contract:** `(page: Page, logger?: Logger)`
- `page` — the Playwright `Page` instance (required)
- `logger` — optional; falls back to `new Logger('BasePage')` if not provided
- Product page objects should always pass both: `super(page, logger)`

**Categories of functionality it provides:** Navigation, click helpers, input
helpers, text extraction, visibility helpers, scroll utilities.

> ⚠️ **Agent rule:** Always read [`core/pages/BasePage.ts`](../core/pages/BasePage.ts)
> directly to see the current, up-to-date list of available methods before
> writing or reviewing any page object. Do not assume methods exist based on
> memory — the file is the source of truth.

---

## `core/browser/CustomWorld.ts`

**What it is:** The Cucumber `World` class for the entire framework, registered
via `setWorldConstructor(CustomWorld)`. This is what `this` refers to inside
every Cucumber step definition and hook.

**Why it exists:** Attaches Playwright browser primitives (`browser`, `context`,
`page`, `request`) and framework utilities (`logger`, `sharedData`) to every
scenario's execution context so they are available as `this.<property>` in all
step files.

**Key architectural design:** The `pages` property is typed as `unknown` at the
core level. This keeps `core/` product-agnostic. Each product narrows it to its
own strongly-typed `PageManager` via their `support/types.ts` file using
TypeScript interface extension (`extends Omit<CustomWorld, 'sharedData'>`).

> ⚠️ **Agent rule:** Read [`core/browser/CustomWorld.ts`](../core/browser/CustomWorld.ts)
> for the full, current list of `this` properties available in all step
> definitions and hooks.

---

## `core/browser/hooks.ts`

**What it is:** The global Cucumber lifecycle hooks — `BeforeAll`, `Before`,
`After`, and `AfterAll` — that manage the Playwright browser lifecycle for every
scenario across all products.

**Why it exists:** Centralises all browser infrastructure concerns (browser
launch, isolated context creation, storageState injection, tracing, screenshot
capture on failure, teardown) so that product-level hooks only need to handle
their own `PageManager` setup. This is a deliberate separation of concerns.

**Load order guarantee:** `core/browser/**` is listed as the first entry in the
`require` array of every product profile in `cucumber.js`. This guarantees that
the core `Before` hook (which sets up `this.page`, `this.context`, etc.) always
runs before the product `Before` hook (which sets up `this.pages`). This order
is a hard dependency — never change it.

**What the core hooks do (summary):**
- `BeforeAll` — Launches the configured browser once for the entire test run
- `Before` — Creates an isolated `BrowserContext` + `Page` + `APIRequestContext` per scenario; injects storageState if available; starts tracing
- `After` — On failure: captures full-page screenshot and saves trace. Always: closes page, context, and request
- `AfterAll` — Closes the global browser with a 5-second timeout guard to prevent hangs in parallel mode

> ⚠️ **Agent rule:** Read [`core/browser/hooks.ts`](../core/browser/hooks.ts)
> to understand the full Before/After lifecycle before adding any new hook logic.
> Never add product-specific logic to these core hooks.

---

## `core/utils/logger.ts`

**What it is:** A `class Logger` built on Winston using the singleton root +
child logger pattern.

**Why it exists:** Provides structured, context-tagged, timestamp-prefixed
logging that is safe for parallel Cucumber workers (a single root Winston
instance holds all file handles, avoiding duplicate writes), and CI-aware
(automatically switches to plain text output without ANSI color codes when
running in Jenkins or other CI systems).

**Stable facts about the logger:**
- Log files are always written to `logs/error.log` (errors only) and
  `logs/combined.log` (all levels), relative to the project root
- Log level is controlled by the `LOG_LEVEL` environment variable
- CI detection uses: `!process.stdout.isTTY`, `CI`, `JENKINS_URL`, `BUILD_ID`
- Usage: `new Logger('MyContext')` — the string becomes the `[Context]` label
  in every log line

> ⚠️ **Agent rule:** Read [`core/utils/logger.ts`](../core/utils/logger.ts)
> for current log levels, transport config, and the `isCI()` detection logic.
> Never use `console.log` anywhere in this framework — always use the `Logger`
> class or `this.logger`.

---

## `core/auth/storage-manager.ts`

**What it is:** A `class StorageManager` with static utility methods for
managing Playwright `storageState` JSON files used for auth session reuse.

**Why it exists:** Centralises the file naming convention and existence checks
for auth state across all products, so every product that needs authentication
uses a consistent, predictable path pattern.

**The naming convention (will not change):**
```
.state/{product}_{env}_{persona}.json
```
Example: `.state/SauceDemo_qa_default.json`

> ⚠️ **Agent rule:** Read [`core/auth/storage-manager.ts`](../core/auth/storage-manager.ts)
> for current static methods before implementing any auth-related file logic.

---

## `core/api/ApiHelper.ts`

**What it is:** A helper class wrapping Playwright's `APIRequestContext` for
making REST API calls within test scenarios.

> ⚠️ **Agent rule:** Read [`core/api/ApiHelper.ts`](../core/api/ApiHelper.ts)
> for current available request methods before writing any API test logic.

---

## `core/reporting/generate-report.ts`

**What it is:** A standalone Node script (run via `tsx`) that auto-discovers all
`reports/*-report.json` files produced by Cucumber and generates a rich HTML
report at `reports/html-report/` using `multiple-cucumber-html-reporter`.

**Run via:** `npm run report`

This script is not a test file — it is a post-execution utility. It does not
use Playwright or Cucumber APIs directly.

---

## `core/types/multiple-cucumber-html-reporter.d.ts`

**What it is:** A TypeScript declaration file (`.d.ts`) that provides type
definitions for the `multiple-cucumber-html-reporter` package, which does not
ship its own types.

---

## `core/index.ts`

**What it is:** A barrel export file that re-exports the public API of `core/`:
- `export * from './pages'` → exports `BasePage`
- `export * from './utils'` → exports `Logger`

Products can import from `@core` using this barrel instead of deep paths when
importing multiple core utilities.
