import { useState, useEffect } from 'react';
import { Download, FileText, TrendingUp, ShoppingCart, Users, Package } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { getReportStats } from '@/services/adminStatsService';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminCard,
  AdminStatCard,
  AdminSelect,
  AdminButton,
  AdminLoading,
} from '@/components/admin/admin-ui';

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

  const handleExport = (type: 'CSV' | 'PDF') => {
    if (!stats) return;
    if (type === 'CSV') {
      const rows = [
        ['Metrik', 'Değer'],
        ['Toplam Satış', stats.totalSales],
        ['Sipariş Sayısı', stats.orderCount],
        ['Yeni Müşteri', stats.newCustomers],
        ['Ortalama Sepet', stats.avgBasket],
        [],
        ['Gün', 'Satış'],
        ...stats.dailySales.map((day) => [day.label, day.amount]),
      ];
      const csv = `\uFEFF${rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(';')).join('\n')}`;
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `aquails-rapor-${range}-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      addToast('CSV raporu indirildi.', 'success');
      return;
    }
    const report = window.open('', '_blank');
    if (!report) {
      addToast('PDF görünümü açılamadı. Açılır pencere iznini kontrol edin.', 'error');
      return;
    }
    report.opener = null;
    report.document.write(`<!doctype html><html><head><title>Aquails Satış Raporu</title><style>body{font:14px Arial;padding:32px;color:#123}h1{font-size:24px}table{border-collapse:collapse;width:100%;margin-top:20px}td,th{border:1px solid #ccd;padding:8px;text-align:left}</style></head><body><h1>Aquails Satış Raporu</h1><p>Dönem: ${range}</p><table><tr><th>Toplam Satış</th><th>Sipariş</th><th>Yeni Müşteri</th><th>Ort. Sepet</th></tr><tr><td>₺${stats.totalSales.toLocaleString('tr-TR')}</td><td>${stats.orderCount}</td><td>${stats.newCustomers}</td><td>₺${stats.avgBasket.toLocaleString('tr-TR')}</td></tr></table><script>window.print();</script></body></html>`);
    report.document.close();
  };

  const maxDaily = Math.max(...(stats?.dailySales.map((d) => d.amount) ?? [1]), 1);

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Raporlar"
        description="Satış ve katalog istatistikleri"
        action={
          <div className="flex flex-wrap gap-2">
            <AdminSelect
              value={range}
              onChange={(e) => setRange(e.target.value as typeof range)}
              className="w-auto"
            >
              <option value="day">Bugün</option>
              <option value="week">Bu Hafta</option>
              <option value="month">Bu Ay</option>
              <option value="year">Bu Yıl</option>
            </AdminSelect>
            <AdminButton onClick={() => handleExport('CSV')} disabled={!stats}>
              <Download className="w-4 h-4" /> CSV
            </AdminButton>
            <AdminButton variant="secondary" onClick={() => handleExport('PDF')} disabled={!stats}>
              <FileText className="w-4 h-4" /> PDF
            </AdminButton>
          </div>
        }
      />

      {loading ? (
        <AdminLoading variant="spinner" label="Rapor yükleniyor..." />
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
              <h3 className="text-sm font-semibold text-aq-text mb-4">Satış Trendi</h3>
              {stats.dailySales.length === 0 ? (
                <p className="text-sm text-aq-muted text-center py-12">Bu dönemde sipariş yok</p>
              ) : (
                <div className="h-48 flex items-end justify-center gap-2 p-4 bg-aq-ice rounded-xl">
                  {stats.dailySales.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-aq-sky0 rounded-t-sm min-h-[4px] transition-all"
                        style={{ height: `${(d.amount / maxDaily) * 100}%` }}
                        title={`₺${d.amount.toLocaleString('tr-TR')}`}
                      />
                      <span className="text-[9px] text-aq-muted truncate w-full text-center">{d.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </AdminCard>

            <AdminCard>
              <h3 className="text-sm font-semibold text-aq-text mb-4">Kategori Dağılımı (Ürün)</h3>
              <div className="space-y-3">
                {stats.categoryBreakdown.map((c, i) => {
                  const colors = ['bg-aq-sky0', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-teal-500', 'bg-indigo-500'];
                  return (
                    <div key={c.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-aq-muted">{c.name}</span>
                        <span className="text-aq-text font-medium">{c.count} ürün ({c.percent}%)</span>
                      </div>
                      <div className="w-full h-2 bg-aq-ice rounded-full overflow-hidden">
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
    </AdminPageShell>
  );
}
