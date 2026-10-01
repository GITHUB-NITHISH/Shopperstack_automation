import { Page, test, expect } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { resolveWithFallback } from '@locators/_helpers';
import { DashboardLocators } from '@locators/dashboard.locators';
import { AccountLocators } from '@locators/account.locators';

export type Category = 'Men' | 'Women' | 'Kids' | 'Electronic' | 'Beauty';
export type CategoryScope = 'all' | 'beauty' | 'men' | 'women' | 'kids' | 'electronics';

export const DASHBOARD_CATEGORIES: readonly Category[] = ['Men', 'Women', 'Kids', 'Electronic'] as const;

/**
 * ShoppersStack Home / Dashboard page ("/").
 *
 * Guests can: browse home banner, click the top nav categories, view featured
 * products, open a product card and click the header "Login" button.
 *
 * Authenticated shoppers additionally get: a category-scoped search, cart badge,
 * greeting heading and the "Account settings" menu.
 */
export class DashboardPage extends BasePage {
  constructor(page: Page) { super(page); }

  async open(): Promise<void> {
    await test.step('Open Home', async () => {
      await this.goto('/');
    });
  }

  /** Guest-only: click the header "Login" button to navigate to /user-signin. */
  async clickHeaderLogin(): Promise<void> {
    await test.step('Click header Login', async () => {
      await this.click(resolveWithFallback(this.page, DashboardLocators.headerLoginButton), 'Login');
    });
  }

  async openCategory(category: Category): Promise<void> {
    await test.step(`Open category ${category}`, async () => {
      await this.click(resolveWithFallback(this.page, DashboardLocators.categoryLink, { category }), category);
    });
  }

  /** Authenticated search using the header <select> + text combobox. */
  async search(term: string, scope: CategoryScope = 'all'): Promise<void> {
    await test.step(`Search "${term}" in ${scope}`, async () => {
      await resolveWithFallback(this.page, DashboardLocators.categoryScopeSelect).selectOption(scope);
      const input = resolveWithFallback(this.page, DashboardLocators.searchInput);
      await this.fill(input, term, 'search');
      await input.press('Enter');
    });
  }

  async openCart(): Promise<void> {
    await test.step('Open Cart', async () => {
      await this.click(resolveWithFallback(this.page, DashboardLocators.cartLink), 'Cart');
    });
  }

  /** Returns the numeric text of the cart link ("1", "2", …). */
  async getCartBadge(): Promise<string> {
    return await this.getText(resolveWithFallback(this.page, DashboardLocators.cartBadge));
  }

  async getGreeting(): Promise<string> {
    return await this.getText(resolveWithFallback(this.page, DashboardLocators.greetingHeading));
  }

  async openAccountMenu(): Promise<void> {
    await test.step('Open Account settings menu', async () => {
      await this.click(resolveWithFallback(this.page, DashboardLocators.accountSettingsBtn), 'Account settings');
    });
  }

  async logout(): Promise<void> {
    await test.step('Logout', async () => {
      await this.openAccountMenu();
      await this.click(resolveWithFallback(this.page, AccountLocators.logoutItem), 'Logout');
    });
  }

  async getFeaturedProductCards() {
    return resolveWithFallback(this.page, DashboardLocators.productCard);
  }

  async addFirstFeaturedToCart(): Promise<void> {
    await test.step('Add first featured product to cart', async () => {
      await this.click(resolveWithFallback(this.page, DashboardLocators.addToCartButton).first(), 'add to cart');
    });
  }

  async openFeaturedProductByIndex(index: number): Promise<void> {
    await test.step(`Open featured product #${index}`, async () => {
      const cards = resolveWithFallback(this.page, DashboardLocators.productCard);
      await cards.nth(index).click();
    });
  }

  // ─── High-level POM helpers (keep specs page-free) ────────────────────────

  /** Signed-in shopper is detected by presence of the "Account settings" avatar. */
  async isLoggedIn(): Promise<boolean> {
    return await this.isVisible(
      resolveWithFallback(this.page, DashboardLocators.accountSettingsBtn),
      10_000,
    );
  }

  /** Assert the given top-nav category is visible. */
  async expectCategoryVisible(category: Category): Promise<void> {
    await expect(
      this.categoryLocator(category),
      `Category "${category}" visible`,
    ).toBeVisible();
  }

  /** Locator for the top-nav category link — exposed for multi-check specs that need soft assertions. */
  categoryLocator(category: Category) {
    return resolveWithFallback(this.page, DashboardLocators.categoryLink, { category }).first();
  }

  /** Assert the cart link is visible in the header. */
  async expectCartLinkVisible(): Promise<void> {
    await expect(
      resolveWithFallback(this.page, DashboardLocators.cartLink).first(),
      'Cart link visible',
    ).toBeVisible();
  }

  /** Assert PDP "Add to cart" button is rendered. */
  async expectAddToCartVisible(): Promise<void> {
    await expect(
      resolveWithFallback(this.page, DashboardLocators.addToCartButton).first(),
      'Add to cart button',
    ).toBeVisible();
  }

  /** Assert the Logout menu item is visible (call after openAccountMenu). */
  async expectLogoutMenuItemVisible(): Promise<void> {
    await expect(
      resolveWithFallback(this.page, AccountLocators.logoutItem).first(),
      'Logout menu item',
    ).toBeVisible();
  }
}
