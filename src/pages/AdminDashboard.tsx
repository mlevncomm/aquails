import { Link } from 'react-router';
import { useState, useEffect, useMemo } from 'react';
import {
  Banknote, ShoppingBag, Clock, Users, AlertTriangle, Wrench,
  Package, MessageSquare, Star, Bell, RefreshCw, Zap,
  ArrowRight, Eye, TrendingUp, Loader2, ChevronRight,
} from 'lucide-react';
import {
  getDashboardStats,
  getSalesChartDataRange,
  getLowStockProducts,
  getRecentOrders,
  getCatalogCategoryBreakdown,
  type CategoryBreakdown,
} from '@/services/adminStatsService';
import { orderStatusToTr } from '@/lib/orderStatus';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { AdminCard, AdminTableWrap, AdminEmpty } from '@/components/admin/admin-ui';

const PIE_COLORS = ['#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b', '#f43f5e', '#06b6d4', '#6366f1'];

const statusStyles: Record<string, string> = {
  'Tamamlandı': 'bg-emerald-50 text-emerald-700',
  'Kargoda': 'bg-aq-sky text-aq-blue',
  'Hazırlanıyor': 'bg-amber-50 text-amber-700',
  'Yeni': 'bg-violet-50 text-violet-700',
  'İptal Edildi': 'bg-aq-ice text-aq-muted',
  'İade': 'bg-orange-50 text-orange-700',
};

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `₺${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₺${(n / 1_000).toFixed(0)}K`;
  return `₺${n.toLocaleString('tr-TR')}`;
}

function KpiSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-2xl border border-aq-border/60 p-6 h-[132px]">
      <div className="w-10 h-10 bg-aq-ice rounded-xl mb-4" />
      <div className="h-7 w-24 bg-aq-ice rounded-lg mb-2" />
      <div className="h-4 w-16 bg-aq-ice rounded" />
    </div>
  );
}

type ChartRange = 'week' | 'month' | 'year';

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [chartRange, setChartRange] = useState<ChartRange>('month');
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getDashboardStats>> | null>(null);
  const [chartData, setChartData] = useState<Awaited<ReturnType<typeof getSalesChartDataRange>>>([]);
  const [lowStock, setLowStock] = useState<Awaited<ReturnType<typeof getLowStockProducts>>>([]);
  const [recentOrders, setRecentOrders] = useState<Awaited<ReturnType<typeof getRecentOrders>>>([]);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);

  useEffect(() => {
    void Promise.all([
      getDashboardStats(),
      getLowStockProducts(),
      getRecentOrders(6),
      getCatalogCategoryBreakdown(),
    ]).then(([s, stock, orders, cats]) => {
      setStats(s);
      setLowStock(stock);
      setRecentOrders(orders);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    void getSalesChartDataRange(chartRange).then(setChartData);
  }, [chartRange]);

  const todayLabel = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const primaryKpis = stats
    ? [
        {
          label: 'Bu Ay Ciro',
          value: formatCurrency(stats.monthlyRevenue),
          sub: `${stats.monthlyOrders} sipariş`,
          icon: Banknote,
          accent: 'from-aq-blue to-aq-navy',
          bg: 'bg-aq-sky',
          text: 'text-aq-blue',
          href: '/admin/raporlar',
        },
        {
          label: 'Bugünkü Ciro',
          value: formatCurrency(stats.todayRevenue),
          sub: 'Günlük toplam',
          icon: TrendingUp,
          accent: 'from-emerald-500 to-teal-600',
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          href: '/admin/raporlar',
        },
        {
          label: 'Bekleyen Sipariş',
          value: String(stats.pendingOrders),
          sub: 'İşlem bekliyor',
          icon: Clock,
          accent: 'from-amber-500 to-orange-500',
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          href: '/admin/siparisler',
        },
        {
          label: 'Toplam Müşteri',
          value: stats.totalCustomers.toLocaleString('tr-TR'),
          sub: stats.newCustomersToday > 0 ? `+${stats.newCustomersToday} bugün` : 'Kayıtlı müşteri',
          icon: Users,
          accent: 'from-violet-500 to-purple-600',
          bg: 'bg-violet-50',
          text: 'text-violet-700',
          href: '/admin/musteriler',
        },
      ]
    : [];

  const operations = stats
    ? [
        { label: 'Bugünkü Kurulum', value: stats.todayInstallations, href: '/admin/servis-takvimi', icon: Wrench, urgent: stats.todayInstallations > 0 },
        { label: 'Bekleyen Servis', value: stats.pendingService, href: '/admin/servis-talepleri', icon: Clock, urgent: stats.pendingService > 0 },
        { label: 'Düşük Stok', value: stats.lowStockCount, href: '/admin/stok', icon: Package, urgent: stats.lowStockCount > 0 },
        { label: 'Terk Edilmiş Sepet', value: stats.abandonedCarts, href: '/admin/terk-edilmis-sepetler', icon: ShoppingBag, urgent: stats.abandonedCarts > 0 },
        { label: 'Okunmamış Soru', value: stats.unreadQuestions, href: '/admin/sorular', icon: MessageSquare, urgent: stats.unreadQuestions > 0 },
        { label: 'Onay Bekleyen Yorum', value: stats.unreadReviews, href: '/admin/yorumlar', icon: Star, urgent: stats.unreadReviews > 0 },
        { label: 'Kritik Uyarı', value: stats.criticalAlerts, href: '/admin/stok-bildirimleri', icon: Bell, urgent: stats.criticalAlerts > 0 },
        { label: 'Bekleyen İade', value: stats.pendingReturns, href: '/admin/iade-degisim', icon: RefreshCw, urgent: stats.pendingReturns > 0 },
        { label: 'Aktif Abonelik', value: stats.activeSubscriptions, href: '/admin/abonelikler', icon: Zap, urgent: false },
      ]
    : [];

  const attentionItems = useMemo(() => operations.filter((o) => o.urgent), [operations]);

  const pieData = categories.map((c, i) => ({
    name: c.name,
    value: c.count,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const maxChartSales = Math.max(...chartData.map((d) => d.sales), 1);

  const yFormatter = (v: number) => {
    if (maxChartSales < 1000) return `₺${v}`;
    if (maxChartSales < 1_000_000) return `₺${(v / 1000).toFixed(0)}K`;
    return `${(v / 1_000_000).toFixed(1)}M`;
  };

  return (
    <div className="space-y-8 pb-4">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-sm text-aq-muted capitalize">{todayLabel}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-aq-text tracking-tight mt-1">
            Hoş geldiniz{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-aq-muted text-sm mt-1">Mağazanızın güncel özetine göz atın.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/siparisler"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-aq-blue text-white text-sm font-semibold hover:bg-aq-deep hover:text-white transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            Siparişler
          </Link>
          <Link
            to="/admin/urunler"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-aq-border/60 text-aq-muted text-sm font-medium hover:bg-aq-ice transition-colors"
          >
            <Package className="w-4 h-4" />
            Ürünler
          </Link>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
          : primaryKpis.map((kpi) => (
            <Link
              key={kpi.label}
              to={kpi.href}
              className="group relative bg-white rounded-2xl border border-aq-border/60 p-6 hover:border-aq-blue/25 transition-all overflow-hidden"
            >
              <div className={cn('absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r opacity-70', kpi.accent)} />
              <div className="flex items-start justify-between">
                <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', kpi.bg)}>
                  <kpi.icon className={cn('w-5 h-5', kpi.text)} />
                </div>
                <ChevronRight className="w-4 h-4 text-aq-muted/60 group-hover:text-aq-muted group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-2xl font-bold text-aq-text mt-4 tracking-tight">{kpi.value}</p>
              <p className="text-sm font-medium text-aq-muted mt-0.5">{kpi.label}</p>
              <p className="text-xs text-aq-muted mt-1">{kpi.sub}</p>
            </Link>
          ))}
      </div>

      {/* Attention banner */}
      {!loading && attentionItems.length > 0 && (
        <AdminCard className="!p-0 overflow-hidden border-amber-200/60 bg-gradient-to-r from-amber-50/80 to-white">
          <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-semibold">{attentionItems.length} konu dikkat gerektiriyor</span>
            </div>
            <div className="flex flex-wrap gap-2 sm:ml-auto">
              {attentionItems.slice(0, 4).map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-amber-200 text-xs font-medium text-amber-900 hover:bg-amber-50 transition-colors"
                >
                  {item.label}
                  <span className="font-semibold">{item.value}</span>
                </Link>
              ))}
            </div>
          </div>
        </AdminCard>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6">
        <AdminCard className="xl:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base font-semibold text-aq-text">Satış Trendi</h2>
              <p className="text-xs text-aq-muted mt-0.5">Dönemsel ciro grafiği</p>
            </div>
            <div className="flex bg-aq-ice rounded-xl p-1 self-start">
              {([
                ['week', 'Haftalık'],
                ['month', 'Aylık'],
                ['year', 'Yıllık'],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setChartRange(key)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                    chartRange === key
                      ? 'bg-white text-aq-blue shadow-sm'
                      : 'text-aq-muted hover:text-aq-muted',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="h-[280px] flex items-center justify-center text-aq-muted">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : chartData.every((d) => d.sales === 0) ? (
            <div className="h-[280px] flex flex-col items-center justify-center text-center px-4">
              <div className="w-14 h-14 rounded-2xl bg-aq-ice flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-aq-muted/60" />
              </div>
              <p className="text-sm font-medium text-aq-muted">Henüz satış verisi yok</p>
              <p className="text-xs text-aq-muted mt-1">İlk siparişler geldiğinde grafik burada görünecek.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashSalesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={yFormatter} width={48} />
                <Tooltip
                  formatter={(value: number) => [`₺${value.toLocaleString('tr-TR')}`, 'Ciro']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Area type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={2} fill="url(#dashSalesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </AdminCard>

        <AdminCard>
          <h2 className="text-base font-semibold text-aq-text">Katalog Dağılımı</h2>
          <p className="text-xs text-aq-muted mt-0.5 mb-5">Ürün sayısına göre kategoriler</p>
          {loading ? (
            <div className="h-[220px] flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-aq-muted" />
            </div>
          ) : pieData.length === 0 ? (
            <AdminEmpty message="Kategori verisi yok" />
          ) : (
            <>
              <div className="relative">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-aq-text">
                    {pieData.reduce((s, c) => s + c.value, 0)}
                  </span>
                  <span className="text-[11px] text-aq-muted">ürün</span>
                </div>
              </div>
              <div className="space-y-2 mt-2 max-h-[160px] overflow-y-auto pr-1">
                {pieData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-aq-muted truncate">{cat.name}</span>
                    </div>
                    <span className="font-semibold text-aq-text flex-shrink-0">{cat.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </AdminCard>
      </div>

      {/* Operations grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-aq-text">Operasyon Özeti</h2>
            <p className="text-xs text-aq-muted mt-0.5">Tüm metrikler — tıklayarak ilgili sayfaya gidin</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="animate-pulse h-24 bg-white rounded-xl border border-aq-border/60" />
            ))
            : operations.map((op) => (
              <Link
                key={op.label}
                to={op.href}
                className={cn(
                  'flex flex-col justify-between p-4 rounded-xl border bg-white transition-all hover:shadow-sm hover:-translate-y-0.5 min-h-[96px]',
                  op.urgent ? 'border-amber-200 bg-amber-50/30' : 'border-aq-border/60 hover:border-aq-border/60',
                )}
              >
                <div className="flex items-center justify-between">
                  <op.icon className={cn('w-4 h-4', op.urgent ? 'text-amber-600' : 'text-aq-muted')} />
                  {op.urgent && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                </div>
                <div className="mt-3">
                  <p className="text-xl font-semibold text-aq-text leading-none">{op.value}</p>
                  <p className="text-[11px] text-aq-muted mt-1.5 leading-snug">{op.label}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* Recent orders + low stock */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6">
        <AdminTableWrap className="xl:col-span-2">
          <div className="flex items-center justify-between px-6 py-4 border-b border-aq-border/60">
            <div>
              <h2 className="text-base font-semibold text-aq-text">Son Siparişler</h2>
              <p className="text-xs text-aq-muted">En son gelen siparişler</p>
            </div>
            <Link to="/admin/siparisler" className="text-xs font-medium text-aq-blue hover:text-aq-navy flex items-center gap-1">
              Tümünü gör <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="py-16 flex justify-center text-aq-muted"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : recentOrders.length === 0 ? (
            <AdminEmpty message="Henüz sipariş yok" />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-aq-ice/80">
                  {['Sipariş', 'Müşteri', 'Tutar', 'Durum', ''].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-semibold text-aq-muted uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const statusTr = orderStatusToTr(order.status);
                  const customerName = (order.profiles as { name?: string } | null)?.name ?? 'Müşteri';
                  return (
                    <tr key={order.id} className="border-b border-aq-border/60 last:border-0 hover:bg-aq-ice/50">
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold text-aq-blue">{order.order_number}</p>
                        <p className="text-[11px] text-aq-muted">
                          {new Date(order.created_at).toLocaleDateString('tr-TR')}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-aq-sky rounded-full flex items-center justify-center text-xs font-medium text-aq-blue">
                            {customerName[0]}
                          </div>
                          <span className="text-sm text-aq-muted">{customerName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-aq-text">
                        {Number(order.total).toLocaleString('tr-TR')}₺
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-full', statusStyles[statusTr] ?? 'bg-aq-ice text-aq-muted')}>
                          {statusTr}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Link
                          to={`/admin/siparisler/${order.id}`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-aq-sky text-aq-muted hover:text-aq-blue transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </AdminTableWrap>

        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-aq-text">Düşük Stok</h2>
              <p className="text-xs text-aq-muted">10 adet ve altı</p>
            </div>
            {lowStock.length > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                {lowStock.length}
              </span>
            )}
          </div>
          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-aq-muted" /></div>
          ) : lowStock.length === 0 ? (
            <div className="text-center py-10">
              <Package className="w-8 h-8 text-aq-border mx-auto mb-2" />
              <p className="text-sm text-aq-muted">Stoklar yeterli</p>
            </div>
          ) : (
            <div className="space-y-2">
              {lowStock.slice(0, 6).map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-aq-ice transition-colors">
                  <div className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                    p.stock <= 3 ? 'bg-red-50' : 'bg-amber-50',
                  )}>
                    <Package className={cn('w-4 h-4', p.stock <= 3 ? 'text-red-500' : 'text-amber-500')} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-aq-text line-clamp-1">{p.name}</p>
                    <p className="text-[10px] text-aq-muted">{p.sku}</p>
                  </div>
                  <span className={cn(
                    'text-sm font-semibold flex-shrink-0',
                    p.stock <= 3 ? 'text-red-600' : 'text-amber-600',
                  )}>
                    {p.stock}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link
            to="/admin/stok"
            className="flex items-center justify-center gap-1.5 mt-5 pt-4 border-t border-aq-border/60 text-xs font-semibold text-aq-blue hover:text-aq-navy"
          >
            Stok yönetimi <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </AdminCard>
      </div>
    </div>
  );
}
