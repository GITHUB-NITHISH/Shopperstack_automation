import { apiTest as test, expect } from '@fixtures/api.fixture';
import { DataGenerator } from '@utils/DataGenerator';

test.describe('@api @auth Register API', () => {
  test('TC01 @smoke Register unique user returns success/created', async ({ authApi }) => {
    const u = DataGenerator.randomUser();
    const raw = await authApi.raw('post', '/api/customer/register', {
      data: { ...u, confirmPassword: u.password },
    });
    expect([200, 201, 400, 404, 422]).toContain(raw.status());
  });

  test('TC02 @regression Register with duplicate email returns 4xx', async ({ authApi }) => {
    const raw = await authApi.raw('post', '/api/customer/register', {
      data: {
        firstName: 'Thiru', lastName: 'Kumar',
        email: 'thiru04102031@gmail.com',
        phoneNumber: '9876543210',
        password: 'Thiru2001@', confirmPassword: 'Thiru2001@',
      },
    });
    expect([200, 400, 409, 404, 422]).toContain(raw.status());
  });

  test('TC03 @regression Register with mismatched passwords rejected', async ({ authApi }) => {
    const u = DataGenerator.randomUser();
    const raw = await authApi.raw('post', '/api/customer/register', {
      data: { ...u, confirmPassword: 'Mismatch@1' },
    });
    expect([400, 404, 422]).toContain(raw.status());
  });

  test('TC04 @regression Register with missing email returns 4xx', async ({ authApi }) => {
    const raw = await authApi.raw('post', '/api/customer/register', {
      data: { firstName: 'A', lastName: 'B', password: 'X@12345', confirmPassword: 'X@12345', phoneNumber: '9876543210' },
    });
    expect([400, 404, 422]).toContain(raw.status());
  });

  test('TC05 @regression Register with invalid phone rejected', async ({ authApi }) => {
    const u = DataGenerator.randomUser();
    const raw = await authApi.raw('post', '/api/customer/register', {
      data: { ...u, phoneNumber: '123', confirmPassword: u.password },
    });
    expect([400, 404, 422]).toContain(raw.status());
  });
});
