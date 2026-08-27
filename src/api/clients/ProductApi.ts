import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '@core/BaseApiClient';
import { Endpoints } from '@core/constants/Endpoints';

export class ProductApi extends BaseApiClient {
  constructor(request: APIRequestContext, baseURL: string, token?: string) {
    super(request, baseURL, token);
  }

  list(params: { page?: number; size?: number; sort?: string } = {}) {
    return this.get(Endpoints.product.list, { params: params as any, expectStatus: 200 });
  }

  byId(id: number | string) {
    return this.get(Endpoints.product.byId(id), { expectStatus: [200, 404] });
  }

  search(query: string) {
    return this.get(Endpoints.product.search, { params: { query }, expectStatus: 200 });
  }

  filter(f: { category?: string; minPrice?: number; maxPrice?: number; brand?: string; rating?: number }) {
    return this.get(Endpoints.product.filter, { params: f as any, expectStatus: 200 });
  }

  featured() {
    return this.get(Endpoints.product.featured, { expectStatus: 200 });
  }
}
