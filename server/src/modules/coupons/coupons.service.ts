import type { Coupon, CouponType, Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/AppError.js';
import { decimalToNumber } from '../../lib/serialize.js';
import { z } from 'zod';

type DbClient = Prisma.TransactionClient | typeof prisma;

export const validateCouponSchema = z.object({
  code: z.string().trim().min(1),
  subtotal: z.coerce.number().min(0),
});

export const createCouponSchema = z.object({
  code: z.string().trim().min(2).max(50).transform((v) => v.toUpperCase()),
  type: z.enum(['PERCENT', 'FIXED', 'SHIPPING']),
  value: z.coerce.number().min(0),
  minOrder: z.coerce.number().min(0).nullable().optional(),
  usageLimit: z.coerce.number().int().min(1).nullable().optional(),
  isActive: z.boolean().default(true),
  startsAt: z.coerce.date().nullable().optional(),
  endsAt: z.coerce.date().nullable().optional(),
});

export const updateCouponSchema = createCouponSchema.partial();

export interface CouponValidationResult {
  code: string;
  type: CouponType;
  discount: number;
  message: string;
}

function serializeCoupon(coupon: Coupon) {
  return {
    id: coupon.id,
    code: coupon.code,
    type: coupon.type,
    value: decimalToNumber(coupon.value) ?? 0,
    minOrder: decimalToNumber(coupon.minOrder),
    usageLimit: coupon.usageLimit,
    usedCount: coupon.usedCount,
    isActive: coupon.isActive,
    startsAt: coupon.startsAt?.toISOString() ?? null,
    endsAt: coupon.endsAt?.toISOString() ?? null,
    createdAt: coupon.createdAt.toISOString(),
    updatedAt: coupon.updatedAt.toISOString(),
  };
}

export function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase();
}

export function calculateCouponDiscount(
  coupon: Coupon,
  subtotal: number,
  shippingCost: number,
): number {
  const minOrder = decimalToNumber(coupon.minOrder) ?? 0;
  if (subtotal < minOrder) {
    throw new AppError(
      `Minimum sipariş tutarı ${minOrder} TL olmalıdır.`,
      400,
      'COUPON_MIN_ORDER',
    );
  }

  const value = decimalToNumber(coupon.value) ?? 0;

  switch (coupon.type) {
    case 'PERCENT':
      return Math.min(subtotal * (value / 100), subtotal);
    case 'FIXED':
      return Math.min(value, subtotal);
    case 'SHIPPING':
      return shippingCost;
    default:
      return 0;
  }
}

export async function assertCouponValid(
  code: string,
  subtotal: number,
  shippingCost = 0,
  client: DbClient = prisma,
): Promise<{ coupon: Coupon; discount: number }> {
  const normalizedCode = normalizeCouponCode(code);
  const coupon = await client.coupon.findUnique({
    where: { code: normalizedCode },
  });

  if (!coupon || !coupon.isActive) {
    throw new AppError('Geçersiz kupon kodu.', 400, 'INVALID_COUPON');
  }

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) {
    throw new AppError('Kupon henüz geçerli değil.', 400, 'COUPON_NOT_STARTED');
  }
  if (coupon.endsAt && coupon.endsAt < now) {
    throw new AppError('Kupon süresi dolmuş.', 400, 'COUPON_EXPIRED');
  }
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError('Kupon kullanım limiti dolmuş.', 400, 'COUPON_LIMIT_REACHED');
  }

  const discount = calculateCouponDiscount(coupon, subtotal, shippingCost);

  return { coupon, discount };
}

export async function validateCoupon(code: string, subtotal: number, shippingCost = 0) {
  const { coupon, discount } = await assertCouponValid(code, subtotal, shippingCost);

  return {
    code: coupon.code,
    type: coupon.type,
    discount,
    message: 'Kupon uygulandı.',
  } satisfies CouponValidationResult;
}

export async function listCoupons() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  return coupons.map(serializeCoupon);
}

export async function createCoupon(input: z.infer<typeof createCouponSchema>) {
  const existing = await prisma.coupon.findUnique({ where: { code: input.code } });
  if (existing) {
    throw new AppError('Coupon code already exists', 409, 'CODE_ALREADY_EXISTS');
  }

  const coupon = await prisma.coupon.create({ data: input });
  return serializeCoupon(coupon);
}

export async function updateCoupon(id: string, input: z.infer<typeof updateCouponSchema>) {
  const existing = await prisma.coupon.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Coupon not found', 404, 'COUPON_NOT_FOUND');
  }

  const coupon = await prisma.coupon.update({ where: { id }, data: input });
  return serializeCoupon(coupon);
}

export async function deleteCoupon(id: string) {
  const existing = await prisma.coupon.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Coupon not found', 404, 'COUPON_NOT_FOUND');
  }

  await prisma.coupon.delete({ where: { id } });
  return { deleted: true };
}

export async function incrementCouponUsage(code: string, client: DbClient = prisma) {
  const normalizedCode = normalizeCouponCode(code);
  const coupon = await client.coupon.findUnique({
    where: { code: normalizedCode },
  });

  if (!coupon) {
    throw new AppError('Geçersiz kupon kodu.', 400, 'INVALID_COUPON');
  }

  const where: Prisma.CouponWhereInput = { code: normalizedCode };
  if (coupon.usageLimit !== null) {
    where.usedCount = { lt: coupon.usageLimit };
  }

  const updated = await client.coupon.updateMany({
    where,
    data: { usedCount: { increment: 1 } },
  });

  if (updated.count === 0) {
    throw new AppError('Kupon kullanım limiti dolmuş.', 400, 'COUPON_LIMIT_REACHED');
  }
}
