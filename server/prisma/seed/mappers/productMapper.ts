import type { Prisma, ProductBadge } from '@prisma/client';

/**
 * Frontend product shape (from src/data/products.ts).
 * FAZ 4 will import full product data via this mapper — do not read frontend files here.
 *
 * Badge mapping note: frontend uses lowercase (`discount`, `premium`, `new`);
 * database enum uses uppercase (DISCOUNT, PREMIUM, NEW). Map at API/seed layer in FAZ 4.
 */
export interface FrontendProductInput {
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
  badge?: 'discount' | 'premium' | 'new';
  discountPercent?: number;
}

const BADGE_MAP: Record<
  NonNullable<FrontendProductInput['badge']>,
  ProductBadge
> = {
  discount: 'DISCOUNT',
  premium: 'PREMIUM',
  new: 'NEW',
};

export function mapFrontendBadge(
  badge?: FrontendProductInput['badge'],
): ProductBadge | undefined {
  if (!badge) return undefined;
  return BADGE_MAP[badge];
}

export function mapFrontendProductToCreateInput(
  product: FrontendProductInput,
  categoryId: string,
): Prisma.ProductCreateInput {
  return {
    slug: product.slug,
    name: product.name,
    subcategory: product.subcategory,
    description: product.description,
    shortDescription: product.shortDescription,
    price: product.price,
    oldPrice: product.oldPrice,
    rating: product.rating,
    reviewCount: product.reviewCount,
    stock: product.stock,
    images: product.images,
    features: product.features,
    specifications: product.specifications,
    badge: mapFrontendBadge(product.badge),
    discountPercent: product.discountPercent,
    isActive: true,
    category: { connect: { id: categoryId } },
  };
}

/**
 * Resolve category slug from frontend category name.
 * FAZ 4 seed will build a name→slug lookup from seeded categories.
 */
export function resolveCategorySlugFromName(
  categoryName: string,
  nameToSlug: Map<string, string>,
): string | undefined {
  return nameToSlug.get(categoryName);
}
