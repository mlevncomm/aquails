import { apiClient } from '@/lib/apiClient';
import { invokeFunction } from '@/lib/api';
import { isSupabaseMode } from '@/lib/dataProvider';
import { requireSupabase } from '@/lib/supabase';

export interface CouponValidationResult {
  code: string;
  type: 'PERCENT' | 'FIXED' | 'SHIPPING';
  discount: number;
  message: string;
}

export async function validateCoupon(code: string, subtotal: number): Promise<CouponValidationResult> {
  if (isSupabaseMode) {
    return invokeFunction<CouponValidationResult>('validate-coupon', { code, subtotal });
  }
  return apiClient.post<CouponValidationResult>('/api/coupons/validate', { code, subtotal });
}

export async function adminGetCoupons() {
  if (isSupabaseMode) {
    const { data, error } = await requireSupabase().from('coupons').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  }
  return apiClient.get<Array<Record<string, unknown>>>('/api/admin/coupons');
}

export async function adminCreateCoupon(body: Record<string, unknown>) {
  if (isSupabaseMode) {
    const { data, error } = await requireSupabase().from('coupons').insert(body).select('*').single();
    if (error) throw new Error(error.message);
    return data;
  }
  return apiClient.post('/api/admin/coupons', body);
}

export async function adminUpdateCoupon(id: string, body: Record<string, unknown>) {
  if (isSupabaseMode) {
    const { data, error } = await requireSupabase().from('coupons').update(body).eq('id', id).select('*').single();
    if (error) throw new Error(error.message);
    return data;
  }
  return apiClient.patch(`/api/admin/coupons/${id}`, body);
}

export async function adminDeleteCoupon(id: string) {
  if (isSupabaseMode) {
    const { data, error } = await requireSupabase().from('coupons').update({ is_active: false }).eq('id', id).select('*').single();
    if (error) throw new Error(error.message);
    return data;
  }
  return apiClient.delete(`/api/admin/coupons/${id}`);
}
