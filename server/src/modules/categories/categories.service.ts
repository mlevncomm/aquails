import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/AppError.js';
import { serializeCategory, serializeAdminCategory } from '../../lib/serialize.js';

export const createCategorySchema = z.object({
  slug: z.string().trim().min(2).max(200),
  name: z.string().trim().min(2).max(200),
  description: z.string().trim().optional(),
  icon: z.string().trim().max(100).optional(),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export async function listCategories(activeOnly = true) {
  const categories = await prisma.category.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: { name: 'asc' },
  });

  const counts = await prisma.product.groupBy({
    by: ['categoryId'],
    where: { isActive: true },
    _count: { _all: true },
  });

  const countMap = new Map(counts.map((c) => [c.categoryId, c._count._all]));
  const serializer = activeOnly ? serializeCategory : serializeAdminCategory;

  return categories.map((category) =>
    serializer(category, countMap.get(category.id) ?? 0),
  );
}

export async function getCategoryBySlug(slug: string, activeOnly = true) {
  const category = await prisma.category.findFirst({
    where: {
      slug,
      ...(activeOnly ? { isActive: true } : {}),
    },
  });

  if (!category) {
    throw new AppError('Kategori bulunamadı', 404, 'CATEGORY_NOT_FOUND');
  }

  const productCount = await prisma.product.count({
    where: { categoryId: category.id, isActive: true },
  });

  return serializeCategory(category, productCount);
}

export async function createCategory(input: CreateCategoryInput) {
  const existing = await prisma.category.findUnique({ where: { slug: input.slug } });
  if (existing) {
    throw new AppError('Kategori adresi zaten mevcut', 409, 'SLUG_ALREADY_EXISTS');
  }

  const category = await prisma.category.create({ data: input });
  return serializeAdminCategory(category, 0);
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Kategori bulunamadı', 404, 'CATEGORY_NOT_FOUND');
  }

  if (input.slug && input.slug !== existing.slug) {
    const slugTaken = await prisma.category.findUnique({ where: { slug: input.slug } });
    if (slugTaken) {
      throw new AppError('Kategori adresi zaten mevcut', 409, 'SLUG_ALREADY_EXISTS');
    }
  }

  const category = await prisma.category.update({ where: { id }, data: input });
  const productCount = await prisma.product.count({
    where: { categoryId: category.id, isActive: true },
  });
  return serializeAdminCategory(category, productCount);
}

export async function softDeleteCategory(id: string) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Kategori bulunamadı', 404, 'CATEGORY_NOT_FOUND');
  }

  const category = await prisma.category.update({
    where: { id },
    data: { isActive: false },
  });

  return serializeAdminCategory(category, 0);
}
