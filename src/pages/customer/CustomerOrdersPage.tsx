import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Eye } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { getCustomerOrders, type CustomerOrder } from '@/services/orderService';
import { useAuthStore } from '@/stores/authStore';

export default function CustomerOrdersPage() {
  const user = useAuthStore((s) => s.user);
  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    void getCustomerOrders(user.id).then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, [user]);

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'Tümü' },
            { key: 'pending', label: 'Hazırlanıyor' },
            { key: 'shipped', label: 'Kargoda' },
            { key: 'delivered', label: 'Teslim Edildi' },
            { key: 'cancelled', label: 'İptal' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                filter === f.key ? 'bg-[#1A73E8] text-white' : 'bg-white border border-[#E8F0FE] text-[#5A6B7B] hover:border-[#1A73E8]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-8 text-center text-sm text-[#8B9DAF]">
            Siparişler yükleniyor...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-[#E8F0FE] rounded-2xl">
            <EmptyState title="Henüz siparişiniz yok" description="İlk siparişinizi vermek için ürünlerimizi inceleyin." />
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <div key={order.id} className="bg-white border border-[#E8F0FE] rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-semibold text-[#1A73E8]">{order.orderNo}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-[#8B9DAF] mt-1.5">{order.date}</p>
                    <p className="text-sm text-[#5A6B7B] mt-2 truncate">
                      {order.items.map((i) => i.name).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 sm:text-right">
                    <div>
                      <p className="text-base font-bold text-[#0D2137]">{order.total.toLocaleString('tr-TR')}₺</p>
                      <p className="text-xs text-[#8B9DAF]">{order.items.length} ürün</p>
                    </div>
                    <Link
                      to={`/hesabim/siparisler/${order.id}`}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F0F6FF] text-[#1A73E8] hover:bg-[#1A73E8] hover:text-white transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
