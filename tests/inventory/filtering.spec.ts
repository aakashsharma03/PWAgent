import { test, expect } from '../../fixtures/authFixture';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Product Filtering and Search @inventory', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ authenticatedPage: page }) => {
    inventoryPage = new InventoryPage(page);
    expect(page.url()).toContain('/inventory');
  });

  test('TC-112: Verify All 6 Unique Products Exist', async ({ authenticatedPage: page }) => {
    const expectedProducts = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheSauces() T-Shirt (Red)',
    ];

    const productNames = await page.locator('[data-test="inventory-item-name"]').allTextContents();
    
    expect(productNames.length).toBe(6);
    expectedProducts.forEach(product => {
      expect(productNames).toContain(product);
    });
  });

  test('TC-113: Verify Product Price Ranges', async ({ authenticatedPage: page }) => {
    const expectedPrices = ['$29.99', '$9.99', '$15.99', '$49.99', '$7.99', '$15.99'];
    const priceElements = await page.locator('[data-test="inventory-item-price"]').allTextContents();
    
    // Verify all expected prices are present
    expectedPrices.forEach(price => {
      expect(priceElements).toContain(price);
    });
  });

  test('TC-114: Sort by Name Z to A', async ({ authenticatedPage: page }) => {
    // Select Z to A sorting
    const selectButton = page.locator('[data-test="product-sort-container"] select');
    await selectButton.selectOption('za');
    
    await page.waitForTimeout(500);
    
    // Verify names are in reverse alphabetical order
    const productNames = await page.locator('[data-test="inventory-item-name"]').allTextContents();
    
    expect(productNames[0]).toContain('Test.allTheSauces()');
    expect(productNames[5]).toContain('Sauce Labs Backpack');
  });

  test('TC-115: Add Items and Verify Counter Updates', async ({ authenticatedPage: page }) => {
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    
    // Add 5 different items
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    for (let i = 0; i < 5; i++) {
      await addButtons.nth(i).click();
      await page.waitForTimeout(200);
      const expectedCount = i + 1;
      expect(await cartBadge.textContent()).toBe(expectedCount.toString());
    }
  });

  test('TC-116: Add All 6 Products to Cart', async ({ authenticatedPage: page }) => {
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    const buttonCount = await addButtons.count();
    
    // Add all products to cart
    for (let i = 0; i < buttonCount; i++) {
      await addButtons.nth(i).click();
      await page.waitForTimeout(300);
    }
    
    // Verify cart badge shows 6
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    expect(await cartBadge.textContent()).toBe('6');
  });

  test('TC-117: Remove and Re-add Same Product', async ({ authenticatedPage: page }) => {
    // Add product
    const addButton = page.locator('[data-test^="add-to-cart"]').first();
    await addButton.click();
    await page.waitForTimeout(300);
    
    // Verify in cart
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    expect(await cartBadge.textContent()).toBe('1');
    
    // Remove product
    const removeButton = page.locator('[data-test^="remove-from-cart"]').first();
    await removeButton.click();
    await page.waitForTimeout(300);
    
    // Verify removed from cart
    await expect(cartBadge).not.toBeVisible();
    
    // Re-add product
    await addButton.click();
    await page.waitForTimeout(300);
    
    // Verify back in cart
    expect(await cartBadge.textContent()).toBe('1');
  });

  test('TC-118: Verify Button State Changes (Add ↔ Remove)', async ({ authenticatedPage: page }) => {
    const firstProductItem = page.locator('[data-test="inventory-item"]').first();
    const addButton = firstProductItem.locator('[data-test^="add-to-cart"]');
    
    // Verify Add button is visible initially
    await expect(addButton).toBeVisible();
    const addText = await addButton.textContent();
    expect(addText).toContain('Add to cart');
    
    // Click to add
    await addButton.click();
    await page.waitForTimeout(300);
    
    // Verify Remove button is visible
    const removeButton = firstProductItem.locator('[data-test^="remove-from-cart"]');
    await expect(removeButton).toBeVisible();
    
    // Click to remove
    await removeButton.click();
    await page.waitForTimeout(300);
    
    // Verify Add button is visible again
    await expect(addButton).toBeVisible();
  });

  test('TC-119: Verify Product Description Text Visible', async ({ authenticatedPage: page }) => {
    // Check first product has description
    const firstProductItem = page.locator('[data-test="inventory-item"]').first();
    const description = firstProductItem.locator('[data-test="inventory-item-desc"]');
    
    await expect(description).toBeVisible();
    const text = await description.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });

  test('@critical TC-120: Inventory Page Not Empty After Login', async ({ authenticatedPage: page }) => {
    // Verify products are displayed
    const productItems = page.locator('[data-test="inventory-item"]');
    const count = await productItems.count();
    
    expect(count).toBeGreaterThan(0);
    expect(count).toBe(6);
    
    // Verify sorting dropdown exists
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    await expect(sortDropdown).toBeVisible();
  });
});
