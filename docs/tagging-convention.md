# PlayGenie Tagging Conventions

In Cucumber, tags are how we select tests for execution, split runs across environments, and handle retries. This framework enforces a strict tagging taxonomy to keep parallel execution organized across multiple products.

Every scenario MUST have at least a **Product Tag** and a **Suite Tag**.

---

## 1. Product Tags (Mandatory)
Every feature file or scenario must be tagged with the product it belongs to. This ensures we don't accidentally run tests for Product A when deploying Product B.

- `@saucedemo`
- `@productX`

> **Note**: `cucumber.js` profiles use these tags automatically via path filtering, but it's best practice to include them on the Feature.

## 2. Suite Tags (Mandatory)
Determines *when* and *where* a test runs in the CI/CD pipeline.

- `@smoke` — Critical path only (Login, Checkout). Must be fast and 100% reliable. Run on every PR.
- `@regression` — Exhaustive suite. Run nightly or before major releases.
- `@e2e` — Multi-system integration tests. May be slow or require specific external dependencies.

## 3. Priority Tags (Optional but Recommended)
Useful for triaging failures.

- `@p0` — Blocks release if failing.
- `@p1` — High priority bug if failing.
- `@p2` — Edge cases or minor UI bugs.

## 4. Feature Area Tags (Optional)
Useful for local development or targeted regression testing (e.g., "only run checkout tests").

- `@login`
- `@checkout`
- `@inventory`
- `@search`

## 5. Execution Modifiers (Special)
These change how the framework handles the test.

- `@flaky` — Specifically opts the test into a higher retry count (if configured in `cucumber.js`). Use this when investigating an unstable test.
- `@skip` or `@wip` — (Work in progress) Excludes the test from CI runs.

---

## Examples

### Good ✅
```gherkin
@saucedemo @smoke @p0 @login
Feature: User Authentication
  # ...
```

### Bad ❌
```gherkin
@test # Too generic
Feature: User Authentication
  # ...
```
