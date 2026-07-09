import { getSupabaseOrNull, isSupabaseConfigured } from '@/lib/supabase';
import type { Profile, UserRole } from '@/types/database';
import { useAuthStore } from '@/stores/authStore';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

/** @deprecated Dev-only legacy mock users when Supabase env is not set */
const DEV_MOCK_USERS: User[] = [
  { id: '1', name: 'Ahmet Yılmaz', email: 'ahmet@email.com', phone: '0532 123 45 67', role: 'customer' },
  { id: '2', name: 'Aquails Admin', email: 'admin@aquails.com', phone: '0850 123 45 67', role: 'admin' },
];

const LEGACY_STORAGE_KEY = 'aquails_auth';

function mapProfile(profile: Profile): User {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone ?? '',
    role: profile.role,
  };
}

function saveLegacyUser(user: User | null) {
  if (user) localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(LEGACY_STORAGE_KEY);
}

export function loadUserFromStorage(): User | null {
  if (isSupabaseConfigured()) return null;
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function getProfile(userId: string): Promise<User | null> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return mapProfile(data);
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return loadUserFromStorage();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const profile = await getProfile(session.user.id);
  if (profile) return profile;

  return {
    id: session.user.id,
    email: session.user.email ?? '',
    name: session.user.user_metadata?.name ?? '',
    phone: session.user.user_metadata?.phone ?? '',
    role: 'customer',
  };
}

export async function signIn(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
  const supabase = getSupabaseOrNull();

  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) return { success: false, error: error.message };

    const user = await getProfile(data.user.id) ?? {
      id: data.user.id,
      email: data.user.email ?? credentials.email,
      name: data.user.user_metadata?.name ?? '',
      phone: data.user.user_metadata?.phone ?? '',
      role: 'customer' as const,
    };
    useAuthStore.getState().setUser(user);
    return { success: true, user };
  }

  // Dev legacy mock (only without Supabase env)
  await new Promise((r) => setTimeout(r, 300));
  if (credentials.email === 'admin@aquails.com' && credentials.password === 'admin123') {
    const user = DEV_MOCK_USERS[1];
    saveLegacyUser(user);
    useAuthStore.getState().setUser(user);
    return { success: true, user };
  }
  if (credentials.email === 'ahmet@email.com' && credentials.password === '123456') {
    const user = DEV_MOCK_USERS[0];
    saveLegacyUser(user);
    useAuthStore.getState().setUser(user);
    return { success: true, user };
  }
  return { success: false, error: 'E-posta veya şifre hatalı.' };
}

export async function signUp(data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
  const supabase = getSupabaseOrNull();

  if (supabase) {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: data.name, phone: data.phone },
      },
    });
    if (error) return { success: false, error: error.message };
    if (!authData.user) return { success: false, error: 'Kayıt oluşturulamadı.' };

    const user: User = {
      id: authData.user.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'customer',
    };
    useAuthStore.getState().setUser(user);
    return { success: true, user };
  }

  // Dev legacy mock
  await new Promise((r) => setTimeout(r, 300));
  const user: User = {
    id: Date.now().toString(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: 'customer',
  };
  saveLegacyUser(user);
  useAuthStore.getState().setUser(user);
  return { success: true, user };
}

export async function signOut(): Promise<void> {
  const supabase = getSupabaseOrNull();
  if (supabase) await supabase.auth.signOut();
  saveLegacyUser(null);
  useAuthStore.getState().clearUser();
}

export async function forgotPassword(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
  if (!email.includes('@')) return { success: false, error: 'Geçerli bir e-posta adresi girin.' };

  const supabase = getSupabaseOrNull();
  if (supabase) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/sifremi-unuttum`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true, message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.' };
  }

  await new Promise((r) => setTimeout(r, 300));
  return { success: true, message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. (mock)' };
}

/** Initialize auth: Supabase session listener or legacy localStorage hydrate */
export async function initAuth(): Promise<void> {
  const supabase = getSupabaseOrNull();

  if (supabase) {
    const user = await getCurrentUser();
    if (user) useAuthStore.getState().setUser(user);

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await getProfile(session.user.id);
        useAuthStore.getState().setUser(profile ?? {
          id: session.user.id,
          email: session.user.email ?? '',
          name: session.user.user_metadata?.name ?? '',
          phone: session.user.user_metadata?.phone ?? '',
          role: 'customer',
        });
      } else {
        useAuthStore.getState().clearUser();
      }
      useAuthStore.getState().setHydrated();
    });
  } else {
    const stored = loadUserFromStorage();
    if (stored) useAuthStore.getState().setUser(stored);
  }

  useAuthStore.getState().setHydrated();
}

// Backward-compatible aliases
export const login = signIn;
export const register = signUp;
export const logout = () => { void signOut(); };
