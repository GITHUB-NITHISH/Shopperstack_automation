import { uiTest as test, expect } from '@fixtures/ui.fixture';
import { DataGenerator } from '@utils/DataGenerator';
import registerData from '@data/testdata/ui/register.data.json';
import type { SignupRole } from '@pages/RegisterPage';
import { Messages } from '@core/constants/Messages';
import { Tags } from '@core/constants/Tags';

/**
 * Registration — creates a fresh user per test and asserts the signup contract.
 *
 * Login flow after registration is intentionally NOT tested here — it's covered
 * by tests/ui/auth/login.spec.ts TC01 using deterministic credentials from
 * data/testdata/ui/login.data.json. Keeping register scope tight isolates
 * failures to the actual sign-up API/UI.
 */
test.describe(`${Tags.ui} ${Tags.auth} Register – ShoppersStack`, () => {
  for (const cfg of registerData.roles) {
    const role = cfg.role as SignupRole;

    test(`TC01 ${Tags.smoke} [${role}] Register with faker data lands on success URL and shows toast`, async ({
      registerPage}) => {
      const user = DataGenerator.randomUser();
      const payload = {
        ...user,
        confirmPassword: user.password,
        country: registerData.location.country,
        state:   registerData.location.state,
        city:    registerData.location.city,
      };

      await registerPage.open(cfg.signupUrl);
      await registerPage.register(payload, {
        hasTerms: cfg.hasTerms,
        requiresLocation: cfg.requiresLocation,
      });

      await registerPage.expectUrl( new RegExp(cfg.successUrlPattern),
        `${role} registration should navigate away from signup`);

      expect(await registerPage.getSuccessText(), `${role} success toast`)
        .toBe(Messages.register.successToast[role]);
    });
  }

  test(`TC02 ${Tags.regression} Register button stays disabled when passwords do not match`, async ({ registerPage }) => {
    const cfg = registerData.roles[0]; // shopper
    const user = DataGenerator.randomUser();
    await registerPage.open(cfg.signupUrl);
    await registerPage.register(
      { ...user, confirmPassword: 'Mismatch@123' },
      { hasTerms: cfg.hasTerms, requiresLocation: cfg.requiresLocation, skipSubmit: true },
    );
    await expect(registerPage.submitButton(), 'Register button should be disabled on password mismatch').toBeDisabled();
  });

  test(`TC03 ${Tags.regression} Register with existing email shows duplicate toast`, async ({ registerPage }) => {
    const cfg = registerData.roles[0];
    await registerPage.open(cfg.signupUrl);
    await registerPage.register(
      {
        firstName: 'Thiru',
        lastName:  'Kumar',
        email:     registerData.duplicate.email,
        phoneNumber: DataGenerator.randomPhone(),
        password:  registerData.duplicate.password,
        confirmPassword: registerData.duplicate.password,
      },
      { hasTerms: cfg.hasTerms, requiresLocation: cfg.requiresLocation, skipSubmit: true },
    );
    await expect(registerPage.submitButton(), 'Register button should be enabled with valid inputs').toBeEnabled();
    await registerPage.clickSubmit();
    expect(await registerPage.getErrorText(), 'duplicate email toast').toBe(Messages.register.duplicateEmail);
    await registerPage.expectUrl(new RegExp(cfg.signupUrl.replace('/', '')));
  });

  test(`TC04 ${Tags.regression} Register button stays disabled for invalid phone number`, async ({ registerPage }) => {
    const cfg = registerData.roles[0];
    const user = DataGenerator.randomUser();
    await registerPage.open(cfg.signupUrl);
    await registerPage.register(
      { ...user, phoneNumber: registerData.invalidPhone, confirmPassword: user.password },
      { hasTerms: cfg.hasTerms, requiresLocation: cfg.requiresLocation, skipSubmit: true },
    );
    await expect(registerPage.submitButton(), 'Register button should be disabled for invalid phone').toBeDisabled();
  });
});
