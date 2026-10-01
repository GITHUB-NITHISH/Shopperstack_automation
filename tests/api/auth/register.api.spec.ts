import { apiTest as test, expect } from '@fixtures/api.fixture';
import { DataGenerator } from '@utils/DataGenerator';
import loginPayloads from '@data/testdata/api/payloads/login.payload.json';
import { ApiMessages } from '@core/constants/ApiMessages';
import {
  validateStatus,
  validateStatusText,
  validateError,
  validateSchema,
  validateEmptyBody,
} from '@utils/apiValidators';
import { AdminRegistrationSuccessSchema, ShopperRegistrationSuccessSchema } from '@api/schemas/common.schema';

test.describe('@api @auth Register API', () => {
  test('TC01 @smoke Register unique shopper returns 201 with success envelope', async ({ authApi }) => {
    const payload = DataGenerator.buildRegistrationData('SHOPPER');
    console.log('Shopper register payload:', payload);

    const res = await authApi.registerShopper(payload);
    validateStatus(res, 201);

    const body = await res.json();
    console.log('Register response:', JSON.stringify(body, null, 2));

    validateSchema(body, ShopperRegistrationSuccessSchema);
    expect.soft(body.data).toMatchObject({
      firstName: payload.firstName,
      lastName:  payload.lastName,
      email:     payload.email,
      city:      payload.city,
      state:     payload.state,
      country:   payload.country,
    });
    console.log(`✅ Registered SHOPPER: ${payload.email} / ${payload.password}`);
  });

  test('TC02 @regression Register with duplicate email returns 409 CONFLICT', async ({ authApi }) => {
    const payload = DataGenerator.buildRegistrationData('SHOPPER', {
      email: loginPayloads.shopper.validShopper.email,
    });
    const res = await authApi.registerShopper(payload);
    validateStatus(res, 409);
    validateError(await res.json(), 409, ApiMessages.CONFLICT, ApiMessages.Errors.DUPLICATE_USER);
  });

  test('TC03 @regression Register with missing required field (city) rejected', async ({ authApi }) => {
    const payload = DataGenerator.buildRegistrationData<Record<string, unknown>>('SHOPPER');
    delete payload.city;

    const res = await authApi.registerShopper(payload);
    validateStatus(res, 400);

    const body = await res.json();
    expect.soft(body.data).toHaveProperty('city');
    validateError(body, 400, ApiMessages.BAD_REQUEST, {'city': ApiMessages.Errors.MUST_NOT_BE_NULL});
  });

  test('TC04 @regression Register with invalid phone rejected', async ({ authApi }) => {
    const payload = DataGenerator.buildRegistrationData('SHOPPER', {
      phone: DataGenerator.invalidPhone(),
    });
    const res = await authApi.registerShopper(payload);
    validateStatus(res, 400);
    validateError(await res.json(), 400, ApiMessages.BAD_REQUEST, {'phone': ApiMessages.Errors.INVALID_PHONE});
  });

  test('TC05 @regression Register with invalid gender enum returns 400 with empty body', async ({ authApi }) => {
    const payload = DataGenerator.buildRegistrationData('SHOPPER', { gender: 'Male' }); // must be MALE
    const res = await authApi.registerShopper(payload);
    validateStatus(res, 400);
    await validateEmptyBody(res);
  });

  test('TC06 @regression Register unique admin returns 201', async ({ authApi }) => {
    const payload = DataGenerator.buildRegistrationData('ADMIN');
    console.log('Admin register payload:', payload);

    const res = await authApi.registerAdmin(payload);
    validateStatus(res, 201);

    const body = await res.json();
    validateSchema(body, AdminRegistrationSuccessSchema);
    expect.soft(body.data?.status).toBe('ACTIVE');
    expect.soft(body.data).toMatchObject({
      firstName: payload.firstName,
      lastName:  payload.lastName,
      email:     payload.email,
      city:      payload.city,
      state:     payload.state,
      country:   payload.country,
    });
    console.log(`✅ Registered ADMIN: ${payload.email} / ${payload.password}`);
  });
});
