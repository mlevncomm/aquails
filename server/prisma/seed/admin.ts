import type { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../src/lib/password.js';

const DEFAULT_ADMIN_EMAIL = 'admin@aquails.com';
const DEFAULT_ADMIN_NAME = 'Aquails Admin';

export async function seedAdminUser(prisma: PrismaClient): Promise<void> {
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password) {
    console.warn(
      'Skipping admin seed: SEED_ADMIN_PASSWORD is not set in environment.',
    );
    return;
  }

  const email = (
    process.env.SEED_ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL
  ).toLowerCase();
  const name = process.env.SEED_ADMIN_NAME ?? DEFAULT_ADMIN_NAME;
  const passwordHash = await hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: 'ADMIN',
    },
    create: {
      name,
      email,
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log(`Seeded admin user: ${email}`);
}
