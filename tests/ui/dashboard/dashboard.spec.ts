import { uiTest as test, expect } from '@fixtures/ui.fixture';
import { Tags } from '@core/constants/Tags';
import { UrlPatterns } from '@core/constants/UrlPatterns';
import { DASHBOARD_CATEGORIES } from '@pages/DashboardPage';

/**
 * Dashboard (Home) UI validation for the logged-in shopper.
 *
 * Auth strategy: this file runs under the `ui` Playwright project, which
 * declares `dependencies: ['setup:ui']` and injects
 * `storageState: auth/storage/customer.storageState.json` in playwright.config.ts.
 * Every test starts already authenticated as the shopper — we only navigate to "/".
 */
test.describe(`${Tags.ui} ${Tags.dashboard} Shopper Dashboard UI`, () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.open();
  });

  test(`D01 ${Tags.smoke} Header shows greeting for logged-in shopper`, async ({ dashboardPage, log }) => {
    const greeting = await dashboardPage.getGreeting();
    log.info({ greeting }, 'Dashboard greeting captured');
    expect(greeting.toLowerCase(), 'greeting should contain "hello"').toContain('hello');
  });

  test(`D02 ${Tags.smoke} Top navigation categories are visible`, async ({ dashboardPage }) => {
    // Multi-category → soft assertions so all failures surface in one run.
    for (const category of DASHBOARD_CATEGORIES) {
      await expect.soft(dashboardPage.categoryLocator(category), `Category "${category}"`).toBeVisible();
    }
  });

  test(`D03 ${Tags.smoke} Featured product grid renders cards`, async ({ dashboardPage, log }) => {
    const cards = await dashboardPage.getFeaturedProductCards();
    const count = await cards.count();
    log.info({ count }, 'Featured product cards rendered');
    expect(count, 'at least 1 featured product card should render').toBeGreaterThan(0);
  });

  test(`D04 ${Tags.regression} Cart icon is visible and navigates to /cart`, async ({ dashboardPage }) => {
    await dashboardPage.expectCartLinkVisible();
    await dashboardPage.openCart();
    await dashboardPage.expectUrl(UrlPatterns.cart);
  });

  test(`D05 ${Tags.regression} Category-scoped search navigates to results`, async ({ dashboardPage }) => {
    await dashboardPage.search('shirt', 'men');
    await dashboardPage.expectUrl(/shirt/i);
  });

  test(`D06 ${Tags.regression} Open first featured product goes to product detail page`, async ({ dashboardPage }) => {
    await dashboardPage.openFeaturedProductByIndex(0);
    await dashboardPage.expectUrl(UrlPatterns.productDetail, 'URL should include /product…');
    await dashboardPage.expectAddToCartVisible();
  });

  test(`D07 ${Tags.regression} Account menu opens and Logout is available`, async ({ dashboardPage }) => {
    await dashboardPage.openAccountMenu();
    await dashboardPage.expectLogoutMenuItemVisible();
  });
});
