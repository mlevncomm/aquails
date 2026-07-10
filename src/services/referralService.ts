export interface ReferralData {
  code: string;
  link: string;
  invitedCount: number;
  earnedCoupons: Array<{ code: string; value: number; date: string }>;
  history: Array<{ name: string; date: string; status: string }>;
}

export function getReferralData(): ReferralData {
  const saved = localStorage.getItem('referral-data');
  if (saved) return JSON.parse(saved);
  const code = 'AQUAILS' + Math.floor(100 + Math.random() * 900);
  return {
    code,
    link: `${window.location.origin}/kayit-ol?ref=${code}`,
    invitedCount: 0,
    earnedCoupons: [],
    history: [],
  };
}

export function saveReferralData(data: ReferralData): void {
  localStorage.setItem('referral-data', JSON.stringify(data));
}

export function trackReferralSignup(referralCode: string): void {
  const data = getReferralData();
  if (data.code === referralCode) {
    data.invitedCount += 1;
    data.earnedCoupons.push({ code: `DAVET${data.invitedCount * 50}`, value: 250, date: new Date().toISOString() });
    data.history.push({ name: `Davetli ${data.invitedCount}`, date: new Date().toISOString(), status: 'Tamamlandı' });
    saveReferralData(data);
  }
}
