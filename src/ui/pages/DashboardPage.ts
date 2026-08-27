import { Page, test } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { resolveWithFallback } from '@locators/_helpers';
import { DashboardLocators } from '@locators/dashboard.locators';

export class DashboardPage extends BasePage {
  constructor(page: Page) { super(page); }

  async open(): Promise<void> {
    await test.step('Open Dashboard', async () => {
      await this.goto('/');
    });
  }

  async searchProduct(term: string): Promise<void> {
    await test.step(`Search "${term}"`, async () => {
      const input = resolveWithFallback(this.page, DashboardLocators.searchInput);
      await this.fill(input, term, 'search');
      await input.press('Enter');
    });
  }

  async openCart(): Promise<void> {
    await test.step('Open Cart', async () => {
      await this.click(resolveWithFallback(this.page, DashboardLocators.cartIcon), 'Cart icon');
    });
  }

  async openWishlist(): Promise<void> {
    await test.step('Open Wishlist', async () => {
      await this.click(resolveWithFallback(this.page, DashboardLocators.wishlistIcon), 'Wishlist');
    });
  }

  async logout(): Promise<void> {
    await test.step('Logout', async () => {
      await this.click(resolveWithFallback(this.page, DashboardLocators.profileMenu), 'Profile menu');
      await this.click(resolveWithFallback(this.page, DashboardLocators.logoutButton), 'Logout');
    });
  }

  async getCartBadge(): Promise<string> {
    return await this.getText(resolveWithFallback(this.page, DashboardLocators.cartBadge));
  }

  async getProductCards() {
    return resolveWithFallback(this.page, DashboardLocators.productCard);
  }
}
