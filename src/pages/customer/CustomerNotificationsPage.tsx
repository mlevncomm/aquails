import { useState, useEffect } from 'react';
import { Package, Truck, Filter, Wrench, Tag, Info, Bell } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type Notification,
} from '@/services/notificationService';
import {
  CustomerPageShell,
  CustomerPageHeader,
  CustomerCard,
  CustomerEmpty,
  CustomerLoading,
  CustomerButton,
} from '@/components/customer/customer-ui';
import { cn } from '@/lib/utils';

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
  order: 'bg-aq-sky text-aq-blue',
  shipping: 'bg-aq-ice text-aq-deep',
  filter: 'bg-aq-sky/70 text-aq-blue',
  service: 'bg-amber-50 text-amber-700',
  campaign: 'bg-aq-sky text-aq-blue',
  promo: 'bg-aq-sky text-aq-blue',
  system: 'bg-aq-ice text-aq-muted',
  info: 'bg-aq-ice text-aq-muted',
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
      <CustomerPageShell>
        <CustomerLoading rows={4} />
      </CustomerPageShell>
    );
  }

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <CustomerPageShell>
      <CustomerPageHeader
        title="Bildirimlerim"
        description="Sipariş, servis ve kampanya güncellemeleri"
        action={
          hasUnread ? (
            <CustomerButton variant="ghost" onClick={() => void handleMarkAllRead()}>
              Tümünü okundu işaretle
            </CustomerButton>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <CustomerCard padding={false}>
          <CustomerEmpty
            icon={Bell}
            title="Bildirim yok"
            message="Yeni bildirimleriniz olduğunda burada görünecek."
          />
        </CustomerCard>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = typeIcons[n.type] || Info;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => void handleMarkRead(n.id)}
                className={cn(
                  'flex items-start gap-3 p-4 rounded-2xl w-full text-left transition-all border',
                  n.isRead
                    ? 'bg-white border-aq-border/60'
                    : 'bg-white border-aq-blue/20 shadow-[0_1px_2px_rgba(18,134,216,0.06)]',
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    typeColors[n.type] ?? typeColors.info,
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm',
                      n.isRead ? 'text-aq-muted' : 'text-aq-text font-semibold',
                    )}
                  >
                    {n.title}
                  </p>
                  <p className="text-xs text-aq-muted mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-aq-muted mt-1.5">{n.date}</p>
                </div>
                {!n.isRead && (
                  <div className="w-2 h-2 bg-aq-blue rounded-full flex-shrink-0 mt-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </CustomerPageShell>
  );
}
