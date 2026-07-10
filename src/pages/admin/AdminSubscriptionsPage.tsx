import { useState, useEffect } from 'react';
import { RefreshCw, Users } from 'lucide-react';
import { getSubscriptions, getSubscriptionStats, type AdminSubscription } from '@/services/subscriptionService';

const statusLabels: Record<string, { text: string; color: string }> = {
  active: { text: 'Aktif', color: 'bg-emerald-50 text-emerald-600' },
  paused: { text: 'Duraklatıldı', color: 'bg-amber-50 text-amber-600' },
  cancelled: { text: 'İptal', color: 'bg-gray-100 text-gray-500' },
};

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<AdminSubscription[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, paused: 0, monthlyRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void Promise.all([getSubscriptions(), getSubscriptionStats()]).then(([data, s]) => {
      setSubs(data);
      setStats(s);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Abonelikler</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Toplam Abone', value: String(stats.total), icon: Users },
          { label: 'Aktif', value: String(stats.active), icon: RefreshCw },
          { label: 'Duraklatılmış', value: String(stats.paused), icon: RefreshCw },
          { label: 'Aylık Gelir', value: `${stats.monthlyRevenue.toLocaleString('tr-TR')}₺`, icon: RefreshCw },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#E8F0FE] rounded-2xl p-4 text-center">
            <s.icon className="w-5 h-5 text-[#1A73E8] mx-auto mb-1" />
            <p className="text-xl font-bold text-[#0D2137]">{s.value}</p>
            <p className="text-xs text-[#8B9DAF]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-sm text-[#8B9DAF]">Yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FBFF]">
                  {['Müşteri', 'Plan', 'Cihaz', 'Sonraki Teslimat', 'Tutar', 'Durum'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => {
                  const st = statusLabels[s.status];
                  return (
                    <tr key={s.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                      <td className="px-4 py-3 text-sm font-medium text-[#0D2137]">{s.customer}</td>
                      <td className="px-4 py-3 text-sm text-[#5A6B7B]">{s.plan}</td>
                      <td className="px-4 py-3 text-sm text-[#5A6B7B]">{s.device}</td>
                      <td className="px-4 py-3 text-sm text-[#8B9DAF]">{s.nextDelivery}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-[#0D2137]">{s.price.toLocaleString('tr-TR')}₺</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.color}`}>{st.text}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && subs.length === 0 && (
          <div className="text-center py-8 text-sm text-[#8B9DAF]">Abonelik bulunmuyor</div>
        )}
      </div>
    </>
  );
}
