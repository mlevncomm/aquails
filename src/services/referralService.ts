import { getSupabaseOrNull } from '@/lib/supabase';
import { formatDateTR } from '@/lib/format';

export interface ReferralData {
  code: string;
  link: string;
  invitedCount: number;
  earnedCoupons: Array<{ code: string; value: number; date: string }>;
  history: Array<{ name: string; date: string; status: string }>;
}

export async function getReferralData(): Promise<ReferralData> {
  const supabase = getSupabaseOrNull();
  const fallbackCode = 'AQUAILS';
  const empty: ReferralData = {
    code: fallbackCode,
    link: `${window.location.origin}/kayit-ol?ref=${fallbackCode}`,
    invitedCount: 0,
    earnedCoupons: [],
    history: [],
  };

  if (!supabase) return empty;

  const { data: codeData, error: codeError } = await supabase.rpc('ensure_referral_code');
  if (codeError || !codeData) return empty;

  const code = String(codeData);
  const { data: rows } = await supabase
    .from('referrals')
    .select('id, referred_email, status, reward_points, created_at')
    .order('created_at', { ascending: false });

  const history = (rows ?? []).map((r) => ({
    name: r.referred_email || 'Davetli',
    date: formatDateTR(r.created_at),
    status: r.status === 'completed' ? 'Tamamlandı' : 'Bekliyor',
  }));

  const earnedCoupons = (rows ?? [])
    .filter((r) => r.status === 'completed')
    .map((r) => ({
      code: `DAVET-${String(r.id).slice(0, 6).toUpperCase()}`,
      value: r.reward_points,
      date: formatDateTR(r.created_at),
    }));

  return {
    code,
    link: `${window.location.origin}/kayit-ol?ref=${code}`,
    invitedCount: rows?.length ?? 0,
    earnedCoupons,
    history,
  };
}

export async function trackReferralSignup(referralCode: string): Promise<void> {
  if (!referralCode.trim()) return;
  const supabase = getSupabaseOrNull();
  if (!supabase) return;
  await supabase.rpc('track_referral_signup', { p_referral_code: referralCode.trim() });
}
