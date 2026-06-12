export interface LoyaltyTransaction {
  id: string;
  type: 'earn' | 'redeem';
  amount: number;
  description: string;
  date: string;
}

export interface LoyaltyData {
  totalPoints: number;
  availablePoints: number;
  totalEarned: number;
  totalRedeemed: number;
  transactions: LoyaltyTransaction[];
}

const DEFAULT: LoyaltyData = { totalPoints: 0, availablePoints: 0, totalEarned: 0, totalRedeemed: 0, transactions: [] };

function getData(): LoyaltyData {
  try {
    const saved = localStorage.getItem('loyalty-data');
    return saved ? JSON.parse(saved) : { ...DEFAULT, totalPoints: 1250, availablePoints: 1250, totalEarned: 1250 };
  } catch { return DEFAULT; }
}

function saveData(data: LoyaltyData): void {
  localStorage.setItem('loyalty-data', JSON.stringify(data));
}

export function getLoyaltyData(): LoyaltyData { return getData(); }

export function earnPoints(amount: number, description: string): void {
  const data = getData();
  const tx: LoyaltyTransaction = { id: Date.now().toString(), type: 'earn', amount, description, date: new Date().toISOString() };
  data.transactions.unshift(tx);
  data.totalPoints += amount;
  data.availablePoints += amount;
  data.totalEarned += amount;
  saveData(data);
}

export function redeemPoints(amount: number, description: string): boolean {
  const data = getData();
  if (data.availablePoints < amount) return false;
  const tx: LoyaltyTransaction = { id: Date.now().toString(), type: 'redeem', amount, description, date: new Date().toISOString() };
  data.transactions.unshift(tx);
  data.availablePoints -= amount;
  data.totalRedeemed += amount;
  saveData(data);
  return true;
}

export function convertPointsToCoupon(points: number): { code: string; discount: number } | null {
  if (points < 100) return null;
  const discount = Math.floor(points / 100) * 10;
  const code = `PUAN${points}-${Date.now().toString(36).toUpperCase()}`;
  if (redeemPoints(points, `Kupon: ${code}`)) return { code, discount };
  return null;
}

export const EARN_RULES = [
  { action: 'Her ₺100 alışveriş', points: 5 },
  { action: 'Yorum yazma', points: 50 },
  { action: 'Filtre aboneliği', points: 250 },
  { action: 'Arkadaş daveti', points: 300 },
  { action: 'Profili tamamla', points: 100 },
  { action: 'İlk sipariş', points: 200 },
];
