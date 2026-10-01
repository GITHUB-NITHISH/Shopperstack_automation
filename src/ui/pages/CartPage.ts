import { Page, test } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { resolveWithFallback } from '@locators/_helpers';
import { CartLocators } from '@locators/cart.locators';

/**
 * ShoppersStack Cart page (/cart).
 *
 * Extracts the four "price details" values from the right-hand panel and drives
 * the [Buy Now] / [Continue Shopping] actions.
 */
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
      await this.click(resolveWithFallback(this.page, CartLocators.removeButton).first(), 'remove');
    });
  }

  async increaseQtyOfFirstItem(): Promise<void> {
    await this.click(resolveWithFallback(this.page, CartLocators.qtyPlus).first(), 'Qty +');
  }

  async decreaseQtyOfFirstItem(): Promise<void> {
    await this.click(resolveWithFallback(this.page, CartLocators.qtyMinus).first(), 'Qty -');
  }

  // ---- Price-details panel ---------------------------------------------------

  async getActualPriceText(): Promise<string>    { return this.getText(resolveWithFallback(this.page, CartLocators.actualPriceHeading)); }
  async getDiscountPriceText(): Promise<string>  { return this.getText(resolveWithFallback(this.page, CartLocators.discountPriceHeading)); }
  async getDeliveryChargesText(): Promise<string>{ return this.getText(resolveWithFallback(this.page, CartLocators.deliveryChargesHeading)); }
  async getTotalPriceText(): Promise<string>     { return this.getText(resolveWithFallback(this.page, CartLocators.totalPriceHeading)); }

  /** Parses the trailing '₹<amount>' from a heading like 'Total Price ₹1234'. */
  static parseAmount(text: string): number {
    const m = text.match(/₹\s*([0-9,]+)/);
    return m ? Number(m[1].replace(/,/g, '')) : NaN;
  }

  async clickBuyNow(): Promise<void> {
    await test.step('Click Buy Now', async () => {
      await this.click(resolveWithFallback(this.page, CartLocators.buyNowButton), 'Buy Now');
    });
  }

  async clickContinueShopping(): Promise<void> {
    await test.step('Click Continue Shopping', async () => {
      await this.click(resolveWithFallback(this.page, CartLocators.continueShoppingBtn), 'Continue Shopping');
    });
  }

  // Legacy alias so existing tests keep compiling.
  async proceedToCheckout(): Promise<void> { await this.clickBuyNow(); }
  async getSubtotal(): Promise<string> { return this.getTotalPriceText(); }

  async isEmpty(): Promise<boolean> {
    return await this.isVisible(resolveWithFallback(this.page, CartLocators.emptyCartMsg));
  }
}
