import { uiTest as test, expect } from '@fixtures/ui.fixture';

test.describe('@ui @product Category listings', () => {
  const categories = ['men', 'women', 'kids', 'electronics', 'beauty_products'] as const;

  for (const category of categories) {
    test(`TC-P-${category} @regression /${category} renders products & pagination`, async ({ productListingPage, page }) => {
      await productListingPage.openCategory(category);
      await expect(page).toHaveURL(new RegExp(`/${category}$`));
      await expect(page.getByRole('button', { name: 'add to cart' }).first()).toBeVisible();
      await expect(page.getByRole('navigation', { name: 'pagination navigation' })).toBeVisible();
    });
  }

  test('TC-P-nav @regression Pagination next moves off page 1', async ({ productListingPage, page }) => {
    await productListingPage.openCategory('men');
    await productListingPage.goToNextPage();
    // Playwright doesn't rely on URL query for pagination so just assert the 'previous' button becomes enabled.
    await expect(page.getByRole('button', { name: 'Go to previous page' })).toBeEnabled();
  });
});
