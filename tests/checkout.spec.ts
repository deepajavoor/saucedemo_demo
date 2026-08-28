import { test, expect } from '../fixtures/base';
import { PRODUCTS, VALID_CUSTOMER, MISSING_FIRST_NAME, MISSING_POSTAL_CODE } from '../test-data/checkout-data';
import { sumPrices } from '../utils/money';

/** Shared arrange step: log in, add two products, reach the cart. */
async function addTwoProductsAndGoToCart(authenticatedPage: any) {
  await authenticatedPage.addProductToCart(PRODUCTS.backpack);
  await authenticatedPage.addProductToCart(PRODUCTS.fleeceJacket);
  await authenticatedPage.goToCart();
}

test.describe('Checkout', () => {
  test('TC-10 complete checkout end-to-end with valid customer information', async ({
    page,
    authenticatedPage,
    cartPage,
    checkoutPage,
  }) => {
    await addTwoProductsAndGoToCart(authenticatedPage);

    const backpackPrice = await cartPage.getItemPrice(PRODUCTS.backpack);
    const jacketPrice = await cartPage.getItemPrice(PRODUCTS.fleeceJacket);
    const expectedSubtotal = sumPrices([backpackPrice, jacketPrice]);

    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    await checkoutPage.fillCustomerInfo(VALID_CUSTOMER);
    await checkoutPage.continueToOverview();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Verify order summary math rather than trusting the displayed total blindly —
    // subtotal should equal the sum of the two item prices carried from the cart.
    const subtotalText = await checkoutPage.summarySubtotal.innerText();
    expect(subtotalText).toContain(expectedSubtotal.toFixed(2));

    const total = await checkoutPage.getTotalAsNumber();
    expect(total).toBeGreaterThan(expectedSubtotal); // tax is added on top

    await checkoutPage.finishOrder();

    // Order confirmation
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(checkoutPage.completeText).toBeVisible();
    await expect(authenticatedPage.cartBadge).toHaveCount(0); // cart is cleared after purchase
  });

  test('TC-11 [negative] checkout blocks submission when first name is missing', async ({
    page,
    authenticatedPage,
    cartPage,
    checkoutPage,
  }) => {
    await addTwoProductsAndGoToCart(authenticatedPage);
    await cartPage.proceedToCheckout();

    await checkoutPage.fillCustomerInfo(MISSING_FIRST_NAME);
    await checkoutPage.continueToOverview();

    await expect(page).toHaveURL(/checkout-step-one\.html/); // did not advance
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('TC-12 [negative] checkout blocks submission when postal code is missing', async ({
    page,
    authenticatedPage,
    cartPage,
    checkoutPage,
  }) => {
    await addTwoProductsAndGoToCart(authenticatedPage);
    await cartPage.proceedToCheckout();

    await checkoutPage.fillCustomerInfo(MISSING_POSTAL_CODE);
    await checkoutPage.continueToOverview();

    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
  });

  test('TC-13 cancelling from the overview screen returns to the inventory page', async ({
    page,
    authenticatedPage,
    cartPage,
    checkoutPage,
  }) => {
    await addTwoProductsAndGoToCart(authenticatedPage);
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCustomerInfo(VALID_CUSTOMER);
    await checkoutPage.continueToOverview();

    await checkoutPage.cancelButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
    // Cart contents are preserved on cancel — SauceDemo does not clear on cancel.
    expect(await authenticatedPage.getCartCount()).toBe(2);
  });
});
