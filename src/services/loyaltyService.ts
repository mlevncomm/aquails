import { isSupabaseMode } from '@/lib/dataProvider';
import { requireSupabase } from '@/lib/supabase';

const STORAGE_KEY = 'aquails_loyalty';

export interface LoyaltyTransaction {
  id: string;
  type: 'earn' | 'redeem';
  amount: number;
  description: string;
  createdAt: string;
}

export interface LoyaltyData {
  points: number;
  transactions: LoyaltyTransaction[];
  totalPoints: number;
  availablePoints: number;
  totalRedeemed: number;
  totalEarned: number;
}

export const EARN_RULES = [
  { action: 'Sipariş tamamlama', points: 100 },
  { action: 'Ürün değerlendirme', points: 50 },
  { action: 'Arkadaş daveti', points: 250 },
  { action: 'Filtre aboneliği', points: 75 },
];

function getLocalData(): LoyaltyData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const base = raw ? JSON.parse(raw) : { points: 0, transactions: [] };
    const redeemed = (base.transactions ?? []).filter((t: LoyaltyTransaction) => t.type === 'redeem').reduce((s: number, t: LoyaltyTransaction) => s + t.amount, 0);
    return {
      points: base.points ?? 0,
      transactions: base.transactions ?? [],
      totalPoints: (base.points ?? 0) + redeemed,
      availablePoints: base.points ?? 0,
      totalRedeemed: redeemed,
      totalEarned: (base.points ?? 0) + redeemed,
    };
  } catch {
    return { points: 0, transactions: [], totalPoints: 0, availablePoints: 0, totalRedeemed: 0, totalEarned: 0 };
  }
}

function saveLocalData(data: LoyaltyData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

async function getSupabaseData(): Promise<LoyaltyData> {
  const supabase = requireSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { points: 0, transactions: [], totalPoints: 0, availablePoints: 0, totalRedeemed: 0, totalEarned: 0 };

  const [{ data: profile }, { data: transactions }] = await Promise.all([
    supabase.from('profiles').select('loyalty_points').eq('id', user.id).single(),
    supabase.from('loyalty_transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
  ]);

  const redeemed = (transactions ?? []).filter((t) => t.type === 'redeem').reduce((s, t) => s + Number(t.amount), 0);
  const points = Number(profile?.loyalty_points ?? 0);

  return {
    points,
    transactions: (transactions ?? []).map((t) => ({
      id: String(t.id),
      type: t.type as 'earn' | 'redeem',
      amount: Number(t.amount),
      description: String(t.description ?? ''),
      createdAt: String(t.created_at),
    })),
    totalPoints: points + redeemed,
    availablePoints: points,
    totalRedeemed: redeemed,
    totalEarned: points + redeemed,
  };
}

export async function getLoyaltyData(): Promise<LoyaltyData> {
  if (isSupabaseMode) return getSupabaseData();
  return getLocalData();
}

export async function earnPoints(amount: number, description: string): Promise<void> {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('loyalty_transactions').insert({ user_id: user.id, type: 'earn', amount, description });
    const { data: profile } = await supabase.from('profiles').select('loyalty_points').eq('id', user.id).single();
    const current = Number(profile?.loyalty_points ?? 0);
    await supabase.from('profiles').update({ loyalty_points: current + amount }).eq('id', user.id);
    return;
  }
  const data = getLocalData();
  data.points += amount;
  data.transactions.unshift({ id: crypto.randomUUID(), type: 'earn', amount, description, createdAt: new Date().toISOString() });
  saveLocalData(data);
}

export async function redeemPoints(amount: number, description: string): Promise<boolean> {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data: profile } = await supabase.from('profiles').select('loyalty_points').eq('id', user.id).single();
    const current = Number(profile?.loyalty_points ?? 0);
    if (current < amount) return false;
    await supabase.from('loyalty_transactions').insert({ user_id: user.id, type: 'redeem', amount, description });
    await supabase.from('profiles').update({ loyalty_points: current - amount }).eq('id', user.id);
    return true;
  }
  const data = getLocalData();
  if (data.points < amount) return false;
  data.points -= amount;
  data.transactions.unshift({ id: crypto.randomUUID(), type: 'redeem', amount, description, createdAt: new Date().toISOString() });
  saveLocalData(data);
  return true;
}

export async function convertPointsToCoupon(points: number): Promise<{ code: string; discount: number } | null> {
  const ok = await redeemPoints(points, `${points} puan kupon dönüşümü`);
  if (!ok) return null;
  const discount = Math.floor(points / 10);
  return { code: `PUAN${discount}`, discount };
}
