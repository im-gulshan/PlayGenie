# 02 — Products Inventory

**Total products: 2** — `portfolio`, `saucedemo`

This file is the authoritative inventory of every file in every product.
When looking for a file, adding to a product, or understanding what exists —
read this document first.

---

## Product 1: `portfolio`

**What it tests:** Gulshan Kumar's personal SDET portfolio website
**URL:** `https://gulshan-sdet.in/` (overrideable via `PORTFOLIO_URL` env var)
**Run command:** `npm run test:portfolio`
**Auth:** None — no login required. The Before hook simply navigates to `baseUrl`.
**Cucumber profile:** `portfolio` in `cucumber.js`
**Parallel workers:** 2
**Root directory:** `products/portfolio/`

---

### Config

| File | Purpose |
|---|---|
| [`config/portfolio.config.ts`](../../../products/portfolio/config/portfolio.config.ts) | Merges global + env config. Sets `productName: 'Portfolio'` and `baseUrl` from `PORTFOLIO_URL` env var or the default URL. Interface: `PortfolioConfig extends ProductConfigBase`. |

---

### Data

| File | Purpose |
|---|---|
| [`data/qa.data.ts`](../../../products/portfolio/data/qa.data.ts) | All expected QA test data. Covers: hero (name: Gulshan Kumar, role: SDET-II, company: S&P Global, yearsExperience: 7+, email: gulshan.sdet@gmail.com), navigation tabs, experience companies (S&P Global, TCS, Amazon), skills categories and items, projects (Selenium Automation Framework), innovations (6 items), education (LPU, Guru Nanak, RSBV), contact (Noida, India; email; LinkedIn; GitHub; Telegram; copyright). |
| [`data/index.ts`](../../../products/portfolio/data/index.ts) | Env-based data resolver. Exports `portfolioData` — loads `qa.data.ts` or the matching env file based on `TEST_ENV`. Import as: `import { portfolioData } from '../data'` |

---

### Support

| File | Purpose |
|---|---|
| [`support/hooks.ts`](../../../products/portfolio/support/hooks.ts) | Product-level `Before` hook. Runs **after** the core `Before` hook. Creates `PageManager` instance and navigates to `config.baseUrl`. |
| [`support/types.ts`](../../../products/portfolio/support/types.ts) | Defines `PortfolioWorld` (extends `CustomWorld`, narrows `pages` to `PageManager`) and `PortfolioSharedState` (`activeTab?: string`, `activeSkillCategory?: string`). |
| [`support/steps.ts`](../../../products/portfolio/support/steps.ts) | Typed wrappers for `Given`, `When`, `Then` bound to `PortfolioWorld`. All portfolio step files MUST import from here. |

---

### Pages

| File | Purpose |
|---|---|
| [`pages/PageManager.ts`](../../../products/portfolio/pages/PageManager.ts) | Aggregates all 8 page objects. Instantiated once per scenario in `support/hooks.ts`. Access via `this.pages.<pageName>` in step files. |
| [`pages/NavigationPage.ts`](../../../products/portfolio/pages/NavigationPage.ts) | Section tab navigation, header nav links, theme toggle, scroll-to-top button, brand name. Also temporarily holds theme toggle interactions pending refactor. |
| [`pages/HeroPage.ts`](../../../products/portfolio/pages/HeroPage.ts) | Hero section: name, role, company, stats (years experience, domains, innovations), email, LinkedIn link, page title. |
| [`pages/ExperiencePage.ts`](../../../products/portfolio/pages/ExperiencePage.ts) | Experience section: company cards, job roles, employment periods. Companies: S&P Global, TCS, Amazon. |
| [`pages/SkillsPage.ts`](../../../products/portfolio/pages/SkillsPage.ts) | Skills section: category tabs (Programming Languages, Automation Testing, Performance Testing, Manual Testing, API Testing) and skill items within each category. |
| [`pages/ProjectsPage.ts`](../../../products/portfolio/pages/ProjectsPage.ts) | Projects section: project cards, GitHub URLs, technology tags. |
| [`pages/InnovationsPage.ts`](../../../products/portfolio/pages/InnovationsPage.ts) | Innovations section: list of 6 innovation items. |
| [`pages/EducationPage.ts`](../../../products/portfolio/pages/EducationPage.ts) | Education section: institutions and degree names. |
| [`pages/ContactPage.ts`](../../../products/portfolio/pages/ContactPage.ts) | Contact section: status badge, heading, location, email, LinkedIn, GitHub, Telegram links, copyright text. |

---

### Feature Files (9)

| File | Tags | Scenarios covered |
|---|---|---|
| [`features/hero.feature`](../../../products/portfolio/features/hero.feature) | `@portfolio @regression` | Hero section content — name, role, company, stats, social links, page title |
| [`features/navigation.feature`](../../../products/portfolio/features/navigation.feature) | `@portfolio @smoke` | Tab navigation, header nav links, sticky nav visibility, scroll-to-top, brand name |
| [`features/experience.feature`](../../../products/portfolio/features/experience.feature) | `@portfolio @regression` | Experience section — subtitle, company names, roles, periods |
| [`features/skills.feature`](../../../products/portfolio/features/skills.feature) | `@portfolio @regression` | Skills section — subtitle, category tabs, skill items per category |
| [`features/projects.feature`](../../../products/portfolio/features/projects.feature) | `@portfolio @regression` | Projects section — subtitle, project names, GitHub links |
| [`features/innovations.feature`](../../../products/portfolio/features/innovations.feature) | `@portfolio @regression` | Innovations section — subtitle, innovation item names |
| [`features/education.feature`](../../../products/portfolio/features/education.feature) | `@portfolio @regression` | Education section — subtitle, institution names, degree names |
| [`features/contact.feature`](../../../products/portfolio/features/contact.feature) | `@portfolio @regression` | Contact section — status badge, heading, location, email, social links, copyright |
| [`features/theme_toggle.feature`](../../../products/portfolio/features/theme_toggle.feature) | `@portfolio @theme` | Dark/light mode toggle — button presence, toggle switching, toggle back |

---

### Step Definition Files (8)

| File | Covers |
|---|---|
| [`steps/hero.steps.ts`](../../../products/portfolio/steps/hero.steps.ts) | Hero section step definitions |
| [`steps/navigation.steps.ts`](../../../products/portfolio/steps/navigation.steps.ts) | Navigation step definitions + **theme toggle step definitions (intentionally co-located here — see note below)** |
| [`steps/experience.steps.ts`](../../../products/portfolio/steps/experience.steps.ts) | Experience section step definitions |
| [`steps/skills.steps.ts`](../../../products/portfolio/steps/skills.steps.ts) | Skills section step definitions |
| [`steps/projects.steps.ts`](../../../products/portfolio/steps/projects.steps.ts) | Projects section step definitions |
| [`steps/innovations.steps.ts`](../../../products/portfolio/steps/innovations.steps.ts) | Innovations section step definitions |
| [`steps/education.steps.ts`](../../../products/portfolio/steps/education.steps.ts) | Education section step definitions |
| [`steps/contact.steps.ts`](../../../products/portfolio/steps/contact.steps.ts) | Contact section step definitions |

> **Theme Toggle Steps — Intentional Design:**
> The step definitions for `theme_toggle.feature` (`I click the theme toggle
> button`, `the theme toggle button should be visible`) are defined inside
> `navigation.steps.ts`. This is intentional — there is no separate
> `theme_toggle.steps.ts` and none is planned. Do **not** create one.

---

## Product 2: `saucedemo`

**What it tests:** SauceDemo e-commerce demo app (login + product/checkout flow)
**URL:** `https://www.saucedemo.com/` (overrideable via `BASE_URL` env var)
**Run command:** `npm run test:saucedemo`
**Auth:** Optional storage state. Run `npm run auth:saucedemo` to pre-generate.
**Cucumber profile:** `saucedemo` in `cucumber.js`
**Parallel workers:** 3
**Root directory:** `products/saucedemo/`

---

### Auth

| File | Purpose |
|---|---|
| [`auth/setup.ts`](../../../products/saucedemo/auth/setup.ts) | Standalone script. Launches Chromium headless, performs UI login via `LoginPage`, saves storageState to `.state/SauceDemo_{env}_default.json`. Idempotent: skips if file already exists. Reads credentials from `SAUCE_USERNAME` and `SAUCE_PASSWORD` env vars (set in `.env`). Run via: `npm run auth:saucedemo`. |

---

### Config

| File | Purpose |
|---|---|
| [`config/saucedemo.config.ts`](../../../products/saucedemo/config/saucedemo.config.ts) | Merges global + env config. Sets `productName: 'SauceDemo'` and `baseUrl` from `BASE_URL` env var or the default URL. Interface: `SauceDemoConfig extends ProductConfigBase`. |

---

### Data

| File | Purpose |
|---|---|
| [`data/common.data.ts`](../../../products/saucedemo/data/common.data.ts) | Test data shared across all environments. |
| [`data/qa.data.ts`](../../../products/saucedemo/data/qa.data.ts) | QA-specific test data. |
| [`data/uat.data.ts`](../../../products/saucedemo/data/uat.data.ts) | UAT-specific test data. |
| [`data/index.ts`](../../../products/saucedemo/data/index.ts) | Env-based data resolver. Exports the correct dataset based on `TEST_ENV`. |

---

### Support

| File | Purpose |
|---|---|
| [`support/hooks.ts`](../../../products/saucedemo/support/hooks.ts) | Product-level `Before` hook. Sets `this.sharedData.productName = 'saucedemo'` and creates `PageManager`. |
| [`support/types.ts`](../../../products/saucedemo/support/types.ts) | Defines `SauceDemoWorld` (extends `CustomWorld`, narrows `pages` to `PageManager`) and `SauceDemoSharedState` (`productName?`, `firstProdName?`, `allProductsName?: string[]`). |
| [`support/steps.ts`](../../../products/saucedemo/support/steps.ts) | Typed wrappers for `Given`, `When`, `Then` bound to `SauceDemoWorld`. All saucedemo step files MUST import from here. |

---

### Pages

| File | Purpose |
|---|---|
| [`pages/PageManager.ts`](../../../products/saucedemo/pages/PageManager.ts) | Aggregates all 6 page objects. Instantiated once per scenario. |
| [`pages/LoginPage.ts`](../../../products/saucedemo/pages/LoginPage.ts) | Username input, password input, login button, error message handling. |
| [`pages/ProductsPage.ts`](../../../products/saucedemo/pages/ProductsPage.ts) | Product inventory list, sort dropdown, add-to-cart buttons. |
| [`pages/CartPage.ts`](../../../products/saucedemo/pages/CartPage.ts) | Shopping cart — items list, quantities, checkout button. |
| [`pages/CheckoutInfoPage.ts`](../../../products/saucedemo/pages/CheckoutInfoPage.ts) | Checkout information form — first name, last name, postal code. |
| [`pages/CheckoutOverviewPage.ts`](../../../products/saucedemo/pages/CheckoutOverviewPage.ts) | Order summary — item list, totals, finish button. |
| [`pages/CheckoutCompletePage.ts`](../../../products/saucedemo/pages/CheckoutCompletePage.ts) | Order confirmation / thank you page. |

---

### Feature Files (2)

| File | Tags | Scenarios covered |
|---|---|---|
| [`features/login.feature`](../../../products/saucedemo/features/login.feature) | `@saucedemo @smoke @login` | Login with valid credentials, invalid credentials, locked-out user |
| [`features/product_validation.feature`](../../../products/saucedemo/features/product_validation.feature) | `@saucedemo @regression` | Product listing, sorting, add to cart, checkout flow, order confirmation |

---

### Step Definition Files (2)

| File | Covers |
|---|---|
| [`steps/login.steps.ts`](../../../products/saucedemo/steps/login.steps.ts) | Login/logout step definitions |
| [`steps/product_validation.steps.ts`](../../../products/saucedemo/steps/product_validation.steps.ts) | Product listing, cart, full checkout flow step definitions |
