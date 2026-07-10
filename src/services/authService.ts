import { getSupabaseOrNull, isSupabaseConfigured } from '@/lib/supabase';
import type { Profile, UserRole } from '@/types/database';
import type { Database } from '@/types/database';
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

function mapProfile(profile: Profile): User {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone ?? '',
    role: profile.role,
  };
}

export function loadUserFromStorage(): User | null {
  return null;
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
  if (!supabase) return null;

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

function supabaseRequired() {
  return !isSupabaseConfigured()
    ? { success: false as const, error: 'Oturum servisi yapılandırılmamış. Lütfen daha sonra tekrar deneyin.' }
    : null;
}

export async function signIn(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
  const missing = supabaseRequired();
  if (missing) return missing;

  const supabase = getSupabaseOrNull()!;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });
  if (error) return { success: false, error: 'E-posta veya şifre hatalı.' };

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

export async function signUp(data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
  const missing = supabaseRequired();
  if (missing) return missing;

  const supabase = getSupabaseOrNull()!;
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

export async function signOut(): Promise<void> {
  const supabase = getSupabaseOrNull();
  if (supabase) await supabase.auth.signOut();
  useAuthStore.getState().clearUser();
}

export async function forgotPassword(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
  if (!email.includes('@')) return { success: false, error: 'Geçerli bir e-posta adresi girin.' };

  const missing = supabaseRequired();
  if (missing) return missing;

  const supabase = getSupabaseOrNull()!;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/sifremi-unuttum`,
  });
  if (error) return { success: false, error: error.message };
  return { success: true, message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.' };
}

export async function updateProfile(updates: {
  name?: string;
  phone?: string;
}): Promise<{ success: boolean; user?: User; error?: string }> {
  const missing = supabaseRequired();
  if (missing) return missing;

  const supabase = getSupabaseOrNull()!;
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return { success: false, error: 'Oturum bulunamadı.' };

  const payload: Database['public']['Tables']['profiles']['Update'] = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.phone !== undefined) payload.phone = updates.phone;

  const { error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', authUser.id);

  if (error) return { success: false, error: error.message };

  if (updates.name || updates.phone) {
    await supabase.auth.updateUser({
      data: {
        name: updates.name,
        phone: updates.phone,
      },
    });
  }

  const user = await getProfile(authUser.id);
  if (user) useAuthStore.getState().setUser(user);
  return { success: true, user: user ?? undefined };
}

export async function updatePassword(
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const missing = supabaseRequired();
  if (missing) return missing;

  if (newPassword.length < 6) {
    return { success: false, error: 'Şifre en az 6 karakter olmalıdır.' };
  }

  const supabase = getSupabaseOrNull()!;
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/** Initialize auth: Supabase session listener */
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
  }

  useAuthStore.getState().setHydrated();
}

export const login = signIn;
export const register = signUp;
export const logout = () => { void signOut(); };
