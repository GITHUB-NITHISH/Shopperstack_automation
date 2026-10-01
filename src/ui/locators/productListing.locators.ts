import { LocatorDef } from './_helpers';

/**
 * Category listings: /men /women /kids /electronics /beauty_products
 * Each product card contains: img[alt=<name>], rating value, brand, name,
 * ₹discounted price, ₹original price, X% off, [add to cart] button.
 */
export const ProductListingLocators: Record<string, LocatorDef[]> = {
  productCard:            [{ engine: 'css', value: 'main div:has(> img):has(button:has-text("add to cart"))' }],
  productImage:           [{ engine: 'css', value: 'img[alt]' }],
  productBrand:           [{ engine: 'css', value: 'div > div:nth-child(1)' }],
  productName:            [{ engine: 'css', value: 'div > div:nth-child(2)' }],
  productDiscountedPrice: [{ engine: 'css', value: 'p > span:nth-child(1)' }],
  productOriginalPrice:   [{ engine: 'css', value: 'p > span:nth-child(2)' }],
  productDiscountPct:     [{ engine: 'css', value: 'p > span:nth-child(3)' }],

  addToCartButton:        [{ engine: 'role', value: 'button', roleOptions: { name: 'add to cart' } }],

  paginationNav:          [{ engine: 'role', value: 'navigation', roleOptions: { name: 'pagination navigation' } }],
  paginationNext:         [{ engine: 'role', value: 'button', roleOptions: { name: 'Go to next page' } }],
  paginationPrev:         [{ engine: 'role', value: 'button', roleOptions: { name: 'Go to previous page' } }],
  paginationFirst:        [{ engine: 'role', value: 'button', roleOptions: { name: 'Go to first page' } }],
  paginationLast:         [{ engine: 'role', value: 'button', roleOptions: { name: 'Go to last page' } }],
  paginationPage:         [{ engine: 'role', value: 'button', roleOptions: { name: 'Go to page {{page}}' } }],

  // Legacy (kept for POM compatibility)
  filterCategory:         [{ engine: 'css', value: '.filter-category input[type="checkbox"]' }],
  filterBrand:            [{ engine: 'css', value: '.filter-brand input[type="checkbox"]' }],
  filterPriceMin:         [{ engine: 'css', value: 'input[name="minPrice"]' }],
  filterPriceMax:         [{ engine: 'css', value: 'input[name="maxPrice"]' }],
  sortDropdown:           [{ engine: 'css', value: 'select[name="sort"], .sort-dropdown' }],
  addToWishlistButton:    [{ engine: 'css', value: 'button[aria-label*="wishlist" i]' }],
  resultsCount:           [{ engine: 'css', value: '.results-count' }],
  noResults:              [{ engine: 'text', value: 'No products found' }],
};
