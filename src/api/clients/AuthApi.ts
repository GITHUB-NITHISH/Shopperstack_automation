import * as fs from 'fs';
import * as path from 'path';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from '@core/BaseApiClient';
import { Endpoints } from '@core/constants/Endpoints';

/** Path where the JWT is persisted across tests (matches api.fixture loader). */
const TOKEN_FILE = path.resolve(__dirname, '../../../auth/storage/api.token.json');

/** Persist a JWT to disk so downstream specs (via `apiToken` fixture) can reuse it. */
function persistToken(token: string, email?: string): void {
  try {
    fs.mkdirSync(path.dirname(TOKEN_FILE), { recursive: true });
    fs.writeFileSync(TOKEN_FILE, JSON.stringify({ token, email, savedAt: new Date().toISOString() }, null, 2));
  } catch { /* ignore — persistence is best-effort */ }
}

export class AuthApi extends BaseApiClient {
  constructor(request: APIRequestContext, baseURL: string) {
    super(request, baseURL);
  }

  // ---------- Raw thin wrappers (return APIResponse, no assertions) ----------

  /** POST /shopping/users/login — returns raw response and caches JWT on success. */
  async login(payload: unknown): Promise<APIResponse> {
    const res = await this.raw('post', Endpoints.auth.login, { data: payload });
    if (res.ok()) {
      try {
        const body = await res.json();
        const jwt = body?.data?.jwtToken;
        if (typeof jwt === 'string' && jwt.length > 20) {
          this.setToken(jwt);
          persistToken(jwt, body?.data?.email);
        }
      } catch { /* ignore parse issues — caller may re-read via clone patterns */ }
    }
    return res;
  }

  /** POST /shopping/shoppers — shopper registration. */
  async registerShopper(payload: unknown): Promise<APIResponse> {
    return this.raw('post', Endpoints.auth.register, { data: payload });
  }

  /** POST /shopping/admin — admin registration. */
  async registerAdmin(payload: unknown): Promise<APIResponse> {
    return this.raw('post', Endpoints.auth.adminSignup, { data: payload });
  }

  /** POST /shopping/merchants — merchant registration. */
  async registerMerchant(payload: unknown): Promise<APIResponse> {
    return this.raw('post', Endpoints.auth.merchantSignup, { data: payload });
  }

  /** POST /shopping/users/forgot-password */
  async forgotPassword(email: string, role: 'SHOPPER' | 'MERCHANT' | 'ADMIN' = 'SHOPPER'): Promise<APIResponse> {
    return this.raw('post', Endpoints.auth.forgotPassword, { headers: { email, role } });
  }

  /** POST /shopping/users/logout */
  async logout(): Promise<APIResponse> {
    return this.raw('post', Endpoints.auth.logout);
  }

  /** Return the cached JWT (post-login), if any. */
  getToken(): string | undefined {
    return this.token;
  }
}

