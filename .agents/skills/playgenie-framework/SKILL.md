---
name: playgenie-framework
description: >-
  Comprehensive knowledge base for the PlayGenie Playwright + Cucumber BDD
  automation framework. Activate this skill when working on ANYTHING in this
  repository: adding features, debugging failures, writing page objects, steps,
  configs, running tests, or onboarding to the codebase. This skill is the
  single source of truth — read it before assuming anything about the framework.
---

# PlayGenie Framework Knowledge Base

PlayGenie is a **multi-product UI automation framework** built on Playwright and
Cucumber BDD with TypeScript. It is designed to test multiple independent web
applications (called **products**) from a single codebase, with strict isolation
between them.

**Framework name in package.json:** `playgenie`
**Location:** `d:\GoogleAntiGravity\Playwright-Framework\`
**Products:** 2 → `portfolio`, `saucedemo`

---

## Task → Reference Map

Before doing any work in this repo, identify your task and read the matching
reference file. Do **not** guess — read the file.

| Your Task | Read This |
|---|---|
| Understand how the framework is structured and why | [`01-architecture.md`](./references/01-architecture.md) |
| Find a specific file, understand a product, add anything to portfolio or saucedemo | [`02-products.md`](./references/02-products.md) |
| Use or extend `BasePage`, `Logger`, `CustomWorld`, hooks, auth, or reporting | [`03-core-layer.md`](./references/03-core-layer.md) |
| Work with config, environments, env vars, or product config merging | [`04-config-system.md`](./references/04-config-system.md) |
| Add a new page, feature, step file, data file, or entire product | [`05-patterns.md`](./references/05-patterns.md) |
| Run tests, filter by tag, select browser/env, use Docker, generate reports | [`06-commands.md`](./references/06-commands.md) |

---

## Critical Rules — Never Violate These

These rules are architectural laws of this framework. Breaking them will cause
runtime errors, type errors, or broken test isolation.

1. **All page objects MUST extend `BasePage`** from `core/pages/BasePage.ts`.
   Never create a page object that extends `World` or has no base class.

2. **Step files MUST import `{ Given, When, Then }` from `../support/steps`**
   (the typed wrapper). Never import directly from `@cucumber/cucumber` in steps
   — you will lose type safety on `this`.

3. **Never import or instantiate `Logger` in step files.** Use `this.logger`
   which is already available on the World.

4. **`core/` is product-agnostic.** Never add product-specific logic, imports,
   or hardcoded URLs inside any `core/` file.

5. **Hook execution order is guaranteed by the `cucumber.js` require array:**
   `core/browser/**` loads before `products/*/support/**`. Core `Before` hook
   always runs first (sets up browser/page/context), product `Before` hook
   runs second (sets up PageManager). Never reorder this.

6. **Each scenario gets its own isolated `BrowserContext`.** Tests are safe to
   run in parallel. Never share mutable state across scenarios — use
   `this.sharedData` for intra-scenario state only.

7. **Never call `console.log` in framework code.** Always use `this.logger` in
   steps and hooks. Use the `Logger` class directly in core/utility files.

8. ⚠️ **Known Gap — Theme Toggle Steps:** The step definitions for
   `portfolio/features/theme_toggle.feature` are **temporarily located inside**
   `products/portfolio/steps/navigation.steps.ts` (approximately lines 16–42).
   A dedicated `products/portfolio/steps/theme_toggle.steps.ts` is planned.
   When it is created, those step definitions will be moved there. Do not create
   duplicate step definitions for theme toggle.
