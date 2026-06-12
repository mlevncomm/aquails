import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Subscription {
  id: string;
  plan: '6ay' | '12ay' | 'premium';
  deviceName: string;
  nextDelivery: string;
  status: 'active' | 'paused' | 'cancelled';
  price: number;
  createdAt: string;
}

interface SubscriptionStore {
  subscriptions: Subscription[];
  add: (sub: Omit<Subscription, 'id' | 'createdAt'>) => void;
  pause: (id: string) => void;
  resume: (id: string) => void;
  cancel: (id: string) => void;
  changePlan: (id: string, plan: Subscription['plan']) => void;
}

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      subscriptions: [
        { id: '1', plan: '6ay', deviceName: 'Aquails PurePro 7 Aşamalı', nextDelivery: '15 Temmuz 2026', status: 'active', price: 590, createdAt: '2026-01-15' },
      ],
      add: (sub) => set({
        subscriptions: [...get().subscriptions, { ...sub, id: Date.now().toString(), createdAt: new Date().toISOString() }]
      }),
      pause: (id) => set({
        subscriptions: get().subscriptions.map(s => s.id === id ? { ...s, status: 'paused' as const } : s)
      }),
      resume: (id) => set({
        subscriptions: get().subscriptions.map(s => s.id === id ? { ...s, status: 'active' as const } : s)
      }),
      cancel: (id) => set({
        subscriptions: get().subscriptions.map(s => s.id === id ? { ...s, status: 'cancelled' as const } : s)
      }),
      changePlan: (id, plan) => set({
        subscriptions: get().subscriptions.map(s => s.id === id ? { ...s, plan } : s)
      }),
    }),
    { name: 'aquails_subscriptions' }
  )
);
