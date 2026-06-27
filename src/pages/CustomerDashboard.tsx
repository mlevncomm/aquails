import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  ShoppingBag, Truck, Filter as FilterIcon, Heart, Clock,
  Wrench, Zap, ChevronRight, Bell, RefreshCw, MapPin,
  CreditCard, Star, Package
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { filterStatuses, products } from '@/data';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/ProductCard';
import { getCustomerOrders, type ApiOrder } from '@/services/orderService';
import { useAuthStore } from '@/stores/authStore';

const statusLabels: Record<string, string> = {
  delivered: 'Tamamlandı',
  shipped: 'Kargoda',
  pending: 'Bekliyor',
  processing: 'Hazırlanıyor',
  cancelled: 'İptal',
};

const staticStats = [
  { icon: FilterIcon, label: 'Filtre Değişimine', value: '15 Gün', trend: 'Acele et', color: 'bg-amber-50 text-amber-600' },
  { icon: Heart, label: 'Favorilerim', value: '5', trend: '', color: 'bg-red-50 text-red-500' },
];
const quickActions = [
  { icon: ShoppingBag, label: 'Sipariş Ver', href: '/urunler', color: 'from-[#1A73E8] to-[#1557B0]' },
  { icon: Wrench, label: 'Servis Talebi', href: '/hesabim/servis-talepleri', color: 'from-emerald-500 to-emerald-600' },
  { icon: RefreshCw, label: 'Filtre Değişim', href: '/hesabim/filtre-takibi', color: 'from-amber-500 to-amber-600' },
  { icon: MapPin, label: 'Adres Ekle', href: '/hesabim/adresler', color: 'from-purple-500 to-purple-600' },
];

const recentActivity = [
  { icon: Package, text: 'Siparişiniz kargoya verildi', detail: 'AQ-2025-1847', time: '2 saat önce', color: 'bg-blue-50 text-blue-600' },
  { icon: Bell, text: 'Filtre değişim zamanı yaklaşıyor', detail: 'Sediment filtresi %20', time: '1 gün önce', color: 'bg-amber-50 text-amber-600' },
  { icon: Star, text: 'Yeni kampanya başladı', detail: '%20 Yaz İndirimi', time: '2 gün önce', color: 'bg-purple-50 text-purple-600' },
  { icon: CreditCard, text: 'Ödemeniz onaylandı', detail: '12.900₺', time: '3 gün önce', color: 'bg-emerald-50 text-emerald-600' },
];

const serviceRequests = [
  { type: 'Filtre Değişimi', date: '8 Haz 2025', status: 'pending' as const, desc: 'PurePro 7 Aşamalı cihaz için' },
  { type: 'Periyodik Bakım', date: '15 Haz 2025', status: 'scheduled' as const, desc: 'Yıllık bakım kontrolü' },
];

const addresses = [
  { title: 'Ev', address: 'Atatürk Mah. Cumhuriyet Cad. No:45 D:12, Pendik/İstanbul', isDefault: true },
  { title: 'İş', address: 'Caferağa Mah. Moda Cad. No:12, Kadıköy/İstanbul', isDefault: false },
];

function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function CustomerDashboard() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getCustomerOrders();
        if (!cancelled) setOrders(data);
      } catch {
        if (!cancelled) setOrders([]);
      } finally {
        if (!cancelled) setOrdersLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const activeCount = orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length;
  const latestOrder = orders[0];
  const welcomeSubtitle = latestOrder
    ? `Son siparişiniz: ${latestOrder.orderNumber} (${statusLabels[latestOrder.status] ?? latestOrder.status})`
    : 'Henüz siparişiniz yok. İlk siparişinizi verin!';

  const stats = [
    { icon: ShoppingBag, label: 'Toplam Sipariş', value: String(orders.length), trend: '', color: 'bg-[#1A73E8]/10 text-[#1A73E8]' },
    { icon: Truck, label: 'Kargoda / Bekliyor', value: String(activeCount), trend: '', color: 'bg-emerald-50 text-emerald-600' },
    ...staticStats,
  ];

  return (
    <>
      {/* Welcome Banner */}
      <ScrollReveal>
        <div className="bg-gradient-to-r from-[#1A73E8] to-[#4285F4] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Tekrar Hoş Geldiniz{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!</h3>
            <p className="text-sm text-white/80 mt-1">{welcomeSubtitle}</p>
          </div>
          <Link
            to="/hesabim/siparisler"
            className="bg-white/15 text-white border border-white/30 px-5 py-2.5 rounded-full text-[13px] font-semibold hover:bg-white/25 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            Siparişlerim <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </ScrollReveal>

      {/* Stats */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6" staggerDelay={0.08}>
        {stats.map((stat) => (
          <StaggerItem key={stat.label}>
            <div className="bg-white border border-[#E8F0FE] rounded-2xl p-4 sm:p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className={cn('w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center', stat.color.split(' ')[0])}>
                  <stat.icon className={cn('w-4 h-4 sm:w-5 sm:h-5', stat.color.split(' ')[1])} />
                </div>
                {stat.trend && (
                  <span className="text-[10px] font-medium text-[#8B9DAF] bg-[#F8FBFF] px-1.5 py-0.5 rounded-full">{stat.trend}</span>
                )}
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#0D2137] mt-2">{stat.value}</p>
              <p className="text-[11px] sm:text-xs text-[#8B9DAF] mt-0.5">{stat.label}</p>
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
              className="flex items-center gap-3 p-3.5 sm:p-4 bg-white border border-[#E8F0FE] rounded-2xl hover:shadow-md hover:border-[#D6E3F0] transition-all group"
            >
              <div className={cn('w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-gradient-to-br', action.color, 'text-white shadow-sm')}>
                <action.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#0D2137] group-hover:text-[#1A73E8] transition-colors">{action.label}</span>
            </Link>
          ))}
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">

          {/* Recent Orders */}
          <ScrollReveal delay={0.2}>
            <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F6FF]">
                <h4 className="text-base font-semibold text-[#0D2137]">Son Siparişlerim</h4>
                <Link to="/hesabim/siparisler" className="text-[13px] text-[#1A73E8] hover:underline font-medium">Tümünü Gör</Link>
              </div>
              <div className="divide-y divide-[#F0F6FF]">
                {ordersLoading ? (
                  <p className="px-5 py-6 text-sm text-[#8B9DAF] text-center">Siparişler yükleniyor...</p>
                ) : orders.length === 0 ? (
                  <p className="px-5 py-6 text-sm text-[#8B9DAF] text-center">Henüz siparişiniz yok.</p>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <Link
                      key={order.id}
                      to={`/hesabim/siparisler/${order.id}`}
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-[#F8FBFF]/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#F0F6FF] rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-[#1A73E8]/40" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1A73E8]">{order.orderNumber}</p>
                          <p className="text-xs text-[#8B9DAF] mt-0.5">{formatOrderDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#0D2137]">{order.total.toLocaleString('tr-TR')}₺</p>
                        <span className={cn(
                          'text-[11px] font-medium px-2 py-0.5 rounded-full',
                          order.status === 'delivered' && 'bg-emerald-50 text-emerald-600',
                          order.status === 'shipped' && 'bg-blue-50 text-blue-600',
                          (order.status === 'pending' || order.status === 'processing') && 'bg-amber-50 text-amber-600',
                          order.status === 'cancelled' && 'bg-red-50 text-red-500',
                        )}>
                          {statusLabels[order.status] ?? order.status}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Recent Activity */}
          <ScrollReveal delay={0.25}>
            <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F0F6FF]">
                <h4 className="text-base font-semibold text-[#0D2137]">Son Aktiviteler</h4>
              </div>
              <div className="p-4 space-y-2">
                {recentActivity.map((act, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F8FBFF] transition-colors">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', act.color)}>
                      <act.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0D2137]">{act.text}</p>
                      <p className="text-xs text-[#8B9DAF]">{act.detail}</p>
                    </div>
                    <span className="text-[11px] text-[#8B9DAF] flex-shrink-0">{act.time}</span>
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
            <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F6FF]">
                <h4 className="text-base font-semibold text-[#0D2137]">Aktif Servis Talepleri</h4>
                <Link to="/hesabim/servis-talepleri" className="text-[11px] font-medium text-[#1A73E8] hover:underline">Tümü</Link>
              </div>
              <div className="p-4 space-y-3">
                {serviceRequests.map((req, i) => (
                  <div key={i} className="flex items-start gap-3 bg-[#F8FBFF] rounded-xl p-4">
                    <Clock className={cn('w-5 h-5 flex-shrink-0 mt-0.5', req.status === 'pending' ? 'text-amber-500' : 'text-[#1A73E8]')} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#0D2137]">{req.type}</p>
                      <p className="text-xs text-[#8B9DAF]">{req.desc}</p>
                      <p className="text-[11px] text-[#8B9DAF] mt-1">{req.date}</p>
                    </div>
                    <span className={cn(
                      'text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 h-fit',
                      req.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    )}>
                      {req.status === 'pending' ? 'Bekliyor' : 'Planlandı'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-4 pb-4">
                <Link
                  to="/servis-randevusu"
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-[#1A73E8] border border-[#1A73E8] rounded-xl hover:bg-[#1A73E8] hover:text-white transition-all"
                >
                  <Wrench className="w-3.5 h-3.5" /> Yeni Servis Talebi
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Filter Tracking */}
          <ScrollReveal delay={0.35}>
            <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F0F6FF]">
                <h4 className="text-base font-semibold text-[#0D2137]">Filtre Ömrü Takibi</h4>
              </div>
              <div className="p-4 space-y-4">
                {filterStatuses.slice(0, 3).map((fs) => (
                  <div key={fs.filterName}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] text-[#5A6B7B]">{fs.filterName}</span>
                      <span className={cn(
                        'text-xs font-semibold',
                        fs.percentRemaining > 80 ? 'text-emerald-600' : fs.percentRemaining > 50 ? 'text-amber-600' : 'text-red-500'
                      )}>
                        {fs.daysRemaining} gün
                      </span>
                    </div>
                    <div className="h-2 bg-[#F0F6FF] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${fs.percentRemaining}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={cn(
                          'h-full rounded-full',
                          fs.percentRemaining > 80 ? 'bg-emerald-500' : fs.percentRemaining > 50 ? 'bg-amber-500' : 'bg-red-500'
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 pb-4">
                <Link
                  to="/hesabim/filtre-takibi"
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-[#1A73E8] border border-[#E8F0FE] rounded-xl hover:border-[#1A73E8] hover:bg-[#F0F6FF] transition-all"
                >
                  <Zap className="w-3.5 h-3.5" /> Filtre Değişim Talebi
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Addresses */}
          <ScrollReveal delay={0.4}>
            <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F6FF]">
                <h4 className="text-base font-semibold text-[#0D2137]">Adreslerim</h4>
                <Link to="/hesabim/adresler" className="text-[11px] font-medium text-[#1A73E8] hover:underline">Yönet</Link>
              </div>
              <div className="p-4 space-y-3">
                {addresses.map((addr) => (
                  <div key={addr.title} className="bg-[#F8FBFF] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="text-sm font-semibold text-[#0D2137]">{addr.title}</h5>
                      {addr.isDefault && (
                        <span className="bg-[#1A73E8]/10 text-[#1A73E8] text-[10px] font-semibold px-2 py-0.5 rounded-full">Varsayılan</span>
                      )}
                    </div>
                    <p className="text-[13px] text-[#5A6B7B] leading-relaxed">{addr.address}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Subscription Promo */}
          <ScrollReveal delay={0.45}>
            <div className="bg-gradient-to-br from-[#1A73E8] to-[#1557B0] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-5 h-5" />
                <h4 className="text-sm font-bold">Filtre Aboneliği</h4>
              </div>
              <p className="text-xs text-white/80 mb-3 leading-relaxed">
                Filtreleriniz otomatik olarak kapınıza gelsin. Abone olarak %15 indirim kazanın.
              </p>
              <Link
                to="/filtre-aboneligi"
                className="inline-flex items-center gap-1.5 bg-white/15 border border-white/30 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-white/25 transition-all"
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
          <h3 className="text-lg font-bold text-[#0D2137]">Sizin İçin Seçtiklerimiz</h3>
          <Link to="/urunler" className="text-[13px] text-[#1A73E8] hover:underline font-medium">Tümü</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(8, 12).map((p) => (
            <ProductCard key={p.id} product={p} compact />
          ))}
        </div>
      </ScrollReveal>
    </>
  );
}
