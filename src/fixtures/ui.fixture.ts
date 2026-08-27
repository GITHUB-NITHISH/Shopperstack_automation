import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { DashboardPage } from '@pages/DashboardPage';
import { ProductListingPage } from '@pages/ProductListingPage';
import { ProductDetailPage } from '@pages/ProductDetailPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { AccountPage } from '@pages/AccountPage';
import { baseTest as base } from './base.fixture';

export type UiFixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  dashboardPage: DashboardPage;
  productListingPage: ProductListingPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  accountPage: AccountPage;
};

export const uiTest = base.extend<UiFixtures>({
  loginPage:          async ({ page }, use) => await use(new LoginPage(page)),
  registerPage:       async ({ page }, use) => await use(new RegisterPage(page)),
  dashboardPage:      async ({ page }, use) => await use(new DashboardPage(page)),
  productListingPage: async ({ page }, use) => await use(new ProductListingPage(page)),
  productDetailPage:  async ({ page }, use) => await use(new ProductDetailPage(page)),
  cartPage:           async ({ page }, use) => await use(new CartPage(page)),
  checkoutPage:       async ({ page }, use) => await use(new CheckoutPage(page)),
  accountPage:        async ({ page }, use) => await use(new AccountPage(page)),
});

export { expect } from '@playwright/test';
