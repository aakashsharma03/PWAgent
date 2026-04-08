import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage - Page Object for Login functionality
 */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async navigate() {
    await this.goto('/');
  }

  async login(username: string, password: string) {
    await this.navigate();
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickButton(this.loginButton);
    await this.page.waitForURL('**/inventory.html', { timeout: 10000 });
  }

  async getErrorMessage(): Promise<string> {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getTextContent(this.errorMessage);
    }
    return '';
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }
}
