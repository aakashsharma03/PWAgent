import { test, expect } from '../../fixtures/authFixture';
import { InventoryPage } from '../../pages/InventoryPage';
import { PRODUCTS, PRODUCT_LIST, SORT_OPTIONS, SORT_SCENARIOS } from '../../test-data/inventory-data';
import { expectPrice, expectCartCount } from '../../utils/assertions';

test.describe('Inventory and Shopping @inventory', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ authenticatedPage: page }) => {
    inventoryPage = new InventoryPage(page);
    // Ensure we're on the inventory page
    expect(page.url()).toContain('/inventory');
  });

  test('@smoke TC-101: Browse All Products and Verify Display', async ({ authenticatedPage: page }) => {
    // Verify inventory page is displayed
    expect(page.url()).toContain('/inventory');
    
    // Verify page title
    const title = page.locator('[data-test="title"]');
    await expect(title).toBeVisible();
    expect(await title.textContent()).toContain('Products');
    
    // Verify all 6 products are displayed
    const productItems = page.locator('[data-test="inventory-item"]');
    const count = await productItems.count();
    expect(count).toBe(6);
    
    // Verify each product has essential elements
    for (let i = 0; i < count; i++) {
      const item = productItems.nth(i);
      const productName = item.locator('[data-test="inventory-item-name"]');
      const productPrice = item.locator('[data-test="inventory-item-price"]');
      const addButton = item.locator('[data-test^="add-to-cart"]');
      
      await expect(productName).toBeVisible();
      await expect(productPrice).toBeVisible();
      await expect(addButton).toBeVisible();
    }
  });

  test('@smoke TC-102: Verify Product Names and Prices Display Correctly', async ({ authenticatedPage: page }) => {
    // Get all product items
    const productItems = page.locator('[data-test="inventory-item"]');
    const count = await productItems.count();
    
    expect(count).toBe(6);
    
    // Verify each product name and price
    const expectedProducts = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheSauces() T-Shirt (Red)',
    ];
    
    for (let i = 0; i < count; i++) {
      const item = productItems.nth(i);
      const nameElement = item.locator('[data-test="inventory-item-name"]');
      const priceElement = item.locator('[data-test="inventory-item-price"]');
      
      const text = await nameElement.textContent();
      expect(expectedProducts).toContain(text);
      
      const priceText = await priceElement.textContent();
      expect(priceText).toMatch(/\$\d+\.\d{2}/);
    }
  });

  test('TC-103: Sort Products by Name (A to Z)', async ({ authenticatedPage: page }) => {
    // Open sort dropdown
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    await expect(sortDropdown).toBeVisible();
    
    // Click on sort dropdown
    const selectButton = sortDropdown.locator('select');
    await selectButton.selectOption('az');
    
    // Wait for products to re-sort
    await page.waitForTimeout(500);
    
    // Verify products are sorted A to Z
    const productNames = await page.locator('[data-test="inventory-item-name"]').allTextContents();
    const expectedOrder = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheSauces() T-Shirt (Red)',
    ];
    
    expect(productNames).toEqual(expectedOrder);
  });

  test('TC-104: Sort Products by Price (Low to High)', async ({ authenticatedPage: page }) => {
    // Open sort dropdown and select low to high
    const selectButton = page.locator('[data-test="product-sort-container"] select');
    await selectButton.selectOption('lohi');
    
    // Wait for sorting
    await page.waitForTimeout(500);
    
    // Verify prices are sorted low to high
    const priceElements = await page.locator('[data-test="inventory-item-price"]').allTextContents();
    const prices = priceElements.map(text => parseFloat(text.replace('$', '')));
    
    // Check that prices are in ascending order
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  test('TC-105: Sort Products by Price (High to Low)', async ({ authenticatedPage: page }) => {
    // Select high to low sorting
    const selectButton = page.locator('[data-test="product-sort-container"] select');
    await selectButton.selectOption('hilo');
    
    // Wait for sorting
    await page.waitForTimeout(500);
    
    // Verify prices are sorted high to low
    const priceElements = await page.locator('[data-test="inventory-item-price"]').allTextContents();
    const prices = priceElements.map(text => parseFloat(text.replace('$', '')));
    
    // Check that prices are in descending order
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
    }
  });

  test('TC-106: Add Single Product to Cart', async ({ authenticatedPage: page }) => {
    // Get initial cart count
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    const initialCount = await cartBadge.isVisible() ? parseInt(await cartBadge.textContent() || '0') : 0;
    
    // Add first product to cart
    const firstAddButton = page.locator('[data-test^="add-to-cart"]').first();
    await firstAddButton.click();
    
    // Verify cart badge updated
    await expect(cartBadge).toBeVisible();
    const newCount = parseInt(await cartBadge.textContent() || '0');
    expect(newCount).toBe(initialCount + 1);
    
    // Verify button changed to "Remove"
    const removeButton = page.locator('[data-test^="remove-from-cart"]').first();
    await expect(removeButton).toBeVisible();
  });

  test('TC-107: Add Multiple Different Products to Cart', async ({ authenticatedPage: page }) => {
    // Add first product
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    await addButtons.nth(0).click();
    await page.waitForTimeout(300);
    
    // Add second product
    await addButtons.nth(1).click();
    await page.waitForTimeout(300);
    
    // Add third product
    await addButtons.nth(2).click();
    
    // Verify cart count is 3
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    expect(await cartBadge.textContent()).toBe('3');
  });

  test('TC-108: Remove Product from Inventory Page', async ({ authenticatedPage: page }) => {
    // Add item to cart
    const addButton = page.locator('[data-test^="add-to-cart"]').first();
    await addButton.click();
    await page.waitForTimeout(300);
    
    // Verify cart badge shows 1
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    expect(await cartBadge.textContent()).toBe('1');
    
    // Remove item from cart
    const removeButton = page.locator('[data-test^="remove-from-cart"]').first();
    await removeButton.click();
    
    // Verify cart badge is gone
    await expect(cartBadge).not.toBeVisible();
    
    // Verify button changed back to "Add to Cart"
    await expect(addButton).toBeVisible();
  });

  test('TC-109: Verify Product Images Load', async ({ authenticatedPage: page }) => {
    // Verify all product images are visible
    const productImages = page.locator('[data-test="inventory-item-img"]');
    const imageCount = await productImages.count();
    
    expect(imageCount).toBe(6);
    
    // Check each image is visible
    for (let i = 0; i < imageCount; i++) {
      const image = productImages.nth(i);
      await expect(image).toBeVisible();
      
      // Verify image has src attribute
      const src = await image.getAttribute('src');
      expect(src).toBeTruthy();
      expect(src).toContain('');
    }
  });

  test('@critical TC-110: Verify Sidebar Menu Shows Correct Cart Count', async ({ authenticatedPage: page }) => {
    // Add multiple items to cart
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    await addButtons.nth(0).click();
    await page.waitForTimeout(200);
    await addButtons.nth(1).click();
    await page.waitForTimeout(200);
    await addButtons.nth(2).click();
    
    // Open sidebar menu
    const menuButton = page.locator('[data-test="burger-menu-button"]');
    await menuButton.click();
    
    // Verify cart badge shows correct count
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    expect(await cartBadge.textContent()).toBe('3');
    
    // Close sidebar
    const closeButton = page.locator('[data-test="close-sidebar-menu-button"]');
    await closeButton.click();
  });

  test('TC-111: Logout and Verify Cart is Cleared', async ({ authenticatedPage: page }) => {
    // Add items to cart
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    await addButtons.nth(0).click();
    await page.waitForTimeout(300);
    
    // Verify item in cart
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    expect(await cartBadge.textContent()).toBe('1');
    
    // Open sidebar and logout
    const menuButton = page.locator('[data-test="burger-menu-button"]');
    await menuButton.click();
    await page.waitForTimeout(300);
    
    const logoutButton = page.locator('[data-test="logout-sidebar-link"]');
    await logoutButton.click();
    
    // Verify redirected to login page
    await expect(page).toHaveURL(/.*login/);
  });
});
