import { LocatorDef } from './_helpers';

/**
 * Product Detail Page — opened when a shopper clicks a product card in a listing.
 * Surfaces: product image, brand + name, star rating, discounted / original price + % off,
 * quantity selector, [add to cart], [Buy Now], [Add to Wish List] and [Like] (heart).
 */
export const ProductDetailLocators: Record<string, LocatorDef[]> = {
  productTitle:         [{ engine: 'css', value: 'h1, h2, h3' }],
  productBrand:         [{ engine: 'css', value: '[class*="brand" i]' }],
  productPrice:         [{ engine: 'css', value: 'p:has-text("₹") span:nth-child(1)' }],
  productOriginalPrice: [{ engine: 'css', value: 'p:has-text("₹") span:nth-child(2)' }],
  productDiscountPct:   [{ engine: 'css', value: 'p:has-text("₹") span:nth-child(3)' }],
  productImage:         [{ engine: 'css', value: 'img[alt]' }],
  ratingValue:          [{ engine: 'css', value: '[aria-label*="Star" i]' }],
  quantityInput:        [{ engine: 'role', value: 'spinbutton', roleOptions: { name: /quantity|qty/i } }],
  qtyPlus:              [{ engine: 'role', value: 'button', roleOptions: { name: /increase|\+/ } }],
  qtyMinus:             [{ engine: 'role', value: 'button', roleOptions: { name: /decrease|-/ } }],
  addToCartButton:      [{ engine: 'role', value: 'button', roleOptions: { name: /add to cart/i } }],
  buyNowButton:         [{ engine: 'role', value: 'button', roleOptions: { name: /buy now/i } }],
  addToWishlist:        [{ engine: 'role', value: 'button', roleOptions: { name: /wish list|wishlist/i } }],
  likeButton:           [{ engine: 'role', value: 'button', roleOptions: { name: /like/i } }],
  descriptionTab:       [{ engine: 'text', value: 'Description' }],
  reviewsTab:           [{ engine: 'text', value: 'Reviews' }],
  outOfStockLabel:      [{ engine: 'text', value: 'Out of Stock' }],

  // Legacy
  sizeSelector:         [{ engine: 'css', value: '.size-option, select[name="size"]' }],
  colorSelector:        [{ engine: 'css', value: '.color-option' }],
};
