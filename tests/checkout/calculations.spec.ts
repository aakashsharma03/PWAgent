// Test Cases: TC-020, TC-021
// Price Calculation Tests

import { test, expect } from '../../fixtures/authFixture.ts';
import { CheckoutOverviewPage } from '../../pages/CheckoutOverviewPage.ts';
import { CartPage } from '../../pages/CartPage.ts';
import { InventoryPage } from '../../pages/InventoryPage.ts';
import { CheckoutInfoPage } from '../../pages/CheckoutInfoPage.ts';
import { PRODUCTS } from '../../test-data/product-data.ts';
import { VALID_CHECKOUT, calculateTotal, parsePriceString } from '../../test-data/checkout-data.ts';
import { calculateTaxAmount } from '../../utils/helpers.ts';

test.describe('Price Calculations', () => {
  test('@critical @calculation TC-020: Single Item Price Calculation', async ({
    authenticatedPage: page,
  }) => {
    // Setup: Add single item (Backpack $29.99)
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.navigate();
    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK.name);

    // Navigate through checkout
    const cartPage = new CartPage(page);
    await cartPage.navigate();
    await cartPage.clickCheckout();

    const checkoutInfoPage = new CheckoutInfoPage(page);
    await checkoutInfoPage.proceedWithValidData(
      VALID_CHECKOUT.firstName,
      VALID_CHECKOUT.lastName,
      VALID_CHECKOUT.postalCode
    );

    // Verify prices on overview page
    const overviewPage = new CheckoutOverviewPage(page);
    const itemTotal = await overviewPage.getItemTotalValue();
    expect(itemTotal).toContain('29.99');

    const tax = await overviewPage.getTaxValue();
    expect(tax).toContain('2.40');

    const total = await overviewPage.getTotalValue();
    expect(total).toContain('32.39');

    // Verify calculation: $29.99 * 0.08 = $2.392 ≈ $2.40
    const taxValue = parsePriceString(tax);
    const expectedTax = calculateTaxAmount(29.99);
    expect(Math.abs(taxValue - expectedTax)).toBeLessThan(0.01);
  });

  test('@critical @calculation TC-021: Multiple Items Price Calculation', async ({
    authenticatedPage: page,
  }) => {
    // Setup: Add multiple items
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.navigate();

    // Add three items: Backpack ($29.99) + Bike Light ($9.99) + T-Shirt ($15.99) = $55.97
    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK.name);
    await inventoryPage.addItemToCart(PRODUCTS.BIKE_LIGHT.name);
    await inventoryPage.addItemToCart(PRODUCTS.BOLT_T_SHIRT.name);

    // Navigate through checkout
    const cartPage = new CartPage(page);
    await cartPage.navigate();

    // Verify cart subtotal
    const cartBadgeValue = await cartPage.getCartBadgeValue();
    expect(cartBadgeValue).toBe(3);

    await cartPage.clickCheckout();

    const checkoutInfoPage = new CheckoutInfoPage(page);
    await checkoutInfoPage.proceedWithValidData(
      VALID_CHECKOUT.firstName,
      VALID_CHECKOUT.lastName,
      VALID_CHECKOUT.postalCode
    );

    // Verify prices on overview page
    const overviewPage = new CheckoutOverviewPage(page);
    const itemTotal = await overviewPage.getItemTotalValue();
    
    // Extract numeric values for calculation
    const itemTotalValue = parsePriceString(itemTotal);
    expect(itemTotalValue).toBeCloseTo(55.97, 1);

    const tax = await overviewPage.getTaxValue();
    const taxValue = parsePriceString(tax);
    
    // Expected: $55.97 * 0.08 = $4.4776 ≈ $4.48
    const expectedTax = calculateTaxAmount(55.97);
    expect(Math.abs(taxValue - expectedTax)).toBeLessThan(0.01);

    const total = await overviewPage.getTotalValue();
    const totalValue = parsePriceString(total);
    
    // Expected: $55.97 + $4.48 = $60.45
    const expectedTotal = itemTotalValue + expectedTax;
    expect(Math.abs(totalValue - expectedTotal)).toBeLessThan(0.01);
  });

  test('@functional @calculation TC-022: Tax Calculation Accuracy with Various Amounts', async ({
    authenticatedPage: page,
  }) => {
    // Add items with specific prices for calculation testing
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.navigate();
    
    // Add single high-value item
    await inventoryPage.addItemToCart(PRODUCTS.FLEECE_JACKET.name); // $49.99

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
    const tax = await overviewPage.getTaxValue();
    const taxValue = parsePriceString(tax);

    // Expected: $49.99 * 0.08 = $3.9992 ≈ $4.00
    const expectedTax = calculateTaxAmount(49.99);
    expect(Math.abs(taxValue - expectedTax)).toBeLessThan(0.01);
  });
});
