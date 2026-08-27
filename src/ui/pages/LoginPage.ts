import { Page, test } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { resolveWithFallback } from '@locators/_helpers';
import { LoginLocators } from '@locators/login.locators';

export class LoginPage extends BasePage {
  constructor(page: Page) { super(page); }

  private get emailInput()    { return resolveWithFallback(this.page, LoginLocators.emailInput); }
  private get passwordInput() { return resolveWithFallback(this.page, LoginLocators.passwordInput); }
  private get submitButton()  { return resolveWithFallback(this.page, LoginLocators.submitButton); }
  private get loginNavLink()  { return resolveWithFallback(this.page, LoginLocators.loginNavLink); }
  private get errorToast()    { return resolveWithFallback(this.page, LoginLocators.errorToast); }
  private get loggedInIndicator() { return resolveWithFallback(this.page, LoginLocators.loggedInIndicator); }

  async open(): Promise<void> {
    await test.step('Open Login page', async () => {
      await this.goto('/login');
    });
  }

  async login(email: string, password: string): Promise<void> {
    await test.step(`Login as ${email}`, async () => {
      await this.fill(this.emailInput, email, 'email');
      await this.fill(this.passwordInput, password, 'password');
      await this.click(this.submitButton, 'Login button');
    });
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorToast);
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.isVisible(this.loggedInIndicator, 8_000);
  }
}
