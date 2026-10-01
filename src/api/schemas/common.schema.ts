import { z } from 'zod';

/** Generic ShoppersStack envelope: { statusCode, message, data } */
export const EnvelopeSchema = z.object({
  statusCode: z.number(),
  message:    z.string(),
  data:       z.unknown(),
});

/** Successful login: data holds a jwtToken and shopper snapshot. */
export const LoginSuccessSchema = z.object({
  statusCode: z.literal(200),
  message:    z.literal('OK'),  
  data: z.object({
    userId: z.number(),
    email: z.string().email(),
    role: z.enum(['SHOPPER','MERCHANT','ADMIN']),
    status: z.enum(['ACTIVE','INACTIVE','BLOCKED']),
    createdDateTime: z.null(),
    firstName: z.string(),
    lastName: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    zoneId: z.string(),
    imageId: z.null(),
    jwtToken:  z.string().min(20),
  }).strict(),
}).strict();

/** Successful shopper registration echoes the created profile in `data`. */
const RegistrationDataSchema = z.object({
  userId: z.number(),
  email: z.string().email(),
  status: z.literal('ACTIVE'),
  createdDateTime: z.null(),
  firstName: z.string(),
  lastName: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zoneId: z.string(),
  imageId: z.null(),
  jwtToken: z.null(),
});

export const ShopperRegistrationSuccessSchema = z.object({
  statusCode: z.literal(201),
  message: z.literal('Created'),

  data: RegistrationDataSchema.extend({
    role: z.literal('SHOPPER'),
  }).strict(),
}).strict();

export const AdminRegistrationSuccessSchema = z.object({
  statusCode: z.literal(201),
  message: z.literal('Created'),

  data: RegistrationDataSchema.extend({
    role: z.literal('ADMIN'),
  }).strict(),
}).strict();

/** Legacy schema kept for existing callers that referenced LoginSchema. */
export const LoginSchema = LoginSuccessSchema;

export const ProductSchema = z.object({
  statusCode: z.number(),
  data: z.object({
    productId: z.number(),
    name: z.string(),
    price: z.number(),
  }).passthrough(),
});

export const CartSchema = z.object({
  statusCode: z.number(),
  data: z.array(z.object({ productId: z.number(), quantity: z.number() }).passthrough()),
});

export const OrderSchema = z.object({
  statusCode: z.number(),
  data: z.unknown(),
});

