import { Page, Locator } from '@playwright/test';

export type LocatorDef = { engine: 'css' | 'xpath' | 'role' | 'text' | 'label' | 'testid'; value: string; roleOptions?: any };

/** Substitute {{param}} placeholders in locator value */
export function interpolate(value: string, params?: Record<string, string | number>): string {
  if (!params) return value;
  return value.replace(/\{\{(\w+)\}\}/g, (_, k) => String(params[k] ?? ''));
}

/** Resolve a locator definition into a Playwright Locator */
export function resolve(page: Page, def: LocatorDef, params?: Record<string, string | number>): Locator {
  const v = interpolate(def.value, params);
  switch (def.engine) {
    case 'css': return page.locator(v);
    case 'xpath': return page.locator(`xpath=${v}`);
    case 'role': return page.getByRole(v as any, def.roleOptions);
    case 'text': return page.getByText(v, { exact: false });
    case 'label': return page.getByLabel(v);
    case 'testid': return page.getByTestId(v);
  }
}

/** Try multiple fallback locators until one resolves */
export function resolveWithFallback(page: Page, defs: LocatorDef[], params?: Record<string, string | number>): Locator {
  // Return first — POM uses .or() chain when needed
  const locators = defs.map(d => resolve(page, d, params));
  return locators.reduce((acc, l) => acc.or(l));
}
