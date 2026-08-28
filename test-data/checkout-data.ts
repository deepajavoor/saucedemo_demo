export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const VALID_CUSTOMER: CustomerInfo = {
  firstName: 'Deepa',
  lastName: 'Javoor',
  postalCode: '560001',
};

export const MISSING_FIRST_NAME: CustomerInfo = {
  firstName: '',
  lastName: 'Javoor',
  postalCode: '560001',
};

export const MISSING_POSTAL_CODE: CustomerInfo = {
  firstName: 'Deepa',
  lastName: 'Javoor',
  postalCode: '',
};

/**
 * Product names exactly as rendered on the inventory page.
 * Using the visible names (rather than data-test slugs) as the single
 * source of truth keeps tests readable; page objects handle the mapping
 * to the underlying data-test locators.
 */
export const PRODUCTS = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
  onesie: 'Sauce Labs Onesie',
  redTShirt: 'Test.allTheThings() T-Shirt (Red)',
} as const;
