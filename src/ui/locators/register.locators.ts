import { LocatorDef } from './_helpers';

/**
 * Signup routes on ShoppersStack:
 *   Shopper  -> /customer-signup
 *   Merchant -> reached via /urlhelper ("Create Shopper/ Merchant" footer link)
 *   Admin    -> /admin-signup  ("Create Admin Account" footer link)
 */
export const RegisterLocators: Record<string, LocatorDef[]> = {
  firstNameInput:       [{ engine: 'role', value: 'textbox', roleOptions: { name: /first name/i } }],
  lastNameInput:        [{ engine: 'role', value: 'textbox', roleOptions: { name: /last name/i } }],
  emailInput:           [{ engine: 'role', value: 'textbox', roleOptions: { name: /^email( address)?$/i } }],
  phoneInput:           [{ engine: 'role', value: 'textbox', roleOptions: { name: /phone number|mobile/i } }],
  passwordInput:        [{ engine: 'role', value: 'textbox', roleOptions: { name: /^password$/i } }],
  confirmPasswordInput: [{ engine: 'role', value: 'textbox', roleOptions: { name: /confirm password/i } }],
  genderMaleRadio:      [{ engine: 'role', value: 'radio', roleOptions: { name: /^male$/i } }],
  genderFemaleRadio:    [{ engine: 'role', value: 'radio', roleOptions: { name: /^female$/i } }],
  genderOtherRadio:     [{ engine: 'role', value: 'radio', roleOptions: { name: /^other$/i } }],
  genderSelect:         [{ engine: 'role', value: 'combobox', roleOptions: { name: /gender/i } }],
  dobInput:             [{ engine: 'role', value: 'textbox', roleOptions: { name: /date of birth|dob/i } }],
  countrySelect:        [{ engine: 'css', value: 'select#Country' }],
  stateSelect:          [{ engine: 'css', value: 'select#State' }],
  citySelect:           [{ engine: 'css', value: 'select#City' }],
  agreeCheckbox:        [{ engine: 'css', value: 'input[type="checkbox"]' }],
  submitButton:         [{ engine: 'role', value: 'button', roleOptions: { name: 'Register' } }],
  successToast:         [{ engine: 'css', value: '.Toastify__toast--success' }],
  errorToast:           [{ engine: 'css', value: '.MuiAlert-standardError, [role="alert"]' }],

  createAdminLink:      [{ engine: 'role', value: 'link', roleOptions: { name: 'Create Admin Account' } }],
  createShopperMerchantHelper: [{ engine: 'role', value: 'link', roleOptions: { name: 'Create Shopper/ Merchant' } }],
};
