import { uiTest as test, expect } from '@fixtures/ui.fixture';
import loginData from '@data/testdata/ui/login.data.json';

// Login runs unauthenticated — clear the storage state
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('@ui @auth Login', () => {
  test('TC01 @smoke Login with valid credentials', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(loginData.valid.email, loginData.valid.password);
    expect(await loginPage.isLoggedIn()).toBeTruthy();
  });

  test('TC02 @regression Login with invalid password shows error', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(loginData.invalidPassword.email, loginData.invalidPassword.password);
    const err = await loginPage.getErrorMessage();
    expect(err.length).toBeGreaterThan(0);
  });

  test('TC03 @regression Login with unknown email shows error', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(loginData.unknownEmail.email, loginData.unknownEmail.password);
    expect(await loginPage.getErrorMessage()).not.toBe('');
  });

  test('TC04 @regression Login with invalid email format blocks submit', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.login(loginData.invalidEmailFormat.email, loginData.invalidEmailFormat.password);
    // Native email validation or app error
    expect(page.url()).toContain('login');
  });

  test('TC05 @regression Login with empty fields blocks submit', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.login('', '');
    expect(page.url()).toContain('login');
  });

  test('TC06 @regression Password field masks input', async ({ loginPage, page }) => {
    await loginPage.open();
    const pw = page.locator('input[type="password"]').first();
    await pw.fill('Secret@123');
    await expect(pw).toHaveAttribute('type', 'password');
  });

  test('TC07 @regression Forgot Password link is present', async ({ loginPage, page }) => {
    await loginPage.open();
    await expect(page.getByText(/forgot password/i).first()).toBeVisible();
  });

  test('TC08 @regression Register link navigates to signup', async ({ loginPage, page }) => {
    await loginPage.open();
    await page.getByText(/register|sign up/i).first().click();
    await expect(page).toHaveURL(/signup|register/i);
  });
});
