import { Page, test } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { resolveWithFallback } from '@locators/_helpers';
import { CartLocators } from '@locators/cart.locators';

export class CartPage extends BasePage {
  constructor(page: Page) { super(page); }

  async open(): Promise<void> {
    await test.step('Open Cart', async () => {
      await this.goto('/cart');
    });
  }

  async getItemCount(): Promise<number> {
    return await resolveWithFallback(this.page, CartLocators.cartItem).count();
  }

  async removeFirstItem(): Promise<void> {
    await test.step('Remove first cart item', async () => {
      await this.click(resolveWithFallback(this.page, CartLocators.removeButton).first(), 'Remove');
    });
  }

  async increaseQtyOfFirstItem(): Promise<void> {
    await this.click(resolveWithFallback(this.page, CartLocators.qtyPlus).first(), 'Qty +');
  }

  async decreaseQtyOfFirstItem(): Promise<void> {
    await this.click(resolveWithFallback(this.page, CartLocators.qtyMinus).first(), 'Qty -');
  }

  async applyCoupon(code: string): Promise<void> {
    await test.step(`Apply coupon ${code}`, async () => {
      await this.fill(resolveWithFallback(this.page, CartLocators.couponInput), code, 'coupon');
      await this.click(resolveWithFallback(this.page, CartLocators.applyCouponBtn), 'Apply');
    });
  }

  async getSubtotal(): Promise<string> {
    return await this.getText(resolveWithFallback(this.page, CartLocators.subtotal));
  }

  async proceedToCheckout(): Promise<void> {
    await test.step('Proceed to Checkout', async () => {
      await this.click(resolveWithFallback(this.page, CartLocators.checkoutButton), 'Checkout');
    });
  }

  async isEmpty(): Promise<boolean> {
    return await this.isVisible(resolveWithFallback(this.page, CartLocators.emptyCartMsg));
  }
}
