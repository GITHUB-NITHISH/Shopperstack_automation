import { LocatorDef } from './_helpers';

/**
 * Cart page = /cart
 * Right-side "price details" panel:
 *   heading "price details"
 *   Actual Price (<n> Product) ₹<amount>
 *   Discount Price ₹<amount>
 *   Delivery Charges ₹ 100
 *   Total Price ₹<amount>
 *   [Buy Now]  [Continue Shopping]
 */
export const CartLocators: Record<string, LocatorDef[]> = {
  priceDetailsHeading:  [{ engine: 'role', value: 'heading', roleOptions: { name: 'price details' } }],

  actualPriceHeading:   [{ engine: 'role', value: 'heading', roleOptions: { name: /^Actual Price/i } }],
  discountPriceHeading: [{ engine: 'role', value: 'heading', roleOptions: { name: /^Discount Price/i } }],
  deliveryChargesHeading:[{ engine: 'role', value: 'heading', roleOptions: { name: /^Delivery Charges/i } }],
  totalPriceHeading:    [{ engine: 'role', value: 'heading', roleOptions: { name: /^Total Price/i } }],

  buyNowButton:         [{ engine: 'role', value: 'button', roleOptions: { name: 'Buy Now' } }],
  continueShoppingBtn:  [{ engine: 'role', value: 'button', roleOptions: { name: 'Continue Shopping' } }],

  cartItem:             [{ engine: 'css', value: 'main div:has(button:has-text("remove"))' }],
  removeButton:         [{ engine: 'role', value: 'button', roleOptions: { name: /remove/i } }],
  qtyPlus:              [{ engine: 'role', value: 'button', roleOptions: { name: /increase|plus/i } }],
  qtyMinus:             [{ engine: 'role', value: 'button', roleOptions: { name: /decrease|minus/i } }],

  emptyCartMsg:         [{ engine: 'text', value: 'cart is empty' }],

  // Legacy aliases (kept so existing helpers/tests keep working)
  cartPageHeading:      [{ engine: 'role', value: 'heading', roleOptions: { name: 'price details' } }],
  cartItemName:         [{ engine: 'css', value: '.cart-item h3' }],
  cartItemPrice:        [{ engine: 'css', value: '.cart-item .item-price' }],
  cartItemQty:          [{ engine: 'css', value: '.cart-item input[type="number"]' }],
  subtotal:             [{ engine: 'role', value: 'heading', roleOptions: { name: /^Total Price/i } }],
  total:                [{ engine: 'role', value: 'heading', roleOptions: { name: /^Total Price/i } }],
  checkoutButton:       [{ engine: 'role', value: 'button', roleOptions: { name: 'Buy Now' } }],
  couponInput:          [{ engine: 'css', value: 'input[name="coupon"], input[placeholder*="coupon" i]' }],
  applyCouponBtn:       [{ engine: 'role', value: 'button', roleOptions: { name: /apply/i } }],
};
