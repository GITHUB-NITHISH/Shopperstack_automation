import { Page, test } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { resolveWithFallback } from '@locators/_helpers';
import { CheckoutLocators } from '@locators/checkout.locators';

export class CheckoutPage extends BasePage {
  constructor(page: Page) { super(page); }

  async selectFirstAddress(): Promise<void> {
    await test.step('Select first address', async () => {
      await resolveWithFallback(this.page, CheckoutLocators.addressRadio).first().check();
    });
  }

  async selectPaymentMethod(value: string): Promise<void> {
    await test.step(`Select payment method: ${value}`, async () => {
      await this.page.locator(`input[type="radio"][value="${value}"]`).check();
    });
  }

  async fillCardDetails(number: string, expiry: string, cvv: string): Promise<void> {
    await this.fill(resolveWithFallback(this.page, CheckoutLocators.cardNumberInput), number, 'card');
    await this.fill(resolveWithFallback(this.page, CheckoutLocators.cardExpiryInput), expiry, 'expiry');
    await this.fill(resolveWithFallback(this.page, CheckoutLocators.cardCvvInput), cvv, 'cvv');
  }

  async placeOrder(): Promise<void> {
    await test.step('Place Order', async () => {
      await this.click(resolveWithFallback(this.page, CheckoutLocators.placeOrderButton), 'Place Order');
    });
  }

  async isOrderConfirmed(): Promise<boolean> {
    return await this.isVisible(resolveWithFallback(this.page, CheckoutLocators.orderConfirmation), 15_000);
  }

  async getOrderId(): Promise<string> {
    return await this.getText(resolveWithFallback(this.page, CheckoutLocators.orderId));
  }
}
