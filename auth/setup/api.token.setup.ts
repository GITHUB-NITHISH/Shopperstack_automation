import { test as setup, request } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { ENV } from '@config/EnvConfig';
import { AuthApi } from '@api/clients/AuthApi';

const TOKEN_FILE = path.resolve(__dirname, '../storage/api.token.json');

setup('authenticate customer via API @setup', async () => {
  const ctx = await request.newContext({ baseURL: ENV.API_BASE_URL });
  const api = new AuthApi(ctx, ENV.API_BASE_URL);
  try {
    const res = await api.login({ email: ENV.CUSTOMER_EMAIL, password: ENV.CUSTOMER_PASSWORD }, [200, 201]);
    fs.mkdirSync(path.dirname(TOKEN_FILE), { recursive: true });
    fs.writeFileSync(TOKEN_FILE, JSON.stringify({ token: res.data?.token ?? '' }, null, 2));
  } catch (err) {
    // Write empty token file so downstream tests can still parse
    fs.mkdirSync(path.dirname(TOKEN_FILE), { recursive: true });
    fs.writeFileSync(TOKEN_FILE, JSON.stringify({ token: '' }, null, 2));
    // eslint-disable-next-line no-console
    console.warn('[api.token.setup] Login failed — writing empty token. Reason:', (err as Error).message);
  } finally {
    await ctx.dispose();
  }
});
