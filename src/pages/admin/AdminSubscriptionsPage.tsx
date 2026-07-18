import { useState, useEffect } from 'react';
import { RefreshCw, Users } from 'lucide-react';
import { getSubscriptions, getSubscriptionStats, updateSubscriptionStatus, type AdminSubscription } from '@/services/subscriptionService';
import { useToastStore } from '@/components/Toast';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminStatCard,
  AdminTableWrap,
  AdminLoading,
  AdminEmpty,
  AdminBadge,
  AdminCard,
} from '@/components/admin/admin-ui';

const statusLabels: Record<string, { text: string; tone: 'success' | 'warning' | 'neutral' }> = {
  active: { text: 'Aktif', tone: 'success' },
  paused: { text: 'Duraklatıldı', tone: 'warning' },
  cancelled: { text: 'İptal', tone: 'neutral' },
};

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<AdminSubscription[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, paused: 0, monthlyRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const addToast = useToastStore((s) => s.add);

  const load = () => {
    void Promise.all([getSubscriptions(), getSubscriptionStats()]).then(([data, s]) => {
      setSubs(data);
      setStats(s);
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: AdminSubscription['status']) => {
    const res = await updateSubscriptionStatus(id, status);
    if (res.success) {
      addToast('Abonelik durumu güncellendi.', 'success');
      load();
    }
  };

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Abonelikler"
        description="Filtre aboneliklerini ve gelir özetini yönetin."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <AdminStatCard label="Toplam Abone" value={stats.total} icon={<Users className="w-5 h-5" />} />
        <AdminStatCard label="Aktif" value={stats.active} icon={<RefreshCw className="w-5 h-5" />} />
        <AdminStatCard label="Duraklatılmış" value={stats.paused} icon={<RefreshCw className="w-5 h-5" />} />
        <AdminStatCard label="Aylık Gelir" value={`${stats.monthlyRevenue.toLocaleString('tr-TR')}₺`} icon={<RefreshCw className="w-5 h-5" />} />
      </div>

      {loading ? (
        <AdminLoading />
      ) : subs.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty icon={Users} message="Abonelik bulunmuyor" />
        </AdminCard>
      ) : (
        <AdminTableWrap stickyFirst>
          <table className="w-full">
            <thead>
              <tr className="bg-aq-ice border-b border-aq-border/60">
                {['Müşteri', 'Plan', 'Cihaz', 'Sonraki Teslimat', 'Tutar', 'Durum', 'İşlem'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-aq-muted uppercase whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => {
                const st = statusLabels[s.status];
                return (
                  <tr key={s.id} className="border-b border-aq-border/60 last:border-0 hover:bg-aq-ice/50">
                    <td className="px-4 py-3 text-sm font-medium text-aq-text">{s.customer}</td>
                    <td className="px-4 py-3 text-sm text-aq-muted">{s.plan}</td>
                    <td className="px-4 py-3 text-sm text-aq-muted">{s.device}</td>
                    <td className="px-4 py-3 text-sm text-aq-muted">{s.nextDelivery}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-aq-text">{s.price.toLocaleString('tr-TR')}₺</td>
                    <td className="px-4 py-3">
                      <AdminBadge tone={st.tone}>{st.text}</AdminBadge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 text-xs">
                        {s.status !== 'active' && <button type="button" onClick={() => void setStatus(s.id, 'active')} className="px-2 py-1 rounded bg-emerald-50 text-emerald-600">Aktif</button>}
                        {s.status !== 'paused' && <button type="button" onClick={() => void setStatus(s.id, 'paused')} className="px-2 py-1 rounded bg-amber-50 text-amber-600">Duraklat</button>}
                        {s.status !== 'cancelled' && <button type="button" onClick={() => void setStatus(s.id, 'cancelled')} className="px-2 py-1 rounded bg-red-50 text-red-600">İptal</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </AdminTableWrap>
      )}
    </AdminPageShell>
  );
}
