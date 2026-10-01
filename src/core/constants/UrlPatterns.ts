/**
 * Central regex catalog for URL assertions.
 * Keep patterns anchored where possible — avoid greedy fragments like `/\// `.
 */
export const UrlPatterns = {
  home:            /^https?:\/\/[^/]+\/?$/,
  userSignin:      /\/user-signin(\?|$)/,
  shopperSignup:   /\/signup(\?|$)/,
  adminSignup:     /\/admin-signup(\?|$)/,
  merchantSignup:  /\/urlhelper(\?|$)/,
  cart:            /\/cart(\?|$|#)/,
  productDetail:   /\/product/i,
  productListing:  /\/products(\?|$|\/)/i,
} as const;
