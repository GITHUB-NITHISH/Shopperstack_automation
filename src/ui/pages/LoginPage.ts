import { Page, test, expect } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { resolveWithFallback } from '@locators/_helpers';
import { LoginLocators } from '@locators/login.locators';
import { DashboardPage } from './DashboardPage';

export type UserRole = 'shopper' | 'merchant' | 'admin';

/**
 * ShoppersStack Login page (/user-signin).
 * The page has a vertical tablist — Shopper / Merchant / Admin — backed by the
 * same textboxes so we just switch the active tab before typing.
 */
export class LoginPage extends BasePage {
  constructor(page: Page) { super(page); }

  private get emailInput()          { return resolveWithFallback(this.page, LoginLocators.emailInput); }
  private get passwordInput()       { return resolveWithFallback(this.page, LoginLocators.passwordInput); }
  private get submitButton()        { return resolveWithFallback(this.page, LoginLocators.submitButton); }
  private get togglePasswordBtn()   { return resolveWithFallback(this.page, LoginLocators.togglePasswordBtn); }
  private get createAccountButton() { return resolveWithFallback(this.page, LoginLocators.createAccountButton); }
  private get forgotPasswordLink()  { return resolveWithFallback(this.page, LoginLocators.forgotPasswordLink); }
  private get errorToast()          { return resolveWithFallback(this.page, LoginLocators.errorToast); }
  private get loggedInIndicator()   { return resolveWithFallback(this.page, LoginLocators.loggedInIndicator); }

  /** Public accessor for the password field — used by visibility/mask tests. */
  passwordField() { return this.passwordInput; }

  private tab(role: UserRole) {
    const key = role === 'shopper' ? 'shopperTab' : role === 'merchant' ? 'merchantTab' : 'adminTab';
    return resolveWithFallback(this.page, LoginLocators[key]);
  }

  private heading(role: UserRole) {
    const key = role === 'shopper' ? 'shopperHeading' : role === 'merchant' ? 'merchantHeading' : 'adminHeading';
    return resolveWithFallback(this.page, LoginLocators[key]);
  }

  async open(): Promise<void> {
    await test.step('Open Login page', async () => {
      await this.goto('/user-signin');
    });
  }

  /** Click the vertical tab that scopes the form to Shopper / Merchant / Admin. */
  async selectRole(role: UserRole): Promise<void> {
    await test.step(`Select role: ${role}`, async () => {
      await this.click(this.tab(role), `${role} tab`);
    });
  }

  async fillPassword(value: string): Promise<void> {
    await this.fill(this.passwordInput, value, 'password');
  }

  /** Click the Login submit button without filling any fields. */
  async clickLogin(): Promise<void> {
    await this.click(this.submitButton, 'Login button');
  }

  async login(email: string, password: string, role: UserRole): Promise<void> {
    await test.step(`Login as ${role} ${email}`, async () => {
      await this.selectRole(role);
      await this.fill(this.emailInput, email, 'email');
      await this.fill(this.passwordInput, password, 'password');
      await this.click(this.submitButton, 'Login button');
    });
  }

  async togglePasswordVisibility(): Promise<void> {
    await test.step('Toggle password visibility', async () => {
      await this.click(this.togglePasswordBtn, 'toggle password');
    });
  }

  async clickCreateAccount(): Promise<void> {
    await test.step('Click Create Account', async () => {
      await this.click(this.createAccountButton, 'Create Account');
    });
  }

  async clickForgotPassword(): Promise<void> {
    await test.step('Click Forgot Password?', async () => {
      await this.click(this.forgotPasswordLink, 'Forgot Password?');
    });
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorToast);
  }

  /** After successful login the header exposes the "Account settings" avatar. */
  async isLoggedIn(): Promise<boolean> {
    return await this.isVisible(this.loggedInIndicator, 10_000);
  }

  // ─── High-level assertion helpers (keep specs POM-clean) ───────────────────

  /** Assert all three role tabs are visible on the sign-in page. */
  async expectAllRoleTabsVisible(): Promise<void> {
    await test.step('Assert Shopper / Merchant / Admin tabs visible', async () => {
      await expect(this.tab('shopper'),  'Shopper Login tab').toBeVisible();
      await expect(this.tab('merchant'), 'Merchant Login tab').toBeVisible();
      await expect(this.tab('admin'),    'Admin Login tab').toBeVisible();
    });
  }

  /** Assert the role-specific form renders (heading + inputs + submit). */
  async expectRoleFormVisible(role: UserRole): Promise<void> {
    await test.step(`Assert ${role} form visible`, async () => {
      await expect(this.heading(role),   `${role} heading`).toBeVisible();
      await expect(this.emailInput,      'email field').toBeVisible();
      await expect(this.passwordInput,   'password field').toBeVisible();
      await expect(this.submitButton,    'Login button').toBeVisible();
    });
  }

  /** Assert the Forgot Password link is visible. */
  async expectForgotPasswordVisible(): Promise<void> {
    await expect(this.forgotPasswordLink.first(), 'Forgot Password?').toBeVisible();
  }
}
