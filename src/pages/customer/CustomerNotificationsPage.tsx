import { useNotificationStore } from '@/stores/notificationStore';
import { EmptyState } from '@/components/EmptyState';
import { Package, Truck, Filter, Wrench, Tag, Info, Trash2, Bell } from 'lucide-react';

const typeIcons: Record<string, React.ElementType> = { order: Package, shipping: Truck, filter: Filter, service: Wrench, campaign: Tag, system: Info };
const typeColors: Record<string, string> = {
  order: 'bg-blue-50 text-blue-600', shipping: 'bg-purple-50 text-purple-600', filter: 'bg-emerald-50 text-emerald-600',
  service: 'bg-orange-50 text-orange-600', campaign: 'bg-pink-50 text-pink-600', system: 'bg-gray-100 text-gray-500',
};

export default function CustomerNotificationsPage() {
  const { notifications, markAsRead, markAllRead, deleteNotification } = useNotificationStore();

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-[#0D2137]">Bildirimlerim</h2>
        {notifications.some((n) => !n.read) && (
          <button onClick={markAllRead} className="text-xs font-medium text-[#1A73E8] hover:underline">
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
                onClick={() => markAsRead(n.id)}
                className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  n.read ? 'bg-white border border-[#E8F0FE]' : 'bg-[#F0F6FF] border border-[#1A73E8]/20'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[n.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.read ? 'text-[#5A6B7B]' : 'text-[#0D2137] font-medium'}`}>{n.title}</p>
                  <p className="text-xs text-[#8B9DAF] mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-[#8B9DAF] mt-1">{new Date(n.createdAt).toLocaleDateString('tr-TR')}</p>
                </div>
                {!n.read && <div className="w-2 h-2 bg-[#1A73E8] rounded-full flex-shrink-0 mt-1.5" />}
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                  className="p-1 hover:bg-red-50 rounded-lg text-[#8B9DAF] hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
