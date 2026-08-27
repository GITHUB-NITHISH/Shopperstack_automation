export const Messages = {
  login: {
    invalidCreds: 'Invalid email or password',
    success: 'Login Successful',
  },
  register: {
    success: 'Registration successful',
    duplicateEmail: 'Email already exists',
  },
  cart: {
    added: 'Item added to cart',
    removed: 'Item removed from cart',
    empty: 'Your cart is empty',
  },
  order: {
    placed: 'Order placed successfully',
    cancelled: 'Order cancelled',
  },
} as const;
