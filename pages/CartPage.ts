import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage - Page Object for Cart functionality
 */
export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly removeButtons: Locator;
  readonly cartBadge: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.removeButtons = page.locator('[data-test^="remove"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.emptyCartMessage = page.locator('text=Your Cart is empty');
  }

  async navigate() {
    await this.goto('/cart.html');
  }

  async getCartItemCount(): Promise<number> {
    return await this.countElements(this.cartItems);
  }

  async getCartBadgeValue(): Promise<number> {
    return await this.getCartBadgeCount();
  }

  async clickContinueShopping() {
    await this.clickButton(this.continueShoppingButton);
    await this.waitForNavigation('**/inventory.html');
  }

  async clickCheckout() {
    await this.clickButton(this.checkoutButton);
    await this.waitForNavigation('**/checkout-step-one.html');
  }

  async removeItemByIndex(index: number) {
    const buttons = await this.removeButtons.all();
    if (index < buttons.length) {
      await buttons[index].click();
    }
  }

  async isCartEmpty(): Promise<boolean> {
    // Check if there are no cart items (more reliable than looking for empty message)
    const itemCount = await this.getCartItemCount();
    return itemCount === 0;
  }

  async verifyItemInCart(itemName: string): Promise<boolean> {
    const itemLocator = this.page.locator(`text=${itemName}`);
    return await this.isVisible(itemLocator);
  }
}
