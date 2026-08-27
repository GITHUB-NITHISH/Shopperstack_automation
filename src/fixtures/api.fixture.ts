import * as fs from 'fs';
import * as path from 'path';
import { AuthApi } from '@api/clients/AuthApi';
import { ProductApi } from '@api/clients/ProductApi';
import { CartApi } from '@api/clients/CartApi';
import { OrderApi } from '@api/clients/OrderApi';
import { CustomerApi } from '@api/clients/CustomerApi';
import { baseTest as base } from './base.fixture';

const TOKEN_FILE = path.resolve(__dirname, '../../auth/storage/api.token.json');

function loadToken(): string | undefined {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8')).token;
    }
  } catch { /* ignore */ }
  return undefined;
}

export type ApiFixtures = {
  authApi: AuthApi;
  productApi: ProductApi;
  cartApi: CartApi;
  orderApi: OrderApi;
  customerApi: CustomerApi;
  apiToken: string | undefined;
};

export const apiTest = base.extend<ApiFixtures>({
  apiToken: async ({}, use) => { await use(loadToken()); },
  authApi:     async ({ request, env }, use) => await use(new AuthApi(request, env.API_BASE_URL)),
  productApi:  async ({ request, env, apiToken }, use) => await use(new ProductApi(request, env.API_BASE_URL, apiToken)),
  cartApi:     async ({ request, env, apiToken }, use) => await use(new CartApi(request, env.API_BASE_URL, apiToken)),
  orderApi:    async ({ request, env, apiToken }, use) => await use(new OrderApi(request, env.API_BASE_URL, apiToken)),
  customerApi: async ({ request, env, apiToken }, use) => await use(new CustomerApi(request, env.API_BASE_URL, apiToken)),
});

export { expect } from '@playwright/test';
