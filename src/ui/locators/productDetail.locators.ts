import { LocatorDef } from './_helpers';

export const ProductDetailLocators: Record<string, LocatorDef[]> = {
  productTitle:    [{ engine: 'css', value: 'h1.product-title, h1' }],
  productPrice:    [{ engine: 'css', value: '.product-price, .final-price' }],
  productImage:    [{ engine: 'css', value: '.product-image img, .gallery-main img' }],
  sizeSelector:    [{ engine: 'css', value: '.size-option, select[name="size"]' }],
  colorSelector:   [{ engine: 'css', value: '.color-option' }],
  quantityInput:   [{ engine: 'css', value: 'input[name="quantity"]' }],
  qtyPlus:         [{ engine: 'css', value: '.qty-plus, button[aria-label="Increase"]' }],
  qtyMinus:        [{ engine: 'css', value: '.qty-minus, button[aria-label="Decrease"]' }],
  addToCartButton: [{ engine: 'role', value: 'button', roleOptions: { name: /add to cart/i } }],
  buyNowButton:    [{ engine: 'role', value: 'button', roleOptions: { name: /buy now/i } }],
  addToWishlist:   [{ engine: 'role', value: 'button', roleOptions: { name: /wishlist/i } }],
  descriptionTab:  [{ engine: 'text', value: 'Description' }],
  reviewsTab:      [{ engine: 'text', value: 'Reviews' }],
  ratingValue:     [{ engine: 'css', value: '.rating-value, .star-rating' }],
  outOfStockLabel: [{ engine: 'text', value: 'Out of Stock' }],
};
