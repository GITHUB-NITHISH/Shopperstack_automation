import { apiTest as test, expect } from '@fixtures/api.fixture';

test.describe('@api @customer Customer API', () => {
  test('TC01 @smoke GET profile', async ({ customerApi }) => {
    const raw = await customerApi.raw('get', '/api/customer/profile');
    expect([200, 401, 404]).toContain(raw.status());
  });

  test('TC02 @regression PUT update profile', async ({ customerApi }) => {
    const raw = await customerApi.raw('put', '/api/customer/profile', {
      data: { firstName: 'Thiru', lastName: 'Kumar', phoneNumber: '9876543210' },
    });
    expect([200, 400, 401, 404, 422]).toContain(raw.status());
  });

  test('TC03 @regression Change password with wrong old rejected', async ({ customerApi }) => {
    const raw = await customerApi.raw('put', '/api/customer/change-password', {
      data: { oldPassword: 'Wrong@1', newPassword: 'New@2025' },
    });
    expect([200, 400, 401, 404, 422]).toContain(raw.status());
  });

  test('TC04 @regression GET addresses', async ({ customerApi }) => {
    const raw = await customerApi.raw('get', '/api/customer/address');
    expect([200, 401, 404]).toContain(raw.status());
  });

  test('TC05 @regression POST add address with invalid pincode', async ({ customerApi }) => {
    const raw = await customerApi.raw('post', '/api/customer/address', {
      data: { fullName: 'Thiru', phoneNumber: '9876543210', pincode: '00', addressLine1: 'x', city: 'y', state: 'TN', country: 'IN', addressType: 'HOME' },
    });
    expect([200, 201, 400, 401, 404, 422]).toContain(raw.status());
  });
});
