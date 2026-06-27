import type { Decimal } from '@prisma/client/runtime/library';
import type { ProductBadge } from '@prisma/client';

export type ApiProductBadge = 'discount' | 'premium' | 'new';

export function decimalToNumber(value: Decimal | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  return Number(value);
}

export function badgeToApi(badge: ProductBadge | null | undefined): ApiProductBadge | undefined {
  if (!badge) return undefined;
  const map: Record<ProductBadge, ApiProductBadge> = {
    DISCOUNT: 'discount',
    PREMIUM: 'premium',
    NEW: 'new',
  };
  return map[badge];
}

export function badgeFromApi(badge?: ApiProductBadge): ProductBadge | undefined {
  if (!badge) return undefined;
  const map: Record<ApiProductBadge, ProductBadge> = {
    discount: 'DISCOUNT',
    premium: 'PREMIUM',
    new: 'NEW',
  };
  return map[badge];
}

export function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }
  return [];
}

export function parseJsonObject(value: unknown): Record<string, string> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const result: Record<string, string> = {};
    for (const [key, val] of Object.entries(value)) {
      if (typeof val === 'string') result[key] = val;
    }
    return result;
  }
  return {};
}

export type ProductWithCategory = {
  id: string;
  slug: string;
  name: string;
  subcategory: string | null;
  description: string;
  shortDescription: string | null;
  price: Decimal;
  oldPrice: Decimal | null;
  rating: Decimal;
  reviewCount: number;
  stock: number;
  images: unknown;
  features: unknown;
  specifications: unknown;
  badge: ProductBadge | null;
  discountPercent: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: { id: string; slug: string; name: string };
};

export interface PublicProductDto {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  shortDescription: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  badge?: ApiProductBadge;
  discountPercent?: number;
}

export function serializeProduct(product: ProductWithCategory): PublicProductDto {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category.name,
    subcategory: product.subcategory ?? product.category.name,
    description: product.description,
    shortDescription: product.shortDescription ?? '',
    price: decimalToNumber(product.price) ?? 0,
    oldPrice: decimalToNumber(product.oldPrice),
    rating: decimalToNumber(product.rating) ?? 0,
    reviewCount: product.reviewCount,
    stock: product.stock,
    images: parseJsonArray(product.images),
    features: parseJsonArray(product.features),
    specifications: parseJsonObject(product.specifications),
    badge: badgeToApi(product.badge),
    discountPercent: product.discountPercent ?? undefined,
  };
}

export interface PublicCategoryDto {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  productCount: number;
}

export interface AdminCategoryDto extends PublicCategoryDto {
  isActive: boolean;
}

export function serializeCategory(
  category: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    icon: string | null;
    isActive: boolean;
  },
  productCount: number,
): PublicCategoryDto {
  return {
    id: category.slug,
    slug: category.slug,
    name: category.name,
    description: category.description ?? '',
    icon: category.icon ?? 'Package',
    productCount,
  };
}

export function serializeAdminCategory(
  category: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    icon: string | null;
    isActive: boolean;
  },
  productCount: number,
): AdminCategoryDto {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description ?? '',
    icon: category.icon ?? 'Package',
    productCount,
    isActive: category.isActive,
  };
}
