/**
 * Checkout Test Data
 * Contains test data for validation, edge cases, and negative scenarios
 */

export const VALID_CHECKOUT = {
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '12345',
};

export const CHECKOUT_DATA_VARIANTS = [
  {
    firstName: 'Jane',
    lastName: 'Smith',
    postalCode: '54321',
  },
  {
    firstName: 'Alice',
    lastName: 'Johnson',
    postalCode: '67890',
  },
  {
    firstName: 'Bob',
    lastName: 'Williams',
    postalCode: '11111',
  },
];

export const INVALID_INPUTS = [
  {
    field: 'firstName',
    value: '',
    expectedError: 'Error: First Name is required',
  },
  {
    field: 'lastName',
    value: '',
    expectedError: 'Error: Last Name is required',
  },
  {
    field: 'postalCode',
    value: '',
    expectedError: 'Error: Postal Code is required',
  },
];

export const EDGE_CASE_INPUTS = {
  specialChars: {
    firstName: 'John@#$%',
    lastName: 'Doe&*()',
    postalCode: '12345',
  },
  whitespaceOnly: {
    firstName: '     ',
    lastName: '     ',
    postalCode: '     ',
  },
  veryLongInput: {
    firstName: 'A'.repeat(100),
    lastName: 'B'.repeat(100),
    postalCode: '1'.repeat(20),
  },
  numericNames: {
    firstName: '12345',
    lastName: '67890',
    postalCode: '12345',
  },
  mixedContent: {
    firstName: 'John123',
    lastName: 'Doe456',
    postalCode: 'ABC123',
  },
};

export const TAX_RATE = 0.08; // 8% tax

/**
 * Calculate expected total including tax
 * @param itemTotal - Total before tax
 * @returns Formatted total including tax
 */
export const calculateTotal = (itemTotal: number): string => {
  const tax = Math.round(itemTotal * TAX_RATE * 100) / 100;
  const total = itemTotal + tax;
  return total.toFixed(2);
};

/**
 * Calculate tax amount
 * @param itemTotal - Total before tax
 * @returns Formatted tax amount
 */
export const calculateTax = (itemTotal: number): string => {
  const tax = Math.round(itemTotal * TAX_RATE * 100) / 100;
  return tax.toFixed(2);
};

/**
 * Parse price string and return numeric value
 * @param priceString - Price string like "$29.99"
 * @returns Numeric value
 */
export const parsePriceString = (priceString: string): number => {
  return parseFloat(priceString.replace('$', '')) || 0;
};

/**
 * Calculate total price from multiple items
 * @param prices - Array of price strings
 * @returns Formatted total with tax
 */
export const calculateCartTotal = (prices: string[]): string => {
  const itemTotal = prices.reduce(
    (sum, price) => sum + parsePriceString(price),
    0
  );
  return calculateTotal(itemTotal);
};
