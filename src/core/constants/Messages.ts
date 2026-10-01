export const Messages = {
  login: {
    invalidCredError: 'Given user ID or password is wrong',
    // success: 'Login Successful',
  },
  register: {
    successToast: {
        shopper: 'Successfully Registered',
        admin: 'Profile Created Successfully',
        merchant: 'Merchant Registered Successfully',
    },
    duplicateEmail: 'Given Email ID or Phone number already used',
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
