import { test, expect } from '../../fixtures/authFixture';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutInfoPage } from '../../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../../pages/CheckoutCompletePage';
import { VALID_CHECKOUT } from '../../test-data/checkout-data';

test.describe('End-to-End Regression Tests @regression', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutInfoPage: CheckoutInfoPage;
  let checkoutOverviewPage: CheckoutOverviewPage;
  let completePage: CheckoutCompletePage;

  test.beforeEach(async ({ authenticatedPage: page }) => {
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutInfoPage = new CheckoutInfoPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);
    completePage = new CheckoutCompletePage(page);
    expect(page.url()).toContain('/inventory');
  });

  test('@smoke TC-301: Complete E2E Journey - Single Item', async ({ authenticatedPage: page }) => {
    // Step 1: Browse inventory
    expect(page.url()).toContain('/inventory');
    const productItems = page.locator('[data-test="inventory-item"]');
    expect(await productItems.count()).toBe(6);
    
    // Step 2: Add item to cart
    const addButton = page.locator('[data-test^="add-to-cart"]').first();
    await addButton.click();
    
    // Step 3: Go to cart
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    expect(page.url()).toContain('/cart');
    
    // Step 4: Checkout
    const checkoutButton = page.locator('[data-test="checkout"]');
    await checkoutButton.click();
    expect(page.url()).toContain('/checkout-step-one');
    
    // Step 5: Fill checkout info
    await checkoutInfoPage.fillCheckoutForm(
      VALID_CHECKOUT.FIRST_NAME,
      VALID_CHECKOUT.LAST_NAME,
      VALID_CHECKOUT.ZIP_CODE
    );
    
    // Step 6: Continue to overview
    const continueButton = page.locator('[data-test="continue"]');
    await continueButton.click();
    expect(page.url()).toContain('/checkout-step-two');
    
    // Step 7: Review and complete
    const finishButton = page.locator('[data-test="finish"]');
    await finishButton.click();
    
    // Step 8: Verify order complete
    expect(page.url()).toContain('/checkout-complete');
    const confirmationMessage = page.locator('h2:has-text("Thank you for your order")');
    await expect(confirmationMessage).toBeVisible();
  });

  test('TC-302: Complete E2E Journey - Multiple Items', async ({ authenticatedPage: page }) => {
    // Add 3 items
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    for (let i = 0; i < 3; i++) {
      await addButtons.nth(i).click();
      await page.waitForTimeout(200);
    }
    
    // Verify cart count
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    expect(await cartBadge.textContent()).toBe('3');
    
    // Go to cart
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    
    // Verify 3 items in cart
    const cartItems = page.locator('[data-test="cart-item"]');
    expect(await cartItems.count()).toBe(3);
    
    // Proceed to checkout
    const checkoutButton = page.locator('[data-test="checkout"]');
    await checkoutButton.click();
    
    // Fill info
    await checkoutInfoPage.fillCheckoutForm(
      VALID_CHECKOUT.FIRST_NAME,
      VALID_CHECKOUT.LAST_NAME,
      VALID_CHECKOUT.ZIP_CODE
    );
    
    // Continue
    const continueButton = page.locator('[data-test="continue"]');
    await continueButton.click();
    
    // Finish
    const finishButton = page.locator('[data-test="finish"]');
    await finishButton.click();
    
    // Verify completion
    const confirmationMessage = page.locator('h2:has-text("Thank you for your order")');
    await expect(confirmationMessage).toBeVisible();
  });

  test('TC-303: Add, Remove, Re-add Item', async ({ authenticatedPage: page }) => {
    const firstAddButton = page.locator('[data-test^="add-to-cart"]').first();
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    
    // Add item
    await firstAddButton.click();
    const badge1 = await page.locator('[data-test="shopping-cart-badge"]').textContent();
    expect(badge1).toBe('1');
    
    // Remove it
    const removeButton = page.locator('[data-test^="remove-from-cart"]').first();
    await removeButton.click();
    await page.waitForTimeout(300);
    
    // Verify removed
    const badge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(badge).not.toBeVisible();
    
    // Re-add
    await firstAddButton.click();
    const badge2 = await page.locator('[data-test="shopping-cart-badge"]').textContent();
    expect(badge2).toBe('1');
  });

  test('TC-304: Cart Persistence - Navigate Away and Back', async ({ authenticatedPage: page }) => {
    // Add items
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    await addButtons.nth(0).click();
    await page.waitForTimeout(200);
    await addButtons.nth(1).click();
    
    // Go to cart
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    
    // Verify 2 items
    let cartItems = page.locator('[data-test="cart-item"]');
    expect(await cartItems.count()).toBe(2);
    
    // Click continue shopping
    const continueButton = page.locator('[data-test="continue-shopping"]');
    await continueButton.click();
    
    // Back on inventory
    expect(page.url()).toContain('/inventory');
    
    // Go back to cart
    await cartLink.click();
    
    // Verify items still there
    cartItems = page.locator('[data-test="cart-item"]');
    expect(await cartItems.count()).toBe(2);
  });

  test('TC-305: Checkout Cancel and Return to Cart', async ({ authenticatedPage: page }) => {
    // Add item and go to cart
    const addButton = page.locator('[data-test^="add-to-cart"]').first();
    await addButton.click();
    
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    
    // Start checkout
    const checkoutButton = page.locator('[data-test="checkout"]');
    await checkoutButton.click();
    
    // Cancel checkout
    const cancelButton = page.locator('[data-test="cancel"]');
    await cancelButton.click();
    
    // Should be back on cart
    expect(page.url()).toContain('/cart');
    
    // Verify item still in cart
    const cartItems = page.locator('[data-test="cart-item"]');
    expect(await cartItems.count()).toBe(1);
  });

  test('TC-306: Sort Products and Add to Cart', async ({ authenticatedPage: page }) => {
    // Sort by price high to low
    const selectButton = page.locator('[data-test="product-sort-container"] select');
    await selectButton.selectOption('hilo');
    await page.waitForTimeout(500);
    
    // Add first product (most expensive)
    const addButton = page.locator('[data-test^="add-to-cart"]').first();
    await addButton.click();
    
    // Go to cart
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    
    // Verify item added (should be Fleece Jacket at $49.99)
    const cartItems = page.locator('[data-test="cart-item"]');
    expect(await cartItems.count()).toBe(1);
  });

  test('@critical TC-307: Full Checkout with Validation', async ({ authenticatedPage: page }) => {
    // Add 2 items
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    await addButtons.nth(0).click();
    await page.waitForTimeout(200);
    await addButtons.nth(2).click();
    
    // Go to cart
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    
    // Verify items in cart
    const cartItems = page.locator('[data-test="cart-item"]');
    expect(await cartItems.count()).toBe(2);
    
    // Start checkout
    const checkoutButton = page.locator('[data-test="checkout"]');
    await checkoutButton.click();
    
    // Test invalid data first (empty fields)
    let continueButton = page.locator('[data-test="continue"]');
    await continueButton.click();
    
    // Verify error message
    const errorMessage = page.locator('[data-test*="error"]');
    await expect(errorMessage).toBeVisible();
    
    // Fill in valid data
    const firstNameInput = page.locator('[data-test="firstName"]');
    const lastNameInput = page.locator('[data-test="lastName"]');
    const zipInput = page.locator('[data-test="postalCode"]');
    
    await firstNameInput.fill(VALID_CHECKOUT.FIRST_NAME);
    await lastNameInput.fill(VALID_CHECKOUT.LAST_NAME);
    await zipInput.fill(VALID_CHECKOUT.ZIP_CODE);
    
    // Continue
    continueButton = page.locator('[data-test="continue"]');
    await continueButton.click();
    
    // Verify on overview page
    expect(page.url()).toContain('/checkout-step-two');
    
    // Finish order
    const finishButton = page.locator('[data-test="finish"]');
    await finishButton.click();
    
    // Verify completion
    const confirmationMessage = page.locator('h2:has-text("Thank you for your order")');
    await expect(confirmationMessage).toBeVisible();
  });

  test('TC-308: Logout During Checkout - Cart Cleared', async ({ authenticatedPage: page }) => {
    // Add item
    const addButton = page.locator('[data-test^="add-to-cart"]').first();
    await addButton.click();
    
    // Verify in cart
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    expect(await cartBadge.textContent()).toBe('1');
    
    // Open menu and logout
    const menuButton = page.locator('[data-test="burger-menu-button"]');
    await menuButton.click();
    await page.waitForTimeout(300);
    
    const logoutButton = page.locator('[data-test="logout-sidebar-link"]');
    await logoutButton.click();
    
    // Wait for redirect
    await expect(page).toHaveURL(/.*login/);
  });

  test('TC-309: Multiple Checkouts in Sequence', async ({ authenticatedPage: page }) => {
    // First checkout
    const addButton = page.locator('[data-test^="add-to-cart"]').first();
    await addButton.click();
    
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    
    const checkoutButton = page.locator('[data-test="checkout"]');
    await checkoutButton.click();
    
    await checkoutInfoPage.fillCheckoutForm(
      VALID_CHECKOUT.FIRST_NAME,
      VALID_CHECKOUT.LAST_NAME,
      VALID_CHECKOUT.ZIP_CODE
    );
    
    let continueButton = page.locator('[data-test="continue"]');
    await continueButton.click();
    
    let finishButton = page.locator('[data-test="finish"]');
    await finishButton.click();
    
    // Verify complete
    let confirmationMessage = page.locator('h2:has-text("Thank you for your order")');
    await expect(confirmationMessage).toBeVisible();
    
    // Back to inventory for second order
    const backButton = page.locator('[data-test="back-to-products"]');
    await backButton.click();
    
    // Second order
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    await addButtons.nth(1).click();
    
    await cartLink.click();
    await checkoutButton.click();
    
    await checkoutInfoPage.fillCheckoutForm(
      VALID_CHECKOUT.FIRST_NAME,
      VALID_CHECKOUT.LAST_NAME,
      VALID_CHECKOUT.ZIP_CODE
    );
    
    continueButton = page.locator('[data-test="continue"]');
    await continueButton.click();
    
    finishButton = page.locator('[data-test="finish"]');
    await finishButton.click();
    
    // Verify complete
    confirmationMessage = page.locator('h2:has-text("Thank you for your order")');
    await expect(confirmationMessage).toBeVisible();
  });

  test('TC-310: Browse All Products - Add Favorites to Cart', async ({ authenticatedPage: page }) => {
    // Verify all 6 products visible
    const productItems = page.locator('[data-test="inventory-item"]');
    const count = await productItems.count();
    expect(count).toBe(6);
    
    // Add every other product (3 items total)
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    await addButtons.nth(0).click();
    await page.waitForTimeout(200);
    await addButtons.nth(2).click();
    await page.waitForTimeout(200);
    await addButtons.nth(4).click();
    
    // Verify cart has 3 items
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    expect(await cartBadge.textContent()).toBe('3');
    
    // Proceed to checkout
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    
    const cartItems = page.locator('[data-test="cart-item"]');
    expect(await cartItems.count()).toBe(3);
  });
});
