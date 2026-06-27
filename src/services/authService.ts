import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/stores/authStore';
import { ensureCartSessionId } from '@/lib/apiClient';

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
  phone: string | null;
  role: 'customer' | 'admin';
}

const TOKEN_KEY = 'aquails_token';
const USER_KEY = 'aquails_user';

interface AuthResponse {
  user: User;
  token: string;
}

function saveSession(user: User, token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function loadUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

async function mergeGuestCartAfterLogin() {
  const sessionId = localStorage.getItem('aquails_cart_session');
  if (!sessionId) return;
  try {
    await apiClient.post('/api/cart/merge', { sessionId });
  } catch {
    // non-blocking
  }
}

export async function login(
  credentials: LoginCredentials,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const data = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
    saveSession(data.user, data.token);
    useAuthStore.getState().setUser(data.user);
    await mergeGuestCartAfterLogin();
    return { success: true, user: data.user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Giriş başarısız.',
    };
  }
}

export async function register(
  data: RegisterData,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const result = await apiClient.post<AuthResponse>('/api/auth/register', data);
    saveSession(result.user, result.token);
    useAuthStore.getState().setUser(result.user);
    ensureCartSessionId();
    await mergeGuestCartAfterLogin();
    return { success: true, user: result.user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Kayıt başarısız.',
    };
  }
}

export async function forgotPassword(
  email: string,
): Promise<{ success: boolean; message?: string; error?: string; devResetToken?: string }> {
  try {
    const data = await apiClient.post<{ message: string; devResetToken?: string }>(
      '/api/auth/forgot-password',
      { email },
    );
    return { success: true, message: data.message, devResetToken: data.devResetToken };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'İşlem başarısız.',
    };
  }
}

export async function resetPassword(
  token: string,
  password: string,
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const data = await apiClient.post<{ message: string }>('/api/auth/reset-password', {
      token,
      password,
    });
    return { success: true, message: data.message };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Şifre güncellenemedi.',
    };
  }
}

export async function logout(): Promise<void> {
  try {
    if (getAuthToken()) {
      await apiClient.post('/api/auth/logout');
    }
  } catch {
    // ignore
  } finally {
    clearSession();
    useAuthStore.getState().clearUser();
  }
}

export async function initAuth(): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    useAuthStore.getState().setHydrated();
    return;
  }

  try {
    const data = await apiClient.get<{ user: User }>('/api/auth/me');
    saveSession(data.user, token);
    useAuthStore.getState().setUser(data.user);
  } catch {
    clearSession();
    useAuthStore.getState().clearUser();
  } finally {
    useAuthStore.getState().setHydrated();
  }
}
