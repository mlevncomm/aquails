import { apiClient } from '@/lib/apiClient';
import type { User } from '@/services/authService';
import type { Address } from '@/types';

export async function getProfile(): Promise<{ user: User }> {
  return apiClient.get<{ user: User }>('/api/customers/profile');
}

export async function updateProfile(body: { name?: string; phone?: string | null }) {
  return apiClient.patch<{ user: User }>('/api/customers/profile', body);
}

export async function getAddresses(): Promise<Address[]> {
  return apiClient.get<Address[]>('/api/customers/addresses');
}

export async function createAddress(body: Omit<Address, 'id'>) {
  return apiClient.post<Address>('/api/customers/addresses', body);
}

export async function updateAddress(id: string, body: Partial<Address>) {
  return apiClient.patch<Address>(`/api/customers/addresses/${id}`, body);
}

export async function deleteAddress(id: string) {
  return apiClient.delete(`/api/customers/addresses/${id}`);
}

export async function getAdminDashboard() {
  return apiClient.get<Record<string, unknown>>('/api/admin/dashboard');
}

export async function getAdminCustomers() {
  return apiClient.get<Array<User & { registeredAt: string; orderCount: number }>>('/api/admin/customers');
}
