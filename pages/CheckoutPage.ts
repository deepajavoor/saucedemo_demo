import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { CustomerInfo } from '../test-data/checkout-data';

/**
 * SauceDemo's checkout spans three distinct screens (info -> overview -> complete).
 * Modelling them as one page object (rather than three) matches how a tester
 * actually thinks about "checkout" as a single flow, while still exposing
 * step-specific locators/methods for fine-grained assertions.
 */
export class CheckoutPage extends BasePage {
  // Step One: information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // Step Two: overview
  readonly summarySubtotal: Locator;
  readonly summaryTax: Locator;
  readonly summaryTotal: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly overviewItems: Locator;

  // Step Three: complete
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');

    this.summarySubtotal = page.locator('[data-test="subtotal-label"]');
    this.summaryTax = page.locator('[data-test="tax-label"]');
    this.summaryTotal = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.overviewItems = page.locator('[data-test="inventory-item"]');

    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async fillCustomerInfo(info: CustomerInfo) {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async getTotalAsNumber(): Promise<number> {
    const text = await this.summaryTotal.innerText(); // "Total: $32.39"
    return Number(text.replace(/[^0-9.]/g, ''));
  }
}
