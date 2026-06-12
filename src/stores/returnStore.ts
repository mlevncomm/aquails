import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ReturnRequest {
  id: string;
  orderNo: string;
  productName: string;
  type: 'return' | 'exchange' | 'service';
  reason: string;
  description: string;
  status: 'received' | 'reviewing' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
}

interface ReturnStore {
  returns: ReturnRequest[];
  add: (r: Omit<ReturnRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateStatus: (id: string, status: ReturnRequest['status']) => void;
  remove: (id: string) => void;
}

export const useReturnStore = create<ReturnStore>()(
  persist(
    (set, get) => ({
      returns: [
        { id: '1', orderNo: 'AQ-2026-1847', productName: 'Aquails PurePro 7 Aşamalı', type: 'return', reason: 'Farklı model istiyorum', description: 'Daha büyük kapasiteli model almak istiyorum.', status: 'approved', createdAt: '2026-06-05' },
      ],
      add: (r) => set({
        returns: [...get().returns, { ...r, id: Date.now().toString(), status: 'received', createdAt: new Date().toISOString() }]
      }),
      updateStatus: (id, status) => set({
        returns: get().returns.map(r => r.id === id ? { ...r, status } : r)
      }),
      remove: (id) => set({
        returns: get().returns.filter(r => r.id !== id)
      }),
    }),
    { name: 'aquails_returns' }
  )
);
