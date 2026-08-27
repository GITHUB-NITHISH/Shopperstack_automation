import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '@core/BaseApiClient';
import { Endpoints } from '@core/constants/Endpoints';
import { PlaceOrderRequest } from '@api/models/request/OrderRequests';

export class OrderApi extends BaseApiClient {
  constructor(request: APIRequestContext, baseURL: string, token?: string) {
    super(request, baseURL, token);
  }

  place(body: PlaceOrderRequest) { return this.post(Endpoints.order.place, { data: body, expectStatus: [200, 201] }); }
  history(params: { page?: number; size?: number } = {}) { return this.get(Endpoints.order.list, { params: params as any, expectStatus: 200 }); }
  byId(id: string) { return this.get(Endpoints.order.byId(id), { expectStatus: [200, 404] }); }
  cancel(id: string) { return this.put(Endpoints.order.cancel(id), { expectStatus: [200, 202] }); }
}
