/**
 * Inventory and Shopping Page Test Data
 * Contains product filtering, sorting, and browsing test scenarios
 */

export const PRODUCTS = {
  BACKPACK: {
    id: 'sauce-labs-backpack',
    name: 'Sauce Labs Backpack',
    price: 29.99,
    description: 'carry.allTheThings() with the sleek, streamlined Sly Pack',
  },
  BIKE_LIGHT: {
    id: 'sauce-labs-bike-light',
    name: 'Sauce Labs Bike Light',
    price: 9.99,
    description: 'A red light isn\'t the desired effect when biking',
  },
  BOLT_SHIRT: {
    id: 'sauce-labs-bolt-t-shirt',
    name: 'Sauce Labs Bolt T-Shirt',
    price: 15.99,
    description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt',
  },
  FLEECE_JACKET: {
    id: 'sauce-labs-fleece-jacket',
    name: 'Sauce Labs Fleece Jacket',
    price: 49.99,
    description: 'It\'s not a werewolf._',
  },
  ONESIE: {
    id: 'sauce-labs-onesie',
    name: 'Sauce Labs Onesie',
    price: 7.99,
    description: 'Uh. I can feel the wedgie from here',
  },
  RED_SHIRT: {
    id: 'test.allTheThings()-t-shirt-(red)',
    name: 'Test.allTheSauces() T-Shirt (Red)',
    price: 15.99,
    description: 'This classic Sauce Labs t-shirt is perfect to wear when chugging Sirens',
  },
};

export const PRODUCT_LIST = [
  PRODUCTS.BACKPACK,
  PRODUCTS.BIKE_LIGHT,
  PRODUCTS.BOLT_SHIRT,
  PRODUCTS.FLEECE_JACKET,
  PRODUCTS.ONESIE,
  PRODUCTS.RED_SHIRT,
];

// Sorting options
export const SORT_OPTIONS = {
  NAME_AZ: 'Name (A to Z)',
  NAME_ZA: 'Name (Z to A)',
  PRICE_LOW: 'Price (low to high)',
  PRICE_HIGH: 'Price (high to low)',
};

// Filter scenarios
export const FILTER_SCENARIOS = {
  ALL_PRODUCTS: {
    filter: null,
    expectedCount: 6,
    description: 'Display all 6 products without filters',
  },
  PRICE_UNDER_20: {
    filter: { maxPrice: 20 },
    products: ['BIKE_LIGHT', 'BOLT_SHIRT', 'ONESIE', 'RED_SHIRT'],
    expectedCount: 4,
    description: 'Filter products under $20',
  },
  PRICE_OVER_25: {
    filter: { minPrice: 25 },
    products: ['BACKPACK', 'FLEECE_JACKET'],
    expectedCount: 2,
    description: 'Filter products over $25',
  },
};

// Sorting test scenarios
export const SORT_SCENARIOS = [
  {
    option: SORT_OPTIONS.NAME_AZ,
    expected: [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheSauces() T-Shirt (Red)',
    ],
    description: 'Sort products A to Z by name',
  },
  {
    option: SORT_OPTIONS.PRICE_LOW,
    expected: [7.99, 9.99, 15.99, 15.99, 29.99, 49.99],
    description: 'Sort products by price low to high',
  },
  {
    option: SORT_OPTIONS.PRICE_HIGH,
    expected: [49.99, 29.99, 15.99, 15.99, 9.99, 7.99],
    description: 'Sort products by price high to low',
  },
];

// Browsing scenarios
export const BROWSING_SCENARIOS = {
  SINGLE_PRODUCT: {
    products: ['BACKPACK'],
    totalPrice: 29.99,
    description: 'Browse single product',
  },
  MULTIPLE_PRODUCTS: {
    products: ['BACKPACK', 'BIKE_LIGHT', 'BOLT_SHIRT'],
    totalPrice: 55.97,
    description: 'Browse multiple products',
  },
  ALL_PRODUCTS: {
    products: ['BACKPACK', 'BIKE_LIGHT', 'BOLT_SHIRT', 'FLEECE_JACKET', 'ONESIE', 'RED_SHIRT'],
    totalPrice: 128.94,
    description: 'Browse all products',
  },
};

// Product detail page test data
export const PRODUCT_DETAIL_DATA = [
  {
    productId: 'sauce-labs-backpack',
    name: 'Sauce Labs Backpack',
    price: 29.99,
    expectedElements: ['product-image', 'product-title', 'product-price', 'product-description', 'add-to-cart-button'],
    description: 'Verify all product detail page elements',
  },
  {
    productId: 'sauce-labs-bike-light',
    name: 'Sauce Labs Bike Light',
    price: 9.99,
    expectedElements: ['product-image', 'product-title', 'product-price', 'product-description', 'add-to-cart-button'],
    description: 'Verify product detail for bike light',
  },
];

// Add to cart scenarios from inventory
export const ADD_TO_CART_SCENARIOS = [
  {
    products: ['BACKPACK'],
    expectedCartCount: 1,
    expectedTotal: 29.99,
    description: 'Add single item to cart',
  },
  {
    products: ['BACKPACK', 'BIKE_LIGHT'],
    expectedCartCount: 2,
    expectedTotal: 39.98,
    description: 'Add multiple items to cart',
  },
  {
    products: ['BACKPACK', 'BACKPACK', 'BIKE_LIGHT'],
    expectedCartCount: 3,
    expectedTotal: 69.97,
    description: 'Add same item multiple times',
  },
];

// Helper functions
export function getProductByKey(key: string) {
  return PRODUCTS[key as keyof typeof PRODUCTS];
}

export function getProductPrice(key: string): number {
  return PRODUCTS[key as keyof typeof PRODUCTS]?.price || 0;
}

export function calculateTotalPrice(keys: string[]): number {
  return keys.reduce((total, key) => total + getProductPrice(key), 0);
}

export function getPriceRange(): { min: number; max: number } {
  const prices = Object.values(PRODUCTS).map(p => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}
