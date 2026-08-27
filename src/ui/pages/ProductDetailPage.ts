import { Page, test } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { resolveWithFallback } from '@locators/_helpers';
import { ProductDetailLocators } from '@locators/productDetail.locators';

export class ProductDetailPage extends BasePage {
  constructor(page: Page) { super(page); }

  async getTitle(): Promise<string> {
    return await this.getText(resolveWithFallback(this.page, ProductDetailLocators.productTitle));
  }

  async getPrice(): Promise<string> {
    return await this.getText(resolveWithFallback(this.page, ProductDetailLocators.productPrice));
  }

  async selectSize(size: string): Promise<void> {
    await test.step(`Select size ${size}`, async () => {
      await this.page.getByText(size, { exact: true }).first().click();
    });
  }

  async setQuantity(qty: number): Promise<void> {
    await test.step(`Set qty ${qty}`, async () => {
      await this.fill(resolveWithFallback(this.page, ProductDetailLocators.quantityInput), String(qty), 'qty');
    });
  }

  async addToCart(): Promise<void> {
    await test.step('Add to Cart', async () => {
      await this.click(resolveWithFallback(this.page, ProductDetailLocators.addToCartButton), 'Add to Cart');
    });
  }

  async addToWishlist(): Promise<void> {
    await test.step('Add to Wishlist', async () => {
      await this.click(resolveWithFallback(this.page, ProductDetailLocators.addToWishlist), 'Wishlist');
    });
  }

  async buyNow(): Promise<void> {
    await test.step('Buy Now', async () => {
      await this.click(resolveWithFallback(this.page, ProductDetailLocators.buyNowButton), 'Buy Now');
    });
  }
}
