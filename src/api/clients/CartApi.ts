import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '@core/BaseApiClient';
import { Endpoints } from '@core/constants/Endpoints';
import { AddToCartRequest, UpdateCartRequest } from '@api/models/request/CartRequests';

export class CartApi extends BaseApiClient {
  constructor(request: APIRequestContext, baseURL: string, token?: string) {
    super(request, baseURL, token);
  }

  getCart() { return this.get(Endpoints.cart.get, { expectStatus: 200 }); }
  addItem(body: AddToCartRequest) { return this.post(Endpoints.cart.add, { data: body, expectStatus: [200, 201] }); }
  updateItem(id: number, body: UpdateCartRequest) { return this.put(Endpoints.cart.update(id), { data: body, expectStatus: 200 }); }
  removeItem(id: number) { return this.delete(Endpoints.cart.remove(id), { expectStatus: [200, 204] }); }
  clearCart() { return this.delete(Endpoints.cart.clear, { expectStatus: [200, 204] }); }
}
