import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  Banknote, ShoppingBag, Clock, Users, AlertTriangle, Wrench,
  TrendingUp, TrendingDown, Eye, Pencil, Trash2, ClipboardList,
  CheckCircle2, Package, MessageSquare, Star, Bell, RefreshCw,
  Zap, ArrowRight, Calendar
} from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import {
  adminOrders, lowStockProducts, todayServices,
  adminChartData, categoryPieData, operationMetrics, pendingTasks, criticalStockAlerts
} from '@/data';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const stats = [
  { icon: Banknote, label: 'Bu ay', value: '₺1.247.850', trend: '+12.5%', trendUp: true, color: 'bg-[#EBF3FF] text-[#1A73E8]' },
  { icon: ShoppingBag, label: 'Bu ay', value: '1.847', trend: '+8.2%', trendUp: true, color: 'bg-[#F0FDF4] text-[#00C9A7]' },
  { icon: Clock, label: 'İşlem bekliyor', value: '43', trend: '-3.1%', trendUp: false, color: 'bg-[#FFFBEB] text-[#F5A623]' },
  { icon: Users, label: 'Toplam kayıtlı', value: '12.456', trend: '+5.7%', trendUp: true, color: 'bg-[#F3E8FF] text-[#8B5CF6]' },
  { icon: AlertTriangle, label: 'Acil tedbir gerekli', value: '18', trend: '+2', trendUp: false, color: 'bg-[#FEF2F2] text-[#E85454]' },
  { icon: Wrench, label: 'Randevulu servis', value: '24', trend: '+6', trendUp: true, color: 'bg-[#EBF3FF] text-[#1A73E8]' },
];

const operationCards = [
  { icon: Wrench, label: 'Bugünkü Kurulum', value: operationMetrics.todayInstallations, href: '/admin/servis-takvimi', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', iconBg: 'bg-emerald-100' },
  { icon: Clock, label: 'Bekleyen Servis', value: operationMetrics.pendingServiceRequests, href: '/admin/servis-talepleri', color: 'bg-amber-50 text-amber-600 border-amber-200', iconBg: 'bg-amber-100' },
  { icon: Package, label: 'Düşük Stok', value: operationMetrics.lowStockCount, href: '/admin/stok', color: 'bg-red-50 text-red-500 border-red-200', iconBg: 'bg-red-100' },
  { icon: ShoppingBag, label: 'Terk Edilmiş Sepet', value: operationMetrics.abandonedCarts, href: '/admin/terk-edilmis-sepetler', color: 'bg-purple-50 text-purple-600 border-purple-200', iconBg: 'bg-purple-100' },
  { icon: Users, label: 'Yeni Müşteri (Bugün)', value: operationMetrics.newCustomersToday, href: '/admin/musteriler', color: 'bg-blue-50 text-blue-600 border-blue-200', iconBg: 'bg-blue-100' },
  { icon: ClipboardList, label: 'Bekleyen Sipariş', value: operationMetrics.pendingOrders, href: '/admin/siparisler', color: 'bg-sky-50 text-sky-600 border-sky-200', iconBg: 'bg-sky-100' },
  { icon: MessageSquare, label: 'Okunmamız Soru', value: operationMetrics.unreadQuestions, href: '/admin/sorular', color: 'bg-teal-50 text-teal-600 border-teal-200', iconBg: 'bg-teal-100' },
  { icon: Star, label: 'Onay Bekleyen Yorum', value: operationMetrics.unreadReviews, href: '/admin/yorumlar', color: 'bg-yellow-50 text-yellow-600 border-yellow-200', iconBg: 'bg-yellow-100' },
  { icon: Banknote, label: 'Bugünkü Ciro', value: `₺${operationMetrics.todayRevenue.toLocaleString('tr-TR')}`, href: '/admin/raporlar', color: 'bg-indigo-50 text-indigo-600 border-indigo-200', iconBg: 'bg-indigo-100' },
  { icon: Bell, label: 'Kritik Uyarı', value: operationMetrics.criticalAlerts, href: '/admin/stok-bildirimleri', color: 'bg-rose-50 text-rose-600 border-rose-200', iconBg: 'bg-rose-100' },
  { icon: RefreshCw, label: 'Bekleyen İade', value: operationMetrics.pendingReturns, href: '/admin/iade-degisim', color: 'bg-orange-50 text-orange-600 border-orange-200', iconBg: 'bg-orange-100' },
  { icon: Zap, label: 'Aktif Abonelik', value: operationMetrics.activeSubscriptions, href: '/admin/abonelikler', color: 'bg-cyan-50 text-cyan-600 border-cyan-200', iconBg: 'bg-cyan-100' },
];

const priorityConfig = {
  high: { label: 'Yüksek', color: 'bg-red-100 text-red-600' },
  medium: { label: 'Orta', color: 'bg-amber-100 text-amber-600' },
  low: { label: 'Düşük', color: 'bg-blue-100 text-blue-600' },
};

const statusColors: Record<string, string> = {
  'Tamamlandı': 'bg-aqua-success/10 text-aqua-success',
  'Kargoda': 'bg-aqua-primary/10 text-aqua-primary',
  'Bekliyor': 'bg-aqua-warning/10 text-aqua-warning',
  'İptal': 'bg-aqua-danger/10 text-aqua-danger',
};

const serviceStatusColors: Record<string, string> = {
  active: 'bg-aqua-success',
  pending: 'bg-aqua-warning',
  completed: 'bg-aqua-border',
};

export default function AdminDashboard() {
  return (
      <>      {/* Stats Row */}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6" staggerDelay={0.08}>
        {stats.map((stat) => (
          <StaggerItem key={stat.label}>
            <div className="bg-white border border-aqua-border-light rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', stat.color.split(' ')[0])}>
                  <stat.icon className={cn('w-5 h-5', stat.color.split(' ')[1])} />
                </div>
                <div className={cn('flex items-center gap-1 text-xs font-semibold', stat.trendUp ? 'text-aqua-success' : 'text-aqua-danger')}>
                  {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-xl font-bold text-aqua-secondary mt-3">{stat.value}</p>
              <p className="text-xs text-aqua-text-muted mt-0.5">{stat.label}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Operations Cards */}
      <ScrollReveal delay={0.2} className="mb-6">
        <div className="bg-white border border-aqua-border-light rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-aqua-secondary flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-aqua-primary" />
              Operasyon Özeti
            </h3>
            <span className="text-xs text-aqua-text-muted">Bugün</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {operationCards.map((card) => (
              <Link
                key={card.label}
                to={card.href}
                className={cn(
                  'flex flex-col items-center text-center p-4 rounded-xl border transition-all hover:shadow-md hover:-translate-y-0.5',
                  card.color
                )}
              >
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-2', card.iconBg)}>
                  <card.icon className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold">{card.value}</span>
                <span className="text-[11px] font-medium opacity-80 mt-0.5">{card.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Sales Chart */}
        <ScrollReveal delay={0.3} className="lg:col-span-2">
          <div className="bg-white border border-aqua-border-light rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-aqua-secondary">Satış Trendi</h3>
              <div className="flex bg-aqua-bg rounded-lg p-0.5">
                {['Haftalık', 'Aylık', 'Yıllık'].map((period) => (
                  <button
                    key={period}
                    className={cn(
                      'px-3 py-1.5 text-xs font-semibold rounded-md transition-all',
                      period === 'Aylık' ? 'bg-white text-aqua-primary shadow-sm' : 'text-aqua-text-muted hover:text-aqua-secondary'
                    )}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={adminChartData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A73E8" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#1A73E8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F6FF" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8B9DAF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8B9DAF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  formatter={(value: number) => [`${(value / 1000000).toFixed(2)}M ₺`, 'Satış']}
                  contentStyle={{ backgroundColor: '#0D2137', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#1A73E8" strokeWidth={2} fill="url(#salesGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ScrollReveal>

        {/* Category Pie */}
        <ScrollReveal delay={0.4}>
          <div className="bg-white border border-aqua-border-light rounded-2xl p-6">
            <h3 className="text-base font-semibold text-aqua-secondary mb-5">Kategori Satışları</h3>
            <div className="relative">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-aqua-secondary">1.847</span>
                <span className="text-[11px] text-aqua-text-muted">sipariş</span>
              </div>
            </div>
            <div className="space-y-2 mt-3">
              {categoryPieData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-aqua-text-secondary">{cat.name}</span>
                  </div>
                  <span className="font-medium text-aqua-secondary">%{cat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Orders Table */}
      <ScrollReveal delay={0.5} className="mb-6">
        <div className="bg-white border border-aqua-border-light rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-aqua-bg">
            <h3 className="text-base font-semibold text-aqua-secondary">Son Siparişler</h3>
            <Link to="/admin" className="text-[13px] text-aqua-primary hover:underline">Tümünü Gör</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-aqua-bg/50">
                  {['Sipariş No', 'Müşteri', 'Ürün', 'Tutar', 'Durum', 'Tarih', 'İşlem'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-[11px] font-semibold text-aqua-text-muted uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adminOrders.map((order, i) => (
                  <motion.tr
                    key={order.orderNo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-aqua-bg last:border-0 hover:bg-aqua-bg/30 transition-colors"
                  >
                    <td className="px-6 py-3.5 text-sm font-medium text-aqua-primary">{order.orderNo}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-aqua-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-aqua-primary">{order.customer[0]}</span>
                        </div>
                        <span className="text-sm font-medium text-aqua-secondary">{order.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-[13px] text-aqua-text-secondary">{order.product}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-aqua-secondary">{order.amount}</td>
                    <td className="px-6 py-3.5">
                      <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-md', statusColors[order.status])}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-[13px] text-aqua-text-muted">{order.date}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-aqua-bg transition-colors">
                          <Eye className="w-4 h-4 text-aqua-text-muted" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-aqua-bg transition-colors">
                          <Pencil className="w-4 h-4 text-aqua-text-muted" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-aqua-bg transition-colors">
                          <Trash2 className="w-4 h-4 text-aqua-text-muted" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>

      {/* Bottom Row - 4 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Pending Tasks */}
        <ScrollReveal delay={0.55}>
          <div className="bg-white border border-aqua-border-light rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-aqua-secondary flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-aqua-primary" />
                Bekleyen Görevler
              </h4>
              <span className="bg-aqua-warning/10 text-aqua-warning text-[11px] font-semibold px-2 py-0.5 rounded-md">{pendingTasks.length} Görev</span>
            </div>
            <div className="space-y-2">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-aqua-bg/50 transition-colors group">
                  <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                    task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-amber-400' : 'bg-blue-400'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-aqua-secondary group-hover:text-aqua-primary transition-colors">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded', priorityConfig[task.priority].color)}>
                        {priorityConfig[task.priority].label}
                      </span>
                      <span className="text-[10px] text-aqua-text-muted">{task.time}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-aqua-text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Critical Stock Alerts */}
        <ScrollReveal delay={0.6}>
          <div className="bg-white border border-aqua-border-light rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-aqua-secondary flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-aqua-danger" />
                Kritik Stok Uyarıları
              </h4>
              <span className="bg-aqua-danger/10 text-aqua-danger text-[11px] font-semibold px-2 py-0.5 rounded-md">{criticalStockAlerts.length} Ürün</span>
            </div>
            <div className="space-y-3">
              {criticalStockAlerts.map((p) => (
                <div key={p.sku} className="flex items-center gap-3 p-3 rounded-xl bg-red-50/50 border border-red-100">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-aqua-secondary line-clamp-1">{p.name}</p>
                    <p className="text-[10px] text-aqua-text-muted">{p.sku}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-lg font-bold text-aqua-danger">{p.stock}</span>
                    <p className="text-[10px] text-aqua-text-muted">adet</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/admin/stok" className="flex items-center justify-center gap-1.5 mt-4 text-xs font-semibold text-aqua-primary hover:text-aqua-primary-dark transition-colors">
              Tüm Stokları Gör <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Today's Services */}
        <ScrollReveal delay={0.65}>
          <div className="bg-white border border-aqua-border-light rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-aqua-secondary flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-aqua-primary" />
                Bugünkü Servisler
              </h4>
              <span className="bg-aqua-primary/10 text-aqua-primary text-[11px] font-semibold px-2 py-0.5 rounded-md">{todayServices.length} Randevu</span>
            </div>
            <div className="space-y-2">
              {todayServices.map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-aqua-bg/50 transition-colors">
                  <span className="text-[13px] font-semibold text-aqua-primary w-12 flex-shrink-0">{s.time}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-aqua-secondary">{s.customer}</p>
                    <p className="text-[11px] text-aqua-text-muted">{s.type}</p>
                  </div>
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0', serviceStatusColors[s.status])} />
                </div>
              ))}
            </div>
            <Link to="/admin/servis-takvimi" className="flex items-center justify-center gap-1.5 mt-4 text-xs font-semibold text-aqua-primary hover:text-aqua-primary-dark transition-colors">
              Takvimi Gör <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Low Stock */}
        <ScrollReveal delay={0.7}>
          <div className="bg-white border border-aqua-border-light rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-aqua-secondary">Düşük Stok Ürünleri</h4>
              <span className="bg-aqua-danger/10 text-aqua-danger text-[11px] font-semibold px-2 py-0.5 rounded-md">{lowStockProducts.length} Ürün</span>
            </div>
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-aqua-bg rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-4 h-4 text-aqua-primary/30" />
                  </div>
                  <p className="text-[13px] font-medium text-aqua-secondary flex-1 line-clamp-1">{p.name}</p>
                  <span className="text-xs text-aqua-danger font-medium flex-shrink-0">{p.stock} adet</span>
                </div>
              ))}
            </div>
            <Link to="/admin/stok" className="flex items-center justify-center gap-1.5 mt-4 text-xs font-semibold text-aqua-primary hover:text-aqua-primary-dark transition-colors">
              Stok Yönetimi <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
      </>
  );
}
