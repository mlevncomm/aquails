import { apiClient } from '@/lib/apiClient';

export interface ServiceSlot {
  id: string;
  date: string;
  time: string;
  label: string;
  available: boolean;
  status: string;
  customerName?: string | null;
  customerPhone?: string | null;
  serviceType?: string | null;
  address?: string | null;
  orderId?: string | null;
}

export async function getSlotsForDate(date: string): Promise<ServiceSlot[]> {
  return apiClient.get<ServiceSlot[]>(`/api/service-slots?date=${encodeURIComponent(date)}`);
}

export async function bookSlot(payload: {
  slotId: string;
  customerName: string;
  customerPhone: string;
  serviceType?: string;
  address?: string;
  orderId?: string;
}) {
  return apiClient.post<ServiceSlot>('/api/service-slots/book', payload);
}

export async function adminGetSlots(): Promise<ServiceSlot[]> {
  return apiClient.get<ServiceSlot[]>('/api/admin/service-slots');
}

export async function adminCreateSlot(body: Record<string, unknown>) {
  return apiClient.post<ServiceSlot>('/api/admin/service-slots', body);
}

export async function adminUpdateSlot(id: string, body: Record<string, unknown>) {
  return apiClient.patch<ServiceSlot>(`/api/admin/service-slots/${id}`, body);
}

export async function adminDeleteSlot(id: string) {
  return apiClient.delete(`/api/admin/service-slots/${id}`);
}

// Legacy helpers for checkout compatibility
export function generateSlots(): ServiceSlot[] {
  return [];
}

export async function getTodaySlots(): Promise<ServiceSlot[]> {
  const today = new Date().toISOString().slice(0, 10);
  return getSlotsForDate(today);
}

export async function getWeekSlots(): Promise<ServiceSlot[]> {
  return apiClient.get<ServiceSlot[]>('/api/service-slots');
}

export async function completeSlot(): Promise<void> {
  // Admin updates via adminUpdateSlot
}
