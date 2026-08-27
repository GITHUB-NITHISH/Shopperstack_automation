export interface PlaceOrderRequest {
  addressId: number;
  paymentMethod: 'CARD' | 'UPI' | 'COD' | 'NETBANKING';
  couponCode?: string;
  items: Array<{ productId: number; quantity: number; size?: string; color?: string }>;
}
