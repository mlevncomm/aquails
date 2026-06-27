import { getServiceClient } from './db.ts';
import { AppError } from './errors.ts';

export type CouponType = 'percent' | 'fixed' | 'shipping';

export interface CouponResult {
  code: string;
  type: 'PERCENT' | 'FIXED' | 'SHIPPING';
  discount: number;
  couponId: string;
  message: string;
}

export async function validateCouponInternal(code: string, subtotal: number, userId?: string | null): Promise<CouponResult> {
  const db = getServiceClient();
  const normalized = code.trim().toUpperCase();
  const { data: coupon, error } = await db
    .from('coupons')
    .select('*')
    .eq('code', normalized)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !coupon) throw new AppError('Geçersiz kupon kodu', 400, 'COUPON_INVALID');

  const now = new Date();
  if (coupon.starts_at && new Date(coupon.starts_at) > now) {
    throw new AppError('Kupon henüz geçerli değil', 400, 'COUPON_NOT_STARTED');
  }
  if (coupon.ends_at && new Date(coupon.ends_at) < now) {
    throw new AppError('Kupon süresi dolmuş', 400, 'COUPON_EXPIRED');
  }
  if (coupon.usage_limit != null && coupon.usage_count >= coupon.usage_limit) {
    throw new AppError('Kupon kullanım limiti dolmuş', 400, 'COUPON_LIMIT');
  }
  if (Number(coupon.min_order_amount) > subtotal) {
    throw new AppError(`Minimum sipariş tutarı ${Number(coupon.min_order_amount).toLocaleString('tr-TR')}₺`, 400, 'COUPON_MIN_ORDER');
  }

  let discount = 0;
  let type: CouponResult['type'] = 'FIXED';

  if (coupon.type === 'percent') {
    type = 'PERCENT';
    discount = Math.round(subtotal * (Number(coupon.value) / 100) * 100) / 100;
    if (coupon.max_discount != null) discount = Math.min(discount, Number(coupon.max_discount));
  } else if (coupon.type === 'fixed') {
    type = 'FIXED';
    discount = Math.min(Number(coupon.value), subtotal);
  } else {
    type = 'SHIPPING';
    discount = 0;
  }

  return {
    code: coupon.code,
    type,
    discount,
    couponId: coupon.id,
    message: type === 'SHIPPING' ? 'Ücretsiz kargo uygulandı' : `${discount.toLocaleString('tr-TR')}₺ indirim`,
  };
}

export async function incrementCouponUsage(couponId: string, userId: string | null, orderId: string) {
  const db = getServiceClient();
  const { data: coupon } = await db.from('coupons').select('usage_count').eq('id', couponId).single();
  if (!coupon) return;
  await db.from('coupons').update({ usage_count: (coupon.usage_count ?? 0) + 1 }).eq('id', couponId);
  await db.from('coupon_usages').insert({ coupon_id: couponId, user_id: userId, order_id: orderId });
}
