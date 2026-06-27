import { isSupabaseMode } from '@/lib/dataProvider';
import { isSupabaseConfigured, requireSupabase } from '@/lib/supabase';
import { invokeFunction } from '@/lib/api';
import { apiClient, ensureCartSessionId } from '@/lib/apiClient';
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

export type UserRole = 'customer' | 'admin' | 'super_admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
}

const TOKEN_KEY = 'aquails_token';
const USER_KEY = 'aquails_user';

interface AuthResponse {
  user: User;
  token: string;
}

function mapProfileToUser(profile: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
}): User {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    role: profile.role,
  };
}

function saveExpressSession(user: User, token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearExpressSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAuthToken(): string | null {
  if (isSupabaseMode) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function loadUserFromStorage(): User | null {
  if (isSupabaseMode) return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

async function fetchProfile(userId: string): Promise<User | null> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('profiles').select('id, name, email, phone, role').eq('id', userId).single();
  if (error || !data) return null;
  return mapProfileToUser(data as User);
}

async function mergeGuestCartAfterLogin() {
  const sessionId = localStorage.getItem('aquails_cart_session');
  if (!sessionId) return;
  try {
    if (isSupabaseMode) {
      await invokeFunction('cart-manage', { action: 'merge', sessionId });
    } else {
      await apiClient.post('/api/cart/merge', { sessionId });
    }
  } catch {
    // non-blocking
  }
}

export async function login(
  credentials: LoginCredentials,
): Promise<{ success: boolean; user?: User; error?: string }> {
  if (isSupabaseMode) {
    try {
      const supabase = requireSupabase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      if (error || !data.user) {
        return { success: false, error: error?.message ?? 'Giriş başarısız.' };
      }
      const user = await fetchProfile(data.user.id);
      if (!user) return { success: false, error: 'Profil bulunamadı.' };
      useAuthStore.getState().setUser(user);
      await mergeGuestCartAfterLogin();
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Giriş başarısız.' };
    }
  }

  try {
    const data = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
    saveExpressSession(data.user, data.token);
    useAuthStore.getState().setUser(data.user);
    await mergeGuestCartAfterLogin();
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Giriş başarısız.' };
  }
}

export async function register(
  data: RegisterData,
): Promise<{ success: boolean; user?: User; error?: string }> {
  if (isSupabaseMode) {
    try {
      const supabase = requireSupabase();
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { name: data.name, phone: data.phone },
        },
      });
      if (error) return { success: false, error: error.message };
      if (!authData.user) return { success: false, error: 'Kayıt başarısız.' };

      await supabase.from('profiles').update({ name: data.name, phone: data.phone }).eq('id', authData.user.id);

      const user = await fetchProfile(authData.user.id);
      if (user) useAuthStore.getState().setUser(user);
      ensureCartSessionId();
      await mergeGuestCartAfterLogin();
      return { success: true, user: user ?? undefined };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Kayıt başarısız.' };
    }
  }

  try {
    const result = await apiClient.post<AuthResponse>('/api/auth/register', data);
    saveExpressSession(result.user, result.token);
    useAuthStore.getState().setUser(result.user);
    ensureCartSessionId();
    await mergeGuestCartAfterLogin();
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Kayıt başarısız.' };
  }
}

export async function forgotPassword(
  email: string,
): Promise<{ success: boolean; message?: string; error?: string; devResetToken?: string }> {
  if (isSupabaseMode) {
    try {
      const supabase = requireSupabase();
      const redirectTo = `${import.meta.env.VITE_APP_URL ?? window.location.origin}/#/sifre-sifirla`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) return { success: false, error: error.message };
      return { success: true, message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'İşlem başarısız.' };
    }
  }

  try {
    const data = await apiClient.post<{ message: string; devResetToken?: string }>(
      '/api/auth/forgot-password',
      { email },
    );
    return { success: true, message: data.message, devResetToken: data.devResetToken };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'İşlem başarısız.' };
  }
}

export async function resetPassword(
  token: string,
  password: string,
): Promise<{ success: boolean; message?: string; error?: string }> {
  if (isSupabaseMode) {
    try {
      const supabase = requireSupabase();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) return { success: false, error: error.message };
      return { success: true, message: 'Şifreniz güncellendi.' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Şifre güncellenemedi.' };
    }
  }

  try {
    const data = await apiClient.post<{ message: string }>('/api/auth/reset-password', { token, password });
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Şifre güncellenemedi.' };
  }
}

export async function logout(): Promise<void> {
  if (isSupabaseMode) {
    try {
      await requireSupabase().auth.signOut();
    } catch {
      // ignore
    } finally {
      useAuthStore.getState().clearUser();
    }
    return;
  }

  try {
    if (getAuthToken()) await apiClient.post('/api/auth/logout');
  } catch {
    // ignore
  } finally {
    clearExpressSession();
    useAuthStore.getState().clearUser();
  }
}

async function initSupabaseAuth() {
  const supabase = requireSupabase();
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) {
    const user = await fetchProfile(data.session.user.id);
    if (user) useAuthStore.getState().setUser(user);
    else useAuthStore.getState().clearUser();
  } else {
    useAuthStore.getState().clearUser();
  }

  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      const user = await fetchProfile(session.user.id);
      useAuthStore.getState().setUser(user);
    } else {
      useAuthStore.getState().clearUser();
    }
  });
}

export async function initAuth(): Promise<void> {
  if (isSupabaseMode) {
    try {
      if (!isSupabaseConfigured) {
        useAuthStore.getState().clearUser();
        return;
      }
      await initSupabaseAuth();
    } catch {
      useAuthStore.getState().clearUser();
    } finally {
      useAuthStore.getState().setHydrated();
    }
    return;
  }

  const token = getAuthToken();
  if (!token) {
    useAuthStore.getState().setHydrated();
    return;
  }

  try {
    const data = await apiClient.get<{ user: User }>('/api/auth/me');
    saveExpressSession(data.user, token);
    useAuthStore.getState().setUser(data.user);
  } catch {
    clearExpressSession();
    useAuthStore.getState().clearUser();
  } finally {
    useAuthStore.getState().setHydrated();
  }
}
