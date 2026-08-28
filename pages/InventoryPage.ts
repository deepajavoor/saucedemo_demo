import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly inventoryList: Locator;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  /** Scopes to a single product card by its visible name. */
  private itemCard(productName: string): Locator {
    return this.inventoryItems.filter({ hasText: productName });
  }

  async addProductToCart(productName: string) {
    await this.itemCard(productName).getByRole('button', { name: /add to cart/i }).click();
  }

  async removeProductFromCart(productName: string) {
    await this.itemCard(productName).getByRole('button', { name: /remove/i }).click();
  }

  async getProductPrice(productName: string): Promise<string> {
    return this.itemCard(productName).locator('[data-test="inventory-item-price"]').innerText();
  }

  async getCartCount(): Promise<number> {
    if (await this.cartBadge.count() === 0) return 0;
    return Number(await this.cartBadge.innerText());
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
