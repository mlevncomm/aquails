import { PrismaClient } from '@prisma/client';
import { categorySeedData } from './seed/categories.js';
import { seedAdminUser } from './seed/admin.js';

const prisma = new PrismaClient();

async function seedCategories() {
  for (const category of categorySeedData) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        icon: category.icon,
        isActive: true,
      },
      create: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        icon: category.icon,
        isActive: true,
      },
    });
  }

  console.log(`Seeded ${categorySeedData.length} categories.`);
}

async function main() {
  await seedCategories();
  await seedAdminUser(prisma);
  // Full product import from frontend mock data: FAZ 4 (uses productMapper.ts)
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
