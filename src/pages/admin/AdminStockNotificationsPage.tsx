import { useState, useEffect } from 'react';
import { Mail, Check } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { adminGetNotifications, adminMarkNotified } from '@/services/stockNotificationService';

interface NotificationRow {
  id: string;
  product: string;
  email: string;
  date: string;
  status: string;
}

function mapNotification(raw: Record<string, unknown>): NotificationRow {
  const product = raw.product as { name?: string } | undefined;
  return {
    id: String(raw.id),
    product: product?.name ?? '—',
    email: String(raw.email),
    date: raw.createdAt
      ? new Date(String(raw.createdAt)).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
      : '—',
    status: String(raw.status).toLowerCase(),
  };
}

export default function AdminStockNotificationsPage() {
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addToast = useToastStore(s => s.add);

  const loadNotifications = () => {
    setLoading(true);
    setError(null);
    adminGetNotifications()
      .then((data) => setItems((data as Record<string, unknown>[]).map(mapNotification)))
      .catch((err) => setError(err instanceof Error ? err.message : 'Bildirimler yüklenemedi.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markSent = async (id: string) => {
    try {
      await adminMarkNotified(id);
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'notified' } : i));
      addToast('Bildirim gönderildi olarak işaretlendi.', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'İşlem başarısız.', 'error');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-[#8B9DAF]">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
      <>      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Stok Bildirim Talepleri</h2>
      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#F8FBFF]">{['Ürün', 'E-posta', 'Talep Tarihi', 'Durum', 'İşlem'].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                  <td className="px-4 py-3 text-sm font-medium text-[#0D2137]">{item.product}</td>
                  <td className="px-4 py-3"><span className="flex items-center gap-1.5 text-sm text-[#5A6B7B]"><Mail className="w-3.5 h-3.5 text-[#8B9DAF]" />{item.email}</span></td>
                  <td className="px-4 py-3 text-sm text-[#8B9DAF]">{item.date}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.status === 'notified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{item.status === 'notified' ? 'Gönderildi' : 'Bekliyor'}</span></td>
                  <td className="px-4 py-3"><div className="flex gap-1">{item.status === 'pending' && <button onClick={() => markSent(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-emerald-50 text-[#8B9DAF] hover:text-emerald-500"><Check className="w-4 h-4" /></button>}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && <div className="text-center py-8 text-sm text-[#8B9DAF]">Bildirim talebi yok</div>}
      </div>
      </>
  );
}
