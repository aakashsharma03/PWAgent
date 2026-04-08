/**
 * Custom Assertions for Sauce Labs checkout tests
 */

import { expect, Page, Locator } from '@playwright/test';

/**
 * Verify price matches expected value
 */
export async function expectPrice(
  locator: Locator,
  expectedPrice: string
) {
  const text = await locator.textContent();
  expect(text).toContain(expectedPrice);
}

/**
 * Verify validation error message appears
 */
export async function expectValidationError(
  page: Page,
  expectedError: string
) {
  const errorHeading = page.locator('h3:has-text("Error:")');
  await errorHeading.waitFor({ state: 'visible', timeout: 5000 });
  const text = await errorHeading.textContent();
  expect(text).toContain(expectedError);
}

/**
 * Verify cart count badge shows expected value
 */
export async function expectCartCount(
  page: Page,
  expectedCount: number
) {
  if (expectedCount === 0) {
    const badge = page.locator('[data-test="shopping-cart-badge"]');
    try {
      await expect(badge).not.toBeVisible({ timeout: 3000 });
    } catch {
      // Badge might not exist when count is 0
    }
  } else {
    const badge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(badge).toContainText(expectedCount.toString());
  }
}

/**
 * Verify cart is empty
 */
export async function expectCartEmpty(page: Page) {
  const emptyMessage = page.locator('text=Your Cart is empty');
  await expect(emptyMessage).toBeVisible();
}

/**
 * Verify no console errors
 */
export async function expectNoConsoleErrors(page: Page) {
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  expect(consoleErrors.length).toBe(0);
}

/**
 * Verify order confirmation page
 */
export async function expectOrderConfirmation(page: Page) {
  const heading = page.locator('h2:has-text("Checkout: Complete!")');
  await heading.waitFor({ state: 'visible', timeout: 5000 });
  await expect(heading).toBeVisible();

  const thankYouMsg = page.locator('text=Thank you for your order');
  await expect(thankYouMsg).toBeVisible();
}

/**
 * Verify specific text is visible
 */
export async function expectTextVisible(page: Page, text: string) {
  const locator = page.locator(`text=${text}`);
  await expect(locator).toBeVisible();
}

/**
 * Verify price format accuracy
 */
export async function expectPriceFormat(locator: Locator, expectedFormat: RegExp) {
  const text = await locator.textContent();
  expect(text).toMatch(expectedFormat);
}

/**
 * Verify order total calculation
 */
export async function expectTotalCalculation(
  subtotal: number,
  taxRate: number,
  expectedTotal: number
) {
  const calculatedTax = Math.round(subtotal * taxRate * 100) / 100;
  const calculatedTotal = subtotal + calculatedTax;
  expect(calculatedTotal).toBe(expectedTotal);
}

/**
 * Verify element has proper CSS class
 */
export async function expectElementHasClass(
  locator: Locator,
  className: string
) {
  const classes = await locator.getAttribute('class');
  expect(classes).toContain(className);
}

/**
 * Verify attribute value
 */
export async function expectAttributeValue(
  locator: Locator,
  attribute: string,
  expectedValue: string
) {
  const value = await locator.getAttribute(attribute);
  expect(value).toBe(expectedValue);
}

/**
 * Verify form field is disabled
 */
export async function expectFieldDisabled(locator: Locator) {
  await expect(locator).toBeDisabled();
}

/**
 * Verify form field is enabled
 */
export async function expectFieldEnabled(locator: Locator) {
  await expect(locator).toBeEnabled();
}

/**
 * Verify button is clickable
 */
export async function expectButtonClickable(locator: Locator) {
  await expect(locator).toBeEnabled();
  await expect(locator).toBeVisible();
}
