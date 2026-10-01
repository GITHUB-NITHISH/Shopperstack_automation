import { uiTest as test, expect } from '@fixtures/ui.fixture';

/**
 * What a guest (not-logged-in) visitor can do on ShoppersStack:
 *  - Visit the marketing home page and view the welcome banner.
 *  - Browse the top-nav category pages (/men /women /kids /electronics /beauty_products).
 *  - View the featured products grid & paginate.
 *  - Click the header "Login" button to reach /user-signin.
 *  - Reach the shopper / admin signup helpers from the footer.
 * A guest CANNOT: search (search bar only appears after login), see the
 * "Account settings" avatar, open /cart with items, place orders, or use wishlist.
 */
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('@ui @guest ShoppersStack home (guest)', () => {
  test('TC-G01 @smoke Guest sees welcome banner and top nav', async ({ page, dashboardPage }) => {
    await dashboardPage.open();
    await expect(page).toHaveTitle(/ShoppersStack/);
    await expect(page.getByRole('heading', { name: /Welcome to ShoppersStack/i })).toBeVisible();
    for (const cat of ['Men', 'Women', 'Kids', 'Electronic', 'Beauty']) {
      await expect(page.getByRole('link', { name: cat, exact: true })).toBeVisible();
    }
    await expect(page.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
  });

  test('TC-G02 @smoke Guest can open every category listing', async ({ page }) => {
    for (const [label, url] of [
      ['Men',        /\/men$/],
      ['Women',      /\/women$/],
      ['Kids',       /\/kids$/],
      ['Electronic', /\/electronics$/],
      ['Beauty',     /\/beauty_products$/],
    ] as const) {
      await page.getByRole('link', { name: label, exact: true }).first().click();
      await expect(page).toHaveURL(url);
      await page.goBack();
    }
  });

  test('TC-G03 @regression Guest sees Featured Products with pagination', async ({ page, dashboardPage }) => {
    await dashboardPage.open();
    await expect(page.getByRole('heading', { name: 'Featured Products' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'pagination navigation' })).toBeVisible();
  });

  test('TC-G04 @regression Header "Login" navigates to /user-signin', async ({ dashboardPage, page }) => {
    await dashboardPage.open();
    await dashboardPage.clickHeaderLogin();
    await expect(page).toHaveURL(/\/user-signin/);
    await expect(page.getByRole('tab', { name: 'Shopper Login' })).toBeVisible();
  });

  test('TC-G05 @regression Footer "Create Admin Account" opens /admin-signup', async ({ page, dashboardPage }) => {
    await dashboardPage.open();
    await page.getByRole('link', { name: 'Create Admin Account' }).click();
    await expect(page).toHaveURL(/\/admin-signup/);
  });

  test('TC-G06 @regression Guest has NO account avatar and NO search combobox', async ({ page, dashboardPage }) => {
    await dashboardPage.open();
    await expect(page.getByRole('button', { name: 'Account settings' })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: /^Hello,/i })).toHaveCount(0);
  });
});
