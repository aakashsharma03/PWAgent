import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Test credentials
export const DEFAULT_CREDENTIALS = {
  username: 'standard_user',
  password: 'secret_sauce',
};

// Fixture type definition
type AuthFixtures = {
  authenticatedPage: Page;
};

/**
 * authFixture - Provides an authenticated page with logged-in user
 * Usage in tests:
 *   import { test, expect } from '../fixtures/authFixture';
 *
 *   test('test name', async ({ authenticatedPage: page }) => {
 *     // Page is already logged in
 *   });
 */
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Navigate to login page
    await page.goto('https://www.saucedemo.com');

    // Perform login
    const loginPage = new LoginPage(page);
    await loginPage.login(DEFAULT_CREDENTIALS.username, DEFAULT_CREDENTIALS.password);

    // Wait for inventory page to fully load
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Provide authenticated page to test
    await use(page);

    // Cleanup (Sauce Demo doesn't persist state, so no cleanup needed)
    // But we can log out if needed
    try {
      const logoutButton = page.locator('[data-test="logout-sidebar-link"]');
      if (await logoutButton.isVisible({ timeout: 1000 })) {
        await logoutButton.click();
      }
    } catch {
      // Logout button not visible or not needed
    }
  },
});

export { expect } from '@playwright/test';
