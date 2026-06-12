import { RefreshCw, Users } from 'lucide-react';

const subs = [
  { id: '1', customer: 'Ahmet Yılmaz', plan: '6 Aylık', device: 'PurePro 7 Aşamalı', nextDelivery: '15 Temmuz 2026', price: 590, status: 'active' },
  { id: '2', customer: 'Zeynep Koç', plan: '12 Aylık', device: 'Compact', nextDelivery: '20 Ağustos 2026', price: 990, status: 'active' },
  { id: '3', customer: 'Burak Demir', plan: 'Premium', device: 'Business Pro', nextDelivery: '1 Temmuz 2026', price: 1890, status: 'paused' },
];

const statusLabels: Record<string, { text: string; color: string }> = {
  active: { text: 'Aktif', color: 'bg-emerald-50 text-emerald-600' },
  paused: { text: 'Duraklatıldı', color: 'bg-amber-50 text-amber-600' },
  cancelled: { text: 'İptal', color: 'bg-gray-100 text-gray-500' },
};

export default function AdminSubscriptionsPage() {
  return (
    <>
      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Abonelikler</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Toplam Abone', value: '142', icon: Users },
          { label: 'Aktif', value: '128', icon: RefreshCw },
          { label: 'Duraklatılmış', value: '10', icon: RefreshCw },
          { label: 'Aylık Gelir', value: '85.400₺', icon: RefreshCw },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#E8F0FE] rounded-2xl p-4 text-center">
            <s.icon className="w-5 h-5 text-[#1A73E8] mx-auto mb-1" />
            <p className="text-xl font-bold text-[#0D2137]">{s.value}</p>
            <p className="text-xs text-[#8B9DAF]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FBFF]">
                {['Müşteri', 'Plan', 'Cihaz', 'Sonraki Teslimat', 'Tutar', 'Durum'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">{h}</th>
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
                    <td className="px-4 py-3 text-sm text-[#0D2137]">{s.nextDelivery}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#0D2137]">{s.price}₺</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.color}`}>{st.text}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
