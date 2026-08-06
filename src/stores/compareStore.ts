import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const COMPARE_MAX = 4;

export type CompareToggleResult = 'added' | 'removed' | 'replaced';

interface CompareState {
  ids: string[];
  add: (id: string) => CompareToggleResult | 'noop';
  remove: (id: string) => void;
  toggle: (id: string) => CompareToggleResult;
  clear: () => void;
  isComparing: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) => {
        const current = get().ids;
        if (current.includes(id)) return 'noop';
        if (current.length >= COMPARE_MAX) {
          set({ ids: [...current.slice(1), id] });
          return 'replaced';
        }
        set({ ids: [...current, id] });
        return 'added';
      },
      remove: (id) => set({ ids: get().ids.filter((i) => i !== id) }),
      toggle: (id) => {
        if (get().ids.includes(id)) {
          set({ ids: get().ids.filter((i) => i !== id) });
          return 'removed';
        }
        return get().add(id) as CompareToggleResult;
      },
      clear: () => set({ ids: [] }),
      isComparing: (id) => get().ids.includes(id),
    }),
    { name: 'compare-store' },
  ),
);

export function compareToastMessage(result: CompareToggleResult): string {
  switch (result) {
    case 'added':
      return 'Karşılaştırma listesine eklendi.';
    case 'removed':
      return 'Karşılaştırma listesinden çıkarıldı.';
    case 'replaced':
      return `Liste dolu (max ${COMPARE_MAX}). En eski ürün çıkarıldı, yenisi eklendi.`;
  }
}
