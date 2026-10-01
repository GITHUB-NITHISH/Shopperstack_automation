import { uiTest as test, expect } from '@fixtures/ui.fixture';
import loginData from '@data/testdata/ui/login.data.json';
import profileData from '@data/testdata/ui/profile.data.json';
import { DataGenerator } from '@utils/DataGenerator';

/**
 * Profile tests use the customer storageState created by the `setup:ui` project,
 * so they belong to the `ui` project (not `ui-auth`).
 */
test.describe('@ui @profile My Profile – ShoppersStack', () => {
  test.beforeEach(async ({ accountPage }) => {
    await accountPage.openProfile();
  });

  test('TC-P1 @smoke Profile page displays logged-in user\'s stored email', async ({ page }) => {
    await expect(page).toHaveURL(/user-profile/);
    // The seeded email should be shown somewhere on the page (input or text)
    const email = loginData.valid.email;
    const emailEl = page.getByText(email, { exact: false }).first();
    await expect(emailEl).toBeVisible({ timeout: 10_000 });
  });

  test('TC-P2 @regression Update first & last name persists after page reload', async ({ page, accountPage }) => {
    const newFirst = DataGenerator.randomUser().firstName;
    const newLast  = DataGenerator.randomUser().lastName;

    await accountPage.updateProfile(newFirst, newLast, loginData.valid.email /* phone slot unused when readonly */);
    await page.reload();

    const first = page.getByRole('textbox', { name: /first name/i });
    const last  = page.getByRole('textbox', { name: /last name/i });
    await expect(first).toHaveValue(newFirst);
    await expect(last).toHaveValue(newLast);
  });

  test('TC-P3 @regression Update phone number with valid 10-digit value is accepted', async ({ page, accountPage }) => {
    const newPhone = profileData.updateProfile.phone;
    const firstEl = page.getByRole('textbox', { name: /first name/i });
    const lastEl  = page.getByRole('textbox', { name: /last name/i });
    const currentFirst = await firstEl.inputValue().catch(() => 'User');
    const currentLast  = await lastEl.inputValue().catch(() => 'Test');

    await accountPage.updateProfile(currentFirst, currentLast, newPhone);
    await expect
      .poll(async () => await accountPage.isSuccessToastVisible().catch(() => false), { timeout: 10_000 })
      .toBeTruthy();
  });

  test('TC-P4 @regression Update phone with invalid (<10 digits) value is blocked', async ({ page, accountPage }) => {
    const firstEl = page.getByRole('textbox', { name: /first name/i });
    const lastEl  = page.getByRole('textbox', { name: /last name/i });
    const currentFirst = await firstEl.inputValue().catch(() => 'User');
    const currentLast  = await lastEl.inputValue().catch(() => 'Test');

    await accountPage.updateProfile(currentFirst, currentLast, profileData.invalidPhone);
    // Must stay on the profile page (no navigation) and no success toast
    await expect(page).toHaveURL(/user-profile/);
    const toastShown = await accountPage.isSuccessToastVisible().catch(() => false);
    expect(toastShown).toBeFalsy();
  });
});
