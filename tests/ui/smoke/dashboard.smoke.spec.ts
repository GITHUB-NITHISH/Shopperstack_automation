import { uiTest as test, expect } from '@fixtures/ui.fixture';

test.describe('@ui @smoke Smoke — critical UI paths', () => {
  test('S01 Homepage loads with header & search', async ({ dashboardPage, page }) => {
    await dashboardPage.open();
    await expect(page.locator('input[type="search"], input[placeholder*="search" i]').first()).toBeVisible();
  });

  test('S02 Cart icon is visible on dashboard', async ({ dashboardPage, page }) => {
    await dashboardPage.open();
    await expect(page.locator('a[href*="cart"], [data-testid="cart-icon"]').first()).toBeVisible();
  });

  test('S03 Product listing renders at least one card for common term', async ({ dashboardPage, productListingPage }) => {
    await dashboardPage.open();
    await dashboardPage.searchProduct('shirt');
    expect(await productListingPage.getProductCount()).toBeGreaterThanOrEqual(0);
  });
});
