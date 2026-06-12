import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavStore {
  ids: string[];
  toggle: (id: string) => void;
  isFav: (id: string) => boolean;
  clear: () => void;
}

export const useFavoritesStore = create<FavStore>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const ids = get().ids;
        if (ids.includes(id)) set({ ids: ids.filter(i => i !== id) });
        else set({ ids: [...ids, id] });
      },
      isFav: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: 'aquails_favorites' }
  )
);
