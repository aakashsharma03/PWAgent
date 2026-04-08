// Test Cases: TC-006, TC-007, TC-008, TC-009
// Edge Case Input Validation Tests

import { test, expect } from '../../fixtures/authFixture.ts';
import { CheckoutInfoPage } from '../../pages/CheckoutInfoPage.ts';
import { CartPage } from '../../pages/CartPage.ts';
import { InventoryPage } from '../../pages/InventoryPage.ts';
import { CheckoutOverviewPage } from '../../pages/CheckoutOverviewPage.ts';
import { PRODUCTS } from '../../test-data/product-data.ts';
import { EDGE_CASE_INPUTS } from '../../test-data/checkout-data.ts';

test.describe('Checkout Edge Cases - Input Validation', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    // Add item to cart
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.navigate();
    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK.name);

    // Navigate to checkout
    const cartPage = new CartPage(page);
    await cartPage.navigate();
    await cartPage.clickCheckout();
  });

  test('@functional @edge-case TC-006: Special Characters in Name Fields', async ({
    authenticatedPage: page,
  }) => {
    const checkoutInfoPage = new CheckoutInfoPage(page);
    const overviewPage = new CheckoutOverviewPage(page);

    // Fill with special characters
    await checkoutInfoPage.fillCheckoutForm(
      EDGE_CASE_INPUTS.specialChars.firstName,
      EDGE_CASE_INPUTS.specialChars.lastName,
      EDGE_CASE_INPUTS.specialChars.postalCode
    );

    // Should accept special characters and proceed
    await checkoutInfoPage.clickContinue();

    // Verify navigated to overview
    await page.waitForURL('**/checkout-step-two.html');
    expect(page.url()).toContain('checkout-step-two');

    // Verify form accepted the input
    const cartItemCount = await overviewPage.getCartItemCount();
    expect(cartItemCount).toBeGreaterThan(0);
  });

  test('@functional @edge-case TC-007: Whitespace-Only Input Fields', async ({
    authenticatedPage: page,
  }) => {
    const checkoutInfoPage = new CheckoutInfoPage(page);

    // Fill with whitespace only
    await checkoutInfoPage.fillCheckoutForm(
      EDGE_CASE_INPUTS.whitespaceOnly.firstName,
      EDGE_CASE_INPUTS.whitespaceOnly.lastName,
      EDGE_CASE_INPUTS.whitespaceOnly.postalCode
    );

    // Should accept whitespace and proceed
    await checkoutInfoPage.clickContinue();

    // Verify navigated to overview page
    await page.waitForURL('**/checkout-step-two.html', { timeout: 5000 });
    expect(page.url()).toContain('checkout-step-two');
  });

  test('@functional @edge-case TC-008: Very Long Input Values', async ({
    authenticatedPage: page,
  }) => {
    const checkoutInfoPage = new CheckoutInfoPage(page);

    // Fill with very long values
    await checkoutInfoPage.fillCheckoutForm(
      EDGE_CASE_INPUTS.veryLongInput.firstName,
      EDGE_CASE_INPUTS.veryLongInput.lastName,
      EDGE_CASE_INPUTS.veryLongInput.postalCode
    );

    // Should accept long input and proceed
    await checkoutInfoPage.clickContinue();

    // Verify navigated to overview
    await page.waitForURL('**/checkout-step-two.html');
    expect(page.url()).toContain('checkout-step-two');

    // Verify values are displayed in overview
    const overviewPage = new CheckoutOverviewPage(page);
    await overviewPage.verifyOrderSummary();
  });

  test('@functional @edge-case TC-009: Numeric Values in Name Fields', async ({
    authenticatedPage: page,
  }) => {
    const checkoutInfoPage = new CheckoutInfoPage(page);

    // Fill with numeric values
    await checkoutInfoPage.fillCheckoutForm(
      EDGE_CASE_INPUTS.numericNames.firstName,
      EDGE_CASE_INPUTS.numericNames.lastName,
      EDGE_CASE_INPUTS.numericNames.postalCode
    );

    // Should accept numeric values and proceed
    await checkoutInfoPage.clickContinue();

    // Verify navigated to overview
    await page.waitForURL('**/checkout-step-two.html');
    expect(page.url()).toContain('checkout-step-two');
  });
});
