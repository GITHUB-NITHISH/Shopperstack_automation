import { test as base } from '@playwright/test';
import { logger } from '@utils/Logger';
import { ENV } from '@config/EnvConfig';

/**
 * Base fixture — injects logger, env & auto-logs test lifecycle
 */
export type BaseFixtures = {
  env: typeof ENV;
  log: typeof logger;
};

export const baseTest = base.extend<BaseFixtures>({
  env: async ({}, use) => { await use(ENV); },
  log: async ({}, use, testInfo) => {
    logger.info({ test: testInfo.title }, 'Test started');
    await use(logger);
    logger.info({ test: testInfo.title, status: testInfo.status }, 'Test finished');
  },
});

export { expect } from '@playwright/test';
