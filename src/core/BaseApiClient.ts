import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { logger } from '@utils/Logger';

export interface ApiOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  expectStatus?: number | number[];
}

/**
 * BaseApiClient — thin wrapper around Playwright's APIRequestContext.
 * Handles auth token injection, retries, structured logging & status assertions.
 */
export class BaseApiClient {
  constructor(
    protected readonly request: APIRequestContext,
    protected readonly baseURL: string,
    protected token?: string,
  ) {}

  setToken(token: string): void {
    this.token = token;
  }

  private buildHeaders(extra?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...extra,
    };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    return headers;
  }

  private assertStatus(res: APIResponse, expected?: number | number[]): void {
    if (expected === undefined) return;
    const list = Array.isArray(expected) ? expected : [expected];
    expect(list, `Expected ${list} got ${res.status()}`).toContain(res.status());
  }

  async get<T = any>(path: string, opts: ApiOptions = {}): Promise<T> {
    const url = this.buildUrl(path, opts.params);
    logger.info({ method: 'GET', url }, 'API request');
    const res = await this.request.get(url, { headers: this.buildHeaders(opts.headers) });
    this.assertStatus(res, opts.expectStatus);
    return this.parse<T>(res);
  }

  async post<T = any>(path: string, opts: ApiOptions = {}): Promise<T> {
    const url = this.buildUrl(path, opts.params);
    logger.info({ method: 'POST', url }, 'API request');
    const res = await this.request.post(url, { headers: this.buildHeaders(opts.headers), data: opts.data });
    this.assertStatus(res, opts.expectStatus);
    return this.parse<T>(res);
  }

  async put<T = any>(path: string, opts: ApiOptions = {}): Promise<T> {
    const url = this.buildUrl(path, opts.params);
    const res = await this.request.put(url, { headers: this.buildHeaders(opts.headers), data: opts.data });
    this.assertStatus(res, opts.expectStatus);
    return this.parse<T>(res);
  }

  async delete<T = any>(path: string, opts: ApiOptions = {}): Promise<T> {
    const url = this.buildUrl(path, opts.params);
    const res = await this.request.delete(url, { headers: this.buildHeaders(opts.headers) });
    this.assertStatus(res, opts.expectStatus);
    return this.parse<T>(res);
  }

  /** Return raw response for callers who need headers/status */
  async raw(method: 'get' | 'post' | 'put' | 'delete', path: string, opts: ApiOptions = {}): Promise<APIResponse> {
    const url = this.buildUrl(path, opts.params);
    return this.request[method](url, { headers: this.buildHeaders(opts.headers), data: opts.data });
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(path.startsWith('http') ? path : this.baseURL + path);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
    return url.toString();
  }

  private async parse<T>(res: APIResponse): Promise<T> {
    const ct = res.headers()['content-type'] || '';
    if (ct.includes('application/json')) return (await res.json()) as T;
    return (await res.text()) as unknown as T;
  }
}
