import { isSupabaseMode } from '@/lib/dataProvider';
import { requireSupabase } from '@/lib/supabase';

const STORAGE_KEY = 'aquails_referral';

export interface ReferralData {
  code: string;
  referrals: number;
  earned: number;
  link: string;
  invitedCount: number;
  earnedCoupons: string[];
  history: Array<{ name: string; date: string; status: string }>;
}

function buildReferralLink(code: string) {
  const base = import.meta.env.VITE_APP_URL ?? (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/#/kayit?ref=${code}`;
}

function getLocalData(): ReferralData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const base = raw ? JSON.parse(raw) : { code: 'AQUAILS', referrals: 0, earned: 0 };
    return {
      code: base.code ?? 'AQUAILS',
      referrals: base.referrals ?? 0,
      earned: base.earned ?? 0,
      link: buildReferralLink(base.code ?? 'AQUAILS'),
      invitedCount: base.referrals ?? 0,
      earnedCoupons: base.earnedCoupons ?? [],
      history: base.history ?? [],
    };
  } catch {
    return { code: 'AQUAILS', referrals: 0, earned: 0, link: buildReferralLink('AQUAILS'), invitedCount: 0, earnedCoupons: [], history: [] };
  }
}

function saveLocalData(data: ReferralData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function getReferralData(): Promise<ReferralData> {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { code: '', referrals: 0, earned: 0, link: '', invitedCount: 0, earnedCoupons: [], history: [] };
    const { data: profile } = await supabase.from('profiles').select('referral_code').eq('id', user.id).single();
    const { count } = await supabase.from('referrals').select('*', { count: 'exact', head: true }).eq('referrer_id', user.id);
    const { data: rewards } = await supabase.from('referrals').select('reward_amount').eq('referrer_id', user.id);
    const earned = (rewards ?? []).reduce((sum, r) => sum + Number(r.reward_amount), 0);
    const code = String(profile?.referral_code ?? '');
    return {
      code,
      referrals: count ?? 0,
      earned,
      link: buildReferralLink(code),
      invitedCount: count ?? 0,
      earnedCoupons: earned > 0 ? [`REF${Math.floor(earned / 250)}`] : [],
      history: [],
    };
  }
  return getLocalData();
}

export async function saveReferralData(data: ReferralData): Promise<void> {
  if (!isSupabaseMode) saveLocalData(data);
}

export async function trackReferralSignup(referralCode: string): Promise<void> {
  if (!isSupabaseMode) return;
  const supabase = requireSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { data: referrer } = await supabase.from('profiles').select('id').eq('referral_code', referralCode.toUpperCase()).maybeSingle();
  if (!referrer || referrer.id === user.id) return;
  await supabase.from('referrals').insert({ referrer_id: referrer.id, referred_user_id: user.id, status: 'completed', reward_amount: 50 });
  await supabase.from('profiles').update({ referred_by: referrer.id }).eq('id', user.id);
}
