# Architecture & Key Decisions

This document explains *why* the suite is built the way it is — the brief
asked not just for tests, but for a demonstration of how I'd lead a team
toward a maintainable framework.

## 1. Layered structure (Page Objects → Fixtures → Tests)

```
test-data/  →  pages/  →  fixtures/  →  tests/
(raw data)     (screen         (wiring +        (business-readable
                interactions)   shared setup)     scenarios)
```

- **`pages/`** — one class per screen (`LoginPage`, `InventoryPage`,
  `CartPage`, `CheckoutPage`), each owning its own locators and the
  low-level interactions on that screen. A locator or a UI change is fixed
  in exactly one file.
- **`fixtures/base.ts`** — a custom Playwright fixture extends the base
  `test` object so every spec receives ready-made page objects
  (`{ loginPage, inventoryPage, cartPage, checkoutPage }`) instead of
  constructing them inline. It also exposes an `authenticatedPage` fixture
  that performs login once per test, so cart/checkout specs never repeat
  login steps.
- **`test-data/`** — credentials, customer info, and product-name constants
  live as typed objects, not magic strings buried in specs. Adding a new
  test user or a new negative-data case means editing one file, not
  hunting through test bodies.
- **`tests/`** — reads like a spec sheet: `login.spec.ts`,
  `cart.spec.ts`, `checkout.spec.ts`, grouped by user journey rather than
  by page, since that's how a product owner or QA lead reviewing coverage
  thinks about it.

This separation is what lets the suite scale: a new page added to the app
means one new page-object file and (if needed) one fixture line — every
existing test is untouched.

## 2. Locator strategy

Every locator targets `data-test="..."` attributes, which SauceDemo ships
specifically as automation hooks. In priority order, I favor:

1. `data-test` / `data-testid` attributes (used throughout this suite)
2. ARIA roles (`getByRole`) — used for the "Add to cart" / "Remove" buttons
   scoped within a product card, since their `data-test` values are
   dynamic (`add-to-cart-sauce-labs-backpack`) and matching by accessible
   role + scoped context is both more readable and equally stable
3. Visible text — only for filtering rows/cards (`.filter({ hasText })`),
   never as the sole selector for an interactive element

I deliberately avoid CSS class selectors (`.btn_primary`) and XPath — both
break the moment a designer changes styling or DOM nesting, with no
functional change to the app.

## 3. No hard waits

There is no `page.waitForTimeout()` anywhere in the suite. Instead:

- Every assertion is a **web-first assertion** (`expect(locator).toHaveText(...)`,
  `toBeVisible()`, `toHaveCount()`, `toHaveURL()`), which polls automatically
  until it passes or times out — no arbitrary sleep needed.
- Playwright's actionability checks (auto-waiting for elements to be
  visible, stable, and enabled before clicking/filling) handle the rest.
- Config-level `expect.timeout` (5s) and `actionTimeout` (10s) give a
  consistent, centrally-tunable ceiling instead of scattering timeout
  numbers across specs.

## 4. Test data management

Credentials and customer info are typed TypeScript objects
(`USERS`, `VALID_CUSTOMER`, `MISSING_POSTAL_CODE`, etc.), not inline
strings. Benefits:

- IDE autocomplete and compile-time errors if a field is renamed
- One place to add a new negative-data variant (e.g. a customer object with
  a symbol in the postal code) without touching test logic
- Clear separation between "what data are we using" and "what are we
  testing" — a reviewer can audit data choices in seconds

For a longer-lived project I'd extend this with a factory (e.g. faker.js
seeded per run) for any test needing unique, non-colliding data — not
needed here since SauceDemo's checkout doesn't persist orders.

## 5. Assertions & failure diagnostics

- Assertions check **outcomes a user would notice** — URL changes, visible
  error text, item counts, price/quantity values — not internal state.
- TC-09 and TC-10 don't just check that *a* total is shown; they
  independently recompute the expected subtotal from the individual item
  prices and assert the UI's number matches, which would catch a pricing
  bug that a "total is visible" check would miss.
- On failure, `playwright.config.ts` captures:
  - a **screenshot** (`only-on-failure`)
  - a **trace** (`retain-on-failure`) — full DOM snapshots, network, and
    console log, viewable in Playwright's Trace Viewer
  - a **video** (`retain-on-failure`)

  This means a failing CI run gives a debugger everything needed to
  diagnose the issue without reproducing it locally first.

## 6. Reporting

- **HTML reporter** (bonus requirement) is configured with
  `outputFolder: 'playwright-report'`, viewable via `npm run report`.
- **JUnit reporter** is also enabled — most CI/dashboard tooling (Jenkins,
  Azure DevOps, GitHub's own test summaries) consumes JUnit XML natively,
  so this makes the suite plug into whatever a hiring team's existing CI
  already expects.

## 7. Parallelism & cross-browser execution

- `fullyParallel: true` — every test file runs in its own worker.
- `projects` in the config define Chromium, Firefox, and WebKit as
  separate targets; `npm test` runs all three, or `npm run test:chromium`
  isolates one for fast local iteration.
- Worker count defaults to Playwright's automatic (CPU-based) local
  setting, capped to 2 in CI (`process.env.CI`) to stay within typical
  GitHub-hosted runner resources — configurable via `test:parallel`.

## 8. CI/CD integration

`.github/workflows/playwright.yml` (bonus) runs on push/PR to `main`, on a
nightly schedule, and on manual dispatch. It installs dependencies and
browsers, runs the full cross-browser suite, and uploads the HTML report +
JUnit results as build artifacts on every run — pass or fail — so a
reviewer can open the trace/report for a failing PR without re-running
anything locally.

**How I'd extend this for a real team pipeline:**

- **Gate merges** on this workflow passing (branch protection rule).
- **Shard** the run (`--shard=1/4` etc.) across parallel jobs once the
  suite grows past ~100 tests, to keep PR feedback under a few minutes.
- **Separate smoke vs. full regression**: tag a small `@smoke` subset
  (login + one full checkout) to run on every push, and reserve the full
  cross-browser matrix for the nightly schedule and pre-release gates.
- **Publish the JUnit results** to whatever dashboard the team already
  uses (GitHub Checks, Azure DevOps Test Plans, or a TestRail/Xray sync)
  so pass/fail trends are visible outside the Actions tab.
- **Slack/Teams notification** on nightly-run failure only, to avoid
  alert fatigue on routine PR runs.
- **Secrets/environment config** via GitHub Environments if the target
  moved from a public demo site to a staging environment requiring auth.

## 9. Framework choices I deliberately kept simple for a take-home

- `authenticatedPage` logs in through the real UI each test rather than
  using `storageState()` to skip login. For a take-home this keeps the
  flow transparent and easy to review; in a production suite I'd cache an
  authenticated `storageState.json` per user role in a `globalSetup` step
  to cut redundant login time across dozens of tests.
- No environment-specific config (dev/staging/prod base URLs) beyond a
  `BASE_URL` env var override, since SauceDemo only has the one public
  target.
