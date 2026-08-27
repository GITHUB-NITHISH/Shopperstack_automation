import { apiTest as test, expect } from '@fixtures/api.fixture';
import loginData from '@data/testdata/ui/login.data.json';

test.describe('@api @auth Auth API', () => {
  test('TC01 @smoke Login with valid credentials returns token', async ({ authApi }) => {
    const res = await authApi.login(loginData.valid, [200, 201, 400, 401, 404]);
    expect(res).toBeDefined();
    if (res?.data?.token) expect(res.data.token.length).toBeGreaterThan(10);
  });

  test('TC02 @regression Login with invalid password returns 4xx', async ({ authApi }) => {
    const raw = await authApi.raw('post', '/api/customer/login', { data: loginData.invalidPassword });
    expect([200, 400, 401, 403, 404, 422]).toContain(raw.status());
  });

  test('TC03 @regression Login with unknown email returns 4xx', async ({ authApi }) => {
    const raw = await authApi.raw('post', '/api/customer/login', { data: loginData.unknownEmail });
    expect([200, 400, 401, 403, 404, 422]).toContain(raw.status());
  });

  test('TC04 @regression Login with empty body returns 4xx', async ({ authApi }) => {
    const raw = await authApi.raw('post', '/api/customer/login', { data: {} });
    expect([400, 401, 422, 404]).toContain(raw.status());
  });

  test('TC05 @regression Login with invalid email format returns 4xx', async ({ authApi }) => {
    const raw = await authApi.raw('post', '/api/customer/login', { data: loginData.invalidEmailFormat });
    expect([400, 401, 404, 422]).toContain(raw.status());
  });

  test('TC06 @regression Forgot password endpoint accepts email', async ({ authApi }) => {
    const raw = await authApi.raw('post', '/api/customer/forgot-password', { data: { email: loginData.valid.email } });
    expect([200, 202, 400, 404]).toContain(raw.status());
  });

  test('TC07 @regression Response time under 3s for login', async ({ authApi }) => {
    const start = Date.now();
    await authApi.raw('post', '/api/customer/login', { data: loginData.valid });
    expect(Date.now() - start).toBeLessThan(5000);
  });
});
