import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '@core/BaseApiClient';
import { Endpoints } from '@core/constants/Endpoints';
import { LoginRequest, RegisterRequest } from '@api/models/request/AuthRequests';
import { LoginResponse } from '@api/models/response/CommonResponses';
import { LoginSchema } from '@api/schemas/common.schema';

export class AuthApi extends BaseApiClient {
  constructor(request: APIRequestContext, baseURL: string) {
    super(request, baseURL);
  }

  async login(body: LoginRequest, expectStatus: number | number[] = [200, 201]): Promise<LoginResponse> {
    const res = await this.post<LoginResponse>(Endpoints.auth.login, { data: body, expectStatus });
    // Validate schema on success
    if (Array.isArray(expectStatus) ? expectStatus.includes(200) : expectStatus === 200) {
      LoginSchema.parse(res);
      this.setToken(res.data.token);
    }
    return res;
  }

  async register(body: RegisterRequest, expectStatus: number | number[] = [200, 201]) {
    return this.post(Endpoints.auth.register, { data: body, expectStatus });
  }

  async forgotPassword(email: string) {
    return this.post(Endpoints.auth.forgotPassword, { data: { email }, expectStatus: [200, 202] });
  }

  async logout() {
    return this.post(Endpoints.auth.logout, { expectStatus: [200, 204] });
  }
}
