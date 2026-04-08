import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutCompletePage - Page Object for Order Confirmation
 */
export class CheckoutCompletePage extends BasePage {
  readonly confirmationHeading: Locator;
  readonly confirmationMessage: Locator;
  readonly backHomeButton: Locator;
  readonly completeHeader: Locator;
  readonly ponyImage: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.getByRole('heading', { name: /thank you for your order/i });
    this.confirmationHeading = page.getByRole('heading', { name: /thank you for your order/i });
    this.confirmationMessage = page.getByText(/dispatched/i);
    this.backHomeButton = page.getByRole('button', { name: /back home/i });
    this.ponyImage = page.getByAltText('Pony Express');
  }

  async navigate() {
    await this.goto('/checkout-complete.html');
  }

  async getConfirmationHeading(): Promise<string> {
    return await this.getTextContent(this.confirmationHeading);
  }

  async getConfirmationMessage(): Promise<string> {
    return await this.getTextContent(this.confirmationMessage);
  }

  async verifyOrderConfirmation() {
    try {
      await this.waitForElement(this.completeHeader);
      const heading = await this.getTextContent(this.completeHeader);
      if (!heading.toLowerCase().includes('thank you')) {
        throw new Error('Complete header not found');
      }

      await this.waitForElement(this.confirmationMessage);
      const message = await this.getConfirmationMessage();
      if (!message.toLowerCase().includes('dispatched')) {
        throw new Error('Dispatch message not found');
      }
    } catch (error) {
      throw new Error(`Order confirmation verification failed: ${error}`);
    }
  }

  async verifyOrderConfirmationMessage() {
    try {
      const message = await this.getConfirmationMessage();
      if (!message.includes('dispatched')) {
        throw new Error('Dispatch message not found in confirmation');
      }
    } catch (error) {
      throw new Error(`Confirmation message verification failed: ${error}`);
    }
  }

  async clickBackHome() {
    await this.clickButton(this.backHomeButton);
    await this.waitForNavigation('**/inventory.html');
  }

  async isBackHomeButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.backHomeButton);
  }
}
