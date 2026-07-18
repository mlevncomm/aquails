import { useState, useEffect, useCallback } from 'react';
import { Mail, Check, Trash2, Bell } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import {
  getStockNotifications,
  markNotified,
  deleteStockNotification,
  type StockNotification,
} from '@/services/stockNotificationService';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminCard,
  AdminTableWrap,
  AdminLoading,
  AdminEmpty,
  AdminBadge,
} from '@/components/admin/admin-ui';

export default function AdminStockNotificationsPage() {
  const [items, setItems] = useState<StockNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToastStore((s) => s.add);

  const load = useCallback(async () => {
    setLoading(true);
    setItems(await getStockNotifications());
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const markSent = async (id: string) => {
    const result = await markNotified(id);
    if (result.success) {
      addToast('Stok e-postası gönderim kuyruğuna alındı.', 'success');
      void load();
    }
  };

  const remove = async (id: string) => {
    const result = await deleteStockNotification(id);
    if (result.success) {
      addToast('Kayıt silindi.', 'success');
      void load();
    }
  };

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Stok Bildirim Talepleri"
        description="Stok gelince haber ver taleplerini yönetin."
      />

      {loading ? (
        <AdminLoading label="Yükleniyor..." />
      ) : items.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty icon={Bell} message="Bildirim talebi bulunmuyor" />
        </AdminCard>
      ) : (
        <AdminTableWrap stickyFirst>
          <table className="w-full">
            <thead>
              <tr className="bg-aq-ice border-b border-aq-border/60">
                {['Ürün', 'E-posta', 'Talep Tarihi', 'Durum', 'İşlem'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-aq-muted uppercase whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-aq-border/60 last:border-0 hover:bg-aq-ice/50">
                  <td className="px-4 py-3 text-sm font-medium text-aq-text">{item.productName}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-sm text-aq-muted">
                      <Mail className="w-3.5 h-3.5 text-aq-muted" />
                      {item.email}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-aq-muted">{item.date}</td>
                  <td className="px-4 py-3">
                    <AdminBadge tone={item.notified ? 'success' : 'warning'}>
                      {item.notified ? 'Kuyrukta' : 'Bekliyor'}
                    </AdminBadge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {!item.notified && (
                        <button
                          type="button"
                          onClick={() => void markSent(item.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-emerald-50 text-aq-muted hover:text-emerald-500"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => void remove(item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-aq-muted hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminTableWrap>
      )}
    </AdminPageShell>
  );
}
