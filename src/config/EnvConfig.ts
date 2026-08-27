import { z } from 'zod';
import * as path from 'path';
import * as dotenv from 'dotenv';

const env = process.env.TEST_ENV || 'qa';
dotenv.config({ path: path.resolve(__dirname, `../../config/env/.env.${env}`) });

const EnvSchema = z.object({
  BASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
  CUSTOMER_EMAIL: z.string().email(),
  CUSTOMER_PASSWORD: z.string().min(4),
  LOG_LEVEL: z.string().default('info'),
  TEST_ENV: z.string().default('qa'),
});

export type AppEnv = z.infer<typeof EnvSchema>;

export const ENV: AppEnv = EnvSchema.parse({
  BASE_URL: process.env.BASE_URL,
  API_BASE_URL: process.env.API_BASE_URL,
  CUSTOMER_EMAIL: process.env.CUSTOMER_EMAIL,
  CUSTOMER_PASSWORD: process.env.CUSTOMER_PASSWORD,
  LOG_LEVEL: process.env.LOG_LEVEL,
  TEST_ENV: process.env.TEST_ENV,
});
