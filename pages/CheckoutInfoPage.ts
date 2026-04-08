import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutInfoPage - Page Object for Checkout Information (Step 1)
 */
export class CheckoutInfoPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorHeading: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorHeading = page.locator('h3:has-text("Error:")');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async navigate() {
    await this.goto('/checkout-step-one.html');
  }

  async fillCheckoutForm(firstName: string, lastName: string, postalCode: string) {
    await this.fillInput(this.firstNameInput, firstName);
    await this.fillInput(this.lastNameInput, lastName);
    await this.fillInput(this.postalCodeInput, postalCode);
  }

  async fillFirstName(firstName: string) {
    await this.fillInput(this.firstNameInput, firstName);
  }

  async fillLastName(lastName: string) {
    await this.fillInput(this.lastNameInput, lastName);
  }

  async fillPostalCode(postalCode: string) {
    await this.fillInput(this.postalCodeInput, postalCode);
  }

  async clickContinue() {
    await this.clickButton(this.continueButton);
  }

  async proceedWithValidData(firstName: string, lastName: string, postalCode: string) {
    await this.fillCheckoutForm(firstName, lastName, postalCode);
    await this.clickContinue();
    await this.waitForNavigation('**/checkout-step-two.html');
  }

  async clickCancel() {
    await this.clickButton(this.cancelButton);
    await this.waitForNavigation('**/cart.html');
  }

  async getErrorMessage(): Promise<string> {
    try {
      await this.errorHeading.waitFor({ state: 'visible', timeout: 5000 });
      return await this.getTextContent(this.errorHeading);
    } catch {
      return '';
    }
  }

  async expectErrorMessage(expectedText: string) {
    const errorMsg = await this.getErrorMessage();
    if (!errorMsg.includes(expectedText)) {
      throw new Error(
        `Expected error to contain "${expectedText}" but got "${errorMsg}"`
      );
    }
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.isVisible(this.errorHeading);
  }

  async getFirstNameValue(): Promise<string> {
    return await this.firstNameInput.inputValue();
  }

  async getLastNameValue(): Promise<string> {
    return await this.lastNameInput.inputValue();
  }

  async getPostalCodeValue(): Promise<string> {
    return await this.postalCodeInput.inputValue();
  }
}
