import { useState, useEffect } from 'react';
import { Download, FileText, TrendingUp, ShoppingCart, Users, Package, Loader2 } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { getReportStats } from '@/services/adminStatsService';
import { AdminPageHeader, AdminCard, AdminStatCard } from '@/components/admin/admin-ui';

export default function AdminReportsPage() {
  const [range, setRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getReportStats>> | null>(null);
  const addToast = useToastStore((s) => s.add);

  useEffect(() => {
    setLoading(true);
    void getReportStats(range).then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, [range]);

  const handleExport = (type: string) => {
    addToast(`${type} dışa aktarma hazırlanıyor.`, 'info');
  };

  const maxDaily = Math.max(...(stats?.dailySales.map((d) => d.amount) ?? [1]), 1);

  return (
    <>
      <AdminPageHeader
        title="Raporlar"
        description="Satış ve katalog istatistikleri"
        action={
          <div className="flex gap-2">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as typeof range)}
              className="px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            >
              <option value="day">Bugün</option>
              <option value="week">Bu Hafta</option>
              <option value="month">Bu Ay</option>
              <option value="year">Bu Yıl</option>
            </select>
            <button onClick={() => handleExport('CSV')} className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-sky-700">
              <Download className="w-4 h-4" /> CSV
            </button>
            <button onClick={() => handleExport('PDF')} className="flex items-center gap-2 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm hover:border-sky-300">
              <FileText className="w-4 h-4" /> PDF
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16 text-slate-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <AdminStatCard label="Toplam Satış" value={`₺${stats.totalSales.toLocaleString('tr-TR')}`} icon={<TrendingUp className="w-5 h-5" />} />
            <AdminStatCard label="Sipariş Sayısı" value={stats.orderCount} icon={<ShoppingCart className="w-5 h-5" />} />
            <AdminStatCard label="Yeni Müşteri" value={stats.newCustomers} icon={<Users className="w-5 h-5" />} />
            <AdminStatCard label="Ort. Sepet" value={`₺${stats.avgBasket.toLocaleString('tr-TR')}`} icon={<Package className="w-5 h-5" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminCard>
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Satış Trendi</h3>
              {stats.dailySales.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-12">Bu dönemde sipariş yok</p>
              ) : (
                <div className="h-48 flex items-end justify-center gap-2 p-4 bg-slate-50 rounded-xl">
                  {stats.dailySales.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-sky-500 rounded-t-sm min-h-[4px] transition-all"
                        style={{ height: `${(d.amount / maxDaily) * 100}%` }}
                        title={`₺${d.amount.toLocaleString('tr-TR')}`}
                      />
                      <span className="text-[9px] text-slate-400 truncate w-full text-center">{d.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </AdminCard>

            <AdminCard>
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Kategori Dağılımı (Ürün)</h3>
              <div className="space-y-3">
                {stats.categoryBreakdown.map((c, i) => {
                  const colors = ['bg-sky-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-teal-500', 'bg-indigo-500'];
                  return (
                    <div key={c.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600">{c.name}</span>
                        <span className="text-slate-800 font-medium">{c.count} ürün ({c.percent}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${colors[i % colors.length]} rounded-full`} style={{ width: `${c.percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </AdminCard>
          </div>
        </>
      )}
    </>
  );
}
