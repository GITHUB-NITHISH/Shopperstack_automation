import { LocatorDef } from './_helpers';

/**
 * Checkout starts from Cart -> [Buy Now]. Steps:
 *   1. Choose / add address
 *   2. Pick payment method (COD, Credit/Debit Card, UPI, Net Banking, Wallet)
 *   3. Place Order -> confirmation with order id
 */
export const CheckoutLocators: Record<string, LocatorDef[]> = {
  addressSection:      [{ engine: 'role', value: 'heading', roleOptions: { name: /address/i } }],
  addAddressButton:    [{ engine: 'role', value: 'button', roleOptions: { name: /add.*address|add new/i } }],
  addressCard:         [{ engine: 'css', value: '.MuiPaper-root:has(input[type="radio"])' }],
  addressRadio:        [{ engine: 'css', value: 'input[type="radio"]' }],
  addressNameInput:    [{ engine: 'role', value: 'textbox', roleOptions: { name: /^name$/i } }],
  addressPhoneInput:   [{ engine: 'role', value: 'textbox', roleOptions: { name: /phone/i } }],
  addressPincodeInput: [{ engine: 'role', value: 'textbox', roleOptions: { name: /pincode|pin code|zip/i } }],
  addressStreetInput:  [{ engine: 'role', value: 'textbox', roleOptions: { name: /street|area|locality/i } }],
  addressCityInput:    [{ engine: 'role', value: 'textbox', roleOptions: { name: /city/i } }],
  addressStateInput:   [{ engine: 'role', value: 'textbox', roleOptions: { name: /state/i } }],
  saveAddressButton:   [{ engine: 'role', value: 'button', roleOptions: { name: /save|add/i } }],

  paymentSection:      [{ engine: 'role', value: 'heading', roleOptions: { name: /payment/i } }],
  paymentMethodRadio:  [{ engine: 'css', value: 'input[type="radio"]' }],
  codOption:           [{ engine: 'text', value: 'Cash on Delivery' }],
  cardOption:          [{ engine: 'text', value: 'Credit / Debit Card' }],
  upiOption:           [{ engine: 'text', value: 'UPI' }],
  netbankingOption:    [{ engine: 'text', value: 'Net Banking' }],
  walletOption:        [{ engine: 'text', value: 'Wallet' }],
  cardNumberInput:     [{ engine: 'css', value: 'input[name="cardNumber"], input[autocomplete="cc-number"]' }],
  cardExpiryInput:     [{ engine: 'css', value: 'input[name="expiry"], input[autocomplete="cc-exp"]' }],
  cardCvvInput:        [{ engine: 'css', value: 'input[name="cvv"], input[autocomplete="cc-csc"]' }],

  placeOrderButton:    [{ engine: 'role', value: 'button', roleOptions: { name: /place order|pay now|confirm/i } }],
  orderSummary:        [{ engine: 'css', value: 'article:has-text("price details")' }],
  orderConfirmation:   [{ engine: 'text', value: 'Order Placed' }],
  orderId:             [{ engine: 'css', value: '[data-testid="order-id"], .order-id' }],
};
