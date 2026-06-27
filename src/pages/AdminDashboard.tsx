import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  Banknote, ShoppingBag, Clock, Users, AlertTriangle, Wrench,
  TrendingUp, Eye, Package, MessageSquare, Star, Bell, RefreshCw,
  Zap, ArrowRight, Calendar
} from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { getAdminDashboard } from '@/services/customerService';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/StatusBadge';

interface DashboardOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
  itemCount: number;
}

interface DashboardData {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  newCustomers: number;
  lowStockCount: number;
  recentOrders: DashboardOrder[];
  lowStockProducts: Product[];
}

function formatCurrency(value: number) {
  return `₺${value.toLocaleString('tr-TR')}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getAdminDashboard()
      .then((result) => {
        if (!cancelled) setData(result as unknown as DashboardData);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Veriler yüklenemedi.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-aqua-text-muted">Yükleniyor...</div>;
  }

  if (error || !data) {
    return <div className="text-center py-12 text-aqua-danger">{error ?? 'Veriler yüklenemedi.'}</div>;
  }

  const stats = [
    { icon: Banknote, label: 'Toplam ciro', value: formatCurrency(data.totalRevenue), color: 'bg-[#EBF3FF] text-[#1A73E8]' },
    { icon: ShoppingBag, label: 'Toplam sipariş', value: data.totalOrders.toLocaleString('tr-TR'), color: 'bg-[#F0FDF4] text-[#00C9A7]' },
    { icon: Clock, label: 'İşlem bekliyor', value: String(data.pendingOrders), color: 'bg-[#FFFBEB] text-[#F5A623]' },
    { icon: Users, label: 'Yeni müşteri (30 gün)', value: data.newCustomers.toLocaleString('tr-TR'), color: 'bg-[#F3E8FF] text-[#8B5CF6]' },
    { icon: AlertTriangle, label: 'Düşük stok', value: String(data.lowStockCount), color: 'bg-[#FEF2F2] text-[#E85454]' },
    { icon: Wrench, label: 'Son siparişler', value: String(data.recentOrders.length), color: 'bg-[#EBF3FF] text-[#1A73E8]' },
  ];

  const operationCards = [
    { icon: Package, label: 'Düşük Stok', value: data.lowStockCount, href: '/admin/stok', color: 'bg-red-50 text-red-500 border-red-200', iconBg: 'bg-red-100' },
    { icon: ShoppingBag, label: 'Bekleyen Sipariş', value: data.pendingOrders, href: '/admin/siparisler', color: 'bg-sky-50 text-sky-600 border-sky-200', iconBg: 'bg-sky-100' },
    { icon: Users, label: 'Yeni Müşteri', value: data.newCustomers, href: '/admin/musteriler', color: 'bg-blue-50 text-blue-600 border-blue-200', iconBg: 'bg-blue-100' },
    { icon: Banknote, label: 'Toplam Ciro', value: formatCurrency(data.totalRevenue), href: '/admin/raporlar', color: 'bg-indigo-50 text-indigo-600 border-indigo-200', iconBg: 'bg-indigo-100' },
    { icon: Bell, label: 'Stok Bildirimleri', value: data.lowStockCount, href: '/admin/stok-bildirimleri', color: 'bg-rose-50 text-rose-600 border-rose-200', iconBg: 'bg-rose-100' },
    { icon: Wrench, label: 'Servis Takvimi', value: '—', href: '/admin/servis-takvimi', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', iconBg: 'bg-emerald-100' },
  ];

  const criticalStockAlerts = data.lowStockProducts.filter((p) => p.stock <= 3);

  return (
      <>
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6" staggerDelay={0.08}>
        {stats.map((stat) => (
          <StaggerItem key={stat.label}>
            <div className="bg-white border border-aqua-border-light rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', stat.color.split(' ')[0])}>
                  <stat.icon className={cn('w-5 h-5', stat.color.split(' ')[1])} />
                </div>
                <TrendingUp className="w-3 h-3 text-aqua-text-muted" />
              </div>
              <p className="text-xl font-bold text-aqua-secondary mt-3">{stat.value}</p>
              <p className="text-xs text-aqua-text-muted mt-0.5">{stat.label}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <ScrollReveal delay={0.2} className="mb-6">
        <div className="bg-white border border-aqua-border-light rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-aqua-secondary flex items-center gap-2">
              <Package className="w-5 h-5 text-aqua-primary" />
              Operasyon Özeti
            </h3>
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

      <ScrollReveal delay={0.5} className="mb-6">
        <div className="bg-white border border-aqua-border-light rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-aqua-bg">
            <h3 className="text-base font-semibold text-aqua-secondary">Son Siparişler</h3>
            <Link to="/admin/siparisler" className="text-[13px] text-aqua-primary hover:underline">Tümünü Gör</Link>
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
                {data.recentOrders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-aqua-bg last:border-0 hover:bg-aqua-bg/30 transition-colors"
                  >
                    <td className="px-6 py-3.5 text-sm font-medium text-aqua-primary">{order.orderNumber}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-aqua-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-aqua-primary">{order.customerName[0]}</span>
                        </div>
                        <span className="text-sm font-medium text-aqua-secondary">{order.customerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-[13px] text-aqua-text-secondary">{order.itemCount} ürün</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-aqua-secondary">{formatCurrency(order.total)}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-3.5 text-[13px] text-aqua-text-muted">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-3.5">
                      <Link to={`/admin/siparisler/${order.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-aqua-bg transition-colors">
                        <Eye className="w-4 h-4 text-aqua-text-muted" />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {data.recentOrders.length === 0 && (
              <div className="text-center py-8 text-sm text-aqua-text-muted">Henüz sipariş yok</div>
            )}
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5">
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
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-50/50 border border-red-100">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-aqua-secondary line-clamp-1">{p.name}</p>
                    <p className="text-[10px] text-aqua-text-muted">{p.slug}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-lg font-bold text-aqua-danger">{p.stock}</span>
                    <p className="text-[10px] text-aqua-text-muted">adet</p>
                  </div>
                </div>
              ))}
              {criticalStockAlerts.length === 0 && (
                <p className="text-sm text-aqua-text-muted text-center py-4">Kritik stok yok</p>
              )}
            </div>
            <Link to="/admin/stok" className="flex items-center justify-center gap-1.5 mt-4 text-xs font-semibold text-aqua-primary hover:text-aqua-primary-dark transition-colors">
              Tüm Stokları Gör <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.65}>
          <div className="bg-white border border-aqua-border-light rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-aqua-secondary flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-aqua-primary" />
                Servis Takvimi
              </h4>
            </div>
            <p className="text-sm text-aqua-text-muted text-center py-6">Servis randevularını takvimden görüntüleyin.</p>
            <Link to="/admin/servis-takvimi" className="flex items-center justify-center gap-1.5 mt-4 text-xs font-semibold text-aqua-primary hover:text-aqua-primary-dark transition-colors">
              Takvimi Gör <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.7}>
          <div className="bg-white border border-aqua-border-light rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-aqua-secondary">Düşük Stok Ürünleri</h4>
              <span className="bg-aqua-danger/10 text-aqua-danger text-[11px] font-semibold px-2 py-0.5 rounded-md">{data.lowStockProducts.length} Ürün</span>
            </div>
            <div className="space-y-3">
              {data.lowStockProducts.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-3">
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

        <ScrollReveal delay={0.55}>
          <div className="bg-white border border-aqua-border-light rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-aqua-secondary flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-aqua-primary" />
                Hızlı Erişim
              </h4>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Müşteriler', href: '/admin/musteriler', icon: Users },
                { label: 'Kuponlar', href: '/admin/kuponlar', icon: Star },
                { label: 'Stok Bildirimleri', href: '/admin/stok-bildirimleri', icon: Bell },
                { label: 'İadeler', href: '/admin/iade-degisim', icon: RefreshCw },
                { label: 'Abonelikler', href: '/admin/abonelikler', icon: Zap },
              ].map((item) => (
                <Link key={item.href} to={item.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-aqua-bg/50 transition-colors group">
                  <item.icon className="w-4 h-4 text-aqua-primary" />
                  <span className="text-[13px] font-medium text-aqua-secondary group-hover:text-aqua-primary transition-colors">{item.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-aqua-text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
      </>
  );
}
