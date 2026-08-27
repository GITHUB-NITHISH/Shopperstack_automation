import { Page, Locator } from '@playwright/test';

export class ToastComponent {
  readonly success: Locator;
  readonly error: Locator;

  constructor(private readonly page: Page) {
    this.success = page.locator('.MuiAlert-standardSuccess, .toast-success, [role="status"]').first();
    this.error   = page.locator('.MuiAlert-standardError, .toast-error, [role="alert"]').first();
  }

  async waitForSuccess(text?: string) {
    await this.success.waitFor({ state: 'visible', timeout: 10_000 });
    if (text) {
      const actual = await this.success.textContent();
      if (!actual?.includes(text)) throw new Error(`Toast mismatch. Expected "${text}", got "${actual}"`);
    }
  }
}
