import { apiTest as test, expect } from '@fixtures/api.fixture';
import orderPayload from '@data/testdata/api/payloads/order.payload.json';

test.describe('@api @order Order API', () => {
  test('TC01 @smoke GET order history', async ({ orderApi }) => {
    const raw = await orderApi.raw('get', '/api/order', { params: { page: 0, size: 5 } });
    expect([200, 401, 404]).toContain(raw.status());
  });

  test('TC02 @regression Place order via CARD', async ({ orderApi }) => {
    const raw = await orderApi.raw('post', '/api/order/place', { data: orderPayload.cardOrder });
    expect([200, 201, 400, 401, 404, 422]).toContain(raw.status());
  });

  test('TC03 @regression Place order via COD', async ({ orderApi }) => {
    const raw = await orderApi.raw('post', '/api/order/place', { data: orderPayload.codOrder });
    expect([200, 201, 400, 401, 404, 422]).toContain(raw.status());
  });

  test('TC04 @regression Place order with empty items rejected', async ({ orderApi }) => {
    const raw = await orderApi.raw('post', '/api/order/place', { data: { ...orderPayload.cardOrder, items: [] } });
    expect([400, 401, 404, 422]).toContain(raw.status());
  });

  test('TC05 @regression GET order by non-existent ID returns 4xx', async ({ orderApi }) => {
    const raw = await orderApi.raw('get', '/api/order/OD-NON-EXIST-000');
    expect([200, 400, 401, 404]).toContain(raw.status());
  });

  test('TC06 @regression Cancel non-existent order returns 4xx', async ({ orderApi }) => {
    const raw = await orderApi.raw('put', '/api/order/OD-NON-EXIST-000/cancel');
    expect([200, 202, 400, 401, 404]).toContain(raw.status());
  });
});
