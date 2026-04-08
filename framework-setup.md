# Framework Setup - Playwright + TypeScript + POM
**Status:** Recommended for Implementation  
**Target:** Production-Grade Automation Framework

---

## **1. Project Structure**

```
AgenticPW/
├── .github/
│   └── workflows/
│       └── e2e.yml                    # CI/CD pipeline
├── config/
│   ├── environments.config.ts         # Environment configurations
│   └── browser.config.ts              # Browser-specific config
├── fixtures/
│   ├── authFixture.ts                 # Authentication setup
│   ├── cartFixture.ts                 # Cart pre-population
│   └── baseFixture.ts                 # Base test fixture
├── pages/
│   ├── BasePage.ts                    # Base page class
│   ├── LoginPage.ts                   # Login functionality
│   ├── InventoryPage.ts               # Product listing
│   ├── CartPage.ts                    # Cart review
│   ├── CheckoutInfoPage.ts            # Checkout Step 1
│   ├── CheckoutOverviewPage.ts        # Checkout Step 2
│   └── CheckoutCompletePage.ts        # Order Confirmation
├── tests/
│   ├── auth/
│   │   └── login.spec.ts
│   ├── inventory/
│   │   ├── browse.spec.ts
│   │   └── sort.spec.ts
│   ├── cart/
│   │   ├── add-remove.spec.ts
│   │   └── cart-operations.spec.ts
│   ├── checkout/
│   │   ├── validation.spec.ts         # Field validation
│   │   ├── information.spec.ts        # Step 1 tests
│   │   ├── overview.spec.ts           # Step 2 tests
│   │   ├── completion.spec.ts         # Final step
│   │   ├── calculations.spec.ts       # Price calcs
│   │   ├── error-handling.spec.ts     # Error flows
│   │   └── navigation.spec.ts         # Navigation flows
│   └── regression/
│       ├── cross-browser.spec.ts
│       ├── mobile.spec.ts
│       └── full-flow.spec.ts
├── utils/
│   ├── assertions.ts                  # Custom assertions
│   ├── helpers.ts                     # Helper functions
│   ├── waits.ts                       # Wait utilities
│   └── constants.ts                   # Test constants
├── test-data/
│   ├── checkout-data.ts               # Checkout test data
│   ├── product-data.ts                # Product data
│   └── users.ts                       # User credentials
├── reports/                           # Test execution reports
├── test-plan.md                       # Test planning doc
├── test-cases.md                      # Test case catalog
├── playwright.config.ts               # Playwright configuration
├── package.json
└── README.md
```

---

## **2. BasePage Class Pattern**

```typescript
// pages/BasePage.ts
import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Common actions
  async goto(path: string) {
    await this.page.goto(path);
  }

  async fillInput(locator: Locator, text: string) {
    await locator.fill(text);
  }

  async clickButton(locator: Locator) {
    await locator.click();
  }

  async getTextContent(locator: Locator): Promise<string> {
    return (await locator.textContent()) || '';
  }

  async waitForElement(locator: Locator, timeout = 5000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForNavigation(pattern: string, timeout = 10000) {
    await this.page.waitForURL(pattern, { timeout });
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  async getCartBadgeCount(): Promise<number> {
    const badge = this.page.locator('[data-test="shopping-cart-badge"]');
    const text = await badge.textContent();
    return parseInt(text || '0', 10);
  }

  async closeErrorMessage() {
    const closeButton = this.page.locator('[data-test="error"] button');
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.page.locator('[data-test="error"]').waitFor({ state: 'hidden' });
    }
  }
}
```

---

## **3. Page Object Examples**

### **CheckoutInfoPage.ts**
```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutInfoPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorHeading = page.locator('h3:has-text("Error:")');
  }

  async fillCheckoutForm(firstName: string, lastName: string, postal: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postal);
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorHeading.waitFor({ state: 'visible', timeout: 5000 });
    return await this.getTextContent(this.errorHeading);
  }

  async expectErrorMessage(expectedError: string) {
    const actual = await this.getErrorMessage();
    if (!actual.includes(expectedError)) {
      throw new Error(`Expected "${expectedError}" but got "${actual}"`);
    }
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.isVisible(this.errorHeading);
  }
}
```

### **CheckoutOverviewPage.ts**
```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutOverviewPage extends BasePage {
  readonly itemTotal: Locator;
  readonly taxAmount: Locator;
  readonly totalPrice: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    super(page);
    this.itemTotal = page.locator('[data-test="subtotal"]');
    this.taxAmount = page.locator('[data-test="tax"]');
    this.totalPrice = page.locator('[data-test="total"]');
    this.paymentInfo = page.locator('text=SauceCard');
    this.shippingInfo = page.locator('text=FREE PONY');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
  }

  async getPrices() {
    const itemTotal = await this.getTextContent(this.itemTotal);
    const tax = await this.getTextContent(this.taxAmount);
    const total = await this.getTextContent(this.totalPrice);
    return { itemTotal, tax, total };
  }

  async verifyOrderSummary() {
    await this.waitForElement(this.itemTotal);
    await this.waitForElement(this.taxAmount);
    await this.waitForElement(this.totalPrice);
  }

  async clickFinish() {
    await this.finishButton.click();
    await this.waitForNavigation('**/checkout-complete.html');
  }

  async clickCancel() {
    await this.cancelButton.click();
    await this.waitForNavigation('**/cart.html');
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }
}
```

### **CheckoutCompletePage.ts**
```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly confirmationHeading: Locator;
  readonly confirmationMessage: Locator;
  readonly backHomeButton: Locator;
  readonly ponyExpressImage: Locator;

  constructor(page: Page) {
    super(page);
    this.confirmationHeading = page.locator('h2:has-text("Thank you")');
    this.confirmationMessage = page.locator('text=dispatched');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.ponyExpressImage = page.locator('img[alt*="Pony"]');
  }

  async getConfirmationHeading(): Promise<string> {
    return await this.getTextContent(this.confirmationHeading);
  }

  async getConfirmationMessage(): Promise<string> {
    return await this.getTextContent(this.confirmationMessage);
  }

  async verifyOrderConfirmation() {
    await this.waitForElement(this.confirmationHeading);
    await this.waitForElement(this.confirmationMessage);
    const heading = await this.getConfirmationHeading();
    if (!heading.includes('Thank you')) {
      throw new Error('Order confirmation heading not found');
    }
  }

  async clickBackHome() {
    await this.backHomeButton.click();
    await this.waitForNavigation('**/inventory.html');
  }
}
```

---

## **4. Fixture Strategy**

```typescript
// fixtures/authFixture.ts
import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export const DEFAULT_CREDS = {
  username: 'standard_user',
  password: 'secret_sauce',
};

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Navigate and login
    await page.goto('https://www.saucedemo.com');
    const loginPage = new LoginPage(page);
    await loginPage.login(DEFAULT_CREDS.username, DEFAULT_CREDS.password);
    
    // Wait for inventory page
    await page.waitForURL('**/inventory.html', { timeout: 10000 });
    
    await use(page);
    
    // Cleanup (if needed - Sauce Demo doesn't require it)
  },
});

export { expect } from '@playwright/test';
```

---

## **5. Test Data Management**

```typescript
// test-data/checkout-data.ts
export const VALID_CHECKOUT = {
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '12345',
};

export const INVALID_INPUTS = [
  { field: 'firstName', value: '', expectedError: 'First Name is required' },
  { field: 'lastName', value: '', expectedError: 'Last Name is required' },
  { field: 'postalCode', value: '', expectedError: 'Postal Code is required' },
  { field: 'firstName', value: '@#$%', expectedError: null }, // Accepted
  { field: 'firstName', value: '   ', expectedError: null }, // Whitespace accepted
];

export const EDGE_CASES = {
  longInput: 'A'.repeat(100),
  numericInput: '12345',
  specialChars: '@#$%&*()',
  whiteSpace: '     ',
};

// test-data/product-data.ts
export const PRODUCTS = {
  BACKPACK: {
    id: 4,
    name: 'Sauce Labs Backpack',
    price: '$29.99',
    priceCents: 2999,
  },
  BIKE_LIGHT: {
    id: 0,
    name: 'Sauce Labs Bike Light',
    price: '$9.99',
    priceCents: 999,
  },
  BOLT_T_SHIRT: {
    id: 1,
    name: 'Sauce Labs Bolt T-Shirt',
    price: '$15.99',
    priceCents: 1599,
  },
  FLEECE_JACKET: {
    id: 5,
    name: 'Sauce Labs Fleece Jacket',
    price: '$49.99',
    priceCents: 4999,
  },
  ONESIE: {
    id: 2,
    name: 'Sauce Labs Onesie',
    price: '$7.99',
    priceCents: 799,
  },
};

export const TAX_RATE = 0.08; // 8%

export const calculateTotal = (itemTotal: number): string => {
  const tax = Math.round(itemTotal * TAX_RATE * 100) / 100;
  const total = itemTotal + tax;
  return total.toFixed(2);
};
```

---

## **6. Custom Assertions**

```typescript
// utils/assertions.ts
import { expect, Page, Locator } from '@playwright/test';

export async function expectPrice(
  locator: Locator,
  expectedPrice: string
) {
  const text = await locator.textContent();
  expect(text).toContain(expectedPrice);
}

export async function expectValidationError(
  page: Page,
  expectedError: string
) {
  const errorHeading = page.locator(`h3:has-text("Error:")`);
  await errorHeading.waitFor({ state: 'visible', timeout: 5000 });
  const text = await errorHeading.textContent();
  expect(text).toContain(expectedError);
}

export async function expectCartCount(
  page: Page,
  expectedCount: number
) {
  if (expectedCount === 0) {
    const badge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(badge).not.toBeVisible();
  } else {
    const badge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(badge).toContainText(expectedCount.toString());
  }
}

export async function expectCartEmpty(page: Page) {
  const emptyMessage = page.locator('text=Your Cart is empty');
  await expect(emptyMessage).toBeVisible();
}

export async function expectNoConsoleErrors(page: Page) {
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  expect(consoleErrors).toHaveLength(0);
}
```

---

## **7. Playwright Configuration**

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run server',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

---

## **8. Locator Strategy Guidelines**

### **Priority Order (Most Reliable to Least):**

1. **Data-Test Attributes** (Most Reliable)
   ```typescript
   page.locator('[data-test="firstName"]')
   ```

2. **Role-Based Queries**
   ```typescript
   page.getByRole('button', { name: 'Continue' })
   page.getByRole('textbox', { name: 'First Name' })
   ```

3. **Label-Based**
   ```typescript
   page.getByLabel('First Name')
   ```

4. **Placeholder Text**
   ```typescript
   page.locator('input[placeholder="First Name"]')
   ```

### **Avoid:**
- ❌ Index-based selectors (`:nth-child(2)`)
- ❌ XPath queries
- ❌ Pixel coordinates
- ❌ Order-dependent selectors
- ❌ Text-only selectors

---

## **9. Key Implementation Notes**

### **Anti-Patterns to Avoid:**
- ❌ Hard-coded waits: `page.waitForTimeout(2000)`
- ❌ Hard-coded credentials in tests
- ❌ Test order dependencies
- ❌ Global test state
- ❌ Unrelated assertions in one test

### **Best Practices:**
- ✅ Element-based waits: `locator.waitFor({ state: 'visible' })`
- ✅ Test isolation with fixtures
- ✅ Page Objects for maintainability
- ✅ Parallel execution support
- ✅ Semantic assertions with clear error messages
- ✅ Environment-based configuration
- ✅ Data-driven test variants

---

## **10. Setup Instructions**

```bash
# Install dependencies
npm install

# Run all tests
npm run test

# Run tests by tag
npm run test -- --grep @smoke
npm run test -- --grep @critical

# Run tests by file pattern
npm run test checkout/validation.spec.ts

# Run tests in debug mode
npm run test --debug

# Run with specific browser
npm run test -- --project chromium

# Generate HTML report
npm run test
npm run report

# Run tests matching pattern
npm run test -- --grep "TC-001"
```

---

## **Next Steps**

1. Check these files into the repository
2. Run `npm install` to ensure dependencies are installed
3. Create pages/ directory and implement Page Objects
4. Create fixtures/ directory and auth fixture
5. Create tests/ directory with initial smoke tests
6. Run framework validation tests
7. Integrate with CI/CD pipeline
