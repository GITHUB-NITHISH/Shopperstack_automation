import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '@core/BaseApiClient';
import { Endpoints } from '@core/constants/Endpoints';

export class CustomerApi extends BaseApiClient {
  constructor(request: APIRequestContext, baseURL: string, token?: string) {
    super(request, baseURL, token);
  }

  profile() { return this.get(Endpoints.customer.profile, { expectStatus: 200 }); }
  updateProfile(body: any) { return this.put(Endpoints.customer.profile, { data: body, expectStatus: 200 }); }
  changePassword(oldPassword: string, newPassword: string) {
    return this.put(Endpoints.customer.changePassword, { data: { oldPassword, newPassword }, expectStatus: 200 });
  }
  listAddresses() { return this.get(Endpoints.customer.address, { expectStatus: 200 }); }
  addAddress(body: any) { return this.post(Endpoints.customer.address, { data: body, expectStatus: [200, 201] }); }
  deleteAddress(id: number) { return this.delete(`${Endpoints.customer.address}/${id}`, { expectStatus: [200, 204] }); }
}
