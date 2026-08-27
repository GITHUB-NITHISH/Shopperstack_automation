export const Endpoints = {
  auth: {
    login: '/api/customer/login',
    register: '/api/customer/register',
    verifyOtp: '/api/customer/verify-otp',
    forgotPassword: '/api/customer/forgot-password',
    resetPassword: '/api/customer/reset-password',
    logout: '/api/customer/logout',
  },
  customer: {
    profile: '/api/customer/profile',
    changePassword: '/api/customer/change-password',
    address: '/api/customer/address',
  },
  product: {
    list: '/api/product',
    byId: (id: number | string) => `/api/product/${id}`,
    search: '/api/product/search',
    filter: '/api/product/filter',
    featured: '/api/product/featured',
  },
  cart: {
    get: '/api/cart',
    add: '/api/cart/add',
    update: (id: number | string) => `/api/cart/update/${id}`,
    remove: (id: number | string) => `/api/cart/remove/${id}`,
    clear: '/api/cart/clear',
  },
  order: {
    place: '/api/order/place',
    list: '/api/order',
    byId: (id: string) => `/api/order/${id}`,
    cancel: (id: string) => `/api/order/${id}/cancel`,
  },
  payment: {
    initiate: '/api/payment/initiate',
    verify: '/api/payment/verify',
    methods: '/api/payment/methods',
  },
  wishlist: {
    get: '/api/wishlist',
    add: (id: number | string) => `/api/wishlist/add/${id}`,
    remove: (id: number | string) => `/api/wishlist/remove/${id}`,
  },
} as const;
