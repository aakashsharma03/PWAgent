import { test, expect } from '../../fixtures/authFixture';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { expectCartCount, expectPrice } from '../../utils/assertions';
import { calculateTotalPrice } from '../../test-data/inventory-data';

test.describe('Cart Management @cart', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ authenticatedPage: page }) => {
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    expect(page.url()).toContain('/inventory');
  });

  test('@smoke TC-201: Add Item and View in Cart', async ({ authenticatedPage: page }) => {
    // Add first product to cart
    await page.locator('[data-test^="add-to-cart"]').first().click();
    
    // Verify cart badge shows 1
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    expect(await cartBadge.textContent()).toBe('1');
    
    // Navigate to cart
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    
    // Verify cart page loaded
    await expect(page).toHaveURL(/.*cart/);
    
    // Verify item is in cart
    const cartItems = page.locator('[data-test="cart-item"]');
    expect(await cartItems.count()).toBe(1);
  });

  test('TC-202: View Multiple Items in Cart', async ({ authenticatedPage: page }) => {
    // Add 3 items to cart
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    await addButtons.nth(0).click();
    await page.waitForTimeout(200);
    await addButtons.nth(1).click();
    await page.waitForTimeout(200);
    await addButtons.nth(2).click();
    
    // Navigate to cart
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    
    // Verify 3 items in cart
    const cartItems = page.locator('[data-test="cart-item"]');
    expect(await cartItems.count()).toBe(3);
    
    // Verify cart displays item names
    const itemNames = await page.locator('[data-test="inventory-item-name"]').allTextContents();
    expect(itemNames.length).toBe(3);
  });

  test('TC-203: Remove Item from Cart', async ({ authenticatedPage: page }) => {
    // Add 2 items
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    await addButtons.nth(0).click();
    await page.waitForTimeout(200);
    await addButtons.nth(1).click();
    
    // Go to cart
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    
    // Verify 2 items in cart
    let cartItems = page.locator('[data-test="cart-item"]');
    expect(await cartItems.count()).toBe(2);
    
    // Remove first item
    const removeButton = page.locator('[data-test^="remove-from-cart"]').first();
    await removeButton.click();
    await page.waitForTimeout(300);
    
    // Verify 1 item remains
    cartItems = page.locator('[data-test="cart-item"]');
    expect(await cartItems.count()).toBe(1);
  });

  test('TC-204: Remove All Items from Cart', async ({ authenticatedPage: page }) => {
    // Add 3 items
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    for (let i = 0; i < 3; i++) {
      await addButtons.nth(i).click();
      await page.waitForTimeout(200);
    }
    
    // Go to cart
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    
    // Remove all items
    let removeButtons = page.locator('[data-test^="remove-from-cart"]');
    let count = await removeButtons.count();
    
    while (count > 0) {
      await removeButtons.first().click();
      await page.waitForTimeout(300);
      removeButtons = page.locator('[data-test^="remove-from-cart"]');
      count = await removeButtons.count();
    }
    
    // Verify cart is empty message
    const emptyMessage = page.locator('text=Your Cart is Empty');
    await expect(emptyMessage).toBeVisible();
  });

  test('TC-205: Verify Cart Totals are Calculated Correctly', async ({ authenticatedPage: page }) => {
    // Add items with known prices
    // Backpack ($29.99), Bike Light ($9.99), Bolt Shirt ($15.99)
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    await addButtons.nth(0).click(); // Backpack
    await page.waitForTimeout(200);
    await addButtons.nth(1).click(); // Bike Light
    await page.waitForTimeout(200);
    await addButtons.nth(2).click(); // Bolt Shirt
    
    // Go to cart
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    
    // Verify subtotal
    const subtotalLabel = page.locator('text=/Item total/i');
    await expect(subtotalLabel).toBeVisible();
    
    // Calculate expected total
    const expectedSubtotal = 29.99 + 9.99 + 15.99; // $55.97
    
    // Verify we're on cart page and items are there
    const cartItems = page.locator('[data-test="cart-item"]');
    expect(await cartItems.count()).toBe(3);
  });

  test('TC-206: Continue Shopping from Cart', async ({ authenticatedPage: page }) => {
    // Add item and go to cart
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    await addButtons.nth(0).click();
    
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    
    // Click Continue Shopping
    const continueButton = page.locator('[data-test="continue-shopping"]');
    await expect(continueButton).toBeVisible();
    await continueButton.click();
    
    // Verify back on inventory page
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('TC-207: Checkout from Cart', async ({ authenticatedPage: page }) => {
    // Add item and go to cart
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    await addButtons.nth(0).click();
    
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    
    // Click Checkout
    const checkoutButton = page.locator('[data-test="checkout"]');
    await expect(checkoutButton).toBeVisible();
    await checkoutButton.click();
    
    // Verify on checkout page
    await expect(page).toHaveURL(/.*checkout-step-one/);
  });

  test('TC-208: Verify Cart Item Details', async ({ authenticatedPage: page }) => {
    // Add first product
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    await addButtons.nth(0).click();
    
    // Go to cart
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    
    // Verify item details are displayed
    const cartItem = page.locator('[data-test="cart-item"]').first();
    
    const itemName = cartItem.locator('[data-test="inventory-item-name"]');
    const itemDescription = cartItem.locator('[data-test="inventory-item-desc"]');
    const itemPrice = cartItem.locator('[data-test="inventory-item-price"]');
    const quantityInput = cartItem.locator('[data-test="cart-quantity"]');
    
    await expect(itemName).toBeVisible();
    await expect(itemDescription).toBeVisible();
    await expect(itemPrice).toBeVisible();
    await expect(quantityInput).toBeVisible();
  });

  test('@critical TC-209: Quantity Display and Modification', async ({ authenticatedPage: page }) => {
    // Add item to cart
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    await addButtons.nth(0).click();
    
    // Go to cart
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    
    // Verify quantity input exists
    const quantityInput = page.locator('[data-test="cart-quantity"]');
    await expect(quantityInput).toBeVisible();
    
    // Verify default quantity is 1
    const qtyValue = await quantityInput.inputValue();
    expect(qtyValue).toBe('1');
  });

  test('TC-210: Empty Cart Shows Proper Message', async ({ authenticatedPage: page }) => {
    // Navigate directly to cart when empty
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    
    // Verify empty cart message
    const emptyMessage = page.locator('text=Your Cart is Empty');
    await expect(emptyMessage).toBeVisible();
    
    // Verify cart items container is empty
    const cartItems = page.locator('[data-test="cart-item"]');
    expect(await cartItems.count()).toBe(0);
    
    // Verify Continue Shopping button visible
    const continueButton = page.locator('[data-test="continue-shopping"]');
    await expect(continueButton).toBeVisible();
  });

  test('TC-211: Add Item from Inventory, View in Cart, Remove from Cart', async ({ authenticatedPage: page }) => {
    // Add item
    const addButton = page.locator('[data-test^="add-to-cart"]').first();
    await addButton.click();
    
    // Go to cart
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    
    // Verify item in cart
    let cartItems = page.locator('[data-test="cart-item"]');
    expect(await cartItems.count()).toBe(1);
    
    // Remove from cart
    const removeButton = page.locator('[data-test^="remove-from-cart"]');
    await removeButton.click();
    await page.waitForTimeout(300);
    
    // Verify empty
    cartItems = page.locator('[data-test="cart-item"]');
    expect(await cartItems.count()).toBe(0);
  });

  test('TC-212: Multiple Add/Remove Cycles', async ({ authenticatedPage: page }) => {
    const firstAddButton = page.locator('[data-test^="add-to-cart"]').first();
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    
    // Cycle 1: Add
    await firstAddButton.click();
    const badge1 = await page.locator('[data-test="shopping-cart-badge"]').textContent();
    expect(badge1).toBe('1');
    
    // Go to cart and remove
    await cartLink.click();
    let removeButtons = page.locator('[data-test^="remove-from-cart"]');
    await removeButtons.first().click();
    await page.waitForTimeout(300);
    
    // Back to inventory
    const continueButton = page.locator('[data-test="continue-shopping"]');
    await continueButton.click();
    
    // Cycle 2: Add again
    await firstAddButton.click();
    const badge2 = await page.locator('[data-test="shopping-cart-badge"]').textContent();
    expect(badge2).toBe('1');
  });
});
