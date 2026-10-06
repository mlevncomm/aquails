import { getSupabaseOrNull } from '@/lib/supabase';

export interface LoyaltyData {
  totalPoints: number;
  availablePoints: number;
  totalRedeemed: number;
}

export const EARN_RULES = [
  { action: 'Sipariş', points: 'Her 10₺ = 1 puan' },
  { action: 'Yorum', points: '50 puan' },
  { action: 'Arkadaş daveti', points: '200 puan' },
];

export async function getLoyaltyData(userId?: string): Promise<LoyaltyData> {
  const supabase = getSupabaseOrNull();
  if (!supabase) {
    return { totalPoints: 0, availablePoints: 0, totalRedeemed: 0 };
  }

  let query = supabase.from('profiles').select('loyalty_points, loyalty_redeemed');
  if (userId) query = query.eq('id', userId);

  const { data } = userId
    ? await query.maybeSingle()
    : await supabase
        .from('profiles')
        .select('loyalty_points, loyalty_redeemed')
        .eq('role', 'customer');

  if (userId && data && !Array.isArray(data)) {
    const row = data as { loyalty_points: number; loyalty_redeemed: number };
    return {
      totalPoints: row.loyalty_points + row.loyalty_redeemed,
      availablePoints: row.loyalty_points,
      totalRedeemed: row.loyalty_redeemed,
    };
  }

  const rows = (Array.isArray(data) ? data : []) as { loyalty_points: number; loyalty_redeemed: number }[];
  const available = rows.reduce((s, r) => s + (r.loyalty_points ?? 0), 0);
  const redeemed = rows.reduce((s, r) => s + (r.loyalty_redeemed ?? 0), 0);

  return {
    totalPoints: available + redeemed,
    availablePoints: available,
    totalRedeemed: redeemed,
  };
}

export async function earnPoints(
  userId: string,
  amount: number,
  _reason?: string
): Promise<{ success: boolean; error?: string }> {
  void _reason;
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { data } = await supabase
    .from('profiles')
    .select('loyalty_points')
    .eq('id', userId)
    .maybeSingle();

  if (!data) return { success: false, error: 'Kullanıcı bulunamadı.' };

  const { data: updated, error } = await supabase
    .from('profiles')
    .update({ loyalty_points: data.loyalty_points + amount })
    .eq('id', userId)
    .select('id');

  if (error) return { success: false, error: error.message };
  if (!updated?.length) return { success: false, error: 'Puan güncellenemedi veya yetkiniz yok.' };
  return { success: true };
}

export async function convertPointsToCoupon(
  points: number
): Promise<{ code: string; discount: number } | null> {
  const result = await redeemPoints('', points);
  if (!result.success || !result.code) return null;
  return { code: result.code, discount: Number(result.discount ?? 0) };
}

export async function redeemPoints(
  _userId: string,
  amount: number,
  _reason?: string
): Promise<{ success: boolean; error?: string; code?: string; discount?: number }> {
  void _userId;
  void _reason;
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { data, error } = await supabase.rpc('redeem_loyalty_points', { p_points: amount });
  if (error) return { success: false, error: error.message };

  const result = data as { code?: string; discount?: number };
  return { success: true, code: result?.code, discount: Number(result?.discount ?? 0) };
}

export async function getLoyaltyHistory(userId: string): Promise<{ id: string; amount: number; type: string; description: string; date: string }[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data } = await supabase
    .from('loyalty_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  return (data ?? []).map((t) => ({
    id: t.id,
    amount: t.amount,
    type: t.type,
    description: t.description,
    date: new Date(t.created_at).toLocaleDateString('tr-TR'),
  }));
}

export interface CustomerLoyaltyBalance {
  id: string;
  name: string;
  email: string;
  points: number;
  redeemed: number;
}

/** Admin: every customer with their current balance, richest first. */
export async function getCustomerLoyaltyBalances(): Promise<CustomerLoyaltyBalance[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, loyalty_points, loyalty_redeemed')
    .eq('role', 'customer')
    .order('loyalty_points', { ascending: false });
  if (error || !data) return [];
  return (data as { id: string; name: string; email: string; loyalty_points: number; loyalty_redeemed: number }[]).map((p) => ({
    id: p.id,
    name: p.name || 'Müşteri',
    email: p.email,
    points: p.loyalty_points ?? 0,
    redeemed: p.loyalty_redeemed ?? 0,
  }));
}

export interface AdminLoyaltyTransaction {
  id: string;
  customer: string;
  email: string;
  amount: number;
  type: string;
  description: string;
  date: string;
}

export async function getRecentLoyaltyTransactions(limit = 50): Promise<AdminLoyaltyTransaction[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('loyalty_transactions')
    .select('id, amount, type, description, created_at, profiles(name, email)')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return (data as unknown as {
    id: string; amount: number; type: string; description: string; created_at: string;
    profiles: { name: string | null; email: string } | null;
  }[]).map((t) => ({
    id: t.id,
    customer: t.profiles?.name || 'Müşteri',
    email: t.profiles?.email ?? '',
    amount: t.amount,
    type: t.type,
    description: t.description,
    date: new Date(t.created_at).toLocaleDateString('tr-TR'),
  }));
}

const ADJUST_ERRORS: Record<string, string> = {
  invalid_amount: 'Puan miktarı sıfırdan farklı olmalı.',
  not_found: 'Müşteri bulunamadı.',
  insufficient_balance: 'Müşterinin bakiyesi bu kadar puan düşmek için yetersiz.',
};

/** Admin: add (positive) or deduct (negative) points; the customer is notified. */
export async function adminAdjustLoyaltyPoints(
  userId: string,
  amount: number,
  reason: string,
): Promise<{ success: boolean; error?: string; balance?: number }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };
  const points = Math.trunc(amount);
  if (!points) return { success: false, error: ADJUST_ERRORS.invalid_amount };
  const { data, error } = await supabase.rpc('admin_adjust_loyalty_points', {
    p_user_id: userId,
    p_amount: points,
    p_reason: reason,
  });
  if (error) return { success: false, error: error.message };
  const result = data as { success?: boolean; error?: string; balance?: number } | null;
  if (!result?.success) return { success: false, error: ADJUST_ERRORS[result?.error ?? ''] ?? 'Puan güncellenemedi.' };
  return { success: true, balance: result.balance };
}
