import { Page, test } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { resolveWithFallback } from '@locators/_helpers';
import { RegisterLocators } from '@locators/register.locators';

export type SignupRole = 'shopper' | 'admin' | 'merchant';
export type Gender = 'Male' | 'Female' | 'Other';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  gender?: Gender;
  dateOfBirth?: string;
  country?: string;
  state?: string;
  city?: string;
  acceptTerms?: boolean;
}

export interface RegisterOptions {
  hasTerms?: boolean;
  requiresLocation?: boolean;
  skipSubmit?: boolean;
}

/**
 * ShoppersStack sign-up page (shopper / admin / merchant).
 * Signup URL is passed in by the caller (kept in data JSON, not hardcoded).
 */
export class RegisterPage extends BasePage {
  constructor(page: Page) { super(page); }

  async open(signupUrl: string): Promise<void> {
    await test.step(`Open signup page ${signupUrl}`, async () => {
      await this.goto(signupUrl);
    });
  }

  async register(u: RegisterPayload, opts: RegisterOptions = {}): Promise<void> {
    await test.step(`Register user ${u.email}`, async () => {
      await this.fill(resolveWithFallback(this.page, RegisterLocators.firstNameInput), u.firstName, 'firstName');
      await this.fill(resolveWithFallback(this.page, RegisterLocators.lastNameInput),  u.lastName, 'lastName');

      const gender: Gender = u.gender ?? 'Male';
      const genderLocatorKey =
        gender === 'Female' ? 'genderFemaleRadio'
        : gender === 'Other' ? 'genderOtherRadio'
        : 'genderMaleRadio';
      await this.click(resolveWithFallback(this.page, RegisterLocators[genderLocatorKey]), `${gender} radio`);

      await this.fill(resolveWithFallback(this.page, RegisterLocators.phoneInput),     u.phoneNumber, 'phone');
      await this.fill(resolveWithFallback(this.page, RegisterLocators.emailInput),     u.email, 'email');
      await this.fill(resolveWithFallback(this.page, RegisterLocators.passwordInput),  u.password, 'password');
      await this.fill(resolveWithFallback(this.page, RegisterLocators.confirmPasswordInput), u.confirmPassword, 'confirm');

      if (opts.requiresLocation) {
        const country = u.country ?? 'India';
        const state   = u.state   ?? 'Tamil Nadu';
        const city    = u.city    ?? 'Chennai';
        await resolveWithFallback(this.page, RegisterLocators.countrySelect).selectOption({ label: country });
        await resolveWithFallback(this.page, RegisterLocators.stateSelect).selectOption({ label: state });
        await resolveWithFallback(this.page, RegisterLocators.citySelect).selectOption({ label: city });
      }

      if (opts.hasTerms && (u.acceptTerms ?? true)) {
        await resolveWithFallback(this.page, RegisterLocators.agreeCheckbox).check().catch(() => {});
      }

      if (!opts.skipSubmit) {
        await this.click(resolveWithFallback(this.page, RegisterLocators.submitButton), 'Register');
      }
    });
  }

  submitButton() {
    return resolveWithFallback(this.page, RegisterLocators.submitButton);
  }

  async isSubmitEnabled(): Promise<boolean> {
    return await this.submitButton().isEnabled();
  }

  async clickSubmit(): Promise<void> {
    await this.click(this.submitButton(), 'Register');
  }

  async getSuccessText(): Promise<string> {
    return await this.getText(resolveWithFallback(this.page, RegisterLocators.successToast));
  }

  async getErrorText(): Promise<string> {
    return await this.getText(resolveWithFallback(this.page, RegisterLocators.errorToast));
  }
}
