import { uiTest as test, expect } from '@fixtures/ui.fixture';
import { ENV } from '@config/EnvConfig';

/**
 * Merchant login sanity. Requires MERCHANT_EMAIL / MERCHANT_PASSWORD in
 * config/env/.env.qa. When they aren't set the tests are automatically skipped.
 */
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('@ui @auth @merchant Merchant login', () => {
  test.skip(!ENV.MERCHANT_EMAIL || !ENV.MERCHANT_PASSWORD, 'Set MERCHANT_EMAIL/MERCHANT_PASSWORD to run');

  test('TC-M01 @regression Merchant tab accepts credentials', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.login(ENV.MERCHANT_EMAIL!, ENV.MERCHANT_PASSWORD!, 'merchant');
    await expect(page).not.toHaveURL(/user-signin/);
  });
});
