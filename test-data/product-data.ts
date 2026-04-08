/**
 * Product Test Data
 * Contains product information and pricing
 */

export const PRODUCTS = {
  BACKPACK: {
    testId: 'add-to-cart-sauce-labs-backpack',
    name: 'Sauce Labs Backpack',
    price: '$29.99',
    priceCents: 2999,
    description: 'carry.allTheThings() with the sleek, streamlined Sly Pack...',
  },
  BIKE_LIGHT: {
    testId: 'add-to-cart-sauce-labs-bike-light',
    name: 'Sauce Labs Bike Light',
    price: '$9.99',
    priceCents: 999,
    description: 'A red light isn\'t the desired state in testing but it...',
  },
  BOLT_T_SHIRT: {
    testId: 'add-to-cart-sauce-labs-bolt-t-shirt',
    name: 'Sauce Labs Bolt T-Shirt',
    price: '$15.99',
    priceCents: 1599,
    description: 'Get your testing superhero on with the Sauce Labs bolt...',
  },
  FLEECE_JACKET: {
    testId: 'add-to-cart-sauce-labs-fleece-jacket',
    name: 'Sauce Labs Fleece Jacket',
    price: '$49.99',
    priceCents: 4999,
    description: 'It\'s not just a fleece, it\'s a lifestyle. The kind...',
  },
  ONESIE: {
    testId: 'add-to-cart-sauce-labs-onesie',
    name: 'Sauce Labs Onesie',
    price: '$7.99',
    priceCents: 799,
    description: 'Uh. I can\'t describe what I was told to say about this...',
  },
  TEST_ALL_THE_THINGS_SHIRT: {
    testId: 'add-to-cart-test-allthethings-t-shirt',
    name: 'Test.allTheThings() T-Shirt',
    price: '$15.99',
    priceCents: 1599,
    description: 'This classic Sauce Labs t-shirt is perfect to wear when...',
  },
};

export const PRODUCT_SORT_OPTIONS = {
  NAME_AZ: 'az',
  NAME_ZA: 'za',
  PRICE_LOW_HIGH: 'lohi',
  PRICE_HIGH_LOW: 'hilo',
};

/**
 * Get all product names
 */
export const getAllProductNames = (): string[] => {
  return Object.values(PRODUCTS).map(p => p.name);
};

/**
 * Get all product names sorted A-Z
 */
export const getProductsSortedAZ = (): string[] => {
  return getAllProductNames().sort();
};

/**
 * Get all product prices sorted low to high
 */
export const getProductsSortedByPrice = (): typeof PRODUCTS[keyof typeof PRODUCTS][] => {
  return Object.values(PRODUCTS).sort((a, b) => a.priceCents - b.priceCents);
};

/**
 * Get product by name
 */
export const getProductByName = (name: string) => {
  return Object.values(PRODUCTS).find(p => p.name === name);
};

/**
 * Standard single item cart setup
 */
export const SINGLE_ITEM_CART = [PRODUCTS.BACKPACK];

/**
 * Standard multi-item cart setup
 */
export const MULTI_ITEM_CART = [
  PRODUCTS.BACKPACK,
  PRODUCTS.BIKE_LIGHT,
  PRODUCTS.BOLT_T_SHIRT,
];

/**
 * High-value item cart setup
 */
export const HIGH_VALUE_CART = [PRODUCTS.FLEECE_JACKET];

/**
 * Low-value item cart setup
 */
export const LOW_VALUE_CART = [PRODUCTS.ONESIE];

/**
 * Calculate total price for cart
 */
export const calculateCartPrice = (cartItems: typeof PRODUCTS[keyof typeof PRODUCTS][]): number => {
  return cartItems.reduce((total, item) => total + item.priceCents, 0) / 100;
};

/**
 * Calculate tax for cart
 */
export const calculateCartTax = (cartItems: typeof PRODUCTS[keyof typeof PRODUCTS][]): number => {
  const subtotal = calculateCartPrice(cartItems);
  return Math.round(subtotal * 8 * 10) / 1000; // 8% tax with proper rounding
};

/**
 * Calculate total with tax
 */
export const calculateCartTotalWithTax = (cartItems: typeof PRODUCTS[keyof typeof PRODUCTS][]): number => {
  return calculateCartPrice(cartItems) + calculateCartTax(cartItems);
};
