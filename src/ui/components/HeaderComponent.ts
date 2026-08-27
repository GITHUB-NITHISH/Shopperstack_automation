import { Page, Locator } from '@playwright/test';

/** Reusable header component available on all pages */
export class HeaderComponent {
  readonly logo: Locator;
  readonly searchInput: Locator;
  readonly cartIcon: Locator;
  readonly wishlistIcon: Locator;
  readonly profileMenu: Locator;

  constructor(private readonly page: Page) {
    this.logo         = page.locator('a[href="/"], img[alt*="logo" i]').first();
    this.searchInput  = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    this.cartIcon     = page.locator('[data-testid="cart-icon"], a[href*="cart"]').first();
    this.wishlistIcon = page.locator('a[href*="wishlist"]').first();
    this.profileMenu  = page.locator('[data-testid="user-menu"], .user-profile').first();
  }

  async goHome() {
    await this.logo.click();
  }
}
