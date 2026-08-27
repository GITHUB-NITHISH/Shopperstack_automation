import { LocatorDef } from './_helpers';

export const ProductListingLocators: Record<string, LocatorDef[]> = {
  productCard:       [{ engine: 'css', value: '.product-card, [data-testid="product-card"]' }],
  productName:       [{ engine: 'css', value: '.product-name, .product-title' }],
  productPrice:      [{ engine: 'css', value: '.product-price, .price' }],
  addToCartButton:   [{ engine: 'role', value: 'button', roleOptions: { name: /add to cart/i } }],
  addToWishlistButton: [{ engine: 'css', value: '.wishlist-btn, [aria-label*="wishlist" i]' }],
  filterCategory:    [{ engine: 'css', value: '.filter-category input[type="checkbox"]' }],
  filterBrand:       [{ engine: 'css', value: '.filter-brand input[type="checkbox"]' }],
  filterPriceMin:    [{ engine: 'css', value: 'input[name="minPrice"]' }],
  filterPriceMax:    [{ engine: 'css', value: 'input[name="maxPrice"]' }],
  sortDropdown:      [{ engine: 'css', value: 'select[name="sort"], .sort-dropdown' }],
  paginationNext:    [{ engine: 'css', value: '.pagination-next, [aria-label="Next"]' }],
  resultsCount:      [{ engine: 'css', value: '.results-count, .total-products' }],
  noResults:         [{ engine: 'text', value: 'No products found' }],
};
