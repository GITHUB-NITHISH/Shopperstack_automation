import { Page, test } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { resolveWithFallback } from '@locators/_helpers';
import { AccountLocators } from '@locators/account.locators';

export class AccountPage extends BasePage {
  constructor(page: Page) { super(page); }

  async openProfile(): Promise<void> {
    await test.step('Open My Profile', async () => {
      await this.click(resolveWithFallback(this.page, AccountLocators.profileMenuTrigger), 'Profile menu');
      await this.click(resolveWithFallback(this.page, AccountLocators.myProfileLink), 'My Profile');
    });
  }

  async openMyOrders(): Promise<void> {
    await test.step('Open My Orders', async () => {
      await this.click(resolveWithFallback(this.page, AccountLocators.profileMenuTrigger), 'Profile menu');
      await this.click(resolveWithFallback(this.page, AccountLocators.myOrdersLink), 'My Orders');
    });
  }

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
