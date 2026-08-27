import { LocatorDef } from './_helpers';

export const CheckoutLocators: Record<string, LocatorDef[]> = {
  addressSection:      [{ engine: 'css', value: '.address-section, [data-testid="address-section"]' }],
  addAddressButton:    [{ engine: 'role', value: 'button', roleOptions: { name: /add.*address/i } }],
  addressCard:         [{ engine: 'css', value: '.address-card' }],
  addressRadio:        [{ engine: 'css', value: 'input[type="radio"][name="address"]' }],
  paymentSection:      [{ engine: 'css', value: '.payment-section' }],
  paymentMethodRadio:  [{ engine: 'css', value: 'input[type="radio"][name="paymentMethod"]' }],
  cardNumberInput:     [{ engine: 'css', value: 'input[name="cardNumber"], input[autocomplete="cc-number"]' }],
  cardExpiryInput:     [{ engine: 'css', value: 'input[name="expiry"], input[autocomplete="cc-exp"]' }],
  cardCvvInput:        [{ engine: 'css', value: 'input[name="cvv"], input[autocomplete="cc-csc"]' }],
  placeOrderButton:    [{ engine: 'role', value: 'button', roleOptions: { name: /place order|pay now/i } }],
  orderSummary:        [{ engine: 'css', value: '.order-summary' }],
  orderConfirmation:   [{ engine: 'text', value: 'Order Placed' }],
  orderId:             [{ engine: 'css', value: '[data-testid="order-id"], .order-id' }],
};
