import { Page, test } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { resolveWithFallback } from '@locators/_helpers';
import { RegisterLocators } from '@locators/register.locators';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export class RegisterPage extends BasePage {
  constructor(page: Page) { super(page); }

  async open(): Promise<void> {
    await test.step('Open Register page', async () => {
      await this.goto('/signup');
    });
  }

  async register(u: RegisterPayload): Promise<void> {
    await test.step(`Register user ${u.email}`, async () => {
      await this.fill(resolveWithFallback(this.page, RegisterLocators.firstNameInput), u.firstName, 'firstName');
      await this.fill(resolveWithFallback(this.page, RegisterLocators.lastNameInput),  u.lastName, 'lastName');
      await this.fill(resolveWithFallback(this.page, RegisterLocators.emailInput),     u.email, 'email');
      await this.fill(resolveWithFallback(this.page, RegisterLocators.phoneInput),     u.phoneNumber, 'phone');
      await this.fill(resolveWithFallback(this.page, RegisterLocators.passwordInput),  u.password, 'password');
      await this.fill(resolveWithFallback(this.page, RegisterLocators.confirmPasswordInput), u.confirmPassword, 'confirm');
      await this.click(resolveWithFallback(this.page, RegisterLocators.submitButton), 'Register');
    });
  }

  async getSuccessText(): Promise<string> {
    return await this.getText(resolveWithFallback(this.page, RegisterLocators.successToast));
  }

  async getErrorText(): Promise<string> {
    return await this.getText(resolveWithFallback(this.page, RegisterLocators.errorToast));
  }
}
