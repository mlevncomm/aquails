import type { PrismaClient } from '@prisma/client';

export async function seedCoupons(prisma: PrismaClient): Promise<void> {
  const coupons = [
    {
      code: 'HOSGELDIN10',
      type: 'PERCENT' as const,
      value: 10,
      minOrder: 500,
      usageLimit: 1000,
      isActive: true,
    },
    {
      code: 'KARGO',
      type: 'SHIPPING' as const,
      value: 0,
      minOrder: 1000,
      usageLimit: null,
      isActive: true,
    },
    {
      code: 'INDIRIM100',
      type: 'FIXED' as const,
      value: 100,
      minOrder: 1500,
      usageLimit: 500,
      isActive: true,
    },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {
        type: coupon.type,
        value: coupon.value,
        minOrder: coupon.minOrder,
        usageLimit: coupon.usageLimit,
        isActive: coupon.isActive,
      },
      create: coupon,
    });
  }

  console.log(`Seeded ${coupons.length} coupons.`);
}
