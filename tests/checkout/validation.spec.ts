// Test Cases: TC-002, TC-003, TC-004, TC-005
// Checkout Form Validation Tests

import { test, expect } from '../../fixtures/authFixture.ts';
import { CheckoutInfoPage } from '../../pages/CheckoutInfoPage.ts';
import { CartPage } from '../../pages/CartPage.ts';
import { InventoryPage } from '../../pages/InventoryPage.ts';
import { PRODUCTS } from '../../test-data/product-data.ts';
import { INVALID_INPUTS } from '../../test-data/checkout-data.ts';
import {
  expectValidationError,
} from '../../../utils/assertions';

test.describe('Checkout Form Validation', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    // Add item to cart before each test
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.navigate();
    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK.name);

    // Navigate to checkout page
    const cartPage = new CartPage(page);
    await cartPage.navigate();
    await cartPage.clickCheckout();
  });

  test('@critical @validation TC-002: First Name Field Empty Validation', async ({
    authenticatedPage: page,
  }) => {
    const checkoutInfoPage = new CheckoutInfoPage(page);

    // Leave first name empty, submit form
    await checkoutInfoPage.fillLastName('Doe');
    await checkoutInfoPage.fillPostalCode('12345');
    await checkoutInfoPage.clickContinue();

    // Expect error message
    const errorMsg = await checkoutInfoPage.getErrorMessage();
    expect(errorMsg).toContain('First Name is required');
  });

  test('@critical @validation TC-003: Last Name Field Empty Validation', async ({
    authenticatedPage: page,
  }) => {
    const checkoutInfoPage = new CheckoutInfoPage(page);

    // Fill first name only
    await checkoutInfoPage.fillFirstName('John');
    await checkoutInfoPage.fillPostalCode('12345');
    await checkoutInfoPage.clickContinue();

    // Expect error for last name
    const errorMsg = await checkoutInfoPage.getErrorMessage();
    expect(errorMsg).toContain('Last Name is required');

    // Verify first name is retained
    const firstName = await checkoutInfoPage.getFirstNameValue();
    expect(firstName).toBe('John');
  });

  test('@critical @validation TC-004: Postal Code Field Empty Validation', async ({
    authenticatedPage: page,
  }) => {
    const checkoutInfoPage = new CheckoutInfoPage(page);

    // Fill first name and last name only
    await checkoutInfoPage.fillFirstName('John');
    await checkoutInfoPage.fillLastName('Doe');
    await checkoutInfoPage.clickContinue();

    // Expect error for postal code
    const errorMsg = await checkoutInfoPage.getErrorMessage();
    expect(errorMsg).toContain('Postal Code is required');

    // Verify previous fields are retained
    const firstName = await checkoutInfoPage.getFirstNameValue();
    const lastName = await checkoutInfoPage.getLastNameValue();
    expect(firstName).toBe('John');
    expect(lastName).toBe('Doe');
  });

  test('@functional @validation TC-005: All Fields Missing - Validation Cascading', async ({
    authenticatedPage: page,
  }) => {
    const checkoutInfoPage = new CheckoutInfoPage(page);

    // Step 1: All empty - expect first name error
    await checkoutInfoPage.clickContinue();
    let errorMsg = await checkoutInfoPage.getErrorMessage();
    expect(errorMsg).toContain('First Name is required');

    // Step 2: Fill first name - expect last name error
    await checkoutInfoPage.fillFirstName('John');
    await checkoutInfoPage.clickContinue();
    errorMsg = await checkoutInfoPage.getErrorMessage();
    expect(errorMsg).toContain('Last Name is required');

    // Step 3: Fill last name - expect postal code error
    await checkoutInfoPage.fillLastName('Doe');
    await checkoutInfoPage.clickContinue();
    errorMsg = await checkoutInfoPage.getErrorMessage();
    expect(errorMsg).toContain('Postal Code is required');

    // Step 4: Fill postal code - should proceed
    await checkoutInfoPage.fillPostalCode('12345');
    await checkoutInfoPage.clickContinue();

    // Verify navigated to overview page
    await page.waitForURL('**/checkout-step-two.html');
    expect(page.url()).toContain('checkout-step-two');
  });
});
