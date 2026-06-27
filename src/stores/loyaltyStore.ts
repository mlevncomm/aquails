import { create } from 'zustand';
import { getLoyaltyData, earnPoints, redeemPoints, convertPointsToCoupon, type LoyaltyData } from '@/services/loyaltyService';

const emptyData: LoyaltyData = {
  points: 0,
  transactions: [],
  totalPoints: 0,
  availablePoints: 0,
  totalRedeemed: 0,
  totalEarned: 0,
};

interface LoyaltyState {
  data: LoyaltyData;
  refresh: () => Promise<void>;
  earn: (amount: number, description: string) => Promise<void>;
  redeem: (amount: number, description: string) => Promise<boolean>;
  convert: (points: number) => Promise<{ code: string; discount: number } | null>;
}

export const useLoyaltyStore = create<LoyaltyState>((set) => ({
  data: emptyData,
  refresh: async () => set({ data: await getLoyaltyData() }),
  earn: async (amount, description) => {
    await earnPoints(amount, description);
    set({ data: await getLoyaltyData() });
  },
  redeem: async (amount, description) => {
    const ok = await redeemPoints(amount, description);
    set({ data: await getLoyaltyData() });
    return ok;
  },
  convert: async (points) => {
    const coupon = await convertPointsToCoupon(points);
    set({ data: await getLoyaltyData() });
    return coupon;
  },
}));

void useLoyaltyStore.getState().refresh();
