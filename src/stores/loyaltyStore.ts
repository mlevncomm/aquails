import { create } from 'zustand';
import {
  getLoyaltyData,
  earnPoints,
  redeemPoints,
  convertPointsToCoupon,
  type LoyaltyData,
} from '@/services/loyaltyService';
import { getCurrentUser } from '@/services/authService';

const emptyData: LoyaltyData = { totalPoints: 0, availablePoints: 0, totalRedeemed: 0 };

interface LoyaltyState {
  data: LoyaltyData;
  refresh: () => Promise<void>;
  earn: (amount: number, description: string) => Promise<void>;
  redeem: (amount: number, description: string) => Promise<boolean>;
  convert: (points: number) => Promise<{ code: string; discount: number } | null>;
}

export const useLoyaltyStore = create<LoyaltyState>((set) => ({
  data: emptyData,
  refresh: async () => {
    const user = await getCurrentUser();
    const data = await getLoyaltyData(user?.id);
    set({ data });
  },
  earn: async (amount, description) => {
    const user = await getCurrentUser();
    if (!user) return;
    await earnPoints(user.id, amount, description);
    const data = await getLoyaltyData(user.id);
    set({ data });
  },
  redeem: async (amount, description) => {
    const user = await getCurrentUser();
    if (!user) return false;
    const result = await redeemPoints(user.id, amount, description);
    if (result.success) {
      const data = await getLoyaltyData(user.id);
      set({ data });
      return true;
    }
    return false;
  },
  convert: async (points) => {
    const coupon = await convertPointsToCoupon(points);
    const user = await getCurrentUser();
    if (user) {
      const data = await getLoyaltyData(user.id);
      set({ data });
    }
    return coupon;
  },
}));
