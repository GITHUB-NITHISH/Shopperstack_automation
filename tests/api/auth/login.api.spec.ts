import { apiTest as test, expect } from '@fixtures/api.fixture';
import payloads from '@data/testdata/api/payloads/login.payload.json';
import { ApiMessages } from '@core/constants/ApiMessages';
import {
  validateStatus,
  validateStatusText,
  validateError,
  validateSchema,
  validateEmptyBody,
  validateResponseTime,
} from '@utils/apiValidators';
import { LoginSuccessSchema } from '@api/schemas/common.schema';

// Verified via DevTools capture: POST /shopping/users/login with { email, password, role }.
// Role must be one of: SHOPPER | MERCHANT | ADMIN.

test.describe('@api @auth Login API', () => {
  test('TC01 @smoke Valid shopper login returns 200 with jwtToken', async ({ authApi }) => {
    const res = await authApi.login(payloads.shopper.validShopper);
    validateStatus(res, 200);

    const body = await res.json();
    console.log('Login response:', JSON.stringify(body, null, 2));

    validateSchema(body, LoginSuccessSchema);
    expect.soft(body.data).toMatchObject({
      email: payloads.shopper.validShopper.email,
      role: 'SHOPPER',
    });
    // Token is now cached in authApi + persisted for downstream specs.
    expect.soft(authApi.getToken(), 'JWT should be cached on AuthApi').toBeTruthy();
  });

  test('TC02 @regression Invalid password returns 400 BAD_REQUEST', async ({ authApi }) => {
    const res = await authApi.login(payloads.shopper.invalidPassword);
    validateStatus(res, 400);
    // validateStatusText(res, ApiMessages.StatusText.BadRequest);
    validateError(await res.json(), 400, ApiMessages.BAD_REQUEST, ApiMessages.Errors.WRONG_CREDENTIALS);
  });

  test('TC03 @regression Unknown email returns 401 UNAUTHORIZED', async ({ authApi }) => {
    const res = await authApi.login(payloads.shopper.unknownEmail);
    validateStatus(res, 401);
    // validateStatusText(res, ApiMessages.StatusText.Unauthorized);
    validateError(await res.json(), 401, ApiMessages.UNAUTHORIZED, ApiMessages.Errors.WRONG_CREDENTIALS);
  });

  test('TC04 @regression Empty body returns 400 with no response body', async ({ authApi }) => {
    const res = await authApi.login(undefined);
    validateStatus(res, 400);
    await validateEmptyBody(res);
  });

  test('TC05 @regression Invalid email format returns 401 UNAUTHORIZED', async ({ authApi }) => {
    const res = await authApi.login(payloads.shopper.invalidEmailFormat);
    validateStatus(res, 401);
    // validateStatusText(res, ApiMessages.StatusText.Unauthorized);
    validateError(await res.json(), 401, ApiMessages.UNAUTHORIZED, ApiMessages.Errors.WRONG_CREDENTIALS);
  });

  test('TC06 @regression @performance Login response time under 3s', async ({ authApi }) => {
    const start = Date.now();
    await authApi.login(payloads.shopper.validShopper);
    const duration = Date.now() - start;
    console.log('Duration  :', duration);
    validateResponseTime(duration,3000, {label: 'Login API'});
  });
});

