import { useState, useEffect } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { Package, Truck, Filter, Wrench, Tag, Info, Bell, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type Notification,
} from '@/services/notificationService';

const typeIcons: Record<string, React.ElementType> = {
  order: Package,
  shipping: Truck,
  filter: Filter,
  service: Wrench,
  campaign: Tag,
  promo: Tag,
  system: Info,
  info: Info,
};
const typeColors: Record<string, string> = {
  order: 'bg-blue-50 text-blue-600',
  shipping: 'bg-purple-50 text-purple-600',
  filter: 'bg-emerald-50 text-emerald-600',
  service: 'bg-orange-50 text-orange-600',
  campaign: 'bg-pink-50 text-pink-600',
  promo: 'bg-pink-50 text-pink-600',
  system: 'bg-gray-100 text-gray-500',
  info: 'bg-gray-100 text-gray-500',
};

export default function CustomerNotificationsPage() {
  const user = useAuthStore((s) => s.user);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    if (!user) return;
    const data = await getNotifications(user.id);
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    void loadNotifications();
  }, [user]);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    await markAllNotificationsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-[#8B9DAF]">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Yükleniyor...
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-[#0D2137]">Bildirimlerim</h2>
        {notifications.some((n) => !n.isRead) && (
          <button onClick={() => void handleMarkAllRead()} className="text-xs font-medium text-[#1A73E8] hover:underline">
            Tümünü Okundu İşaretle
          </button>
        )}
      </div>
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-8 h-8" />}
            title="Bildirim Bulunmuyor"
            description="Yeni bildirimleriniz olduğunda burada görünecek."
          />
        ) : (
          notifications.map((n) => {
            const Icon = typeIcons[n.type] || Info;
            return (
              <div
                key={n.id}
                onClick={() => void handleMarkRead(n.id)}
                className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  n.isRead ? 'bg-white border border-[#E8F0FE]' : 'bg-[#F0F6FF] border border-[#1A73E8]/20'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[n.type] ?? typeColors.info}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.isRead ? 'text-[#5A6B7B]' : 'text-[#0D2137] font-medium'}`}>{n.title}</p>
                  <p className="text-xs text-[#8B9DAF] mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-[#8B9DAF] mt-1">{n.date}</p>
                </div>
                {!n.isRead && <div className="w-2 h-2 bg-[#1A73E8] rounded-full flex-shrink-0 mt-1.5" />}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
