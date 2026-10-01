import { test as setup, request, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { ENV } from '@config/EnvConfig';
import { Endpoints } from '@core/constants/Endpoints';

const TOKEN_FILE = path.resolve(__dirname, '../storage/api.token.json');

/**
 * Verified ShoppersStack login contract (captured from live DevTools):
 *   POST {API_BASE_URL}/shopping/users/login
 *   body: { email, password, role: 'SHOPPER' | 'MERCHANT' | 'ADMIN' }
 *   200 -> { user: { jwtToken, email, role, ... }, products, likes }
 */
setup('authenticate customer via API @setup', async () => {
  const ctx = await request.newContext({ baseURL: ENV.API_BASE_URL });
  try {
    const res = await ctx.post(Endpoints.auth.login, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: { email: ENV.CUSTOMER_EMAIL, password: ENV.CUSTOMER_PASSWORD, role: 'SHOPPER' },
    });
    expect(res.status(), `Login failed: ${res.status()} ${await res.text()}`).toBe(200);

    const body = await res.json();
    const token  = body?.user?.jwtToken ?? body?.data?.user?.jwtToken ?? body?.data?.jwtToken ?? '';
    const userId = body?.user?.userId   ?? body?.data?.user?.userId   ?? body?.data?.userId   ?? null;
    expect(token, 'jwtToken missing in login response').toBeTruthy();

    fs.mkdirSync(path.dirname(TOKEN_FILE), { recursive: true });
    fs.writeFileSync(TOKEN_FILE, JSON.stringify({
      token,
      userId,
      email: body?.user?.email ?? body?.data?.user?.email,
      role:  body?.user?.role  ?? body?.data?.user?.role,
      capturedAt: new Date().toISOString(),
    }, null, 2));
  } finally {
    await ctx.dispose();
  }
});
