import { z } from 'zod';

export const EnvelopeSchema = z.object({
  status: z.string(),
  message: z.string().optional(),
  data: z.unknown(),
  error: z.unknown().optional(),
});

export const LoginSchema = z.object({
  status: z.string(),
  message: z.string().optional(),
  data: z.object({
    token: z.string().min(10),
    customerId: z.number(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
  }).passthrough(),
});

export const ProductSchema = z.object({
  status: z.string(),
  data: z.object({
    productId: z.number(),
    name: z.string(),
    price: z.number(),
  }).passthrough(),
});

export const CartSchema = z.object({
  status: z.string(),
  data: z.object({
    cartId: z.number().optional(),
    items: z.array(z.object({ productId: z.number(), quantity: z.number() }).passthrough()),
    grandTotal: z.number().optional(),
  }).passthrough(),
});

export const OrderSchema = z.object({
  status: z.string(),
  data: z.object({
    orderId: z.string(),
    orderStatus: z.string(),
    grandTotal: z.number(),
  }).passthrough(),
});
