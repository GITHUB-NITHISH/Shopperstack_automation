import { LocatorDef } from './_helpers';

export const RegisterLocators: Record<string, LocatorDef[]> = {
  registerNavLink: [{ engine: 'text', value: 'Register' }, { engine: 'text', value: 'Sign Up' }],
  firstNameInput:  [{ engine: 'css', value: 'input[name="firstName"], input[placeholder*="first" i]' }],
  lastNameInput:   [{ engine: 'css', value: 'input[name="lastName"], input[placeholder*="last" i]' }],
  emailInput:      [{ engine: 'css', value: 'input[type="email"], input[name="email"]' }],
  phoneInput:      [{ engine: 'css', value: 'input[name="phoneNumber"], input[name="phone"], input[type="tel"]' }],
  passwordInput:   [{ engine: 'css', value: 'input[name="password"]' }],
  confirmPasswordInput: [{ engine: 'css', value: 'input[name="confirmPassword"]' }],
  genderSelect:    [{ engine: 'css', value: 'select[name="gender"]' }],
  dobInput:        [{ engine: 'css', value: 'input[name="dateOfBirth"], input[type="date"]' }],
  agreeCheckbox:   [{ engine: 'css', value: 'input[type="checkbox"][name*="agree" i]' }],
  submitButton:    [{ engine: 'role', value: 'button', roleOptions: { name: /register|sign up|create account/i } }],
  successToast:    [{ engine: 'css', value: '.MuiAlert-standardSuccess, .toast-success' }],
  errorToast:      [{ engine: 'css', value: '.MuiAlert-standardError, [role="alert"]' }],
};
