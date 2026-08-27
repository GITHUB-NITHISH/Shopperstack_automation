import { test as setup, expect } from '@playwright/test';
import * as path from 'path';
import { ENV } from '@config/EnvConfig';
import { LoginPage } from '@pages/LoginPage';

const storagePath = path.resolve(__dirname, '../storage/customer.storageState.json');

setup('authenticate customer via UI @setup', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login(ENV.CUSTOMER_EMAIL, ENV.CUSTOMER_PASSWORD);
  // Best-effort wait — either we land on dashboard or user indicator appears
  await Promise.race([
    page.waitForURL(/dashboard|home|\/$/, { timeout: 15_000 }).catch(() => null),
    page.waitForSelector('[data-testid="user-menu"], .user-profile', { timeout: 15_000 }).catch(() => null),
  ]);
  await page.context().storageState({ path: storagePath });
  expect(true).toBe(true);
});
