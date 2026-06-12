import { useState } from 'react';
import { Download, FileText, TrendingUp, ShoppingCart, Users, Package } from 'lucide-react';
import { useToastStore } from '@/components/Toast';

const summaryCards = [
  { label: 'Toplam Satış', value: '₺1.245.600', trend: '+12.5%', icon: TrendingUp, color: 'text-emerald-500' },
  { label: 'Sipariş Sayısı', value: '1,847', trend: '+8.2%', icon: ShoppingCart, color: 'text-[#1A73E8]' },
  { label: 'Yeni Müşteri', value: '342', trend: '+15.1%', icon: Users, color: 'text-purple-500' },
  { label: 'Ort. Sepet', value: '₺674', trend: '+3.4%', icon: Package, color: 'text-orange-500' },
];

export default function AdminReportsPage() {
  const [range, setRange] = useState('month');
  const addToast = useToastStore(s => s.add);
  const handleExport = (type: string) => { addToast(`${type} olarak dışa aktarma başlatıldı.`, 'success'); };

  return (
      <>      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-lg font-semibold text-[#0D2137]">Raporlar</h2>
        <div className="flex gap-2">
          <select value={range} onChange={e => setRange(e.target.value)} className="px-3 py-2 text-sm bg-[#0A1929] border border-[#1A3A5C] rounded-lg text-white focus:outline-none focus:border-[#1A73E8]">
            <option value="day">Bugün</option>
            <option value="week">Bu Hafta</option>
            <option value="month">Bu Ay</option>
            <option value="year">Bu Yıl</option>
          </select>
          <button onClick={() => handleExport('CSV')} className="flex items-center gap-2 bg-[#1A73E8] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1557B0]"><Download className="w-4 h-4" /> CSV</button>
          <button onClick={() => handleExport('PDF')} className="flex items-center gap-2 border border-[#1A3A5C] text-[#8B9DAF] px-4 py-2 rounded-lg text-sm hover:border-[#1A73E8] hover:text-white"><FileText className="w-4 h-4" /> PDF</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {summaryCards.map(s => (
          <div key={s.label} className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <span className="text-xs font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">{s.trend}</span>
            </div>
            <p className="text-xl font-bold text-[#0D2137]">{s.value}</p>
            <p className="text-xs text-[#8B9DAF]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#0D2137] mb-4">Günlük Satış Trendi</h3>
          <div className="h-48 bg-[#F8FBFF] rounded-xl flex items-end justify-center gap-2 p-4">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
              <div key={i} className="flex-1 bg-[#1A73E8] rounded-t-sm opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#0D2137] mb-4">Kategori Dağılımı</h3>
          <div className="space-y-3">
            {[
              { label: 'Ev Tipi Cihazlar', value: 45, color: 'bg-[#1A73E8]' },
              { label: 'Filtre Setleri', value: 30, color: 'bg-emerald-500' },
              { label: 'Yedek Parçalar', value: 15, color: 'bg-purple-500' },
              { label: 'Servis Paketleri', value: 10, color: 'bg-amber-500' },
            ].map(c => (
              <div key={c.label}>
                <div className="flex justify-between text-xs mb-1"><span className="text-[#5A6B7B]">{c.label}</span><span className="text-[#0D2137] font-medium">{c.value}%</span></div>
                <div className="w-full h-2 bg-[#F0F6FF] rounded-full overflow-hidden"><div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.value}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </>
  );
}
