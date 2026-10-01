import { LocatorDef } from './_helpers';

/**
 * Login page = https://www.shoppersstack.com/user-signin
 * Vertical tablist with 3 tabs: "Shopper Login", "Merchant Login", "Admin Login".
 * Each tab-panel exposes the same textboxes ("Email", "Password") and buttons.
 */
export const LoginLocators: Record<string, LocatorDef[]> = {
  headerLoginButton:   [{ engine: 'role', value: 'button', roleOptions: { name: 'Login', exact: true } }],

  shopperTab:          [{ engine: 'role', value: 'tab', roleOptions: { name: 'Shopper Login' } }],
  merchantTab:         [{ engine: 'role', value: 'tab', roleOptions: { name: 'Merchant Login' } }],
  adminTab:            [{ engine: 'role', value: 'tab', roleOptions: { name: 'Admin Login' } }],

  emailInput:          [{ engine: 'role', value: 'textbox', roleOptions: { name: 'Email' } }],
  passwordInput:       [{ engine: 'role', value: 'textbox', roleOptions: { name: 'Password' } }],
  togglePasswordBtn:   [{ engine: 'role', value: 'button', roleOptions: { name: 'toggle password visibility' } }],
  submitButton:        [{ engine: 'role', value: 'button', roleOptions: { name: 'Login', exact: true } }],
  createAccountButton: [{ engine: 'role', value: 'button', roleOptions: { name: 'Create Account' } }],
  forgotPasswordLink:  [{ engine: 'text', value: 'Forgot Password?' }],

  shopperHeading:      [{ engine: 'role', value: 'heading', roleOptions: { name: 'Shopper Login' } }],
  merchantHeading:     [{ engine: 'role', value: 'heading', roleOptions: { name: 'Merchant Login' } }],
  adminHeading:        [{ engine: 'role', value: 'heading', roleOptions: { name: 'Admin Login' } }],

  errorToast: [{engine: 'css',value: '[role="alert"].Toastify__toast-body'}],
  loggedInIndicator:   [{ engine: 'role', value: 'button', roleOptions: { name: 'Account settings' } }],
};
