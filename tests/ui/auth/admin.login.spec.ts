import { uiTest as test, expect } from '@fixtures/ui.fixture';
import { ENV } from '@config/EnvConfig';

/**
 * Admin login sanity. Set ADMIN_EMAIL / ADMIN_PASSWORD in config/env/.env.qa
 * (or create one via the footer "Create Admin Account" link -> /admin-signup).
 */
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('@ui @auth @admin Admin login', () => {
  test.skip(!ENV.ADMIN_EMAIL || !ENV.ADMIN_PASSWORD, 'Set ADMIN_EMAIL/ADMIN_PASSWORD to run');

  test('TC-A01 @regression Admin tab accepts credentials', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.login(ENV.ADMIN_EMAIL!, ENV.ADMIN_PASSWORD!, 'admin');
    await expect(page).not.toHaveURL(/user-signin/);
  });
});
