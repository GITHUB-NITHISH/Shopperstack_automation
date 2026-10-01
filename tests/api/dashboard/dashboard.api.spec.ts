import { apiTest as test, expect } from '@fixtures/api.fixture';
import { ApiMessages } from '@core/constants/ApiMessages';
import { validateStatus, validateSchema, validateEmptyBody } from '@utils/apiValidators';
import { GetCartSchema, GetProductsSchema } from '@api/schemas/dashboard.schema';

/**
 * Dashboard API — endpoints hit when a logged-in shopper lands on Home ("/").
 *
 * Auth strategy: uses the JWT + userId produced once by the `setup:api`
 * project (see auth/setup/api.token.setup.ts). Both are surfaced through the
 * `apiToken` and `shopperId` fixtures in api.fixture.ts, so no test in this
 * file needs to log in again.
 */

test.describe('@api @dashboard Shopper Dashboard API', () => {
  // Auth pre-conditions are enforced by the `apiToken` / `shopperId` fixtures,
  // which throw upfront if auth/storage/api.token.json is missing. No beforeAll needed.

  test('TC01 @smoke Zone product feed returns 200 with products', async ({ dashboardApi }) => {
    const res = await dashboardApi.getZoneFeed('ALPHA');
    validateStatus(res, 200);

    const body = await res.json();
    expect.soft(body.statusCode).toBe(200);
    expect.soft(body.message).toBe(ApiMessages.SUCCESS);
    expect.soft(Array.isArray(body.data), 'data should be an array').toBe(true);
    expect.soft(body.data.length, 'feed should not be empty').toBeGreaterThan(0);

    validateSchema(body, GetProductsSchema, {label: "Validating Schema", soft: true});
  });

  test('TC02 @regression Alpha legacy feed returns 200 with products', async ({ dashboardApi }) => {
    const res = await dashboardApi.getAlphaFeed();
    validateStatus(res, 200);

    const body = await res.json();
    expect.soft(body.message).toBe(ApiMessages.SUCCESS);
    expect.soft(Array.isArray(body.data)).toBe(true);
  });

  test('TC03 @smoke Get shopper likes returns 200 with numeric ids', async ({ dashboardApi, shopperId }) => {
    const res = await dashboardApi.getLikes(shopperId!);
    validateStatus(res, 200);

    const body = await res.json();
    expect.soft(body.statusCode).toBe(200);
    expect.soft(body.message).toBe(ApiMessages.SUCCESS);
    // data can be null (no likes) or array of productIds
    if (Array.isArray(body.data)) {
      body.data.forEach((id: unknown) =>
        expect.soft(typeof id === 'number', `like id ${id} should be number`).toBe(true),
      );
    }
  });

  test('TC04 @smoke Get shopper cart returns 200 with cart array', async ({ dashboardApi, shopperId }) => {
    const res = await dashboardApi.getCart(shopperId!);
    validateStatus(res, 200);

    const body = await res.json();
    expect.soft(body.statusCode).toBe(200);
    expect.soft(body.message).toBe(ApiMessages.SUCCESS);
    validateSchema(body, GetCartSchema, { label: 'Validating Cart Schema', soft: true });
  });

  test('TC05 @smoke Get shopper orders returns 200', async ({ dashboardApi, shopperId }) => {
    const res = await dashboardApi.getOrders(shopperId!);
    validateStatus(res, 200);

    const body = await res.json();
    expect.soft(body.statusCode).toBe(200);
    expect.soft(body.message).toBe(ApiMessages.SUCCESS);
    // data can be null (no orders) or array
    expect.soft(body.data === null || Array.isArray(body.data),
      'orders.data should be null or array').toBe(true);
  });

  test('TC06 @regression Cart without JWT returns 403 FORBIDDEN', async ({ dashboardApi, shopperId }) => {
    dashboardApi.setToken(''); // deliberately clear token for negative auth check
    const res = await dashboardApi.getCart(shopperId!);
    expect(res.status(), `Expected 403, got ${res.status()}`).toBe(403);
    validateEmptyBody(res);
  });

  test('TC07 @regression Cart with malformed JWT returns 403 FORBIDDEN', async ({ dashboardApi, shopperId }) => {
    // ShoppersStack's security filter returns 403 (not 401) for both missing
    // and malformed tokens — verified via live capture on the /carts endpoint.
    dashboardApi.setToken('invalid.jwt.token');
    const res = await dashboardApi.getCart(shopperId!);
    expect(res.status(), `Expected 403, got ${res.status()}`).toBe(403);
    validateEmptyBody(res);
  });

  test('TC08 @regression @performance Dashboard fan-out completes under 4s', async ({ dashboardApi, shopperId }) => {
    const start = Date.now();
    const [feed, likes, cart, orders] = await Promise.all([
      dashboardApi.getZoneFeed('ALPHA'),
      dashboardApi.getLikes(shopperId!),
      dashboardApi.getCart(shopperId!),
      dashboardApi.getOrders(shopperId!),
    ]);
    const duration = Date.now() - start;
    console.log('Dashboard fan-out duration (ms):', duration);

    expect.soft(feed.status(),   'zone feed status').toBe(200);
    expect.soft(likes.status(),  'likes status').toBe(200);
    expect.soft(cart.status(),   'cart status').toBe(200);
    expect.soft(orders.status(), 'orders status').toBe(200);
    expect.soft(duration, `Dashboard fan-out should complete in <4s, took ${duration}ms`)
      .toBeLessThan(4000);
  });
});
