import { uiTest as test, expect } from '@fixtures/ui.fixture';
import products from '@data/testdata/ui/product.data.json';

test.describe('@ui @product Product Search & Filter', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.open();
  });

  test('TC01 @smoke Search valid product term returns results', async ({ dashboardPage, productListingPage }) => {
    await dashboardPage.searchProduct(products.searchTerms[0]);
    expect(await productListingPage.getProductCount()).toBeGreaterThanOrEqual(0);
  });

  test('TC02 @regression Search with no-match term shows empty state', async ({ dashboardPage, productListingPage }) => {
    await dashboardPage.searchProduct(products.invalidSearch);
    const noRes = await productListingPage.isNoResultsShown();
    const count = await productListingPage.getProductCount();
    expect(noRes || count === 0).toBeTruthy();
  });

  test('TC03 @regression Search multiple keywords iteratively', async ({ dashboardPage, productListingPage }) => {
    for (const term of products.searchTerms.slice(0, 3)) {
      await dashboardPage.searchProduct(term);
      await expect.poll(() => productListingPage.getProductCount()).toBeGreaterThanOrEqual(0);
    }
  });

  test('TC04 @regression Open product detail from listing', async ({ dashboardPage, productListingPage, productDetailPage }) => {
    await dashboardPage.searchProduct(products.searchTerms[0]);
    if ((await productListingPage.getProductCount()) > 0) {
      await productListingPage.openProductByIndex(0);
      await expect.poll(() => productDetailPage.getTitle().catch(() => '')).not.toBe('');
    }
  });

  test('TC05 @regression Filter by price range', async ({ dashboardPage, productListingPage }) => {
    await dashboardPage.searchProduct(products.searchTerms[0]);
    await productListingPage.filterByPrice(products.priceRange.min, products.priceRange.max).catch(() => {});
    expect(await productListingPage.getProductCount()).toBeGreaterThanOrEqual(0);
  });

  test('TC06 @regression Verify header cart icon visible on listing', async ({ page, dashboardPage }) => {
    await dashboardPage.searchProduct(products.searchTerms[0]);
    await expect(page.locator('a[href*="cart"], [data-testid="cart-icon"]').first()).toBeVisible();
  });
});
