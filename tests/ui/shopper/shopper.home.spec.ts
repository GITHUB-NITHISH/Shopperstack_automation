import { uiTest as test, expect } from '@fixtures/ui.fixture';

/**
 * Authenticated shopper journeys on ShoppersStack.
 * Runs against the customer.storageState.json produced by the setup:ui project.
 */
test.describe('@ui @shopper Logged-in shopper home', () => {
  test('TC-S01 @smoke Shopper sees personalised header (greeting, cart, avatar)', async ({ dashboardPage, page }) => {
    await dashboardPage.open();
    await expect(page).toHaveTitle(/ShoppersStack \| Home/);
    await expect(page.getByRole('heading', { name: /^Hello,/i })).toBeVisible();
    await expect(page.locator('a[href="/cart"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Account settings' })).toBeVisible();
  });

  test('TC-S02 @smoke Account menu exposes all 7 items', async ({ dashboardPage, page }) => {
    await dashboardPage.open();
    await dashboardPage.openAccountMenu();
    for (const name of ['My Profile', 'Wish List', 'My Orders', 'My Wallet', 'My Likes', 'Logout']) {
      await expect(page.getByRole('menuitem', { name })).toBeVisible();
    }
    // "Cart" menu item includes the current count e.g. "Cart 1"
    await expect(page.getByRole('menuitem', { name: /^Cart(\s+\d+)?$/ })).toBeVisible();
  });

  test('TC-S03 @regression Shopper can navigate to My Profile', async ({ accountPage, page }) => {
    await page.goto('/');
    await accountPage.openProfile();
    await expect(page).toHaveURL(/\/user-profile/);
  });

  test('TC-S04 @regression Shopper can perform a scoped header search', async ({ dashboardPage, page }) => {
    await dashboardPage.open();
    await dashboardPage.search('iphone', 'electronics');
    await expect(page).not.toHaveURL(/user-signin/);
  });

  test('TC-S05 @regression Shopper can open the cart page', async ({ dashboardPage, page }) => {
    await dashboardPage.open();
    await dashboardPage.openCart();
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByRole('heading', { name: 'price details' })).toBeVisible();
  });
});
