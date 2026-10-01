import { Page, test } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { resolveWithFallback } from '@locators/_helpers';
import { AccountLocators } from '@locators/account.locators';

export type AccountMenuItem =
  | 'My Profile' | 'Cart' | 'Wish List' | 'My Orders' | 'My Wallet' | 'My Likes' | 'Logout';

/**
 * Wraps the ShoppersStack "Account settings" menu (avatar in header) and the
 * individual pages it navigates to (/user-profile, /cart, /wishlist, /orders,
 * /wallet, /likes).
 */
export class AccountPage extends BasePage {
  constructor(page: Page) { super(page); }

  private async openMenu() {
    await this.click(resolveWithFallback(this.page, AccountLocators.profileMenuTrigger), 'Account settings');
  }

  async openMenuItem(item: AccountMenuItem): Promise<void> {
    await test.step(`Account menu → ${item}`, async () => {
      await this.openMenu();
      const key: Record<AccountMenuItem, keyof typeof AccountLocators> = {
        'My Profile': 'myProfileItem',
        'Cart':       'cartMenuItem',
        'Wish List':  'wishListItem',
        'My Orders':  'myOrdersItem',
        'My Wallet':  'myWalletItem',
        'My Likes':   'myLikesItem',
        'Logout':     'logoutItem',
      };
      await this.click(resolveWithFallback(this.page, AccountLocators[key[item]]), item);
    });
  }

  async openProfile()  { await this.openMenuItem('My Profile'); }
  async openMyOrders() { await this.openMenuItem('My Orders'); }
  async openWishList() { await this.openMenuItem('Wish List'); }
  async openMyWallet() { await this.openMenuItem('My Wallet'); }
  async openMyLikes()  { await this.openMenuItem('My Likes'); }
  async logout()       { await this.openMenuItem('Logout'); }

  async updateProfile(firstName: string, lastName: string, phone: string): Promise<void> {
    await test.step('Update profile', async () => {
      await this.fill(resolveWithFallback(this.page, AccountLocators.firstNameInput), firstName, 'first');
      await this.fill(resolveWithFallback(this.page, AccountLocators.lastNameInput), lastName, 'last');
      await this.fill(resolveWithFallback(this.page, AccountLocators.phoneInput), phone, 'phone');
      await this.click(resolveWithFallback(this.page, AccountLocators.saveProfileButton), 'Save');
    });
  }

  async changePassword(oldPass: string, newPass: string): Promise<void> {
    await test.step('Change password', async () => {
      await this.click(resolveWithFallback(this.page, AccountLocators.changePasswordLink), 'Change Password');
      await this.fill(resolveWithFallback(this.page, AccountLocators.oldPasswordInput), oldPass, 'old');
      await this.fill(resolveWithFallback(this.page, AccountLocators.newPasswordInput), newPass, 'new');
      await this.click(resolveWithFallback(this.page, AccountLocators.saveProfileButton), 'Save');
    });
  }

  async isSuccessToastVisible(): Promise<boolean> {
    return await this.isVisible(resolveWithFallback(this.page, AccountLocators.successToast));
  }

  async getOrderRowCount(): Promise<number> {
    return await resolveWithFallback(this.page, AccountLocators.orderRow).count();
  }
}
