import { apiClient } from '@/lib/apiClient';

export async function requestNotification(productId: string, email: string, phone?: string) {
  return apiClient.post('/api/stock-notifications', { productId, email, phone });
}

export async function adminGetNotifications() {
  return apiClient.get('/api/admin/stock-notifications');
}

export async function adminMarkNotified(id: string) {
  return apiClient.patch(`/api/admin/stock-notifications/${id}/mark-notified`);
}
