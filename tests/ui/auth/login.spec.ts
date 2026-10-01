import { uiTest as test, expect } from '@fixtures/ui.fixture';
import loginData from '@data/testdata/ui/login.data.json';
import { Messages } from '@core/constants/Messages';
import { Tags } from '@core/constants/Tags';
import { UrlPatterns } from '@core/constants/UrlPatterns';
import type { UserRole } from '@pages/LoginPage';

test.describe(`${Tags.ui} ${Tags.auth} Login – ShoppersStack`, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  for (const cfg of loginData.validByRole) {
    const role = cfg.role as UserRole;

    test(`TC01 ${Tags.smoke} [${role}] Valid login navigates to role home`, async ({ loginPage }) => {
      await loginPage.login(cfg.email, cfg.password, role);
      await loginPage.expectUrl(new RegExp(cfg.successUrl), `${role} should land on its home URL`);
      expect(await loginPage.isLoggedIn(), `Expected user to be logged in as '${role}'`).toBe(true);
    });
  }

  test(`TC02 ${Tags.regression} Shopper login with invalid password shows error`, async ({ loginPage }) => {
    await loginPage.login(loginData.invalidPassword.email, loginData.invalidPassword.password, 'shopper');
    expect(await loginPage.getErrorMessage()).toBe(Messages.login.invalidCredError);
  });

  test(`TC03 ${Tags.regression} Login page exposes three role tabs`, async ({ loginPage }) => {
    await loginPage.expectAllRoleTabsVisible();
  });

  for (const role of ['merchant', 'admin'] as const) {
    test(`TC04 ${Tags.regression} Switching to ${role} tab reveals its own form`, async ({ loginPage }) => {
      await loginPage.selectRole(role);
      await loginPage.expectRoleFormVisible(role);
    });
  }

  test(`TC06 ${Tags.regression} Password field is masked by default and can be toggled`, async ({ loginPage }) => {
    await loginPage.fillPassword('Thiru2001@');
    await expect(loginPage.passwordField(), 'password type before toggle').toHaveAttribute('type', 'password');
    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordField(), 'password type after toggle').toHaveAttribute('type', 'text');
  });

  test(`TC07 ${Tags.regression} Forgot Password? label is present on every tab`, async ({ loginPage }) => {
    for (const role of ['shopper', 'merchant', 'admin'] as const) {
      await loginPage.selectRole(role);
      await loginPage.expectForgotPasswordVisible();
    }
  });

  test(`TC08 ${Tags.regression} "Create Account" navigates to the correct signup URL for all roles`, async ({ loginPage }) => {
    for (const { role, urlPattern } of loginData.signupUrlByRole) {
      await test.step(`Verify Create Account URL for ${role}`, async () => {
        await loginPage.open();
        await loginPage.selectRole(role as UserRole);
        await loginPage.clickCreateAccount();
        await loginPage.expectUrl(new RegExp(urlPattern), `Create Account URL mismatch for ${role}`);
      });
    }
  });

  test(`TC09 ${Tags.regression} Empty submit stays on /user-signin`, async ({ loginPage }) => {
    await loginPage.clickLogin();
    await loginPage.expectUrl(UrlPatterns.userSignin);
  });
});
