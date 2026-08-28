import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS } from '../test-data/users';

/**
 * Extends Playwright's base test with:
 *  1. Ready-to-use page objects — specs never call `new LoginPage(page)` directly.
 *  2. An `authenticatedPage` fixture that performs login once per test via
 *     the UI (kept simple/transparent for a take-home; in a larger suite this
 *     would use storageState() to skip the UI login and save time).
 *
 * This is the main lever for maintainability: adding a new page object or
 * changing how "being logged in" works happens in exactly one place.
 */
type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  authenticatedPage: InventoryPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  // Any test that declares this fixture starts already logged in as the
  // standard user and lands on the inventory page — removes repetitive
  // login boilerplate from every cart/checkout test.
  authenticatedPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await use(new InventoryPage(page));
  },
});

export { expect };
