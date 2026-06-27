import type { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/AppError.js';
import { serializeProduct, type ProductWithCategory } from '../../lib/serialize.js';
import type { PaginatedProducts } from './products.types.js';
import type {
  AdminListProductsQuery,
  CreateProductInput,
  ListProductsQuery,
  UpdateProductInput,
} from './products.validation.js';
import { mapBadgeInput } from './products.validation.js';

const productInclude = {
  category: { select: { id: true, slug: true, name: true } },
} as const;

function buildOrderBy(sort: ListProductsQuery['sort']): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case 'price_asc':
      return { price: 'asc' };
    case 'price_desc':
      return { price: 'desc' };
    case 'rating':
      return { rating: 'desc' };
    case 'newest':
    default:
      return { createdAt: 'desc' };
  }
}

async function resolveCategoryFilter(category?: string) {
  if (!category) return undefined;

  const found = await prisma.category.findFirst({
    where: {
      OR: [{ slug: category }, { id: category }, { name: category }],
      isActive: true,
    },
  });

  return found?.id;
}

export async function listProducts(
  query: ListProductsQuery,
  options?: { includeInactive?: boolean; lowStock?: boolean },
): Promise<PaginatedProducts> {
  const categoryId = await resolveCategoryFilter(query.category);
  const where: Prisma.ProductWhereInput = {};

  if (!options?.includeInactive) {
    where.isActive = true;
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
      { subcategory: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {};
    if (query.minPrice !== undefined) where.price.gte = query.minPrice;
    if (query.maxPrice !== undefined) where.price.lte = query.maxPrice;
  }

  if (options?.lowStock) {
    where.stock = { lte: 10 };
    where.isActive = true;
  }

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: buildOrderBy(query.sort),
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
  ]);

  return {
    items: products.map((p) => serializeProduct(p as ProductWithCategory)),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit) || 1,
    },
  };
}

export async function listAdminProducts(query: AdminListProductsQuery) {
  return listProducts(query, {
    includeInactive: query.includeInactive ?? true,
    lowStock: query.lowStock,
  });
}

export async function getProductBySlug(slug: string, activeOnly = true) {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      ...(activeOnly ? { isActive: true } : {}),
    },
    include: productInclude,
  });

  if (!product) {
    throw new AppError('Ürün bulunamadı', 404, 'PRODUCT_NOT_FOUND');
  }

  return serializeProduct(product as ProductWithCategory);
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });

  if (!product) {
    throw new AppError('Ürün bulunamadı', 404, 'PRODUCT_NOT_FOUND');
  }

  return serializeProduct(product as ProductWithCategory);
}

export async function getRelatedProducts(productId: string, limit = 4) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { categoryId: true, id: true },
  });

  if (!product) {
    throw new AppError('Ürün bulunamadı', 404, 'PRODUCT_NOT_FOUND');
  }

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: productInclude,
    orderBy: { rating: 'desc' },
    take: limit,
  });

  return related.map((p) => serializeProduct(p as ProductWithCategory));
}

export async function createProduct(input: CreateProductInput) {
  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
  if (!category) {
    throw new AppError('Kategori bulunamadı', 404, 'CATEGORY_NOT_FOUND');
  }

  const existing = await prisma.product.findUnique({ where: { slug: input.slug } });
  if (existing) {
    throw new AppError('Ürün adresi zaten mevcut', 409, 'SLUG_ALREADY_EXISTS');
  }

  const product = await prisma.product.create({
    data: {
      slug: input.slug,
      name: input.name,
      categoryId: input.categoryId,
      subcategory: input.subcategory,
      description: input.description,
      shortDescription: input.shortDescription,
      price: input.price,
      oldPrice: input.oldPrice ?? null,
      rating: input.rating,
      reviewCount: input.reviewCount,
      stock: input.stock,
      images: input.images,
      features: input.features,
      specifications: input.specifications,
      badge: mapBadgeInput(input.badge),
      discountPercent: input.discountPercent,
      isActive: input.isActive,
    },
    include: productInclude,
  });

  return serializeProduct(product as ProductWithCategory);
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Ürün bulunamadı', 404, 'PRODUCT_NOT_FOUND');
  }

  if (input.slug && input.slug !== existing.slug) {
    const slugTaken = await prisma.product.findUnique({ where: { slug: input.slug } });
    if (slugTaken) {
      throw new AppError('Ürün adresi zaten mevcut', 409, 'SLUG_ALREADY_EXISTS');
    }
  }

  if (input.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category) {
      throw new AppError('Kategori bulunamadı', 404, 'CATEGORY_NOT_FOUND');
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...input,
      badge: input.badge !== undefined ? mapBadgeInput(input.badge) : undefined,
      oldPrice: input.oldPrice === undefined ? undefined : input.oldPrice,
    },
    include: productInclude,
  });

  return serializeProduct(product as ProductWithCategory);
}

export async function softDeleteProduct(id: string) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Ürün bulunamadı', 404, 'PRODUCT_NOT_FOUND');
  }

  const product = await prisma.product.update({
    where: { id },
    data: { isActive: false },
    include: productInclude,
  });

  return serializeProduct(product as ProductWithCategory);
}
