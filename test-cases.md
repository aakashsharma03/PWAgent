# E-commerce Checkout Process - Test Cases
**User Story:** SCRUM-101 - E-commerce Checkout Process  
**Total Cases:** 32  
**Tagging:** @smoke, @critical, @functional, @regression, @edge-case, @validation, @calculation, @cross-browser, @mobile, @navigation, @user-experience, @business-logic

---

## **SMOKE & CRITICAL PATH TESTS**

### **TC-001: Successful Complete Checkout Flow @smoke @critical @functional**

**Setup:** Logged-in user, one item in cart

**Steps:**
1. Navigate to `/cart.html`
2. Verify item is displayed with price $29.99
3. Click "Checkout" button
4. Enter First Name: "John"
5. Enter Last Name: "Doe"
6. Enter Postal Code: "12345"
7. Click "Continue" button
8. On checkout overview page, verify:
   - Item displayed with $29.99 price
   - "Item total: $29.99" shown
   - "Tax: $2.40" shown
   - "Total: $32.39" shown
   - "SauceCard #31337" payment info displayed
   - "Free Pony Express Delivery!" shipping info displayed
9. Click "Finish" button
10. Verify heading "Thank you for your order!" displayed
11. Verify message "Your order has been dispatched..." displayed
12. Click "Back Home" button
13. Verify returned to inventory page with empty cart

**Expected Results:**
- ✓ Checkout form accepted valid input
- ✓ Order overview displayed correct totals and calculations
- ✓ Order confirmation page shown with success message
- ✓ Cart cleared after successful completion
- ✓ Navigation returned to inventory with badge count reset

**Tags:** @smoke, @critical, @functional, @regression

---

## **VALIDATION TESTS (FIELD-LEVEL)**

### **TC-002: First Name Field Validation - Empty Input @critical @validation**

**Setup:** Logged-in user, items in cart, on checkout information page

**Steps:**
1. Navigate to checkout information page
2. Leave "First Name" field empty
3. Leave other fields empty
4. Click "Continue" button
5. Wait for error message to appear
6. Verify error heading displays "Error: First Name is required"
7. Verify input fields have error indicators (red X icon visible)

**Expected Results:**
- ✓ Error message appears after Continue click
- ✓ Exact error text is "Error: First Name is required"
- ✓ User remains on checkout information page
- ✓ Fields retain focus for correction

**Tags:** @critical, @functional, @validation

---

### **TC-003: Last Name Field Validation - Empty Input @critical @validation**

**Setup:** Logged-in user with items in cart

**Steps:**
1. Navigate to checkout information page
2. Enter First Name: "John"
3. Leave "Last Name" field empty
4. Leave Postal Code field empty
5. Click "Continue" button
6. Verify error heading displays "Error: Last Name is required"
7. Verify First Name field retains value "John"

**Expected Results:**
- ✓ Validation skips First Name (already valid)
- ✓ Error shows for Last Name field
- ✓ Form state is preserved
- ✓ User can correct and resubmit

**Tags:** @critical, @functional, @validation

---

### **TC-004: Postal Code Field Validation - Empty Input @critical @validation**

**Setup:** Logged-in user with items in cart

**Steps:**
1. Navigate to checkout information page
2. Enter First Name: "John"
3. Enter Last Name: "Doe"
4. Leave "Postal Code" field empty
5. Click "Continue" button
6. Verify error heading displays "Error: Postal Code is required"
7. Verify First Name = "John" and Last Name = "Doe" still filled

**Expected Results:**
- ✓ Only Postal Code error shown (earlier fields valid)
- ✓ Previously entered data preserved
- ✓ User can complete form and resubmit

**Tags:** @critical, @functional, @validation

---

### **TC-005: All Fields Missing - Validation Cascading @functional @validation**

**Setup:** Logged-in user with items in cart

**Steps:**
1. On checkout information page
2. Leave all three fields empty
3. Click "Continue" button
4. Verify error "Error: First Name is required" displayed
5. Fill First Name: "John"
6. Click "Continue" button
7. Verify error "Error: Last Name is required" displayed
8. Fill Last Name: "Doe"
9. Click "Continue" button
10. Verify error "Error: Postal Code is required" displayed
11. Fill Postal Code: "12345"
12. Click "Continue" button
13. Verify navigated to checkout overview page

**Expected Results:**
- ✓ Validation happens one field at a time
- ✓ Correct error messages for each field
- ✓ Form accepts valid input after corrections
- ✓ Navigation proceeds after all validations pass

**Tags:** @functional, @validation, @regression

---

## **EDGE CASE - INPUT VALIDATION TESTS**

### **TC-006: Special Characters in Name Fields @functional @edge-case**

**Setup:** Logged-in user with items in cart

**Steps:**
1. Navigate to checkout information page
2. Enter First Name: "John@#$%"
3. Enter Last Name: "Doe&*()"
4. Enter Postal Code: "12345"
5. Click "Continue" button

**Expected Results:**
- ✓ Form accepts special characters in name fields
- ✓ No validation error for special characters
- ✓ Proceeds to Order Overview page
- ✓ Values displayed as entered in Review

**Tags:** @functional, @edge-case

---

### **TC-007: Whitespace-Only Input Fields @functional @edge-case**

**Setup:** Logged-in user with items in cart

**Steps:**
1. Navigate to checkout information page
2. Enter First Name: "    " (5 spaces)
3. Enter Last Name: "    " (5 spaces)
4. Enter Postal Code: "    " (5 spaces)
5. Click "Continue" button

**Expected Results:**
- ✓ Form accepts whitespace as valid input
- ✓ No "required" validation error triggered
- ✓ Navigates to Order Overview page

**Tags:** @functional, @edge-case, @boundary

---

### **TC-008: Very Long Input Values @functional @edge-case**

**Setup:** Logged-in user with items in cart

**Steps:**
1. Navigate to checkout information page
2. Enter First Name: "JohnJohnJohnJohnJohnjohnJohnJohnJohnJohn" (>50 chars)
3. Enter Last Name: "DoeDoeDoeDoeDoeDoeDoeDoeDoeDoeDoeDoe" (>50 chars)
4. Enter Postal Code: "123451234512345" (15 digits)
5. Click "Continue" button
6. Verify navigates to Order Overview
7. Verify input values displayed in overview

**Expected Results:**
- ✓ Form accepts long input (no max-length enforcement)
- ✓ Navigation proceeds without error
- ✓ Content displayed correctly (may wrap/truncate)

**Tags:** @functional, @boundary, @edge-case

---

### **TC-009: Numeric Values in Name Fields @functional @edge-case**

**Setup:** Logged-in user with items in cart

**Steps:**
1. Navigate to checkout information page
2. Enter First Name: "12345"
3. Enter Last Name: "67890"
4. Enter Postal Code: "12345"
5. Click "Continue" button

**Expected Results:**
- ✓ Form accepts numeric values in name fields
- ✓ Proceeds to Order Overview without error
- ✓ Numeric values displayed as entered

**Tags:** @functional, @edge-case

---

## **NAVIGATION & FLOW TESTS**

### **TC-010: Cancel Button from Checkout Information Page @critical @navigation**

**Setup:** Logged-in user with items in cart

**Steps:**
1. Navigate to checkout information page
2. Enter First Name: "John"
3. Enter Last Name: "Doe"
4. Enter Postal Code: "12345"
5. Click "Cancel" button (do NOT click Continue)
6. Verify navigated back to `/cart.html`
7. Verify item still in cart
8. Verify cart count badge still shows "1"
9. Verify item details (name, price) unchanged

**Expected Results:**
- ✓ Cancel button returns to cart page
- ✓ Cart state preserved (items not removed)
- ✓ Checkout form data discarded
- ✓ User can proceed with other shopping or retry checkout

**Tags:** @critical, @functional, @navigation

---

### **TC-011: Cancel Button from Checkout Overview Page @critical @navigation**

**Setup:** Logged-in user, items in cart, on checkout overview page

**Steps:**
1. Add item to cart
2. Proceed to checkout information entry
3. Fill all fields: First Name: "John", Last Name: "Doe", Postal Code: "12345"
4. Click "Continue" to reach Order Overview
5. Click "Cancel" button
6. Verify navigated back to `/cart.html`
7. Verify item still in cart
8. Verify order NOT created

**Expected Results:**
- ✓ Cancel from overview returns to cart
- ✓ Cart items preserved
- ✓ No order created
- ✓ Can retry checkout or continue shopping

**Tags:** @critical, @functional, @navigation

---

### **TC-012: Continue Shopping Button from Cart @functional @navigation**

**Setup:** Logged-in user on cart page with items

**Steps:**
1. Navigate to cart page with items
2. Click "Continue Shopping" button
3. Verify navigated to inventory page
4. Verify cart items are still in cart (count badge unchanged)
5. Add another item to cart
6. Verify new item added to existing items (not replaced)

**Expected Results:**
- ✓ Button returns to product inventory
- ✓ Cart state preserved
- ✓ Can continue shopping and add more items

**Tags:** @functional, @navigation

---

### **TC-013: Back Button Behavior During Checkout @functional @navigation**

**Setup:** Logged-in user during checkout flow

**Steps:**
1. On checkout information page
2. Click browser back button
3. Verify returned to cart page
4. Verify cart items still present
5. Click Checkout again
6. Verify form fields are empty (no session persistence)

**Expected Results:**
- ✓ Back button returns to previous page (cart)
- ✓ Cart state preserved
- ✓ Form doesn't retain data for security
- ✓ Checkout can be restarted cleanly

**Tags:** @functional, @navigation

---

### **TC-014: Refresh Page During Checkout @functional @edge-case**

**Setup:** Logged-in user on checkout information page

**Steps:**
1. On checkout information page
2. Enter First Name: "John"
3. Refresh the page (F5 or Cmd+R)
4. Verify form is cleared (security feature)
5. Verify user still logged in
6. Verify can fill form again and proceed

**Expected Results:**
- ✓ Page refresh clears form data
- ✓ Session maintained
- ✓ No error or redirect
- ✓ User can restart checkout

**Tags:** @functional, @edge-case

---

### **TC-015: Finish Button from Checkout Overview @critical @navigation**

**Setup:** Logged-in user on checkout overview page with complete order

**Steps:**
1. Proceed to Order Overview with valid checkout information
2. Verify all order details correct
3. Click "Finish" button
4. Wait for page load (checkout-complete.html)
5. Verify heading "Checkout: Complete!" displayed
6. Verify main heading "Thank you for your order!" visible
7. Verify confirmation message shown

**Expected Results:**
- ✓ Finish button submits order
- ✓ Navigated to checkout confirmation page
- ✓ Success message displayed
- ✓ No error messages shown

**Tags:** @critical, @functional, @success-path

---

### **TC-016: Order Confirmation Page Message @critical @user-experience**

**Setup:** Successful order completion reached

**Steps:**
1. Complete checkout successfully
2. Verify on `/checkout-complete.html`
3. Read confirmation heading: "Thank you for your order!"
4. Read confirmation message: includes "...has been dispatched, and will arrive..."

**Expected Results:**
- ✓ Heading text exactly: "Thank you for your order!"
- ✓ Message text includes order dispatch and delivery
- ✓ Customer-friendly, professional tone
- ✓ Pony Express image displayed

**Tags:** @critical, @functional, @user-experience

---

### **TC-017: Back Home Button from Confirmation Page @critical @navigation**

**Setup:** On order confirmation page after successful checkout

**Steps:**
1. Complete checkout and reach confirmation page
2. Verify "Back Home" button is visible
3. Click "Back Home" button
4. Verify navigated to `/inventory.html`
5. Verify products on inventory page displayed
6. Verify cart count badge = "0" or not displayed (cleared)
7. Verify can add new items to cart

**Expected Results:**
- ✓ Button returns to inventory/products page
- ✓ Cart is empty after successful order
- ✓ User can continue shopping
- ✓ Session still logged in

**Tags:** @critical, @functional, @navigation

---

## **BUSINESS LOGIC TESTS**

### **TC-018: Cart Cleared After Successful Checkout @critical @business-logic**

**Setup:** Just completed successful order checkout

**Steps:**
1. After order confirmation
2. Click "Back Home" to return to inventory
3. Verify cart count badge NOT displayed (0 items)
4. Click on cart icon/link
5. Verify `/cart.html` shows empty cart message or no items
6. Add new item to cart
7. Verify add to cart works properly (count badge shows "1")

**Expected Results:**
- ✓ Cart completely cleared after order
- ✓ No items remain from previous order
- ✓ Cart is functional for new shopping
- ✓ System properly resets state

**Tags:** @critical, @functional, @business-logic, @regression

---

### **TC-019: Remove Item from Cart @functional @regression**

**Setup:** Logged-in user with multiple items in cart

**Steps:**
1. Add Backpack ($29.99) and Bike Light ($9.99) to cart
2. Verify cart count = 2
3. Navigate to cart page
4. Verify both items displayed
5. Click "Remove" button for Bike Light
6. Verify Bike Light removed from cart display
7. Verify only Backpack ($29.99) remains
8. Verify cart count badge updated to "1"

**Expected Results:**
- ✓ Remove button works correctly
- ✓ Item removed from cart display
- ✓ Cart total updated (only Backpack price shows)
- ✓ Cart count badge decremented
- ✓ Other items unaffected

**Tags:** @functional, @regression

---

## **PRICE CALCULATION TESTS**

### **TC-020: Price Calculation - Single Item @critical @calculation**

**Setup:** Logged-in user with one Backpack ($29.99) in cart

**Steps:**
1. Add Sauce Labs Backpack to cart
2. Proceed through checkout information
3. Reach Order Overview page
4. Verify item total: $29.99
5. Verify tax calculation: $29.99 × 0.08 = $2.392 ≈ $2.40
6. Verify total: $29.99 + $2.40 = $32.39
7. Verify all amounts displayed with currency format ($XX.XX)

**Expected Results:**
- ✓ Item total matches product price
- ✓ Tax calculated correctly (8% of item total)
- ✓ Total = Item Total + Tax (rounding handled)
- ✓ All amounts formatted with 2 decimal places

**Tags:** @critical, @functional, @calculation, @regression

---

### **TC-021: Price Calculation - Multiple Items @critical @calculation**

**Setup:** Logged-in user with multiple items in cart

**Steps:**
1. Add Backpack ($29.99) to cart
2. Add Bike Light ($9.99) to cart
3. Add Bolt T-Shirt ($15.99) to cart
4. Navigate to cart: Verify subtotal = $55.97
5. Proceed to Order Overview
6. Verify Item total: $55.97
7. Verify tax: $55.97 × 0.08 = $4.4776 ≈ $4.48
8. Verify Total: $55.97 + $4.48 = $60.45

**Expected Results:**
- ✓ Item total = sum of all product prices
- ✓ Tax calculated on item total
- ✓ Rounding handled correctly
- ✓ Final total is sum of item total + tax

**Tags:** @critical, @functional, @calculation, @regression

---

## **INFORMATION DISPLAY TESTS**

### **TC-022: Payment Information Display @functional @regression**

**Setup:** Logged-in user on checkout overview page

**Steps:**
1. Proceed to Order Overview
2. Verify "Payment Information:" label displayed
3. Verify payment method shows "SauceCard #31337"
4. Verify payment info is static/mocked (same for all users)

**Expected Results:**
- ✓ Payment information section visible
- ✓ SauceCard details displayed (Sauce Demo mocked payment)
- ✓ Format consistent across test runs

**Tags:** @functional, @regression

---

### **TC-023: Shipping Information Display @functional @regression**

**Setup:** Logged-in user on checkout overview page

**Steps:**
1. Proceed to Order Overview
2. Verify "Shipping Information:" label displayed
3. Verify shipping method shows "Free Pony Express Delivery!"
4. Verify message is same for all orders

**Expected Results:**
- ✓ Shipping information section visible
- ✓ Delivery method clearly stated
- ✓ Consistent messaging across test runs

**Tags:** @functional, @regression

---

### **TC-024: Order Summary Display Accuracy @functional @regression**

**Setup:** Logged-in user with items in cart

**Steps:**
1. Add Onesie ($7.99) and T-Shirt ($15.99) to cart
2. Proceed through checkout information
3. On Order Overview page, verify cart items displayed:
   - Item name visible
   - Item description visible
   - Item price ($XX.XX) displayed
   - Quantity shown
4. Verify no items are missing from display
5. Verify no extra items appear

**Expected Results:**
- ✓ All cart items shown in overview
- ✓ Item details complete and accurate
- ✓ No data loss in checkout flow
- ✓ Prices match original display

**Tags:** @functional, @regression

---

## **ERROR HANDLING & RECOVERY TESTS**

### **TC-025: Form Error Dismissal @functional @user-experience**

**Setup:** Logged-in user on checkout information page

**Steps:**
1. Click "Continue" without filling any fields
2. Verify error message displayed
3. Click error message close button (X icon)
4. Verify error message disappears
5. Verify form fields still empty
6. Verify user can enter data and resubmit

**Expected Results:**
- ✓ Error message has dismiss button
- ✓ Close button removes error notification
- ✓ Form accessible after dismissal
- ✓ User can correct and submit

**Tags:** @functional, @user-experience

---

### **TC-026: Multiple Checkout Attempts (Corrections Flow) @functional @user-experience**

**Setup:** Logged-in user on checkout information page

**Steps:**
1. Enter only First Name: "John"
2. Click Continue → Error: "Last Name required"
3. Click error close button
4. Enter Last Name: "Doe"
5. Click Continue → Error: "Postal Code required"
6. Click error close button
7. Enter Postal Code: "12345"
8. Click Continue
9. Verify proceeds to Order Overview successfully

**Expected Results:**
- ✓ User can correct one field at a time
- ✓ Previous entries retained
- ✓ Eventually form accepted with all valid data
- ✓ No frustration points in correction flow

**Tags:** @functional, @user-experience

---

## **CROSS-BROWSER TESTS**

### **TC-027: Checkout on Desktop Browser (Chrome) @regression @chrome @desktop**

**Setup:** Desktop Chrome browser

**Steps:**
1. Log in with standard_user / secret_sauce
2. Add item to cart
3. Proceed through full checkout flow
4. Complete order successfully
5. Verify all elements properly rendered
6. Verify no layout breaks or missing elements

**Expected Results:**
- ✓ Complete flow works on Chrome
- ✓ All buttons, forms, text visible and functional
- ✓ No console errors

**Tags:** @regression, @chrome, @desktop

---

### **TC-028: Checkout on Firefox Browser @regression @firefox @cross-browser**

**Setup:** Firefox browser (latest)

**Steps:**
1. Log in and complete full checkout flow
2. Verify consistent experience across browsers

**Expected Results:**
- ✓ Complete flow works identically on Firefox
- ✓ Form validation consistent
- ✓ Pricing calculations identical
- ✓ Button states and navigation equivalent

**Tags:** @regression, @firefox, @cross-browser

---

### **TC-029: Checkout on Safari Browser @regression @safari @cross-browser**

**Setup:** Safari browser (macOS)

**Steps:**
1. Log in and complete full checkout flow
2. Specific attention to: form input behavior, date pickers
3. Verify consistent pricing display

**Expected Results:**
- ✓ Complete flow works on Safari
- ✓ No Safari-specific rendering issues
- ✓ Form fields work as expected
- ✓ Consistent with Chrome/Firefox

**Tags:** @regression, @safari, @cross-browser

---

## **MOBILE RESPONSIVENESS TEST**

### **TC-030: Mobile Responsiveness - Checkout Form @functional @mobile**

**Setup:** Mobile device or 375px viewport, logged-in user in checkout flow

**Steps:**
1. Set viewport to 375px width
2. Navigate to checkout information page
3. Verify all form fields visible and usable
4. Verify labels clearly associated with inputs
5. Verify buttons are easily clickable (min 44×44px)
6. Verify error messages display without overflow
7. Verify can enter data and submit successfully

**Expected Results:**
- ✓ Form responsive at mobile width
- ✓ No text overflow or cut-off content
- ✓ Touch-friendly button sizes
- ✓ Full functionality on mobile viewports

**Tags:** @functional, @mobile, @responsive

---

## **ADDITIONAL TESTS**

### **TC-031: Product Sorting by Name A-to-Z @functional @regression**

**Setup:** Logged-in user on inventory page

**Steps:**
1. Navigate to inventory page
2. Verify dropdown sorted "Name (A to Z)" selected by default
3. Verify products listed alphabetically

**Expected Results:**
- ✓ Default sort is A-to-Z
- ✓ Products in correct alphabetical order
- ✓ All products displayed

**Tags:** @functional, @regression

---

### **TC-032: Product Sorting by Price Low to High @functional @regression**

**Setup:** Logged-in user on inventory page

**Steps:**
1. Navigate to inventory page
2. Click sort dropdown
3. Select "Price (low to high)"
4. Verify products sorted by price ascending

**Expected Results:**
- ✓ Products sorted correctly by price (ascending)
- ✓ All products displayed in order
- ✓ Prices accurate

**Tags:** @functional, @regression

---

## **TEST EXECUTION MATRIX**

| Test ID | Name | Type | Priority | Browser | Tags |
|---------|------|------|----------|---------|------|
| TC-001 | Successful Complete Checkout | Smoke | Critical | All | @smoke,@critical |
| TC-002 | First Name Validation | Validation | Critical | Chrome | @validation,@critical |
| TC-003 | Last Name Validation | Validation | Critical | Chrome | @validation,@critical |
| TC-004 | Postal Code Validation | Validation | Critical | Chrome | @validation,@critical |
| TC-005 | Validation Cascading | Validation | High | Chrome | @validation |
| TC-006 | Special Characters Input | Edge Case | Medium | Chrome | @edge-case |
| TC-007 | Whitespace Input | Edge Case | Low | Chrome | @edge-case |
| TC-008 | Very Long Values | Edge Case | Low | Chrome | @edge-case |
| TC-009 | Numeric in Names | Edge Case | Low | Chrome | @edge-case |
| TC-010 | Cancel from Info Page | Navigation | Critical | Chrome | @navigation,@critical |
| TC-011 | Cancel from Overview Page | Navigation | Critical | Chrome | @navigation,@critical |
| TC-012 | Continue Shopping | Navigation | High | Chrome | @navigation |
| TC-013 | Back Button Behavior | Navigation | High | Chrome | @navigation |
| TC-014 | Page Refresh During Checkout | Edge Case | Medium | Chrome | @edge-case |
| TC-015 | Finish Button | Navigation | Critical | Chrome | @navigation,@critical |
| TC-016 | Order Confirmation Message | Functional | Critical | Chrome | @functional,@critical |
| TC-017 | Back Home Button | Navigation | Critical | Chrome | @navigation,@critical |
| TC-018 | Cart Cleared | Business Logic | Critical | Chrome | @business-logic,@critical |
| TC-019 | Remove from Cart | Functional | Medium | Chrome | @functional |
| TC-020 | Price Calc - Single Item | Calculation | Critical | Chrome | @calculation,@critical |
| TC-021 | Price Calc - Multiple Items | Calculation | Critical | Chrome | @calculation,@critical |
| TC-022 | Payment Info Display | Functional | Medium | Chrome | @functional |
| TC-023 | Shipping Info Display | Functional | Medium | Chrome | @functional |
| TC-024 | Order Summary Display | Functional | High | Chrome | @functional |
| TC-025 | Error Dismissal | Error Handling | Medium | Chrome | @functional |
| TC-026 | Checkout Corrections | Error Handling | Medium | Chrome | @functional |
| TC-027 | Chrome Browser | Regression | High | Chrome | @regression,@chrome |
| TC-028 | Firefox Browser | Regression | High | Firefox | @regression,@firefox |
| TC-029 | Safari Browser | Regression | High | Safari | @regression,@safari |
| TC-030 | Mobile Responsive | Functional | High | Mobile | @mobile,@responsive |
| TC-031 | Product Sort A-Z | Regression | Low | Chrome | @regression |
| TC-032 | Product Sort by Price | Regression | Low | Chrome | @regression |
