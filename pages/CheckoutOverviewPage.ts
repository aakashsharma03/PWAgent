import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutOverviewPage - Page Object for Checkout Overview (Step 2)
 */
export class CheckoutOverviewPage extends BasePage {
  readonly itemTotal: Locator;
  readonly taxAmount: Locator;
  readonly totalPrice: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;

  constructor(page: Page) {
    super(page);
    // Use specific data-test attributes for summary values (from inspection of Sauce Demo)
    this.itemTotal = page.locator('[data-test="subtotal-label"]');
    this.taxAmount = page.locator('[data-test="tax-label"]');
    this.totalPrice = page.locator('[data-test="total-label"]');
    this.paymentInfo = page.getByText('SauceCard #31337');
    this.shippingInfo = page.getByText('Free Pony Express Delivery!');
    this.finishButton = page.getByRole('button', { name: /finish/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.cartItemNames = page.locator('[data-test="inventory-item-name"]');
    this.cartItemPrices = page.locator('[data-test="inventory-item-price"]');
  }

  async navigate() {
    await this.goto('/checkout-step-two.html');
  }

  async getPrices() {
    const itemTotal = await this.getTextContent(this.itemTotal);
    const tax = await this.getTextContent(this.taxAmount);
    const total = await this.getTextContent(this.totalPrice);
    return { itemTotal, tax, total };
  }

  async getItemTotalValue(): Promise<string> {
    // Extract price from text like "Item total: $29.99"
    const fullText = await this.getTextContent(this.itemTotal);
    const match = fullText.match(/\$[\d.]+/);
    return match ? match[0] : '';
  }

  async getTaxValue(): Promise<string> {
    // Extract price from text like "Tax: $2.40"
    const fullText = await this.getTextContent(this.taxAmount);
    const match = fullText.match(/\$[\d.]+/);
    return match ? match[0] : '';
  }

  async getTotalValue(): Promise<string> {
    // Extract price from text like "Total: $32.39"
    const fullText = await this.getTextContent(this.totalPrice);
    const match = fullText.match(/\$[\d.]+/);
    return match ? match[0] : '';
  }

  async verifyOrderSummary() {
    // Verify checkout overview page is loaded by checking for key elements
    await this.page.waitForURL('**/checkout-step-two.html');
    
    // Wait for summary information to be visible
    await this.waitForElement(this.itemTotal);
    await this.waitForElement(this.taxAmount);
    await this.waitForElement(this.totalPrice);
  }

  async verifyPaymentInfo() {
    await this.waitForElement(this.paymentInfo);
    const text = await this.getTextContent(this.paymentInfo);
    if (!text.includes('31337')) {
      throw new Error('Payment information not found');
    }
  }

  async verifyShippingInfo() {
    await this.waitForElement(this.shippingInfo);
    const text = await this.getTextContent(this.shippingInfo);
    if (!text.includes('Pony')) {
      throw new Error('Shipping information not found');
    }
  }

  async clickFinish() {
    await this.clickButton(this.finishButton);
    await this.waitForNavigation('**/checkout-complete.html');
  }

  async clickCancel() {
    // Wait for navigation and click in parallel to catch the navigation event
    await Promise.all([
      this.page.waitForURL(/\/(cart|inventory)\.html/, { timeout: 10000 }),
      this.clickButton(this.cancelButton)
    ]);
  }

  async getCartItemCount(): Promise<number> {
    return await this.countElements(this.cartItems);
  }

  async getCartItemNames(): Promise<string[]> {
    const items = await this.cartItemNames.all();
    const names: string[] = [];
    for (const item of items) {
      const text = await this.getTextContent(item);
      if (text) {
        names.push(text);
      }
    }
    return names;
  }

  async verifyCartItem(itemName: string): Promise<boolean> {
    const itemLocator = this.page.getByText(itemName, { exact: false });
    return await this.isVisible(itemLocator);
  }
}
