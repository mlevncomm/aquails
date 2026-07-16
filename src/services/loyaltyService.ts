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
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { data } = await supabase
    .from('profiles')
    .select('loyalty_points')
    .eq('id', userId)
    .maybeSingle();

  if (!data) return { success: false, error: 'Kullanıcı bulunamadı.' };

  const { error } = await supabase
    .from('profiles')
    .update({ loyalty_points: data.loyalty_points + amount })
    .eq('id', userId);

  if (error) return { success: false, error: error.message };
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
