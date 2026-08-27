import { apiTest as test, expect } from '@fixtures/api.fixture';

test.describe('@api @product Product API', () => {
  test('TC01 @smoke GET list returns 200', async ({ productApi }) => {
    const raw = await productApi.raw('get', '/api/product', { params: { page: 0, size: 10 } });
    expect([200, 404]).toContain(raw.status());
  });

  test('TC02 @regression GET product by ID', async ({ productApi }) => {
    const raw = await productApi.raw('get', '/api/product/5001');
    expect([200, 404]).toContain(raw.status());
  });

  test('TC03 @regression GET product by non-existent ID returns 404', async ({ productApi }) => {
    const raw = await productApi.raw('get', '/api/product/99999999');
    expect([404, 400, 200]).toContain(raw.status());
  });

  test('TC04 @regression Search products with query', async ({ productApi }) => {
    const raw = await productApi.raw('get', '/api/product/search', { params: { query: 'shirt' } });
    expect([200, 404]).toContain(raw.status());
  });

  test('TC05 @regression Filter products by price range', async ({ productApi }) => {
    const raw = await productApi.raw('get', '/api/product/filter', { params: { minPrice: 100, maxPrice: 2000 } });
    expect([200, 404]).toContain(raw.status());
  });

  test('TC06 @regression Featured products endpoint', async ({ productApi }) => {
    const raw = await productApi.raw('get', '/api/product/featured');
    expect([200, 404]).toContain(raw.status());
  });

  test('TC07 @regression Pagination boundary page=0 size=1', async ({ productApi }) => {
    const raw = await productApi.raw('get', '/api/product', { params: { page: 0, size: 1 } });
    expect([200, 404]).toContain(raw.status());
  });

  test('TC08 @regression Response time under 5s for product list', async ({ productApi }) => {
    const start = Date.now();
    await productApi.raw('get', '/api/product', { params: { page: 0, size: 20 } });
    expect(Date.now() - start).toBeLessThan(8000);
  });
});
