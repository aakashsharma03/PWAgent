import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * InventoryPage - Page Object for Product Inventory/Catalog
 */
export class InventoryPage extends BasePage {
  readonly addToCartButtons: Locator;
  readonly removeButtons: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly productSort: Locator;
  readonly inventoryItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
    this.removeButtons = page.locator('[data-test^="remove"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.productSort = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.productNames = page.locator('[data-test="inventory-item-name"]');
    this.productPrices = page.locator('[data-test="inventory-item-price"]');
  }

  async navigate() {
    await this.goto('/inventory.html');
  }

  async addItemToCart(itemName: string) {
    const inventoryItem = this.page.locator('[data-test="inventory-item"]').filter({ 
      has: this.page.getByText(itemName, { exact: true }) 
    });
    const buttonLocator = inventoryItem.locator('[data-test^="add-to-cart"]').first();
    await this.clickButton(buttonLocator);
  }

  async removeItemFromCart(itemName: string) {
    const inventoryItem = this.page.locator('[data-test="inventory-item"]').filter({ 
      has: this.page.getByText(itemName, { exact: true }) 
    });
    const buttonLocator = inventoryItem.locator('[data-test^="remove"]').first();
    await this.clickButton(buttonLocator);
  }

  async getCartBadgeValue(): Promise<number> {
    return await this.getCartBadgeCount();
  }

  async clickCart() {
    await this.clickButton(this.cartLink);
    await this.waitForNavigation('**/cart.html');
  }

  async sortBy(sortOption: string) {
    const sortDropdown = this.page.locator('[data-test="product-sort-container"]');
    await sortDropdown.selectOption(sortOption);
  }

  async sortByNameAZ() {
    await this.sortBy('az');
  }

  async sortByNameZA() {
    await this.sortBy('za');
  }

  async sortByPriceLowHigh() {
    await this.sortBy('lohi');
  }

  async sortByPriceHighLow() {
    await this.sortBy('hilo');
  }

  async getProductCount(): Promise<number> {
    return await this.countElements(this.inventoryItems);
  }

  async getProductNames(): Promise<string[]> {
    const items = await this.productNames.all();
    const names: string[] = [];
    for (const item of items) {
      const text = await this.getTextContent(item);
      if (text) {
        names.push(text);
      }
    }
    return names;
  }

  async getProductPrices(): Promise<string[]> {
    const items = await this.productPrices.all();
    const prices: string[] = [];
    for (const item of items) {
      const text = await this.getTextContent(item);
      if (text) {
        prices.push(text);
      }
    }
    return prices;
  }

  async isProductVisible(productName: string): Promise<boolean> {
    const productLocator = this.page.getByText(productName, { exact: false });
    return await this.isVisible(productLocator);
  }
}
