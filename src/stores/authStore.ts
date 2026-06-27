import { create } from 'zustand';
import type { User } from '@/services/authService';
import { initAuth } from '@/services/authService';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  hasHydrated: boolean;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  hasHydrated: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
    }),
  clearUser: () => set({ user: null, isAuthenticated: false, isAdmin: false }),
  setHydrated: () => set({ hasHydrated: true }),
}));

void initAuth();
