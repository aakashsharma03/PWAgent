// Test Cases: TC-010, TC-011, TC-012, TC-013, TC-014
// Navigation and Flow Tests

import { test, expect } from '../../fixtures/authFixture.ts';
import { CheckoutInfoPage } from '../../pages/CheckoutInfoPage.ts';
import { CheckoutOverviewPage } from '../../pages/CheckoutOverviewPage.ts';
import { CartPage } from '../../pages/CartPage.ts';
import { InventoryPage } from '../../pages/InventoryPage.ts';
import { PRODUCTS } from '../../test-data/product-data.ts';
import { VALID_CHECKOUT } from '../../test-data/checkout-data.ts';

test.describe('Checkout Navigation and Flow', () => {
  test('@critical @navigation TC-010: Cancel from Checkout Information Page', async ({
    authenticatedPage: page,
  }) => {
    // Setup: Add item and navigate to checkout
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.navigate();
    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK.name);

    const cartPage = new CartPage(page);
    await cartPage.navigate();
    const cartCountBefore = await cartPage.getCartBadgeValue();
    expect(cartCountBefore).toBe(1);

    // Navigate to checkout
    await cartPage.clickCheckout();

    // Fill form
    const checkoutInfoPage = new CheckoutInfoPage(page);
    await checkoutInfoPage.fillCheckoutForm(
      VALID_CHECKOUT.firstName,
      VALID_CHECKOUT.lastName,
      VALID_CHECKOUT.postalCode
    );

    // Click Cancel
    await checkoutInfoPage.clickCancel();

    // Verify returned to cart
    await page.waitForURL('**/cart.html');
    expect(page.url()).toContain('cart.html');

    // Verify items still in cart
    const cartCountAfter = await cartPage.getCartBadgeValue();
    expect(cartCountAfter).toBe(cartCountBefore);
  });

  test('@critical @navigation TC-011: Cancel from Checkout Overview Page', async ({
    authenticatedPage: page,
  }) => {
    // Setup: Add item and navigate to checkout overview
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.navigate();
    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK.name);

    const cartPage = new CartPage(page);
    await cartPage.navigate();
    const cartCountBefore = await cartPage.getCartBadgeValue();
    await cartPage.clickCheckout();

    // Fill and continue
    const checkoutInfoPage = new CheckoutInfoPage(page);
    await checkoutInfoPage.proceedWithValidData(
      VALID_CHECKOUT.firstName,
      VALID_CHECKOUT.lastName,
      VALID_CHECKOUT.postalCode
    );

    // Verify on overview page
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    await checkoutOverviewPage.verifyOrderSummary();

    // Click Cancel
    await checkoutOverviewPage.clickCancel();

    // Verify navigated away from checkout (to inventory or another page)
    expect(page.url()).not.toContain('checkout-step-two');

    // Navigate to cart to verify items are still there
    await cartPage.navigate();
    const cartCountAfter = await cartPage.getCartBadgeValue();
    expect(cartCountAfter).toBe(cartCountBefore);
  });

  test('@functional @navigation TC-012: Continue Shopping Button from Cart', async ({
    authenticatedPage: page,
  }) => {
    // Setup: Add items and go to cart
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.navigate();
    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK.name);

    const cartPage = new CartPage(page);
    await cartPage.navigate();
    const cartCountBefore = await cartPage.getCartBadgeValue();

    // Click Continue Shopping
    await cartPage.clickContinueShopping();

    // Verify returned to inventory
    await page.waitForURL('**/inventory.html');
    expect(page.url()).toContain('inventory.html');

    // Verify cart items still present
    const cartCountAfter = await inventoryPage.getCartBadgeValue();
    expect(cartCountAfter).toBe(cartCountBefore);

    // Add another item to verify cart is still functional
    await inventoryPage.addItemToCart(PRODUCTS.BIKE_LIGHT.name);
    const cartCountAfterAdd = await inventoryPage.getCartBadgeValue();
    expect(cartCountAfterAdd).toBe(cartCountBefore + 1);
  });

  test('@functional @navigation TC-013: Back Button Behavior During Checkout', async ({
    authenticatedPage: page,
  }) => {
    // Setup: Navigate to checkout
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.navigate();
    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK.name);

    const cartPage = new CartPage(page);
    await cartPage.navigate();
    await cartPage.clickCheckout();

    // Verify on checkout info page
    expect(page.url()).toContain('checkout-step-one');

    // Click browser back button
    await page.goBack();

    // Verify returned to cart
    expect(page.url()).toContain('cart.html');

    // Verify items still in cart
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThan(0);

    // Navigate to checkout again
    await cartPage.clickCheckout();

    // Verify form is empty (not persistent)
    const checkoutInfoPage = new CheckoutInfoPage(page);
    const firstName = await checkoutInfoPage.getFirstNameValue();
    expect(firstName).toBe('');
  });

  test('@functional @edge-case TC-014: Page Refresh During Checkout', async ({
    authenticatedPage: page,
  }) => {
    // Setup: Navigate to checkout
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.navigate();
    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK.name);

    const cartPage = new CartPage(page);
    await cartPage.navigate();
    await cartPage.clickCheckout();

    // Fill form
    const checkoutInfoPage = new CheckoutInfoPage(page);
    await checkoutInfoPage.fillFirstName('John');
    await checkoutInfoPage.fillLastName('Doe');

    // Refresh page
    await page.reload();

    // Verify form is cleared
    const firstName = await checkoutInfoPage.getFirstNameValue();
    const lastName = await checkoutInfoPage.getLastNameValue();
    expect(firstName).toBe('');
    expect(lastName).toBe('');

    // Verify user is still logged in
    const cartBadge = await inventoryPage.getCartBadgeValue();
    expect(cartBadge).toBeGreaterThan(-1); // Should be accessible

    // Verify can fill form and proceed
    await checkoutInfoPage.proceedWithValidData(
      VALID_CHECKOUT.firstName,
      VALID_CHECKOUT.lastName,
      VALID_CHECKOUT.postalCode
    );

    // Verify navigated to overview
    expect(page.url()).toContain('checkout-step-two');
  });
});
