import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  private itemRow(productName: string): Locator {
    return this.cartItems.filter({ hasText: productName });
  }

  async getItemNames(): Promise<string[]> {
    return this.cartItems.locator('[data-test="inventory-item-name"]').allInnerTexts();
  }

  async getItemQuantity(productName: string): Promise<number> {
    return Number(await this.itemRow(productName).locator('[data-test="item-quantity"]').innerText());
  }

  async getItemPrice(productName: string): Promise<string> {
    return this.itemRow(productName).locator('[data-test="inventory-item-price"]').innerText();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}
