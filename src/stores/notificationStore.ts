import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'shipping' | 'filter' | 'service' | 'campaign' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationState {
  notifications: Notification[];
  settings: { email: boolean; sms: boolean; whatsapp: boolean; push: boolean };
  addNotification: (n: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  deleteNotification: (id: string) => void;
  updateSettings: (s: Partial<NotificationState['settings']>) => void;
  unreadCount: () => number;
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Siparisiniz kargoya verildi', message: '#ORD-00123 numarali siparisiniz Yurtici Kargo ile yola cikti.', type: 'shipping', read: false, createdAt: new Date(Date.now() - 86400000).toISOString(), link: '/hesabim/siparisler' },
  { id: '2', title: 'Filtre degisimi yaklasiyor', message: 'Su aritma cihazinizin sediment filtresi degisimi 15 gun icinde.', type: 'filter', read: false, createdAt: new Date(Date.now() - 172800000).toISOString(), link: '/filtre-aboneligi' },
  { id: '3', title: 'Yeni kampanya basladi', message: 'Direkt akis cihazlarda %20 indirim firsatini kacirmayin!', type: 'campaign', read: true, createdAt: new Date(Date.now() - 259200000).toISOString(), link: '/kampanyalar' },
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: DEFAULT_NOTIFICATIONS,
      settings: { email: true, sms: true, whatsapp: false, push: true },
      addNotification: (n) => set({ notifications: [{ ...n, id: Date.now().toString(), createdAt: new Date().toISOString() }, ...get().notifications] }),
      markAsRead: (id) => set({ notifications: get().notifications.map(n => n.id === id ? { ...n, read: true } : n) }),
      markAllRead: () => set({ notifications: get().notifications.map(n => ({ ...n, read: true })) }),
      deleteNotification: (id) => set({ notifications: get().notifications.filter(n => n.id !== id) }),
      updateSettings: (s) => set({ settings: { ...get().settings, ...s } }),
      unreadCount: () => get().notifications.filter(n => !n.read).length,
    }),
    { name: 'notification-store' }
  )
);
