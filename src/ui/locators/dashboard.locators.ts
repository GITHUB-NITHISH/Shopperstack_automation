import { LocatorDef } from './_helpers';

export const DashboardLocators: Record<string, LocatorDef[]> = {
  logo:            [{ engine: 'css', value: 'a[href="/"], img[alt*="logo" i]' }],
  searchInput:     [{ engine: 'css', value: 'input[type="search"], input[placeholder*="search" i]' }],
  searchButton:    [{ engine: 'css', value: 'button[type="submit"][aria-label*="search" i], .search-icon' }],
  cartIcon:        [{ engine: 'css', value: '[data-testid="cart-icon"], a[href*="cart"], .cart-icon' }],
  cartBadge:       [{ engine: 'css', value: '.cart-badge, [data-testid="cart-count"]' }],
  wishlistIcon:    [{ engine: 'css', value: 'a[href*="wishlist"], .wishlist-icon' }],
  profileMenu:     [{ engine: 'css', value: '[data-testid="user-menu"], .user-profile' }],
  logoutButton:    [{ engine: 'text', value: 'Logout' }],
  productCard:     [{ engine: 'css', value: '.product-card, [data-testid="product-card"]' }],
  productCardByName: [{ engine: 'xpath', value: '//*[contains(@class,"product-card")][.//*[contains(text(),"{{name}}")]]' }],
  categoryLink:    [{ engine: 'text', value: '{{category}}' }],
  bannerCarousel:  [{ engine: 'css', value: '.banner, .carousel, .hero-slider' }],
};
