import { Page, Locator, expect } from '@playwright/test';
import { Timeouts } from '@core/constants/Timeouts';
import { logger } from '@utils/Logger';

/**
 * BasePage — enterprise wrapper around common Playwright actions with:
 *  - safe waits (visible + enabled)
 *  - retry-on-flake via expect.poll
 *  - structured logging
 *  - test.step for Allure trace
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(url: string): Promise<void> {
    logger.info({ url }, 'Navigating');
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: Timeouts.navigation });
  }

  async click(locator: Locator, description = 'element'): Promise<void> {
    logger.debug({ description }, 'Click');
    await expect(locator, `Expect ${description} visible`).toBeVisible({ timeout: Timeouts.medium });
    await locator.click();
  }

  async fill(locator: Locator, value: string, description = 'field'): Promise<void> {
    logger.debug({ description, value: value.replace(/./g, '*') }, 'Fill');
    await expect(locator, `Expect ${description} visible`).toBeVisible({ timeout: Timeouts.medium });
    await locator.fill(value);
  }

  async getText(locator: Locator): Promise<string> {
    await expect(locator).toBeVisible({ timeout: Timeouts.medium });
    return (await locator.textContent())?.trim() ?? '';
  }

  async isVisible(locator: Locator, timeout: number = Timeouts.short): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async waitForUrl(url: string | RegExp, timeout = Timeouts.navigation): Promise<void> {
    await this.page.waitForURL(url, { timeout });
  }

  /** Assert the current page URL matches `pattern`. Keeps specs `page`-free. */
  async expectUrl(pattern: string | RegExp, message?: string): Promise<void> {
    await expect(this.page, message).toHaveURL(pattern);
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  /** Retry an async assertion until it passes or times out */
  async assertEventually(fn: () => Promise<void>, timeout = Timeouts.long): Promise<void> {
    await expect.poll(async () => {
      try {
        await fn();
        return true;
      } catch {
        return false;
      }
    }, { timeout }).toBe(true);
  }
}
