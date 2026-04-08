// spec: test-cases.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/authFixture.ts';
import { CartPage } from '../../pages/CartPage.ts';
import { CheckoutInfoPage } from '../../pages/CheckoutInfoPage.ts';
import { CheckoutOverviewPage } from '../../pages/CheckoutOverviewPage.ts';
import { CheckoutCompletePage } from '../../pages/CheckoutCompletePage.ts';
import { InventoryPage } from '../../pages/InventoryPage.ts';
import { VALID_CHECKOUT } from '../../test-data/checkout-data.ts';
import { PRODUCTS } from '../../test-data/product-data.ts';

test.describe('Checkout Complete Flow', () => {
  test('@smoke @critical TC-001: Successful Complete Checkout Flow', async ({ authenticatedPage: page }) => {
    // Setup: Add Backpack to cart
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.navigate();
    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK.name);

    // Navigate to cart
    const cartPage = new CartPage(page);
    await cartPage.navigate();
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(1);

    // Click Checkout button
    await cartPage.clickCheckout();

    // Fill checkout form
    const checkoutInfoPage = new CheckoutInfoPage(page);
    await checkoutInfoPage.fillCheckoutForm(
      VALID_CHECKOUT.firstName,
      VALID_CHECKOUT.lastName,
      VALID_CHECKOUT.postalCode
    );

    // Click Continue button
    await checkoutInfoPage.clickContinue();

    // Verify Order Overview page
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    await checkoutOverviewPage.verifyOrderSummary();

    // Verify prices
    const itemTotal = await checkoutOverviewPage.getItemTotalValue();
    expect(itemTotal).toContain('29.99');

    const taxAmount = await checkoutOverviewPage.getTaxValue();
    expect(taxAmount).toContain('2.40');

    const totalPrice = await checkoutOverviewPage.getTotalValue();
    expect(totalPrice).toContain('32.39');

    // Verify payment and shipping info
    await checkoutOverviewPage.verifyPaymentInfo();
    await checkoutOverviewPage.verifyShippingInfo();

    // Click Finish button
    await checkoutOverviewPage.clickFinish();

    // Verify confirmation page
    const completePage = new CheckoutCompletePage(page);
    await completePage.verifyOrderConfirmation();
    await completePage.verifyOrderConfirmationMessage();

    const confirmationHeading = await completePage.getConfirmationHeading();
    expect(confirmationHeading).toContain('Thank you');

    const confirmationMessage = await completePage.getConfirmationMessage();
    expect(confirmationMessage).toContain('dispatched');

    // Click Back Home button
    await completePage.clickBackHome();

    // Verify empty cart
    await cartPage.navigate();
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBe(true);
  });
});
