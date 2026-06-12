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
  role: 'customer' | 'admin';
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Ahmet Yılmaz', email: 'ahmet@email.com', phone: '0532 123 45 67', role: 'customer' },
  { id: '2', name: 'Aquails Admin', email: 'admin@aquails.com', phone: '0850 123 45 67', role: 'admin' },
];

const STORAGE_KEY = 'aquails_auth';

function saveToStorage(user: User | null) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
}

export function loadUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export async function login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
  await new Promise(r => setTimeout(r, 500));

  if (credentials.email === 'admin@aquails.com' && credentials.password === 'admin123') {
    const user = MOCK_USERS[1];
    saveToStorage(user);
    useAuthStore.getState().setUser(user);
    return { success: true, user };
  }
  if (credentials.email === 'ahmet@email.com' && credentials.password === '123456') {
    const user = MOCK_USERS[0];
    saveToStorage(user);
    useAuthStore.getState().setUser(user);
    return { success: true, user };
  }
  return { success: false, error: 'E-posta veya şifre hatalı.' };
}

export async function register(data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
  await new Promise(r => setTimeout(r, 500));
  const user: User = { id: Date.now().toString(), name: data.name, email: data.email, phone: data.phone, role: 'customer' };
  saveToStorage(user);
  useAuthStore.getState().setUser(user);
  return { success: true, user };
}

export async function forgotPassword(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
  await new Promise(r => setTimeout(r, 500));
  if (!email.includes('@')) return { success: false, error: 'Geçerli bir e-posta adresi girin.' };
  return { success: true, message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.' };
}

export function logout(): void {
  saveToStorage(null);
  useAuthStore.getState().clearUser();
}

export function initAuth(): void {
  const user = loadUserFromStorage();
  if (user) useAuthStore.getState().setUser(user);
}
