import { LocatorDef } from './_helpers';

/**
 * Menu items exposed by the header "Account settings" avatar (role=menu):
 *   My Profile | Cart <n> | Wish List | My Orders | My Wallet | My Likes | Logout
 *
 * Corresponding routes:
 *   /user-profile  /cart  /wishlist  /orders  /wallet  /likes
 */
export const AccountLocators: Record<string, LocatorDef[]> = {
  profileMenuTrigger: [{ engine: 'role', value: 'button', roleOptions: { name: 'Account settings' } }],

  myProfileItem:      [{ engine: 'role', value: 'menuitem', roleOptions: { name: 'My Profile' } }],
  cartMenuItem:       [{ engine: 'role', value: 'menuitem', roleOptions: { name: /^Cart(\s+\d+)?$/ } }],
  wishListItem:       [{ engine: 'role', value: 'menuitem', roleOptions: { name: 'Wish List' } }],
  myOrdersItem:       [{ engine: 'role', value: 'menuitem', roleOptions: { name: 'My Orders' } }],
  myWalletItem:       [{ engine: 'role', value: 'menuitem', roleOptions: { name: 'My Wallet' } }],
  myLikesItem:        [{ engine: 'role', value: 'menuitem', roleOptions: { name: 'My Likes' } }],
  logoutItem:         [{ engine: 'role', value: 'menuitem', roleOptions: { name: 'Logout' } }],

  firstNameInput:     [{ engine: 'role', value: 'textbox', roleOptions: { name: /first name/i } }],
  lastNameInput:      [{ engine: 'role', value: 'textbox', roleOptions: { name: /last name/i } }],
  phoneInput:         [{ engine: 'role', value: 'textbox', roleOptions: { name: /phone number|mobile/i } }],
  dobInput:           [{ engine: 'role', value: 'textbox', roleOptions: { name: /date of birth|dob/i } }],
  saveProfileButton:  [{ engine: 'role', value: 'button', roleOptions: { name: /save|update/i } }],

  changePasswordLink: [{ engine: 'text', value: 'Change Password' }],
  oldPasswordInput:   [{ engine: 'role', value: 'textbox', roleOptions: { name: /old password|current password/i } }],
  newPasswordInput:   [{ engine: 'role', value: 'textbox', roleOptions: { name: /new password/i } }],

  successToast:       [{ engine: 'css', value: '.MuiAlert-standardSuccess, .toast-success' }],
  orderRow:           [{ engine: 'css', value: '.order-row, [data-testid="order-row"]' }],
};
