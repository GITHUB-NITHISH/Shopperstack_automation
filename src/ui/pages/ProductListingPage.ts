import { Page, test } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { resolveWithFallback } from '@locators/_helpers';
import { ProductListingLocators } from '@locators/productListing.locators';

export class ProductListingPage extends BasePage {
  constructor(page: Page) { super(page); }

  async selectSort(value: string): Promise<void> {
    await test.step(`Sort: ${value}`, async () => {
      await resolveWithFallback(this.page, ProductListingLocators.sortDropdown).selectOption(value);
    });
  }

  async filterByPrice(min: number, max: number): Promise<void> {
    await test.step(`Filter price ${min}-${max}`, async () => {
      await this.fill(resolveWithFallback(this.page, ProductListingLocators.filterPriceMin), String(min), 'minPrice');
      await this.fill(resolveWithFallback(this.page, ProductListingLocators.filterPriceMax), String(max), 'maxPrice');
    });
  }

  async openProductByIndex(index: number): Promise<void> {
    await test.step(`Open product #${index}`, async () => {
      const cards = resolveWithFallback(this.page, ProductListingLocators.productCard);
      await cards.nth(index).click();
    });
  }

  async addProductToCartByIndex(index: number): Promise<void> {
    await test.step(`Add product #${index} to cart`, async () => {
      const btn = resolveWithFallback(this.page, ProductListingLocators.addToCartButton).nth(index);
      await this.click(btn, 'Add to Cart');
    });
  }

  async getProductCount(): Promise<number> {
    return await resolveWithFallback(this.page, ProductListingLocators.productCard).count();
  }

  async isNoResultsShown(): Promise<boolean> {
    return await this.isVisible(resolveWithFallback(this.page, ProductListingLocators.noResults));
  }
}
