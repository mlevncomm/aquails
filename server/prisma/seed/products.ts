import type { PrismaClient } from '@prisma/client';
import { products as frontendProducts } from '../../../../src/data/products.js';
import { categorySeedData } from './categories.js';
import {
  mapFrontendProductToCreateInput,
  resolveCategorySlugFromName,
} from './mappers/productMapper.js';

export async function seedProducts(prisma: PrismaClient): Promise<void> {
  const categories = await prisma.category.findMany();
  const nameToSlug = new Map(categorySeedData.map((c) => [c.name, c.slug]));
  const slugToId = new Map(categories.map((c) => [c.slug, c.id]));

  const seenSlugs = new Set<string>();
  let seeded = 0;
  let skipped = 0;

  for (const product of frontendProducts) {
    if (seenSlugs.has(product.slug)) {
      skipped += 1;
      continue;
    }
    seenSlugs.add(product.slug);

    const categorySlug = resolveCategorySlugFromName(product.category, nameToSlug);
    if (!categorySlug) {
      console.warn(`Skipping product ${product.slug}: unknown category "${product.category}"`);
      skipped += 1;
      continue;
    }

    const categoryId = slugToId.get(categorySlug);
    if (!categoryId) {
      console.warn(`Skipping product ${product.slug}: category slug ${categorySlug} not in DB`);
      skipped += 1;
      continue;
    }

    const data = mapFrontendProductToCreateInput(
      {
        slug: product.slug,
        name: product.name,
        category: product.category,
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
        badge: product.badge,
        discountPercent: product.discountPercent,
      },
      categoryId,
    );

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: data.name,
        subcategory: data.subcategory,
        description: data.description,
        shortDescription: data.shortDescription,
        price: data.price,
        oldPrice: data.oldPrice,
        rating: data.rating,
        reviewCount: data.reviewCount,
        stock: data.stock,
        images: data.images as object,
        features: data.features as object,
        specifications: data.specifications as object,
        badge: data.badge,
        discountPercent: data.discountPercent,
        isActive: true,
        category: { connect: { id: categoryId } },
      },
      create: data,
    });

    seeded += 1;
  }

  console.log(`Seeded ${seeded} products (${skipped} skipped).`);
}
