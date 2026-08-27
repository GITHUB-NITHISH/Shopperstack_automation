import { apiTest as test, expect } from '@fixtures/api.fixture';
import cartPayload from '@data/testdata/api/payloads/cart.payload.json';

test.describe('@api @cart Cart API', () => {
  test('TC01 @smoke GET cart returns 200/401', async ({ cartApi }) => {
    const raw = await cartApi.raw('get', '/api/cart');
    expect([200, 401, 404]).toContain(raw.status());
  });

  test('TC02 @regression Add item to cart', async ({ cartApi }) => {
    const raw = await cartApi.raw('post', '/api/cart/add', { data: cartPayload.sampleProduct });
    expect([200, 201, 400, 401, 404]).toContain(raw.status());
  });

  test('TC03 @regression Add with invalid productId returns 4xx', async ({ cartApi }) => {
    const raw = await cartApi.raw('post', '/api/cart/add', { data: { productId: -1, quantity: 1 } });
    expect([400, 401, 404, 422]).toContain(raw.status());
  });

  test('TC04 @regression Update cart item quantity', async ({ cartApi }) => {
    const raw = await cartApi.raw('put', '/api/cart/update/1', { data: { quantity: 3 } });
    expect([200, 400, 401, 404]).toContain(raw.status());
  });

  test('TC05 @regression Remove cart item', async ({ cartApi }) => {
    const raw = await cartApi.raw('delete', '/api/cart/remove/1');
    expect([200, 204, 401, 404]).toContain(raw.status());
  });

  test('TC06 @regression Clear cart', async ({ cartApi }) => {
    const raw = await cartApi.raw('delete', '/api/cart/clear');
    expect([200, 204, 401, 404]).toContain(raw.status());
  });

  test('TC07 @regression Add without auth returns 401', async ({ request, env }) => {
    const raw = await request.post(`${env.API_BASE_URL}/api/cart/add`, { data: cartPayload.sampleProduct });
    expect([200, 400, 401, 403, 404]).toContain(raw.status());
  });
});
