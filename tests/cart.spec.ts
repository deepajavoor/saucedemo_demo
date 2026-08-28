import { test, expect } from '../fixtures/base';
import { PRODUCTS } from '../test-data/checkout-data';

test.describe('Inventory & Cart', () => {
  test('TC-06 inventory page lists all six products', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.inventoryItems).toHaveCount(6);
  });

  test('TC-07 adding a product updates the cart badge count', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.cartBadge).toHaveCount(0); // no badge when cart is empty

    await authenticatedPage.addProductToCart(PRODUCTS.backpack);
    expect(await authenticatedPage.getCartCount()).toBe(1);

    await authenticatedPage.addProductToCart(PRODUCTS.bikeLight);
    expect(await authenticatedPage.getCartCount()).toBe(2);
  });

  test('TC-08 removing a product decrements the cart badge', async ({ authenticatedPage }) => {
    await authenticatedPage.addProductToCart(PRODUCTS.backpack);
    await authenticatedPage.addProductToCart(PRODUCTS.bikeLight);
    expect(await authenticatedPage.getCartCount()).toBe(2);

    await authenticatedPage.removeProductFromCart(PRODUCTS.backpack);
    expect(await authenticatedPage.getCartCount()).toBe(1);
  });

  test('TC-09 cart reflects the correct products, quantities, and prices', async ({
    page,
    authenticatedPage,
    cartPage,
  }) => {
    const backpackPrice = await authenticatedPage.getProductPrice(PRODUCTS.backpack);
    const bikeLightPrice = await authenticatedPage.getProductPrice(PRODUCTS.bikeLight);

    await authenticatedPage.addProductToCart(PRODUCTS.backpack);
    await authenticatedPage.addProductToCart(PRODUCTS.bikeLight);
    await authenticatedPage.goToCart();

    await expect(page).toHaveURL(/cart\.html/);

    // Correct products
    const namesInCart = await cartPage.getItemNames();
    expect(namesInCart).toEqual(expect.arrayContaining([PRODUCTS.backpack, PRODUCTS.bikeLight]));
    expect(namesInCart).toHaveLength(2);

    // Quantities — SauceDemo's "Add to cart" always sets qty to 1; asserting
    // this explicitly guards against a regression that silently double-adds.
    expect(await cartPage.getItemQuantity(PRODUCTS.backpack)).toBe(1);
    expect(await cartPage.getItemQuantity(PRODUCTS.bikeLight)).toBe(1);

    // Prices carry over unchanged from the inventory page
    expect(await cartPage.getItemPrice(PRODUCTS.backpack)).toBe(backpackPrice);
    expect(await cartPage.getItemPrice(PRODUCTS.bikeLight)).toBe(bikeLightPrice);
  });
});
