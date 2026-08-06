import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Eye, Package, ShoppingBag } from 'lucide-react';
import { getCustomerOrders, type CustomerOrder } from '@/services/orderService';
import { useAuthStore } from '@/stores/authStore';
import { orderStatusToTr } from '@/lib/orderStatus';
import {
  CustomerPageShell,
  CustomerPageHeader,
  CustomerCard,
  CustomerFilterBar,
  CustomerChip,
  CustomerBadge,
  CustomerEmpty,
  CustomerLoading,
  CustomerButton,
} from '@/components/customer/customer-ui';

function orderTone(status: string): 'success' | 'info' | 'warning' | 'danger' | 'neutral' {
  if (status === 'delivered') return 'success';
  if (status === 'shipped' || status === 'processing') return 'info';
  if (status === 'pending') return 'warning';
  if (status === 'cancelled' || status === 'refunded') return 'danger';
  return 'neutral';
}

const FILTERS = [
  { key: 'all', label: 'Tümü' },
  { key: 'pending', label: 'Hazırlanıyor' },
  { key: 'shipped', label: 'Kargoda' },
  { key: 'delivered', label: 'Teslim Edildi' },
  { key: 'cancelled', label: 'İptal' },
];

export default function CustomerOrdersPage() {
  const user = useAuthStore((s) => s.user);
  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    void getCustomerOrders(user.id)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <CustomerPageShell>
      <CustomerPageHeader
        title="Siparişlerim"
        description="Siparişlerinizin durumunu takip edin."
      />

      <CustomerFilterBar>
        {FILTERS.map((f) => (
          <CustomerChip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label}
          </CustomerChip>
        ))}
      </CustomerFilterBar>

      {loading ? (
        <CustomerLoading rows={4} />
      ) : filtered.length === 0 ? (
        <CustomerCard padding={false}>
          <CustomerEmpty
            icon={Package}
            title={orders.length === 0 ? 'Henüz siparişiniz yok' : 'Bu filtrede sipariş yok'}
            message={
              orders.length === 0
                ? 'İlk siparişinizi vermek için ürünlerimizi inceleyin.'
                : 'Farklı bir durum seçerek tekrar deneyin.'
            }
            action={
              orders.length === 0 ? (
                <Link to="/urunler">
                  <CustomerButton>
                    <ShoppingBag className="w-4 h-4" /> Alışverişe Başla
                  </CustomerButton>
                </Link>
              ) : undefined
            }
          />
        </CustomerCard>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <CustomerCard key={order.id} className="!p-4 sm:!p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-semibold text-aq-text">{order.orderNo}</span>
                    <CustomerBadge tone={orderTone(order.status)}>
                      {orderStatusToTr(order.status)}
                    </CustomerBadge>
                  </div>
                  <p className="text-xs text-aq-muted mt-1.5">{order.date}</p>
                  <p className="text-sm text-aq-muted mt-2 line-clamp-2">
                    {order.items.map((i) => i.name).join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-4 sm:justify-end">
                  <div className="sm:text-right">
                    <p className="text-base font-bold text-aq-text tabular-nums">
                      {order.total.toLocaleString('tr-TR')}₺
                    </p>
                    <p className="text-xs text-aq-muted">{order.items.length} ürün</p>
                  </div>
                  <Link
                    to={`/hesabim/siparisler/${order.id}`}
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-aq-sky/70 text-aq-blue hover:bg-aq-deep hover:text-white transition-all"
                    aria-label="Sipariş detayı"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </CustomerCard>
          ))}
        </div>
      )}
    </CustomerPageShell>
  );
}
