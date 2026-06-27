import { z } from 'zod';

export const addCartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1),
});

export const mergeCartSchema = z.object({
  sessionId: z.string().min(1),
});
