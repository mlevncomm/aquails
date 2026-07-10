import { getSupabaseOrNull } from '@/lib/supabase';
import type { DbCoupon } from '@/types/database';
import { formatDateTR } from '@/lib/format';

export interface Coupon {
  code: string;
  type: 'percent' | 'fixed' | 'shipping';
  value: number;
  minOrder?: number;
}

export interface AdminCoupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed' | 'shipping';
  value: number;
  minOrder: number;
  usageLimit: number;
  used: number;
  start: string;
  end: string;
  active: boolean;
}

function dbTypeToUi(type: DbCoupon['type']): Coupon['type'] {
  if (type === 'percentage') return 'percent';
  return type;
}

function uiTypeToDb(type: Coupon['type']): DbCoupon['type'] {
  if (type === 'percent') return 'percentage';
  return type;
}

function mapAdminCoupon(row: DbCoupon): AdminCoupon {
  return {
    id: row.id,
    code: row.code,
    type: dbTypeToUi(row.type),
    value: Number(row.value),
    minOrder: Number(row.min_order_amount ?? 0),
    usageLimit: row.usage_limit,
    used: row.usage_count,
    start: row.start_date ? formatDateTR(row.start_date) : '—',
    end: row.end_date ? formatDateTR(row.end_date) : '—',
    active: row.is_active,
  };
}

export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<{ valid: boolean; coupon?: Coupon; discount: number; message?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) {
    return { valid: false, discount: 0, message: 'Kupon servisi yapılandırılmamış.' };
  }

  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) {
    return { valid: false, discount: 0, message: 'Geçersiz kupon kodu.' };
  }

  const c = data as DbCoupon;
  const now = new Date();
  if (c.start_date && new Date(c.start_date) > now) {
    return { valid: false, discount: 0, message: 'Kupon henüz geçerli değil.' };
  }
  if (c.end_date && new Date(c.end_date) < now) {
    return { valid: false, discount: 0, message: 'Kupon süresi dolmuş.' };
  }
  if (c.usage_limit > 0 && c.usage_count >= c.usage_limit) {
    return { valid: false, discount: 0, message: 'Kupon kullanım limiti dolmuş.' };
  }

  const minOrder = Number(c.min_order_amount ?? 0);
  if (minOrder > 0 && subtotal < minOrder) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum ${minOrder.toLocaleString('tr-TR')}₺ sipariş gerekli.`,
    };
  }

  const uiType = dbTypeToUi(c.type);
  const coupon: Coupon = {
    code: c.code,
    type: uiType,
    value: Number(c.value),
    minOrder: minOrder || undefined,
  };

  let discount = 0;
  if (uiType === 'percent') {
    discount = Math.round(subtotal * Number(c.value) / 100);
    if (c.max_discount) discount = Math.min(discount, Number(c.max_discount));
  } else if (uiType === 'fixed') {
    discount = Number(c.value);
  } else if (uiType === 'shipping') {
    discount = -1;
  }

  return { valid: true, coupon, discount };
}

export async function incrementCouponUsage(code: string): Promise<void> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return;

  await supabase.rpc('increment_coupon_usage', { p_code: code.toUpperCase() });
}

export async function getActiveCouponsForCustomer(): Promise<Coupon[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data } = await supabase
    .from('coupons')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  const now = new Date();
  return (data ?? [])
    .filter((c) => {
      if (c.end_date && new Date(c.end_date) < now) return false;
      if (c.usage_limit > 0 && c.usage_count >= c.usage_limit) return false;
      return true;
    })
    .map((c) => ({
      code: c.code,
      type: dbTypeToUi(c.type as DbCoupon['type']),
      value: Number(c.value),
      minOrder: Number(c.min_order_amount ?? 0) || undefined,
    }));
}

export async function getCoupons(): Promise<AdminCoupon[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return (data as DbCoupon[]).map(mapAdminCoupon);
}

export async function createCoupon(input: {
  code: string;
  type: 'percent' | 'fixed' | 'shipping';
  value: number;
  minOrder: number;
  usageLimit: number;
  start: string;
  end: string;
  active?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase.from('coupons').insert({
    code: input.code.toUpperCase(),
    type: uiTypeToDb(input.type),
    value: input.value,
    min_order_amount: input.minOrder,
    usage_limit: input.usageLimit,
    start_date: input.start ? new Date(input.start).toISOString() : null,
    end_date: input.end ? new Date(input.end).toISOString() : null,
    is_active: input.active ?? true,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function toggleCouponActive(
  id: string,
  active: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase.from('coupons').update({ is_active: active }).eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteCoupon(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
