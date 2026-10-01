import {z} from 'zod';

export const ReviewSchema = z.object({
  reviewId: z.number(),
  shopperId: z.number(),
  // Reviewer name / heading / description can be null for legacy or moderated reviews.
  shopperName: z.string().nullable(),
  heading: z.string().nullable(),
  description: z.string().nullable(),
  rating: z.number(),
  // Server sends local timestamps without trailing "Z" (e.g. 2024-08-01T14:22:11.123)
  dateTime: z.iso.datetime({ local: true }),
}).strict();

export const ProductSchema = z.object({
  productId: z.number(),
  name: z.string(),
  title: z.string(),
  description: z.string(),
  rating: z.number(),
  price: z.number(),
  offer: z.number(),
  type: z.string(),
  brand: z.string(),
  category: z.string(),
  merchantId: z.number(),
  quantity: z.number(),
  status: z.enum([
    'ACTIVE',
    'INACTIVE',
    'BLOCKED'
  ]),
  // Some products return a relative path instead of a full URL — accept both.
  thumbnailURL: z.string().url().or(z.string()),
  productImageURLs: z.array(
    z.string().url().or(z.string())
  ),
  searchTags: z.array(z.string()),
  // API returns null when a product has no reviews yet.
  reviews: z.array(ReviewSchema).nullable(),
  // A small number of legacy products have a null createdDateTime.
  createdDateTime: z.iso.datetime({ local: true }).nullable(),
  zoneId: z.string(),
}).strict();

export const GetProductsSchema = z.object({
  statusCode: z.literal(200),
  // ShoppersStack returns "Success" (not "OK") for /shopping/products.
  message: z.literal('Success'),
  data: z.array(ProductSchema),
}).strict();

export const CartItemSchema = z.object({
  itemId: z.number(),
  productId: z.number(),
  quantity: z.number().positive(),
  productName: z.string(),
  imageLink: z.string(),
  price: z.number(),
  productLink: z.string(),
}).strict();

export const GetCartSchema = z.object({
  statusCode: z.literal(200),
  message: z.literal('Success'),
  data: z.array(CartItemSchema),
}).strict();



