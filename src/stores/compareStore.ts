import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareState {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  clear: () => void;
  isComparing: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) => {
        const current = get().ids;
        if (current.includes(id)) return;
        if (current.length >= 4) { set({ ids: [...current.slice(1), id] }); return; }
        set({ ids: [...current, id] });
      },
      remove: (id) => set({ ids: get().ids.filter(i => i !== id) }),
      toggle: (id) => {
        if (get().ids.includes(id)) set({ ids: get().ids.filter(i => i !== id) });
        else get().add(id);
      },
      clear: () => set({ ids: [] }),
      isComparing: (id) => get().ids.includes(id),
    }),
    { name: 'compare-store' }
  )
);
