import { LocatorDef } from './_helpers';

export const CartLocators: Record<string, LocatorDef[]> = {
  cartPageHeading: [{ engine: 'role', value: 'heading', roleOptions: { name: /cart|shopping bag/i } }],
  cartItem:        [{ engine: 'css', value: '.cart-item, [data-testid="cart-item"]' }],
  cartItemName:    [{ engine: 'css', value: '.cart-item .item-name, .cart-item h3' }],
  cartItemPrice:   [{ engine: 'css', value: '.cart-item .item-price' }],
  cartItemQty:     [{ engine: 'css', value: '.cart-item input[type="number"], .cart-item .qty' }],
  qtyPlus:         [{ engine: 'css', value: '.cart-item .qty-plus' }],
  qtyMinus:        [{ engine: 'css', value: '.cart-item .qty-minus' }],
  removeButton:    [{ engine: 'css', value: '.cart-item .remove-btn, button[aria-label*="remove" i]' }],
  subtotal:        [{ engine: 'css', value: '.cart-subtotal, .subtotal' }],
  total:           [{ engine: 'css', value: '.cart-total, .grand-total' }],
  checkoutButton:  [{ engine: 'role', value: 'button', roleOptions: { name: /checkout|proceed/i } }],
  emptyCartMsg:    [{ engine: 'text', value: 'cart is empty' }],
  couponInput:     [{ engine: 'css', value: 'input[name="coupon"], input[placeholder*="coupon" i]' }],
  applyCouponBtn:  [{ engine: 'role', value: 'button', roleOptions: { name: /apply/i } }],
};
