import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import {
  ShoppingBag, Truck, Filter as FilterIcon, Heart, Clock,
  Wrench, Zap, ChevronRight, RefreshCw, MapPin, Package
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/ProductCard';
import { getCustomerOrders, type CustomerOrder } from '@/services/orderService';
import { getAddresses, type Address } from '@/services/addressService';
import { getCustomerServiceRequests, type CustomerServiceRequest } from '@/services/serviceRequestService';
import { getFilterDevices, type FilterDevice } from '@/services/filterTrackingService';
import { getProducts } from '@/services/productService';
import type { Product } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { orderStatusToTr } from '@/lib/orderStatus';

const quickActions = [
  { icon: ShoppingBag, label: 'Sipariş Ver', href: '/urunler', color: 'from-aq-blue to-aq-navy' },
  { icon: Wrench, label: 'Servis Talebi', href: '/hesabim/servis-talepleri', color: 'from-emerald-500 to-emerald-600' },
  { icon: RefreshCw, label: 'Filtre Değişim', href: '/hesabim/filtre-takibi', color: 'from-amber-500 to-amber-600' },
  { icon: MapPin, label: 'Adres Ekle', href: '/hesabim/adresler', color: 'from-purple-500 to-purple-600' },
];

export default function CustomerDashboard() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [serviceRequests, setServiceRequests] = useState<CustomerServiceRequest[]>([]);
  const [filters, setFilters] = useState<FilterDevice[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);

  useEffect(() => {
    if (!user) return;
    void getCustomerOrders(user.id).then(setOrders);
    void getAddresses(user.id).then(setAddresses);
    void getCustomerServiceRequests(user.id).then(setServiceRequests);
    void getFilterDevices(user.id).then(setFilters);
    void getProducts().then((list) => setRecommended(list.slice(0, 4)));
  }, [user]);

  const activeOrders = orders.filter((o) => ['pending', 'processing', 'shipped'].includes(o.status));
  const nextFilterDays = filters[0]?.daysRemaining;
  const stats = [
    { icon: ShoppingBag, label: 'Toplam Sipariş', value: String(orders.length), trend: '', color: 'bg-aq-sky text-aq-blue' },
    { icon: Truck, label: 'Aktif Sipariş', value: String(activeOrders.length), trend: '', color: 'bg-emerald-50 text-emerald-600' },
    { icon: FilterIcon, label: 'Filtre Değişimine', value: nextFilterDays != null ? `${nextFilterDays} Gün` : '—', trend: '', color: 'bg-amber-50 text-amber-600' },
    { icon: Heart, label: 'Adreslerim', value: String(addresses.length), trend: '', color: 'bg-red-50 text-red-500' },
  ];

  const recentActivity = orders.slice(0, 4).map((o) => ({
    icon: Package,
    text: `Sipariş ${orderStatusToTr(o.status)}`,
    detail: o.orderNo,
    time: o.date,
    color: 'bg-aq-sky text-aq-blue',
  }));
  return (
    <>
      {/* Welcome Banner */}
      <ScrollReveal>
        <div className="bg-gradient-to-r from-aq-blue to-aq-navy rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mb-8">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">Tekrar Hoş Geldiniz, {user?.name?.split(' ')[0] ?? 'Müşterimiz'}!</h3>
            <p className="text-sm text-white/80 mt-1.5">
              {activeOrders.length > 0
                ? `${activeOrders.length} aktif siparişiniz var.`
                : 'Yeni bir sipariş vermek için ürünlerimizi inceleyin.'}
            </p>
          </div>
          <Link
            to="/hesabim/siparisler"
            className="bg-white/15 text-white border border-white/30 px-5 py-2.5 rounded-xl text-[13px] font-medium hover:bg-white/25 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            Siparişlerim <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </ScrollReveal>

      {/* Stats */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8" staggerDelay={0.08}>
        {stats.map((stat) => (
          <StaggerItem key={stat.label}>
            <div className="bg-white border border-aq-border/60 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <div className={cn('w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center', stat.color.split(' ')[0])}>
                  <stat.icon className={cn('w-4 h-4 sm:w-5 sm:h-5', stat.color.split(' ')[1])} />
                </div>
                {stat.trend && (
                  <span className="text-[10px] font-medium text-aq-muted bg-aq-ice px-1.5 py-0.5 rounded-full">{stat.trend}</span>
                )}
              </div>
              <p className="text-xl sm:text-2xl font-bold text-aq-text mt-2">{stat.value}</p>
              <p className="text-[11px] sm:text-xs text-aq-muted mt-0.5">{stat.label}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Quick Actions */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="flex items-center gap-3 p-3.5 sm:p-4 bg-white border border-aq-border/60 rounded-2xl hover:border-aq-border/60 transition-all group"
            >
              <div className={cn('w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-gradient-to-br', action.color, 'text-white shadow-sm')}>
                <action.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-aq-text group-hover:text-aq-blue transition-colors">{action.label}</span>
            </Link>
          ))}
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">

          {/* Recent Orders */}
          <ScrollReveal delay={0.2}>
            <div className="bg-white border border-aq-border/60 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-aq-border/60">
                <h4 className="text-base font-semibold text-aq-text">Son Siparişlerim</h4>
                <Link to="/hesabim/siparisler" className="text-[13px] text-aq-blue hover:underline font-medium">Tümünü Gör</Link>
              </div>
              <div className="divide-y divide-aq-border">
                {orders.slice(0, 5).map((order) => (
                  <Link
                    key={order.id}
                    to={`/hesabim/siparisler/${order.id}`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-aq-ice/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-aq-ice rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-aq-blue/40" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-aq-blue">{order.orderNo}</p>
                        <p className="text-xs text-aq-muted mt-0.5">{order.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-aq-text">{order.total.toLocaleString('tr-TR')}₺</p>
                      <span className={cn(
                        'text-[11px] font-medium px-2 py-0.5 rounded-full',
                        order.status === 'delivered' && 'bg-emerald-50 text-emerald-600',
                        order.status === 'shipped' && 'bg-aq-sky text-aq-blue',
                        order.status === 'pending' && 'bg-amber-50 text-amber-600',
                        order.status === 'cancelled' && 'bg-red-50 text-red-500',
                      )}>
                        {orderStatusToTr(order.status)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Recent Activity */}
          <ScrollReveal delay={0.25}>
            <div className="bg-white border border-aq-border/60 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-aq-border/60">
                <h4 className="text-base font-semibold text-aq-text">Son Aktiviteler</h4>
              </div>
              <div className="p-4 space-y-2">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-aq-muted text-center py-4">Henüz sipariş aktivitesi yok.</p>
                ) : recentActivity.map((act, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-aq-ice transition-colors">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', act.color)}>
                      <act.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-aq-text">{act.text}</p>
                      <p className="text-xs text-aq-muted">{act.detail}</p>
                    </div>
                    <span className="text-[11px] text-aq-muted flex-shrink-0">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column */}
        <div className="space-y-4 sm:space-y-6">

          {/* Service Requests */}
          <ScrollReveal delay={0.3}>
            <div className="bg-white border border-aq-border/60 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-aq-border/60">
                <h4 className="text-base font-semibold text-aq-text">Aktif Servis Talepleri</h4>
                <Link to="/hesabim/servis-talepleri" className="text-[11px] font-medium text-aq-blue hover:underline">Tümü</Link>
              </div>
              <div className="p-4 space-y-3">
                {serviceRequests.length === 0 && (
                  <p className="text-sm text-aq-muted text-center py-2">Aktif servis talebi yok.</p>
                )}
                {serviceRequests.slice(0, 3).map((req) => (
                  <div key={req.id} className="flex items-start gap-3 bg-aq-ice rounded-xl p-4">
                    <Clock className={cn('w-5 h-5 flex-shrink-0 mt-0.5', req.status === 'pending' ? 'text-amber-500' : 'text-aq-blue')} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-aq-text">{req.type}</p>
                      <p className="text-xs text-aq-muted">{req.description}</p>
                      <p className="text-[11px] text-aq-muted mt-1">{req.date}</p>
                    </div>
                    <span className={cn(
                      'text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 h-fit',
                      req.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-aq-sky text-aq-blue'
                    )}>
                      {req.status === 'pending' ? 'Bekliyor' : req.status === 'scheduled' ? 'Planlandı' : req.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-4 pb-4">
                <Link
                  to="/servis-randevusu"
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-aq-blue border border-aq-deep rounded-xl hover:bg-aq-deep hover:text-white transition-all"
                >
                  <Wrench className="w-3.5 h-3.5" /> Yeni Servis Talebi
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Filter Tracking */}
          <ScrollReveal delay={0.35}>
            <div className="bg-white border border-aq-border/60 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-aq-border/60">
                <h4 className="text-base font-semibold text-aq-text">Filtre Ömrü Takibi</h4>
              </div>
              <div className="p-4 space-y-4">
                {filters.length === 0 && (
                  <p className="text-sm text-aq-muted text-center py-2">Kayıtlı filtre takibi yok.</p>
                )}
                {filters.slice(0, 3).map((fs) => {
                  const percentRemaining = Math.max(0, Math.min(100, Math.round((fs.daysRemaining / Math.max(fs.changeIntervalDays, 1)) * 100)));
                  return (
                    <div key={fs.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[13px] text-aq-muted">{fs.filterName}</span>
                        <span className={cn(
                          'text-xs font-semibold',
                          percentRemaining > 80 ? 'text-emerald-600' : percentRemaining > 50 ? 'text-amber-600' : 'text-red-500'
                        )}>
                          {fs.daysRemaining} gün
                        </span>
                      </div>
                      <div className="h-2 bg-aq-ice rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentRemaining}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className={cn(
                            'h-full rounded-full',
                            percentRemaining > 80 ? 'bg-emerald-500' : percentRemaining > 50 ? 'bg-amber-500' : 'bg-red-500'
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-4 pb-4">
                <Link
                  to="/hesabim/filtre-takibi"
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-aq-blue border border-aq-border/60 rounded-xl hover:border-aq-blue hover:bg-aq-ice transition-all"
                >
                  <Zap className="w-3.5 h-3.5" /> Filtre Değişim Talebi
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Addresses */}
          <ScrollReveal delay={0.4}>
            <div className="bg-white border border-aq-border/60 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-aq-border/60">
                <h4 className="text-base font-semibold text-aq-text">Adreslerim</h4>
                <Link to="/hesabim/adresler" className="text-[11px] font-medium text-aq-blue hover:underline">Yönet</Link>
              </div>
              <div className="p-4 space-y-3">
                {addresses.slice(0, 2).map((addr) => (
                  <div key={addr.id} className="bg-aq-ice rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="text-sm font-semibold text-aq-text">{addr.title}</h5>
                      {addr.isDefault && (
                        <span className="bg-aq-sky text-aq-blue text-[10px] font-medium px-2 py-0.5 rounded-full">Varsayılan</span>
                      )}
                    </div>
                    <p className="text-[13px] text-aq-muted leading-relaxed">{addr.fullAddress}, {addr.district}/{addr.city}</p>
                  </div>
                ))}
                {addresses.length === 0 && (
                  <p className="text-sm text-aq-muted text-center py-2">Kayıtlı adres yok.</p>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Subscription Promo */}
          <ScrollReveal delay={0.45}>
            <div className="bg-gradient-to-br from-aq-blue to-aq-navy rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-5 h-5" />
                <h4 className="text-sm font-semibold">Filtre Aboneliği</h4>
              </div>
              <p className="text-xs text-white/80 mb-3 leading-relaxed">
                Filtreleriniz otomatik olarak kapınıza gelsin. Abone olarak %15 indirim kazanın.
              </p>
              <Link
                to="/filtre-aboneligi"
                className="inline-flex items-center gap-1.5 bg-white/15 border border-white/30 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-white/25 transition-all"
              >
                Keşfet <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Recommended Products */}
      <ScrollReveal delay={0.5} className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-aq-text">Sizin İçin Seçtiklerimiz</h3>
          <Link to="/urunler" className="text-[13px] text-aq-blue hover:underline font-medium">Tümü</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommended.map((p) => (
            <ProductCard key={p.id} product={p} compact />
          ))}
        </div>
      </ScrollReveal>
    </>
  );
}
