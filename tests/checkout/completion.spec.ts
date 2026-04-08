// Test Cases: TC-015, TC-016, TC-017, TC-018, TC-019, TC-020
// Checkout Completion and Confirmation Tests

import { test, expect } from '../../fixtures/authFixture.ts';
import { CheckoutCompletePage } from '../../pages/CheckoutCompletePage.ts';
import { CheckoutOverviewPage } from '../../pages/CheckoutOverviewPage.ts';
import { CheckoutInfoPage } from '../../pages/CheckoutInfoPage.ts';
import { CartPage } from '../../pages/CartPage.ts';
import { InventoryPage } from '../../pages/InventoryPage.ts';
import { PRODUCTS } from '../../test-data/product-data.ts';
import { VALID_CHECKOUT } from '../../test-data/checkout-data.ts';

test.describe('Checkout Completion and Confirmation', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    // Setup: Add item, navigate to checkout overview
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

  test('@critical @navigation TC-015: Finish Button Navigation', async ({
    authenticatedPage: page,
  }) => {
    const overviewPage = new CheckoutOverviewPage(page);

    // Verify on overview page
    await overviewPage.verifyOrderSummary();

    // Click Finish button
    await overviewPage.clickFinish();

    // Verify navigated to completion page
    await page.waitForURL('**/checkout-complete.html');
    expect(page.url()).toContain('checkout-complete');

    // Verify completion page loaded
    const completePage = new CheckoutCompletePage(page);
    const backHomeBtn = await completePage.isBackHomeButtonVisible();
    expect(backHomeBtn).toBe(true);
  });

  test('@critical @user-experience TC-016: Order Confirmation Message', async ({
    authenticatedPage: page,
  }) => {
    const overviewPage = new CheckoutOverviewPage(page);
    await overviewPage.clickFinish();

    const completePage = new CheckoutCompletePage(page);

    // Verify order confirmation
    await completePage.verifyOrderConfirmation();

    // Verify confirmation heading
    const heading = await completePage.getConfirmationHeading();
    expect(heading).toContain('Thank you for your order');

    // Verify confirmation message
    const message = await completePage.getConfirmationMessage();
    expect(message).toContain('dispatched');
    expect(message).toContain('will arrive');
  });

  test('@critical @navigation TC-017: Back Home Button from Confirmation Page', async ({
    authenticatedPage: page,
  }) => {
    const overviewPage = new CheckoutOverviewPage(page);
    await overviewPage.clickFinish();

    const completePage = new CheckoutCompletePage(page);
    
    // Verify back home button is visible
    const isVisible = await completePage.isBackHomeButtonVisible();
    expect(isVisible).toBe(true);

    // Click Back Home button
    await completePage.clickBackHome();

    // Verify navigated to inventory page
    await page.waitForURL('**/inventory.html');
    expect(page.url()).toContain('inventory.html');
  });

  test('@critical @business-logic TC-018: Cart Cleared After Successful Order', async ({
    authenticatedPage: page,
  }) => {
    const overviewPage = new CheckoutOverviewPage(page);
    await overviewPage.clickFinish();

    const completePage = new CheckoutCompletePage(page);
    
    // Verify order confirmation
    await completePage.verifyOrderConfirmation();

    // Click Back Home
    await completePage.clickBackHome();

    // Verify on inventory page
    const inventoryPage = new InventoryPage(page);
    expect(page.url()).toContain('inventory.html');

    // Verify cart is empty (no badge or 0 items)
    const cartBadgeValue = await inventoryPage.getCartBadgeValue();
    expect(cartBadgeValue).toBe(0);

    // Navigate to cart to verify it's empty
    const cartPage = new CartPage(page);
    await cartPage.navigate();
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBe(true);

    // Verify can add new items to cart
    await inventoryPage.navigate();
    await inventoryPage.addItemToCart(PRODUCTS.BIKE_LIGHT.name);
    const newCartCount = await inventoryPage.getCartBadgeValue();
    expect(newCartCount).toBe(1);
  });

  test('@functional TC-019: Confirmation Page Elements', async ({
    authenticatedPage: page,
  }) => {
    const overviewPage = new CheckoutOverviewPage(page);
    await overviewPage.clickFinish();

    const completePage = new CheckoutCompletePage(page);

    // Verify all confirmation page elements
    await completePage.verifyOrderConfirmation();
    await completePage.verifyOrderConfirmationMessage();

    // Verify thank you heading
    const thankYouLocator = page.locator('text=Thank you for your order');
    await expect(thankYouLocator).toBeVisible();

    // Verify dispatch message
    const dispatchLocator = page.locator('text=dispatched');
    await expect(dispatchLocator).toBeVisible();

    // Verify back home button
    const backHomeBtn = page.locator('[data-test="back-to-products"]');
    await expect(backHomeBtn).toBeVisible();
    await expect(backHomeBtn).toBeEnabled();
  });

  test('@functional TC-020: Session State After Order Completion', async ({
    authenticatedPage: page,
  }) => {
    const overviewPage = new CheckoutOverviewPage(page);
    await overviewPage.clickFinish();

    const completePage = new CheckoutCompletePage(page);
    await completePage.clickBackHome();

    // Verify user is still logged in
    const inventoryPage = new InventoryPage(page);
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    // Verify can perform new actions
    await inventoryPage.addItemToCart(PRODUCTS.FLEECE_JACKET.name);
    const cartBadgeValue = await inventoryPage.getCartBadgeValue();
    expect(cartBadgeValue).toBe(1);

    // Verify can navigate normally
    const cartPage = new CartPage(page);
    await cartPage.navigate();
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);
  });
});
