# SauceDemo Playwright Automation Suite

Automated coverage of the core SauceDemo (https://www.saucedemo.com) e-commerce
journey — login, inventory, cart, and checkout — built with **Playwright +
TypeScript**.

## Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm 9+

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Download the browser binaries Playwright drives (one-time)
npx playwright install --with-deps
```

## Running the tests

```bash
npm test                    # all 13 scenarios across chromium, firefox, webkit
npm run test:chromium       # single browser, faster local iteration
npm run test:headed         # watch the browser while it runs
npm run test:debug          # step through with the Playwright Inspector
npm run test:parallel       # force 4 workers regardless of CI/local default
npm run typecheck           # tsc --noEmit, no test execution
```

View the HTML report after any run:

```bash
npm run report
```

Reports open with `--open=never` by default so they don't launch a browser
tab automatically in CI; on your machine run `npm run report` to open the
last report, or find it at `playwright-report/index.html`.

## Project structure

```
saucedemo-playwright-suite/
├── tests/                    # test specs — one file per user journey
│   ├── login.spec.ts
│   ├── cart.spec.ts
│   └── checkout.spec.ts
├── pages/                    # Page Object Model — one class per screen
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── fixtures/
│   └── base.ts                # custom fixtures: page objects + authenticatedPage
├── test-data/
│   ├── users.ts                # demo account credentials
│   └── checkout-data.ts        # customer info + product name constants
├── utils/
│   └── money.ts                 # price-string parsing/summing helper
├── playwright.config.ts        # browsers, reporters, timeouts, trace/screenshot policy
├── .github/workflows/playwright.yml   # CI pipeline (bonus)
├── ARCHITECTURE.md              # design decisions and rationale
└── TEST_CASES.md                 # scenario/test-case documentation
```

## What's covered

| Area | Scenarios |
|---|---|
| Login | valid user, locked-out user, invalid password, nonexistent user, empty fields |
| Inventory | product count, add/remove updates cart badge |
| Cart | correct products, correct quantities, correct prices |
| Checkout | full happy path + confirmation, missing first name, missing postal code, cancel-and-preserve-cart |

13 scenarios × 3 browsers = **39 automated test runs** per full suite execution.
See `TEST_CASES.md` for the full scenario-by-scenario breakdown and
`ARCHITECTURE.md` for the reasoning behind the framework design.

## CI/CD

A GitHub Actions workflow (`.github/workflows/playwright.yml`) runs the full
suite on every push/PR to `main`, plus a nightly scheduled run, and uploads
the HTML report and JUnit results as build artifacts regardless of pass/fail.
See `ARCHITECTURE.md` → "CI/CD integration" for how this would extend into a
team pipeline.

## Notes

- Tests target the public demo site `https://www.saucedemo.com` — no
  authentication or API keys needed beyond the fixed demo accounts.
- No `page.waitForTimeout()` / hard sleeps anywhere in the suite — every wait
  is Playwright's built-in auto-waiting or an explicit web-first `expect(...)`.
