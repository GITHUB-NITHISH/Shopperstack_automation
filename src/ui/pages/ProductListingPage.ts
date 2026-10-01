import { Page, test } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { resolveWithFallback } from '@locators/_helpers';
import { ProductListingLocators } from '@locators/productListing.locators';

export type ProductCategory = 'men' | 'women' | 'kids' | 'electronics' | 'beauty_products';

/**
 * Category listing pages (/men, /women, /kids, /electronics, /beauty_products).
 */
export class ProductListingPage extends BasePage {
  constructor(page: Page) { super(page); }

  async openCategory(category: ProductCategory): Promise<void> {
    await test.step(`Open /${category}`, async () => {
      await this.goto(`/${category}`);
    });
  }

  async getProductCount(): Promise<number> {
    return await resolveWithFallback(this.page, ProductListingLocators.productCard).count();
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
      await this.click(btn, 'add to cart');
    });
  }

  async goToNextPage(): Promise<void> {
    await test.step('Pagination → next', async () => {
      await this.click(resolveWithFallback(this.page, ProductListingLocators.paginationNext), 'next');
    });
  }

  async goToPage(page: number): Promise<void> {
    await test.step(`Pagination → page ${page}`, async () => {
      await this.click(resolveWithFallback(this.page, ProductListingLocators.paginationPage, { page }), `page ${page}`);
    });
  }

  async goToLastPage(): Promise<void> {
    await this.click(resolveWithFallback(this.page, ProductListingLocators.paginationLast), 'last');
  }

  async isNoResultsShown(): Promise<boolean> {
    return await this.isVisible(resolveWithFallback(this.page, ProductListingLocators.noResults));
  }

  // Legacy shims
  async selectSort(value: string) {
    await resolveWithFallback(this.page, ProductListingLocators.sortDropdown).selectOption(value);
  }
  async filterByPrice(min: number, max: number) {
    await this.fill(resolveWithFallback(this.page, ProductListingLocators.filterPriceMin), String(min), 'minPrice');
    await this.fill(resolveWithFallback(this.page, ProductListingLocators.filterPriceMax), String(max), 'maxPrice');
  }
}
