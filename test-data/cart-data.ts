/**
 * Cart Management Test Data
 * Contains cart operations, quantity updates, and cart state test scenarios
 */

export const CART_OPERATIONS = {
  ADD_ITEM: 'add',
  REMOVE_ITEM: 'remove',
  UPDATE_QUANTITY: 'update',
  CLEAR_CART: 'clear',
};

// Cart state scenarios
export const CART_STATES = {
  EMPTY: {
    items: [],
    itemCount: 0,
    subtotal: 0,
    description: 'Cart with no items',
  },
  SINGLE_ITEM: {
    items: [
      { productId: 'sauce-labs-backpack', quantity: 1, price: 29.99 }
    ],
    itemCount: 1,
    subtotal: 29.99,
    description: 'Cart with single item',
  },
  MULTIPLE_ITEMS: {
    items: [
      { productId: 'sauce-labs-backpack', quantity: 1, price: 29.99 },
      { productId: 'sauce-labs-bike-light', quantity: 2, price: 9.99 },
      { productId: 'sauce-labs-bolt-t-shirt', quantity: 1, price: 15.99 },
    ],
    itemCount: 4,
    subtotal: 65.96,
    description: 'Cart with multiple items and quantities',
  },
  MAX_ITEMS: {
    items: [
      { productId: 'sauce-labs-backpack', quantity: 5 },
      { productId: 'sauce-labs-bike-light', quantity: 5 },
      { productId: 'sauce-labs-bolt-t-shirt', quantity: 5 },
      { productId: 'sauce-labs-fleece-jacket', quantity: 5 },
      { productId: 'sauce-labs-onesie', quantity: 5 },
      { productId: 'test.allTheThings()-t-shirt-(red)', quantity: 5 },
    ],
    itemCount: 30,
    subtotal: 644.70,
    description: 'Cart with maximum items',
  },
};

// Quantity update scenarios
export const QUANTITY_SCENARIOS = [
  {
    productId: 'sauce-labs-backpack',
    initialQuantity: 1,
    newQuantity: 5,
    pricePerUnit: 29.99,
    expectedTotal: 149.95,
    description: 'Increase quantity from 1 to 5',
  },
  {
    productId: 'sauce-labs-bike-light',
    initialQuantity: 3,
    newQuantity: 1,
    pricePerUnit: 9.99,
    expectedTotal: 9.99,
    description: 'Decrease quantity from 3 to 1',
  },
  {
    productId: 'sauce-labs-bolt-t-shirt',
    initialQuantity: 2,
    newQuantity: 2,
    pricePerUnit: 15.99,
    expectedTotal: 31.98,
    description: 'Keep quantity same',
  },
  {
    productId: 'sauce-labs-fleece-jacket',
    initialQuantity: 1,
    newQuantity: 10,
    pricePerUnit: 49.99,
    expectedTotal: 499.90,
    description: 'Large quantity increase',
  },
];

// Remove item scenarios
export const REMOVE_SCENARIOS = [
  {
    cartItems: ['BACKPACK', 'BIKE_LIGHT', 'BOLT_SHIRT'],
    removeItem: 'BIKE_LIGHT',
    remainingItems: ['BACKPACK', 'BOLT_SHIRT'],
    remainingTotal: 45.98,
    description: 'Remove middle item from cart',
  },
  {
    cartItems: ['BACKPACK', 'BIKE_LIGHT'],
    removeItem: 'BACKPACK',
    remainingItems: ['BIKE_LIGHT'],
    remainingTotal: 9.99,
    description: 'Remove first item from cart',
  },
  {
    cartItems: ['BACKPACK'],
    removeItem: 'BACKPACK',
    remainingItems: [],
    remainingTotal: 0,
    description: 'Remove last item (empty cart)',
  },
];

// Cart calculation test data
export const CART_CALCULATIONS = [
  {
    items: [{ product: 'BACKPACK', quantity: 1, price: 29.99 }],
    subtotal: 29.99,
    tax: 2.40,
    total: 32.39,
    taxRate: 0.08,
    description: 'Single item calculation',
  },
  {
    items: [
      { product: 'BACKPACK', quantity: 1, price: 29.99 },
      { product: 'BIKE_LIGHT', quantity: 2, price: 9.99 },
    ],
    subtotal: 49.97,
    tax: 3.99,
    total: 53.96,
    taxRate: 0.08,
    description: 'Multiple items calculation',
  },
  {
    items: [
      { product: 'BACKPACK', quantity: 2, price: 29.99 },
      { product: 'FLEECE_JACKET', quantity: 1, price: 49.99 },
      { product: 'ONESIE', quantity: 3, price: 7.99 },
    ],
    subtotal: 135.93,
    tax: 10.87,
    total: 146.80,
    taxRate: 0.08,
    description: 'Complex multi-item calculation',
  },
];

// Cart validation scenarios
export const CART_VALIDATION = [
  {
    scenario: 'cart-empty-message',
    expectedMessage: 'Your Cart is Empty',
    condition: 'when cart has no items',
    description: 'Verify empty cart message displays',
  },
  {
    scenario: 'cart-item-count',
    expectedValue: 'number-of-items',
    condition: 'cart count should match actual items',
    description: 'Verify accurate cart item count',
  },
  {
    scenario: 'cart-subtotal',
    expectedValue: 'sum-of-item-prices',
    condition: 'subtotal should match sum of items',
    description: 'Verify accurate subtotal calculation',
  },
  {
    scenario: 'continue-shopping-button',
    expectedValue: 'visible',
    condition: 'when cart is not empty',
    description: 'Continue shopping button visible',
  },
  {
    scenario: 'checkout-button',
    expectedValue: 'visible',
    condition: 'when cart has items',
    description: 'Checkout button visible',
  },
];

// Empty cart scenarios
export const EMPTY_CART_SCENARIOS = [
  {
    action: 'remove-all-items',
    description: 'Empty cart by removing each item',
    expectedState: 'empty',
  },
  {
    action: 'logout-and-return',
    description: 'Cart should be empty after logout',
    expectedState: 'empty',
  },
  {
    action: 'complete-checkout',
    description: 'Cart cleared after completing order',
    expectedState: 'empty',
  },
];

// Helper functions
export function calculateCartTotal(items: Array<{ price: number; quantity: number }>, taxRate: number = 0.08) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Number((subtotal * taxRate).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));
  return { subtotal: Number(subtotal.toFixed(2)), tax, total };
}

export function getCartItemCount(items: Array<{ quantity: number }>) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function validateCartState(expectedState: string, actualItems: any[]) {
  switch (expectedState) {
    case 'empty':
      return actualItems.length === 0;
    case 'not-empty':
      return actualItems.length > 0;
    default:
      return false;
  }
}
