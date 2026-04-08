// Test Cases: TC-022, TC-023, TC-024
// Order Information Display Tests

import { test, expect } from '../../fixtures/authFixture.ts';
import { CheckoutOverviewPage } from '../../pages/CheckoutOverviewPage.ts';
import { CartPage } from '../../pages/CartPage.ts';
import { InventoryPage } from '../../pages/InventoryPage.ts';
import { CheckoutInfoPage } from '../../pages/CheckoutInfoPage.ts';
import { PRODUCTS } from '../../test-data/product-data.ts';
import { VALID_CHECKOUT } from '../../test-data/checkout-data.ts';

test.describe('Checkout Overview - Information Display', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    // Setup: Add items and navigate to overview page
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.navigate();
    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK.name);

    const cartPage = new CartPage(page);
    await cartPage.navigate();
    await cartPage.clickCheckout();

    const checkoutInfoPage = new CheckoutInfoPage(page);
    await checkoutInfoPage.proceedWithValidData(
      VALID_CHECKOUT.firstName,
      VALID_CHECKOUT.lastName,
      VALID_CHECKOUT.postalCode
    );
  });

  test('@functional TC-022: Payment Information Display', async ({
    authenticatedPage: page,
  }) => {
    const overviewPage = new CheckoutOverviewPage(page);

    // Verify payment information is displayed
    await overviewPage.verifyPaymentInfo();

    // Verify specific payment details
    const paymentText = await page
      .locator('text=SauceCard')
      .textContent();
    expect(paymentText).toContain('SauceCard #31337');

    // Verify it's static (same for all orders)
    expect(paymentText).toContain('31337');
  });

  test('@functional TC-023: Shipping Information Display', async ({
    authenticatedPage: page,
  }) => {
    const overviewPage = new CheckoutOverviewPage(page);

    // Verify shipping information is displayed
    await overviewPage.verifyShippingInfo();

    // Verify specific shipping details
    const shippingText = await page
      .locator('text=FREE PONY')
      .textContent();
    expect(shippingText).toContain('Free Pony Express Delivery!');

    // Verify consistent messaging
    expect(shippingText?.toLowerCase()).toContain('free');
  });

  test('@functional TC-024: Order Summary Display Accuracy', async ({
    authenticatedPage: page,
  }) => {
    // Add multiple items to test summary
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.navigate();
    
    // First item already added in beforeEach, add one more
    await inventoryPage.addItemToCart(PRODUCTS.BIKE_LIGHT.name);
    
    // Complete checkout
    const cartPage = new CartPage(page);
    await cartPage.navigate();
    await cartPage.clickCheckout();

    const checkoutInfoPage = new CheckoutInfoPage(page);
    await checkoutInfoPage.proceedWithValidData(
      VALID_CHECKOUT.firstName,
      VALID_CHECKOUT.lastName,
      VALID_CHECKOUT.postalCode
    );

    const overviewPage = new CheckoutOverviewPage(page);

    // Verify order summary is displayed
    await overviewPage.verifyOrderSummary();

    // Verify all items are shown
    const cartItemCount = await overviewPage.getCartItemCount();
    expect(cartItemCount).toBe(2);

    // Verify item details are present
    const backpackVisible = await overviewPage.verifyCartItem('Sauce Labs Backpack');
    expect(backpackVisible).toBe(true);

    const bikeLightVisible = await overviewPage.verifyCartItem('Sauce Labs Bike Light');
    expect(bikeLightVisible).toBe(true);

    // Verify prices are displayed
    const itemTotal = await overviewPage.getItemTotalValue();
    expect(itemTotal).toBeTruthy();
    expect(itemTotal).toMatch(/\$\d+\.\d{2}/);

    const taxAmount = await overviewPage.getTaxValue();
    expect(taxAmount).toBeTruthy();

    const totalPrice = await overviewPage.getTotalValue();
    expect(totalPrice).toBeTruthy();

    // Verify no missing or extra items
    // Item names should be displayed
    const names = await overviewPage.getCartItemNames();
    expect(names.length).toBe(2);
  });

  test('@functional TC-025: Order Information Consistency', async ({
    authenticatedPage: page,
  }) => {
    const overviewPage = new CheckoutOverviewPage(page);

    // Verify all required information sections are present
    await overviewPage.verifyPaymentInfo();
    await overviewPage.verifyShippingInfo();
    await overviewPage.verifyOrderSummary();

    // Verify prices match expected format ($XX.XX)
    const itemTotal = await overviewPage.getItemTotalValue();
    expect(itemTotal).toMatch(/\$\d+\.\d{2}/);

    const tax = await overviewPage.getTaxValue();
    expect(tax).toMatch(/\$\d+\.\d{2}/);

    const total = await overviewPage.getTotalValue();
    expect(total).toMatch(/\$\d+\.\d{2}/);

    // Verify all buttons are visible
    const finishBtn = page.locator('[data-test="finish"]');
    await expect(finishBtn).toBeVisible();

    const cancelBtn = page.locator('[data-test="cancel"]');
    await expect(cancelBtn).toBeVisible();
  });
});
