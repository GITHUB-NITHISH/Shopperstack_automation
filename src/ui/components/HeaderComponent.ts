import { Page, Locator } from '@playwright/test';

/**
 * Reusable ShoppersStack header. Two modes:
 *   - Guest: logo + "Login" button + top-nav categories.
 *   - Authenticated shopper: adds the category-scope <select>, search combobox,
 *     "Hello, <NAME>" greeting, cart link with item count, and Account settings.
 */
export class HeaderComponent {
  readonly logo: Locator;
  readonly loginButton: Locator;
  readonly categoryScopeSelect: Locator;
  readonly searchInput: Locator;
  readonly greeting: Locator;
  readonly cartLink: Locator;
  readonly accountSettingsButton: Locator;

  readonly navMen: Locator;
  readonly navWomen: Locator;
  readonly navKids: Locator;
  readonly navElectronic: Locator;
  readonly navBeauty: Locator;

  constructor(private readonly page: Page) {
    this.logo                  = page.getByRole('link', { name: 'logo' }).first();
    this.loginButton           = page.getByRole('button', { name: 'Login', exact: true });
    this.categoryScopeSelect   = page.locator('header select, article > article select').first();
    this.searchInput           = page.locator('header input[type="text"], article > article input[type="text"]').first();
    this.greeting              = page.getByRole('heading', { name: /^Hello,/i });
    this.cartLink              = page.locator('a[href="/cart"]');
    this.accountSettingsButton = page.getByRole('button', { name: 'Account settings' });

    this.navMen        = page.getByRole('link', { name: 'Men',        exact: true });
    this.navWomen      = page.getByRole('link', { name: 'Women',      exact: true });
    this.navKids       = page.getByRole('link', { name: 'Kids',       exact: true });
    this.navElectronic = page.getByRole('link', { name: 'Electronic', exact: true });
    this.navBeauty     = page.getByRole('link', { name: 'Beauty',     exact: true });
  }

  async goHome() { await this.logo.click(); }
  async openLogin() { await this.loginButton.click(); }
}
