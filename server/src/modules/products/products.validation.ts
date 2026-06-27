import { z } from 'zod';
import { badgeFromApi } from '../../lib/serialize.js';

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z
    .enum(['price_asc', 'price_desc', 'newest', 'rating'])
    .default('newest'),
});

export const adminListProductsQuerySchema = listProductsQuerySchema.extend({
  includeInactive: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
  lowStock: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
});

export const createProductSchema = z.object({
  slug: z.string().trim().min(2).max(200),
  name: z.string().trim().min(2).max(300),
  categoryId: z.string().min(1),
  subcategory: z.string().trim().max(200).optional(),
  description: z.string().trim().min(1),
  shortDescription: z.string().trim().max(500).optional(),
  price: z.coerce.number().positive(),
  oldPrice: z.coerce.number().positive().nullable().optional(),
  rating: z.coerce.number().min(0).max(5).default(0),
  reviewCount: z.coerce.number().int().min(0).default(0),
  stock: z.coerce.number().int().min(0).default(0),
  images: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  specifications: z.record(z.string()).default({}),
  badge: z.enum(['discount', 'premium', 'new']).optional(),
  discountPercent: z.coerce.number().int().min(0).max(100).optional(),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
export type AdminListProductsQuery = z.infer<typeof adminListProductsQuerySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export function mapBadgeInput(badge?: CreateProductInput['badge']) {
  return badgeFromApi(badge);
}
