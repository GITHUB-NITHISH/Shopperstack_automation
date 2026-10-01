import { test as setup } from '@playwright/test';
import * as path from 'path';
import { ENV } from '@config/EnvConfig';
import { LoginPage } from '@pages/LoginPage';

const storagePath = path.resolve(__dirname, '../storage/customer.storageState.json');

/**
 * UI storageState setup for the shopper (customer) role.
 * After login the ShoppersStack header renders the "Account settings" avatar,
 * which is our signal that the auth cookies are set.
 */
setup('authenticate shopper via UI @setup', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login(ENV.CUSTOMER_EMAIL, ENV.CUSTOMER_PASSWORD, 'shopper');

  await Promise.race([
    page.waitForURL('**/', { timeout: 15_000 }).catch(() => null),
    page.getByRole('button', { name: 'Account settings' }).waitFor({ timeout: 15_000 }).catch(() => null),
  ]);

  await page.context().storageState({ path: storagePath });
});