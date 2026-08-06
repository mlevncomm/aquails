import { create } from 'zustand';
import type { User } from '@/services/authService';

function isAdminRole(role: User['role'] | undefined): boolean {
  return role === 'admin' || role === 'super_admin';
}

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
    set({ user, isAuthenticated: !!user, isAdmin: isAdminRole(user?.role) }),
  clearUser: () => set({ user: null, isAuthenticated: false, isAdmin: false }),
  setHydrated: () => set({ hasHydrated: true }),
}));
