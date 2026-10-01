import * as fs from 'fs';
import * as path from 'path';
import { AuthApi } from '@api/clients/AuthApi';
import { ProductApi } from '@api/clients/ProductApi';
import { CartApi } from '@api/clients/CartApi';
import { OrderApi } from '@api/clients/OrderApi';
import { CustomerApi } from '@api/clients/CustomerApi';
import { DashboardApi } from '@api/clients/DashboardApi';
import { baseTest as base } from './base.fixture';

const TOKEN_FILE = path.resolve(__dirname, '../../auth/storage/api.token.json');

function loadAuth(): { token?: string; userId?: number } {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      const j = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
      return { token: j.token, userId: j.userId ?? undefined };
    }
  } catch { /* ignore */ }
  return {};
}

export type ApiFixtures = {
  authApi: AuthApi;
  productApi: ProductApi;
  cartApi: CartApi;
  orderApi: OrderApi;
  customerApi: CustomerApi;
  dashboardApi: DashboardApi;
  apiToken: string;
  shopperId: number;
};

export const apiTest = base.extend<ApiFixtures>({
  apiToken:  async ({}, use) => {
    const { token } = loadAuth();
    if (!token) {
      throw new Error(
        'API token missing from auth/storage/api.token.json. ' +
        'Ensure the setup:api project ran (dependencies: ["setup:api"] in playwright.config.ts).',
      );
    }
    await use(token);
  },
  shopperId: async ({}, use) => {
    const { userId } = loadAuth();
    if (!userId) {
      throw new Error(
        'shopperId missing from auth/storage/api.token.json. Re-run setup:api to refresh auth state.',
      );
    }
    await use(userId);
  },
  authApi:      async ({ request, env }, use) => await use(new AuthApi(request, env.API_BASE_URL)),
  productApi:   async ({ request, env, apiToken }, use) => await use(new ProductApi(request, env.API_BASE_URL, apiToken)),
  cartApi:      async ({ request, env, apiToken }, use) => await use(new CartApi(request, env.API_BASE_URL, apiToken)),
  orderApi:     async ({ request, env, apiToken }, use) => await use(new OrderApi(request, env.API_BASE_URL, apiToken)),
  customerApi:  async ({ request, env, apiToken }, use) => await use(new CustomerApi(request, env.API_BASE_URL, apiToken)),
  dashboardApi: async ({ request, env, apiToken }, use) => await use(new DashboardApi(request, env.API_BASE_URL, apiToken)),
});

export { expect } from '@playwright/test';
