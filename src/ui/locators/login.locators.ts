import { LocatorDef } from './_helpers';

export const LoginLocators: Record<string, LocatorDef[]> = {
  loginNavLink:  [{ engine: 'role', value: 'link', roleOptions: { name: /login/i } }, { engine: 'text', value: 'Login' }],
  emailInput:    [{ engine: 'css', value: 'input[type="email"], input[name="email"], input[placeholder*="mail" i]' }],
  passwordInput: [{ engine: 'css', value: 'input[type="password"], input[name="password"]' }],
  submitButton:  [{ engine: 'role', value: 'button', roleOptions: { name: /login|sign in/i } }, { engine: 'css', value: 'button[type="submit"]' }],
  forgotLink:    [{ engine: 'text', value: 'Forgot Password' }],
  registerLink:  [{ engine: 'text', value: 'Register' }, { engine: 'text', value: 'Sign Up' }],
  errorToast:    [{ engine: 'css', value: '.MuiAlert-message, .toast-error, [role="alert"]' }],
  loggedInIndicator: [{ engine: 'css', value: '[data-testid="user-menu"], .user-profile, .account-menu' }],
};
