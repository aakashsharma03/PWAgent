import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage - Base class for all Page Objects
 * Provides common utilities and methods for page interaction
 */
export class BasePage {
  readonly page: Page;
  readonly baseURL = 'https://www.saucedemo.com';

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation
  async goto(path: string) {
    await this.page.goto(`${this.baseURL}${path}`);
  }

  async waitForNavigation(urlPattern: string, timeout = 10000) {
    await this.page.waitForURL(urlPattern, { timeout });
  }

  // Element actions
  async fillInput(locator: Locator, text: string) {
    await locator.fill(text);
  }

  async clickButton(locator: Locator) {
    await locator.click();
  }

  async getTextContent(locator: Locator): Promise<string> {
    return (await locator.textContent()) || '';
  }

  async getAttribute(locator: Locator, attribute: string): Promise<string | null> {
    return await locator.getAttribute(attribute);
  }

  // Wait utilities
  async waitForElement(locator: Locator, timeout = 5000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForElementToHide(locator: Locator, timeout = 5000) {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  // Visibility checks
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible({ timeout: 1000 });
    } catch {
      return false;
    }
  }

  async isHidden(locator: Locator): Promise<boolean> {
    try {
      return await locator.isHidden({ timeout: 1000 });
    } catch {
      return true;
    }
  }

  // Cart utilities
  async getCartBadgeCount(): Promise<number> {
    const badge = this.page.locator('[data-test="shopping-cart-badge"]');
    if (await this.isVisible(badge)) {
      const text = await this.getTextContent(badge);
      return parseInt(text, 10) || 0;
    }
    return 0;
  }

  // Error handling
  async closeErrorMessage() {
    const errorHeading = this.page.locator('h3:has-text("Error:")');
    if (await this.isVisible(errorHeading)) {
      const closeButton = errorHeading.locator('.. button');
      if (await this.isVisible(closeButton)) {
        await closeButton.click();
        await this.waitForElementToHide(errorHeading);
      }
    }
  }

  // Wait for condition
  async waitForCondition(condition: () => Promise<boolean>, timeout = 5000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await this.page.waitForTimeout(100);
    }
    throw new Error(`Condition not met within ${timeout}ms`);
  }

  // Count elements
  async countElements(locator: Locator): Promise<number> {
    return await locator.count();
  }

  // URL assertion
  async expectUrlToContain(pattern: string) {
    await expect(this.page).toHaveURL(new RegExp(pattern));
  }

  // Page title assertion
  async expectPageTitle(title: string) {
    await expect(this.page).toHaveTitle(new RegExp(title));
  }
}
