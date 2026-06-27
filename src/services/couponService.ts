import { apiClient } from '@/lib/apiClient';

export interface CouponValidationResult {
  code: string;
  type: 'PERCENT' | 'FIXED' | 'SHIPPING';
  discount: number;
  message: string;
}

export async function validateCoupon(code: string, subtotal: number): Promise<CouponValidationResult> {
  return apiClient.post<CouponValidationResult>('/api/coupons/validate', { code, subtotal });
}

export async function adminGetCoupons() {
  return apiClient.get<Array<Record<string, unknown>>>('/api/admin/coupons');
}

export async function adminCreateCoupon(body: Record<string, unknown>) {
  return apiClient.post('/api/admin/coupons', body);
}

export async function adminUpdateCoupon(id: string, body: Record<string, unknown>) {
  return apiClient.patch(`/api/admin/coupons/${id}`, body);
}

export async function adminDeleteCoupon(id: string) {
  return apiClient.delete(`/api/admin/coupons/${id}`);
}
