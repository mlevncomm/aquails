import { getSupabaseOrNull } from '@/lib/supabase';
import { formatDateTR } from '@/lib/format';
import type { Profile } from '@/types/database';

export interface CustomerListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  date: string;
  loyaltyPoints: number;
}

export async function getCustomers(): Promise<CustomerListItem[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'customer')
    .order('created_at', { ascending: false });

  if (error || !profiles) return [];

  const { data: orderStats } = await supabase
    .from('orders')
    .select('user_id, total');

  const statsMap = new Map<string, { count: number; spent: number }>();
  for (const o of orderStats ?? []) {
    const cur = statsMap.get(o.user_id) ?? { count: 0, spent: 0 };
    cur.count += 1;
    cur.spent += Number(o.total);
    statsMap.set(o.user_id, cur);
  }

  return (profiles as Profile[]).map((p) => {
    const stats = statsMap.get(p.id) ?? { count: 0, spent: 0 };
    return {
      id: p.id,
      name: p.name || 'Müşteri',
      email: p.email,
      phone: p.phone ?? '—',
      orders: stats.count,
      spent: stats.spent,
      date: formatDateTR(p.created_at),
      loyaltyPoints: p.loyalty_points ?? 0,
    };
  });
}

export async function getCustomerCount(): Promise<number> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return 0;

  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'customer');

  return count ?? 0;
}

export async function getNewCustomersToday(): Promise<number> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return 0;

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'customer')
    .gte('created_at', start.toISOString());

  return count ?? 0;
}
