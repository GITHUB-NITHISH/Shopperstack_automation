import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from '@core/BaseApiClient';
import { Endpoints } from '@core/constants/Endpoints';

/**
 * DashboardApi — thin wrapper around the endpoints hit by the ShoppersStack
 * home page ("/") once a shopper has logged in. Verified via live capture:
 *
 *   GET /shopping/products?zoneId=ALPHA        (public home feed)
 *   GET /shopping/products/alpha               (legacy alpha feed)
 *   GET /shopping/shoppers/likes?shopperId=..  (wishlist / likes)
 *   GET /shopping/shoppers/{id}/carts          (mini-cart badge)
 *   GET /shopping/shoppers/{id}/orders         (recent orders)
 */
export class DashboardApi extends BaseApiClient {
  constructor(request: APIRequestContext, baseURL: string, token?: string) {
    super(request, baseURL, token);
  }

  /** GET /shopping/products?zoneId={zoneId} */
  async getZoneFeed(zoneId: string = 'ALPHA'): Promise<APIResponse> {
    return this.raw('get', Endpoints.product.byZone, { params: { zoneId } });
  }

  /** GET /shopping/products/alpha */
  async getAlphaFeed(): Promise<APIResponse> {
    return this.raw('get', Endpoints.product.alphaFeed);
  }

  /** GET /shopping/shoppers/likes?shopperId={id} */
  async getLikes(shopperId: number | string): Promise<APIResponse> {
    return this.raw('get', Endpoints.dashboard.likes, { params: { shopperId } });
  }

  /** GET /shopping/shoppers/{id}/carts */
  async getCart(shopperId: number | string): Promise<APIResponse> {
    return this.raw('get', Endpoints.dashboard.cart(shopperId));
  }

  /** GET /shopping/shoppers/{id}/orders */
  async getOrders(shopperId: number | string): Promise<APIResponse> {
    return this.raw('get', Endpoints.dashboard.orders(shopperId));
  }

  /** GET /shopping/shoppers/{id} */
  async getProfile(shopperId: number | string): Promise<APIResponse> {
    return this.raw('get', Endpoints.dashboard.profile(shopperId));
  }
}
