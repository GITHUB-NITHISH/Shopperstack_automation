export interface ApiEnvelope<T> {
  status: 'SUCCESS' | 'FAILED' | string;
  message?: string;
  data: T;
  error?: unknown;
}

export interface LoginData {
  token: string;
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  expiresIn?: number;
}

export type LoginResponse = ApiEnvelope<LoginData>;

export interface ProductData {
  productId: number;
  name: string;
  brand?: string;
  category?: string;
  price: number;
  finalPrice?: number;
  stock?: number;
  rating?: number;
  images?: string[];
}
export type ProductResponse = ApiEnvelope<ProductData>;

export interface CartItem { cartItemId: number; productId: number; name: string; price: number; quantity: number; subtotal: number; }
export interface CartData { cartId: number; items: CartItem[]; totalItems: number; subtotal: number; grandTotal: number; }
export type CartResponse = ApiEnvelope<CartData>;

export interface OrderData { orderId: string; orderStatus: string; paymentStatus?: string; grandTotal: number; }
export type OrderResponse = ApiEnvelope<OrderData>;
