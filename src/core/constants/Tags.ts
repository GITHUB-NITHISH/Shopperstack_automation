/**
 * Central Playwright test tags. Compose them into test titles so:
 *   - CI can filter by tag (`--grep @smoke`, `--grep-invert @slow`)
 *   - Renaming a tag is a one-line change
 *   - Typos in tags fail the build (referenced as constants, not strings)
 */
export const Tags = {
  // Scope
  ui:          '@ui',
  api:         '@api',
  // Suite
  smoke:       '@smoke',
  regression:  '@regression',
  performance: '@performance',
  // Feature areas
  auth:        '@auth',
  dashboard:   '@dashboard',
  cart:        '@cart',
  checkout:    '@checkout',
  orders:      '@orders',
} as const;

export type Tag = typeof Tags[keyof typeof Tags];
