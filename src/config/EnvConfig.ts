import { z } from 'zod';
import * as path from 'path';
import * as dotenv from 'dotenv';

const env = process.env.TEST_ENV || 'qa';
dotenv.config({ path: path.resolve(__dirname, `../../config/env/.env.${env}`) });

const EnvSchema = z.object({
  BASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
  // Shopper (customer) creds — mandatory
  CUSTOMER_EMAIL: z.string().email(),
  CUSTOMER_PASSWORD: z.string().min(4),
  // Optional merchant / admin creds for role-specific tests
  MERCHANT_EMAIL: z.string().email().optional(),
  MERCHANT_PASSWORD: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  LOG_LEVEL: z.string().default('info'),
  TEST_ENV: z.string().default('qa'),
});

export type AppEnv = z.infer<typeof EnvSchema>;

export const ENV: AppEnv = EnvSchema.parse({
  BASE_URL: process.env.BASE_URL,
  API_BASE_URL: process.env.API_BASE_URL,
  CUSTOMER_EMAIL: process.env.CUSTOMER_EMAIL,
  CUSTOMER_PASSWORD: process.env.CUSTOMER_PASSWORD,
  MERCHANT_EMAIL: process.env.MERCHANT_EMAIL,
  MERCHANT_PASSWORD: process.env.MERCHANT_PASSWORD,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  LOG_LEVEL: process.env.LOG_LEVEL,
  TEST_ENV: process.env.TEST_ENV,
});
