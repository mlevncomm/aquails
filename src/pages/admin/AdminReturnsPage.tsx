import { useState, useEffect, useCallback } from 'react';
import { Check, X, RotateCcw } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { getAdminReturns, updateReturnStatus, type ReturnRequest } from '@/services/returnService';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminCard,
  AdminTableWrap,
  AdminLoading,
  AdminEmpty,
  AdminBadge,
} from '@/components/admin/admin-ui';

export default function AdminReturnsPage() {
  const [items, setItems] = useState<(ReturnRequest & { customer: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToastStore((s) => s.add);

  const load = useCallback(async () => {
    setLoading(true);
    setItems(await getAdminReturns());
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    const res = await updateReturnStatus(id, status);
    if (res.success) {
      addToast(status === 'approved' ? 'Talep onaylandı.' : 'Talep reddedildi.', 'success');
      void load();
    } else {
      addToast(res.error ?? 'Hata', 'error');
    }
  };

  const statusTone: Record<string, 'warning' | 'success' | 'danger' | 'neutral'> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    completed: 'neutral',
  };

  const statusLabel: Record<string, string> = {
    pending: 'Bekliyor',
    approved: 'Onaylandı',
    rejected: 'Reddedildi',
    completed: 'Tamamlandı',
  };

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="İade / Değişim Yönetimi"
        description="İade ve değişim taleplerini onaylayın veya reddedin."
      />

      {loading ? (
        <AdminLoading label="İade talepleri yükleniyor..." />
      ) : items.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty icon={RotateCcw} message="Henüz iade/değişim talebi yok." />
        </AdminCard>
      ) : (
        <AdminTableWrap stickyFirst>
          <table className="w-full">
            <thead>
              <tr className="bg-aq-ice border-b border-aq-border/60">
                {['Müşteri', 'Sipariş', 'Ürün', 'Tür', 'Sebep', 'Durum', 'Tarih', 'İşlem'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-aq-muted uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-aq-border/60 last:border-0 hover:bg-aq-ice/50">
                  <td className="px-4 py-3 text-sm font-medium text-aq-text">{item.customer}</td>
                  <td className="px-4 py-3 text-sm text-aq-blue">{item.orderNumber}</td>
                  <td className="px-4 py-3 text-sm text-aq-muted">{item.productName}</td>
                  <td className="px-4 py-3 text-sm">{item.type === 'return' ? 'İade' : 'Değişim'}</td>
                  <td className="px-4 py-3 text-sm text-aq-muted max-w-[200px] truncate">{item.reason}</td>
                  <td className="px-4 py-3">
                    <AdminBadge tone={statusTone[item.status] ?? 'neutral'}>
                      {statusLabel[item.status] ?? item.status}
                    </AdminBadge>
                  </td>
                  <td className="px-4 py-3 text-sm text-aq-muted">{item.date}</td>
                  <td className="px-4 py-3">
                    {item.status === 'pending' && (
                      <div className="flex gap-1">
                        <button type="button" onClick={() => void handleAction(item.id, 'approved')} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-emerald-50 text-emerald-500" title="Onayla"><Check className="w-4 h-4" /></button>
                        <button type="button" onClick={() => void handleAction(item.id, 'rejected')} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500" title="Reddet"><X className="w-4 h-4" /></button>
                      </div>
                    )}
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
