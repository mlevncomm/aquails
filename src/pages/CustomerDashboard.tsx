import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import {
  ShoppingBag, Truck, Filter as FilterIcon, MapPin, Clock,
  Wrench, Zap, ChevronRight, RefreshCw, Package, Heart,
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
import {
  CustomerPageShell,
  CustomerCard,
  CustomerSectionTitle,
  CustomerBadge,
  CustomerEmpty,
  CustomerLoading,
  CustomerButton,
} from '@/components/customer/customer-ui';

const quickActions = [
  { icon: ShoppingBag, label: 'Sipariş Ver', href: '/urunler', tone: 'bg-aq-sky text-aq-blue' },
  { icon: Wrench, label: 'Servis Talebi', href: '/hesabim/servis-talepleri', tone: 'bg-aq-ice text-aq-deep' },
  { icon: RefreshCw, label: 'Filtre Değişim', href: '/hesabim/filtre-takibi', tone: 'bg-aq-sky/70 text-aq-blue' },
  { icon: MapPin, label: 'Adres Ekle', href: '/hesabim/adresler', tone: 'bg-aq-ice text-aq-muted' },
];

function orderTone(status: string): 'success' | 'info' | 'warning' | 'danger' | 'neutral' {
  if (status === 'delivered') return 'success';
  if (status === 'shipped' || status === 'processing') return 'info';
  if (status === 'pending') return 'warning';
  if (status === 'cancelled' || status === 'refunded') return 'danger';
  return 'neutral';
}

export default function CustomerDashboard() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [serviceRequests, setServiceRequests] = useState<CustomerServiceRequest[]>([]);
  const [filters, setFilters] = useState<FilterDevice[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    void Promise.all([
      getCustomerOrders(user.id).then(setOrders),
      getAddresses(user.id).then(setAddresses),
      getCustomerServiceRequests(user.id).then(setServiceRequests),
      getFilterDevices(user.id).then(setFilters),
      getProducts().then((list) => setRecommended(list.slice(0, 4))),
    ]).finally(() => setLoading(false));
  }, [user]);

  const activeOrders = orders.filter((o) =>
    ['pending', 'processing', 'shipped'].includes(o.status),
  );
  const nextFilterDays = filters[0]?.daysRemaining;
  const firstName = user?.name?.split(' ')[0] ?? 'Müşterimiz';

  const stats = [
    {
      icon: ShoppingBag,
      label: 'Toplam Sipariş',
      value: String(orders.length),
      tone: 'bg-aq-sky text-aq-blue' as const,
    },
    {
      icon: Truck,
      label: 'Aktif Sipariş',
      value: String(activeOrders.length),
      tone: 'bg-aq-ice text-aq-deep' as const,
    },
    {
      icon: FilterIcon,
      label: 'Filtre Değişimine',
      value: nextFilterDays != null ? `${nextFilterDays} Gün` : '—',
      tone: 'bg-aq-sky/70 text-aq-blue' as const,
    },
    {
      icon: Heart,
      label: 'Kayıtlı Adres',
      value: String(addresses.length),
      tone: 'bg-aq-ice text-aq-muted' as const,
    },
  ];

  const recentActivity = orders.slice(0, 4).map((o) => ({
    icon: Package,
    text: `Sipariş ${orderStatusToTr(o.status)}`,
    detail: o.orderNo,
    time: o.date,
  }));

  if (loading) {
    return (
      <CustomerPageShell>
        <CustomerLoading rows={6} />
      </CustomerPageShell>
    );
  }

  return (
    <CustomerPageShell>
      <ScrollReveal>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-aq-deep via-aq-navy to-aq-blue p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-aq-aqua/20 blur-2xl" />
          <div className="absolute -left-6 bottom-0 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-aq-aqua/90 mb-2">
                Hesabım
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Merhaba, {firstName}
              </h1>
              <p className="text-sm text-white/75 mt-1.5 max-w-md leading-relaxed">
                {activeOrders.length > 0
                  ? `${activeOrders.length} aktif siparişiniz var. Durumu takip edebilirsiniz.`
                  : 'Yeni bir sipariş vermek için ürünlerimizi inceleyin.'}
              </p>
            </div>
            <Link
              to="/hesabim/siparisler"
              className="inline-flex items-center gap-2 bg-white/15 text-white border border-white/25 px-5 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-white/25 transition-colors whitespace-nowrap"
            >
              Siparişlerim <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </ScrollReveal>

      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6" staggerDelay={0.06}>
        {stats.map((stat) => (
          <StaggerItem key={stat.label}>
            <CustomerCard className="!p-4 sm:!p-5">
              <div className={cn('w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3', stat.tone)}>
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-aq-text tabular-nums">{stat.value}</p>
              <p className="text-[11px] sm:text-xs text-aq-muted mt-0.5">{stat.label}</p>
            </CustomerCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <ScrollReveal delay={0.08}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="flex items-center gap-3 p-3.5 sm:p-4 bg-white border border-aq-border/60 rounded-2xl hover:border-aq-blue/40 hover:shadow-[0_4px_16px_rgba(18,134,216,0.08)] transition-all group"
            >
              <div className={cn('w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center', action.tone)}>
                <action.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-aq-text group-hover:text-aq-blue transition-colors">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <ScrollReveal delay={0.12}>
            <CustomerCard padding={false}>
              <CustomerSectionTitle
                title="Son Siparişlerim"
                action={
                  <Link to="/hesabim/siparisler" className="text-[13px] text-aq-blue hover:underline font-medium">
                    Tümünü Gör
                  </Link>
                }
              />
              {orders.length === 0 ? (
                <CustomerEmpty
                  icon={Package}
                  title="Henüz sipariş yok"
                  message="İlk siparişinizi vererek hesabınızı doldurmaya başlayın."
                  action={
                    <Link to="/urunler">
                      <CustomerButton>Alışverişe Başla</CustomerButton>
                    </Link>
                  }
                />
              ) : (
                <div className="divide-y divide-aq-border/60">
                  {orders.slice(0, 5).map((order) => (
                    <Link
                      key={order.id}
                      to={`/hesabim/siparisler/${order.id}`}
                      className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-aq-ice/60 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-aq-sky/70 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4 text-aq-blue" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-aq-text truncate">{order.orderNo}</p>
                          <p className="text-xs text-aq-muted mt-0.5">{order.date}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-aq-text tabular-nums">
                          {order.total.toLocaleString('tr-TR')}₺
                        </p>
                        <CustomerBadge tone={orderTone(order.status)} className="mt-1">
                          {orderStatusToTr(order.status)}
                        </CustomerBadge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CustomerCard>
          </ScrollReveal>

          <ScrollReveal delay={0.16}>
            <CustomerCard padding={false}>
              <CustomerSectionTitle title="Son Aktiviteler" />
              <div className="p-4 space-y-1">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-aq-muted text-center py-6">Henüz sipariş aktivitesi yok.</p>
                ) : (
                  recentActivity.map((act, i) => (
                    <div
                      key={`${act.detail}-${i}`}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-aq-ice transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-aq-sky text-aq-blue">
                        <act.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-aq-text">{act.text}</p>
                        <p className="text-xs text-aq-muted">{act.detail}</p>
                      </div>
                      <span className="text-[11px] text-aq-muted flex-shrink-0">{act.time}</span>
                    </div>
                  ))
                )}
              </div>
            </CustomerCard>
          </ScrollReveal>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <ScrollReveal delay={0.18}>
            <CustomerCard padding={false}>
              <CustomerSectionTitle
                title="Aktif Servis Talepleri"
                action={
                  <Link to="/hesabim/servis-talepleri" className="text-[11px] font-medium text-aq-blue hover:underline">
                    Tümü
                  </Link>
                }
              />
              <div className="p-4 space-y-3">
                {serviceRequests.length === 0 ? (
                  <p className="text-sm text-aq-muted text-center py-4">Aktif servis talebi yok.</p>
                ) : (
                  serviceRequests.slice(0, 3).map((req) => (
                    <div key={req.id} className="flex items-start gap-3 bg-aq-ice rounded-xl p-4">
                      <Clock
                        className={cn(
                          'w-5 h-5 flex-shrink-0 mt-0.5',
                          req.status === 'pending' ? 'text-amber-500' : 'text-aq-blue',
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-aq-text">{req.type}</p>
                        <p className="text-xs text-aq-muted line-clamp-2">{req.description}</p>
                        <p className="text-[11px] text-aq-muted mt-1">{req.date}</p>
                      </div>
                      <CustomerBadge tone={req.status === 'pending' ? 'warning' : 'info'}>
                        {req.status === 'pending'
                          ? 'Bekliyor'
                          : req.status === 'scheduled'
                            ? 'Planlandı'
                            : req.status}
                      </CustomerBadge>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 pb-4">
                <Link
                  to="/servis-randevusu"
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-aq-blue border border-aq-border/60 rounded-xl hover:border-aq-blue hover:bg-aq-sky/40 transition-all"
                >
                  <Wrench className="w-3.5 h-3.5" /> Yeni Servis Talebi
                </Link>
              </div>
            </CustomerCard>
          </ScrollReveal>

          <ScrollReveal delay={0.22}>
            <CustomerCard padding={false}>
              <CustomerSectionTitle title="Filtre Ömrü Takibi" />
              <div className="p-4 space-y-4">
                {filters.length === 0 ? (
                  <p className="text-sm text-aq-muted text-center py-4">Kayıtlı filtre takibi yok.</p>
                ) : (
                  filters.slice(0, 3).map((fs) => {
                    const percentRemaining = Math.max(
                      0,
                      Math.min(100, Math.round((fs.daysRemaining / Math.max(fs.changeIntervalDays, 1)) * 100)),
                    );
                    return (
                      <div key={fs.id}>
                        <div className="flex items-center justify-between mb-1.5 gap-2">
                          <span className="text-[13px] text-aq-muted truncate">{fs.filterName}</span>
                          <span
                            className={cn(
                              'text-xs font-semibold flex-shrink-0',
                              percentRemaining > 80
                                ? 'text-emerald-600'
                                : percentRemaining > 50
                                  ? 'text-amber-600'
                                  : 'text-red-500',
                            )}
                          >
                            {fs.daysRemaining} gün
                          </span>
                        </div>
                        <div className="h-2 bg-aq-ice rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentRemaining}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={cn(
                              'h-full rounded-full',
                              percentRemaining > 80
                                ? 'bg-emerald-500'
                                : percentRemaining > 50
                                  ? 'bg-amber-500'
                                  : 'bg-red-500',
                            )}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="px-4 pb-4">
                <Link
                  to="/hesabim/filtre-takibi"
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-aq-blue border border-aq-border/60 rounded-xl hover:border-aq-blue hover:bg-aq-ice transition-all"
                >
                  <Zap className="w-3.5 h-3.5" /> Filtre Takibine Git
                </Link>
              </div>
            </CustomerCard>
          </ScrollReveal>

          <ScrollReveal delay={0.26}>
            <CustomerCard padding={false}>
              <CustomerSectionTitle
                title="Adreslerim"
                action={
                  <Link to="/hesabim/adresler" className="text-[11px] font-medium text-aq-blue hover:underline">
                    Yönet
                  </Link>
                }
              />
              <div className="p-4 space-y-3">
                {addresses.length === 0 ? (
                  <p className="text-sm text-aq-muted text-center py-4">Kayıtlı adres yok.</p>
                ) : (
                  addresses.slice(0, 2).map((addr) => (
                    <div key={addr.id} className="bg-aq-ice rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-sm font-semibold text-aq-text">{addr.title}</h3>
                        {addr.isDefault && <CustomerBadge tone="info">Varsayılan</CustomerBadge>}
                      </div>
                      <p className="text-[13px] text-aq-muted leading-relaxed">
                        {addr.fullAddress}, {addr.district}/{addr.city}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CustomerCard>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="bg-gradient-to-br from-aq-blue to-aq-navy rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-5 h-5" />
                <h3 className="text-sm font-semibold">Filtre Aboneliği</h3>
              </div>
              <p className="text-xs text-white/80 mb-4 leading-relaxed">
                Filtreleriniz otomatik olarak kapınıza gelsin. Abone olarak indirim kazanın.
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

      {recommended.length > 0 && (
        <ScrollReveal delay={0.34} className="mt-8">
          <CustomerCard padding={false} className="overflow-hidden">
            <div className="flex items-end justify-between gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-aq-border/50">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-aq-blue mb-1">
                  Öneriler
                </p>
                <h2 className="text-lg sm:text-xl font-bold text-aq-text tracking-tight">
                  Sizin İçin Seçtiklerimiz
                </h2>
              </div>
              <Link
                to="/urunler"
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-aq-blue hover:text-aq-deep transition-colors flex-shrink-0"
              >
                Tümü <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="p-4 sm:p-5 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {recommended.map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          </CustomerCard>
        </ScrollReveal>
      )}
    </CustomerPageShell>
  );
}
