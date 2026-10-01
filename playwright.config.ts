import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import * as dotenv from 'dotenv';

const env = process.env.TEST_ENV || 'qa';
dotenv.config({ path: path.resolve(__dirname, `config/env/.env.${env}`) });

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 4 : 1,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
    ['allure-playwright', { outputFolder: 'reports/allure-results', detail: true, suiteTitle: true }],
  ],
  outputDir: 'test-results',
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
    headless : false
  },
  projects: [
    {
      name: 'setup:ui',
      testDir: './auth/setup',
      testMatch: /customer\.auth\.setup\.ts/,
    },
    {
      name: 'setup:api',
      testDir: './auth/setup',
      testMatch: /api\.token\.setup\.ts/,
    },
    {
      // Auth flows (login / register) run as guests — no setup, no storageState.
      name: 'ui-auth',
      testDir: './tests/ui/auth',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        headless: false,
        // storageState: { cookies: [], origins: [] },
      },
    },
    {
      name: 'ui',
      testDir: './tests/ui',
      testIgnore: /auth\//,
      dependencies: ['setup:ui'],
      use: {
        ...devices['Desktop Chrome'],
        headless : false,
        storageState: path.resolve(__dirname, 'auth/storage/customer.storageState.json'),
      },
    },
    {
      // Auth API tests (login/register) run as guests — no token, no setup.
      name: 'api-auth',
      testDir: './tests/api/auth',
      use: {
        baseURL: process.env.API_BASE_URL || 'https://www.shoppersstack.com',
      },
    },
    {
      // Authenticated API tests (cart / order / customer / product) need a token.
      name: 'api',
      testDir: './tests/api',
      testIgnore: /auth\//,
      dependencies: ['setup:api'],
      use: {
        baseURL: process.env.API_BASE_URL || 'https://www.shoppersstack.com',
      },
    },
  ],
});
