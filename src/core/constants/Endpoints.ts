/**
 * ShoppersStack REST endpoints.
 *
 * All shopping/customer/merchant APIs live under the `/shopping` context path
 * (see https://www.shoppersstack.com/shopping/swagger-ui.html).
 * If a specific route in your test env differs, override it via constants below.
 */
const SHOP = '/shopping';

export const Endpoints = {
  auth: {
    // Unified login endpoint — body must include { email, password, role: SHOPPER|MERCHANT|ADMIN }
    login:          `${SHOP}/users/login`,
    // Real Swagger endpoints (see /shopping/v2/api-docs):
    register:       `${SHOP}/shoppers`,     // POST — shopper registration (ShopperRequest)
    verifyAccount:  `${SHOP}/users/verify-account`,
    forgotPassword: `${SHOP}/users/forgot-password`,
    resetPassword:  `${SHOP}/users/reset-password`,
    logout:         `${SHOP}/users/logout`,
    // Merchant
    merchantSignup: `${SHOP}/merchants`,     // POST — merchant registration
    // Admin
    adminSignup:    `${SHOP}/admin`,         // POST — admin registration (User)
  },
  customer: {
    profile:        `${SHOP}/customers/profile`,
    changePassword: `${SHOP}/customers/change-password`,
    address:        `${SHOP}/customers/address`,
  },
  product: {
    list:     `${SHOP}/products`,
    byId:     (id: number | string) => `${SHOP}/products/${id}`,
    search:   `${SHOP}/products/search`,
    byCategory: (category: string) => `${SHOP}/products/category/${category}`,
    featured: `${SHOP}/products/featured`,
    /** Home feed used by the React dashboard — public, requires zoneId query. */
    byZone:   `${SHOP}/products`,
    /** Legacy alpha-zone feed observed on Home. */
    alphaFeed:`${SHOP}/products/alpha`,
  },
  dashboard: {
    /** Shopper's liked / wishlisted product ids. */
    likes:  `${SHOP}/shoppers/likes`,
    /** Shopper cart contents. */
    cart:   (shopperId: number | string) => `${SHOP}/shoppers/${shopperId}/carts`,
    /** Shopper order history. */
    orders: (shopperId: number | string) => `${SHOP}/shoppers/${shopperId}/orders`,
    /** Shopper profile. */
    profile:(shopperId: number | string) => `${SHOP}/shoppers/${shopperId}`,
  },
  cart: {
    get:    `${SHOP}/cart`,
    add:    `${SHOP}/cart/add`,
    update: (id: number | string) => `${SHOP}/cart/update/${id}`,
    remove: (id: number | string) => `${SHOP}/cart/remove/${id}`,
    clear:  `${SHOP}/cart/clear`,
  },
  order: {
    place:  `${SHOP}/orders`,
    list:   `${SHOP}/orders`,
    byId:   (id: string) => `${SHOP}/orders/${id}`,
    cancel: (id: string) => `${SHOP}/orders/${id}/cancel`,
  },
  payment: {
    initiate: `${SHOP}/payments/initiate`,
    verify:   `${SHOP}/payments/verify`,
    methods:  `${SHOP}/payments/methods`,
  },
  wishlist: {
    get:    `${SHOP}/wishlist`,
    add:    (id: number | string) => `${SHOP}/wishlist/add/${id}`,
    remove: (id: number | string) => `${SHOP}/wishlist/remove/${id}`,
  },
} as const;
