import { getSupabaseOrNull } from '@/lib/supabase';
import { formatDateTR } from '@/lib/format';

export interface ReturnRequest {
  id: string;
  orderNumber: string;
  productName: string;
  type: 'return' | 'exchange';
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  date: string;
}

export async function getCustomerReturns(userId: string): Promise<ReturnRequest[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data } = await supabase
    .from('return_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return (data ?? []).map((r) => ({
    id: r.id,
    orderNumber: r.order_number,
    productName: r.product_name,
    type: r.type as ReturnRequest['type'],
    reason: r.reason,
    status: r.status as ReturnRequest['status'],
    date: formatDateTR(r.created_at),
  }));
}

export async function createReturnRequest(input: {
  userId: string;
  orderId?: string;
  orderNumber: string;
  productName: string;
  type: 'return' | 'exchange';
  reason: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase.from('return_requests').insert({
    user_id: input.userId,
    order_id: input.orderId ?? null,
    order_number: input.orderNumber,
    product_name: input.productName,
    type: input.type,
    reason: input.reason,
    status: 'pending',
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getAdminReturns(): Promise<(ReturnRequest & { customer: string })[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data } = await supabase
    .from('return_requests')
    .select('*')
    .order('created_at', { ascending: false });

  const rows = data ?? [];
  const userIds = [...new Set(rows.map((r) => r.user_id))];
  const { data: profiles } = await supabase.from('profiles').select('id, name').in('id', userIds);
  const nameMap = new Map((profiles ?? []).map((p) => [p.id, p.name]));

  return rows.map((r) => ({
    id: r.id,
    orderNumber: r.order_number,
    productName: r.product_name,
    type: r.type as ReturnRequest['type'],
    reason: r.reason,
    status: r.status as ReturnRequest['status'],
    date: formatDateTR(r.created_at),
    customer: nameMap.get(r.user_id) ?? 'Müşteri',
  }));
}

export async function updateReturnStatus(
  id: string,
  status: ReturnRequest['status'],
  adminNote?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };
  const { error } = await supabase.from('return_requests').update({ status, admin_note: adminNote ?? null }).eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
