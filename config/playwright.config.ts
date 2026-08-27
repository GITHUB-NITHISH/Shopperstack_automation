import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import * as dotenv from 'dotenv';

const env = process.env.TEST_ENV || 'qa';
dotenv.config({ path: path.resolve(__dirname, `env/.env.${env}`) });

export default defineConfig({
  testDir: '../tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 4 : 2,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: '../reports/html', open: 'never' }],
    ['junit', { outputFile: '../reports/junit/results.xml' }],
    ['allure-playwright', { outputFolder: '../reports/allure-results', detail: true, suiteTitle: true }],
  ],
  outputDir: '../test-results',
  use: {
    baseURL: process.env.BASE_URL || 'https://www.shoppersstack.com',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    ignoreHTTPSErrors: true,
    viewport: { width: 1440, height: 900 },
    locale: 'en-IN',
    timezoneId: 'Asia/Kolkata',
  },
  projects: [
    {
      name: 'setup:ui',
      testDir: '../auth/setup',
      testMatch: /customer\.auth\.setup\.ts/,
    },
    {
      name: 'setup:api',
      testDir: '../auth/setup',
      testMatch: /api\.token\.setup\.ts/,
    },
    {
      name: 'ui',
      testDir: '../tests/ui',
      dependencies: ['setup:ui'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.resolve(__dirname, '../auth/storage/customer.storageState.json'),
      },
    },
    {
      name: 'api',
      testDir: '../tests/api',
      dependencies: ['setup:api'],
      use: {
        baseURL: process.env.API_BASE_URL || 'https://www.shoppersstack.com',
      },
    },
  ],
});
