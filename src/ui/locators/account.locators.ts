import { LocatorDef } from './_helpers';

export const AccountLocators: Record<string, LocatorDef[]> = {
  profileMenuTrigger: [{ engine: 'css', value: '[data-testid="user-menu"], .user-profile' }],
  myProfileLink:      [{ engine: 'text', value: 'My Profile' }],
  myOrdersLink:       [{ engine: 'text', value: 'My Orders' }],
  addressesLink:      [{ engine: 'text', value: 'Addresses' }],
  changePasswordLink: [{ engine: 'text', value: 'Change Password' }],
  logoutLink:         [{ engine: 'text', value: 'Logout' }],
  firstNameInput:     [{ engine: 'css', value: 'input[name="firstName"]' }],
  lastNameInput:      [{ engine: 'css', value: 'input[name="lastName"]' }],
  phoneInput:         [{ engine: 'css', value: 'input[name="phoneNumber"]' }],
  saveProfileButton:  [{ engine: 'role', value: 'button', roleOptions: { name: /save|update/i } }],
  oldPasswordInput:   [{ engine: 'css', value: 'input[name="oldPassword"]' }],
  newPasswordInput:   [{ engine: 'css', value: 'input[name="newPassword"]' }],
  successToast:       [{ engine: 'css', value: '.MuiAlert-standardSuccess, .toast-success' }],
  orderRow:           [{ engine: 'css', value: '.order-row, [data-testid="order-row"]' }],
};
