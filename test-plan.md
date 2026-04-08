# E-commerce Checkout Process - Test Plan
**User Story:** SCRUM-101  
**Application:** https://www.saucedemo.com  
**Test Framework:** Playwright + TypeScript + POM  

---

## **1. Scope**

### Functional Scope:
- Cart operations (add, remove, view)
- Checkout information entry and validation
- Checkout overview and summary
- Order completion and confirmation
- Navigation flows between pages
- Form validation behavior
- Price calculations

### Out of Scope:
- Payment processing (mocked in Sauce Demo)
- Inventory management
- User profile management
- Product reviews/ratings
- Advanced search/filtering (beyond sort dropdown)

### Test Types:
- **Smoke Tests:** Core checkout flow without errors
- **Regression Tests:** Validation rules, error handling, calculations
- **Functional Tests:** Form behavior, navigation, business logic
- **Edge Case Tests:** Boundary conditions, invalid inputs

---

## **2. Test Strategy**

### UI-Focused Approach:
- Emphasis on user interactions and visual feedback
- Form validation message verification
- Navigation pathway validation
- Price and total calculations verification
- Button state changes (Add to Cart → Remove, enabled/disabled states)

### Browser Coverage:
- **Primary:** Chrome (latest)
- **Secondary:** Firefox (latest)
- **Tertiary:** Safari (latest)
- All tests focus on functional consistency across browsers
- Mobile responsiveness testing for form elements at 375px viewport width

### Test Execution Strategy:
- Parallel execution by feature/suite
- Test isolation: Clean login session between test suites
- Fresh cart state before each checkout test
- No dependencies between test cases

---

## **3. Risk Analysis**

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Dynamic cart badge update timing | Medium | Use explicit waits for `[data-test="shopping-cart-link"]` text content |
| Form validation timing | Medium | Wait for error heading to appear before assertion |
| Tax calculation floating point | Medium | Compare as string or with tolerance |
| Element visibility flakiness | Medium | Use visible `locator()` with timeout |
| Session timeout during checkout | Low | Use stable credentials; tests complete within reasonable time |
| Price format inconsistency | Low | Use regex or normalized string comparison |

---

## **4. Environment Strategy**

### Test Environment:
- **URL:** https://www.saucedemo.com
- **Standard user credentials:** `standard_user` / `secret_sauce`
- **No test data setup required** (pre-populated inventory)
- **No cleanup required** (Sauce Demo doesn't persist state)

### Environment Assumptions:
- Application is fully functional and accessible
- Products and pricing are stable
- No authentication failures for valid credentials
- Same cart/inventory across all browsers

---

## **5. Test Data Strategy**

### Login Credentials:
```
Username: standard_user
Password: secret_sauce
```

### Checkout Information (Valid):
```
First Name: John
Last Name: Doe
Postal Code: 12345
```

### Cart States:
1. Single item checkout (Backpack $29.99)
2. Multiple items checkout (combinations)
3. High-value item checkout (Fleece Jacket $49.99)
4. Low-value item checkout (Onesie $7.99)

### Invalid Inputs (Validation Testing):
- Empty string
- Only whitespace
- Special characters: @, #, $, %, &, *
- Very long strings (500+ characters)
- Numeric values in name fields

---

## **6. Assumptions & Constraints**

### Assumptions:
- Product catalog is stable and doesn't change between test runs
- Application is accessible 24/7
- No regional restrictions or geolocation blocking
- Tax rate is consistent (Sauce Demo uses 8%)
- Users will remain logged in during checkout flow
- Browser caches don't interfere with tests

### Constraints:
- Only one standard user account available
- Payment processing is mocked (not real transaction)
- No actual email sending for order confirmation
- Tests must complete within 5 minutes per test case
- No private/incognito mode testing (potential session issues)

---

## **Test Coverage Summary**

- **Total Test Cases:** 32
- **Smoke Tests:** 6
- **Critical Path Tests:** 12
- **Functional Tests:** 10
- **Edge Case Tests:** 4
- **Cross-Browser Tests:** 3
- **Mobile Responsive Tests:** 1
- **Regression Tests:** 10

**Coverage Breakdown:**
- ✅ Happy path checkout flow (1 test)
- ✅ Form validation - all 3 fields (3 tests)
- ✅ Validation cascading (1 test)
- ✅ Invalid input handling (4 tests)
- ✅ Cancel workflows (2 tests)
- ✅ Price calculations (2 tests)
- ✅ Order information display (3 tests)
- ✅ Navigation and flow (5 tests)
- ✅ Cart management (2 tests)
- ✅ Cross-browser consistency (3 tests)
- ✅ Mobile responsiveness (1 test)
- ✅ Error handling and recovery (2 tests)
- ✅ Additional edge cases (1 test)
