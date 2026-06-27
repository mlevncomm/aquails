import type { PrismaClient } from '@prisma/client';
import { env } from '../../src/config/env.js';
import { hashPassword } from '../../src/lib/password.js';

export async function seedAdminUser(prisma: PrismaClient): Promise<void> {
  const password = env.SEED_ADMIN_PASSWORD;

  if (!password) {
    console.warn(
      'Skipping admin seed: SEED_ADMIN_PASSWORD is not set in environment.',
    );
    return;
  }

  const email = env.SEED_ADMIN_EMAIL;
  const name = env.SEED_ADMIN_NAME;
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
