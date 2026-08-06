import { getSupabaseOrNull } from '@/lib/supabase';
import { formatDateTR } from '@/lib/format';
import type { DbSubscription } from '@/types/database';

export interface AdminSubscription {
  id: string;
  customer: string;
  plan: string;
  device: string;
  nextDelivery: string;
  price: number;
  status: DbSubscription['status'];
}

type SubWithProfile = DbSubscription & {
  profiles: { name: string } | null;
};

function mapSub(row: SubWithProfile): AdminSubscription {
  return {
    id: row.id,
    customer: row.profiles?.name ?? 'Müşteri',
    plan: row.plan,
    device: row.device_name,
    nextDelivery: row.next_delivery ? formatDateTR(row.next_delivery, { day: 'numeric', month: 'long', year: 'numeric' }) : '—',
    price: Number(row.price),
    status: row.status,
  };
}

export async function getSubscriptions(): Promise<AdminSubscription[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, profiles(name)')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return (data as unknown as SubWithProfile[]).map(mapSub);
}

export async function getSubscriptionStats() {
  const supabase = getSupabaseOrNull();
  if (!supabase) {
    return { total: 0, active: 0, paused: 0, monthlyRevenue: 0 };
  }

  const { data } = await supabase.from('subscriptions').select('status, price');

  const subs = data ?? [];
  return {
    total: subs.length,
    active: subs.filter((s) => s.status === 'active').length,
    paused: subs.filter((s) => s.status === 'paused').length,
    monthlyRevenue: subs.filter((s) => s.status === 'active').reduce((sum, s) => sum + Number(s.price), 0),
  };
}

export async function updateSubscriptionStatus(
  id: string,
  status: DbSubscription['status']
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { data, error } = await supabase.rpc('set_my_subscription_status', {
    p_subscription_id: id,
    p_status: status,
  });
  if (error) return { success: false, error: error.message };
  const result = data as { success?: boolean; error?: string } | null;
  if (!result?.success) return { success: false, error: result?.error ?? 'İşlem başarısız.' };
  return { success: true };
}

export interface CustomerSubscription {
  id: string;
  plan: string;
  device: string;
  nextDelivery: string;
  price: number;
  status: DbSubscription['status'];
}

export async function getCustomerSubscriptions(userId: string): Promise<CustomerSubscription[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id,
    plan: row.plan,
    device: row.device_name,
    nextDelivery: row.next_delivery
      ? formatDateTR(row.next_delivery, { day: 'numeric', month: 'long', year: 'numeric' })
      : '—',
    price: Number(row.price),
    status: row.status as DbSubscription['status'],
  }));
}

export async function createSubscription(input: {
  userId: string;
  plan: string;
  deviceName: string;
  price: number;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { data, error } = await supabase.rpc('create_my_subscription', {
    p_plan: input.plan,
    p_device_name: input.deviceName,
  });

  if (error) return { success: false, error: error.message };
  const result = data as { success?: boolean; error?: string } | null;
  if (!result?.success) return { success: false, error: result?.error ?? 'Abonelik oluşturulamadı.' };
  return { success: true };
}
