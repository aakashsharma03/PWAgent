/**
 * Helper Functions for test utilities
 */

/**
 * Parse currency string to number
 * @param currencyString - Price string like "$29.99"
 * @returns Numeric value
 */
export const currencyToNumber = (currencyString: string): number => {
  return parseFloat(currencyString.replace(/[$,]/g, '')) || 0;
};

/**
 * Format number as currency
 * @param value - Numeric value
 * @returns Formatted currency string
 */
export const numberToCurrency = (value: number): string => {
  return `$${value.toFixed(2)}`;
};

/**
 * Calculate total with tax
 * @param subtotal - Subtotal amount
 * @param taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @returns Total including tax
 */
export const calculateTotalWithTax = (subtotal: number, taxRate: number = 0.08): number => {
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  return Math.round((subtotal + tax) * 100) / 100;
};

/**
 * Calculate tax amount
 * @param subtotal - Subtotal amount
 * @param taxRate - Tax rate as decimal
 * @returns Tax amount
 */
export const calculateTaxAmount = (subtotal: number, taxRate: number = 0.08): number => {
  return Math.round(subtotal * taxRate * 100) / 100;
};

/**
 * Sleep for specified milliseconds
 * Note: Avoid using this in tests. Use explicit waits instead.
 * @param ms - Milliseconds to sleep
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Create test data with specific number of items
 * @param template - Template object
 * @param count - Number of copies
 * @returns Array of duplicated objects
 */
export const createTestDataArray = <T>(template: T, count: number): T[] => {
  return Array.from({ length: count }, () => ({ ...template }));
};

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns True if valid email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate postal code format (basic)
 * @param postalCode - Postal code string
 * @returns True if matches basic format (5 digits)
 */
export const isValidPostalCode = (postalCode: string): boolean => {
  const postalCodeRegex = /^\d{5}$/;
  return postalCodeRegex.test(postalCode);
};

/**
 * Generate random string of given length
 * @param length - String length
 * @returns Random string
 */
export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Check if price string is valid format
 * @param price - Price string like "$29.99"
 * @returns True if valid format
 */
export const isValidPriceFormat = (price: string): boolean => {
  const priceRegex = /^\$\d+\.\d{2}$/;
  return priceRegex.test(price);
};

/**
 * Extract numeric value from price string
 * @param price - Price string like "$29.99"
 * @returns Numeric value
 */
export const extractPriceValue = (price: string): number => {
  const match = price.match(/\$?([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
};

/**
 * Compare prices with tolerance for floating point
 * @param actual - Actual price
 * @param expected - Expected price
 * @param tolerance - Tolerance amount (default 0.01)
 * @returns True if prices are within tolerance
 */
export const comparePrices = (
  actual: number,
  expected: number,
  tolerance: number = 0.01
): boolean => {
  return Math.abs(actual - expected) < tolerance;
};

/**
 * Format array of items as readable list
 * @param items - Array of strings
 * @returns Formatted string
 */
export const formatItemList = (items: string[]): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
};

/**
 * Retry function with exponential backoff
 * @param fn - Function to retry
 * @param maxAttempts - Maximum number of attempts
 * @param delayMs - Initial delay in milliseconds
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 100
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts - 1) {
        await sleep(delayMs * Math.pow(2, attempt));
      }
    }
  }

  throw lastError || new Error('Max retry attempts reached');
}

/**
 * Get current timestamp for logging
 * @returns Formatted timestamp
 */
export const getTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Create a delay timer for test steps
 * @param stepName - Name of the step
 * @returns Object with timer methods
 */
export const createStepTimer = (stepName: string) => {
  const startTime = Date.now();
  return {
    stop: () => {
      const duration = Date.now() - startTime;
      console.log(`[${stepName}] completed in ${duration}ms`);
      return duration;
    },
  };
};
