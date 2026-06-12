import { create } from 'zustand';
import { getLoyaltyData, earnPoints, redeemPoints, convertPointsToCoupon, type LoyaltyData } from '@/services/loyaltyService';

interface LoyaltyState {
  data: LoyaltyData;
  refresh: () => void;
  earn: (amount: number, description: string) => void;
  redeem: (amount: number, description: string) => boolean;
  convert: (points: number) => { code: string; discount: number } | null;
}

export const useLoyaltyStore = create<LoyaltyState>((set) => ({
  data: getLoyaltyData(),
  refresh: () => set({ data: getLoyaltyData() }),
  earn: (amount, description) => { earnPoints(amount, description); set({ data: getLoyaltyData() }); },
  redeem: (amount, description) => { const ok = redeemPoints(amount, description); set({ data: getLoyaltyData() }); return ok; },
  convert: (points) => { const coupon = convertPointsToCoupon(points); set({ data: getLoyaltyData() }); return coupon; },
}));
