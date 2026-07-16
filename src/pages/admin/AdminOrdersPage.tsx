import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { Eye, Search, ChevronDown } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useToastStore } from '@/components/Toast';
import { getAllOrders, updateOrderStatus, type AdminOrderListItem } from '@/services/orderService';
import { orderStatusFromTr, ADMIN_ORDER_STATUS_OPTIONS } from '@/lib/orderStatus';

const statuses = ['all', ...ADMIN_ORDER_STATUS_OPTIONS];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState<AdminOrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToastStore((s) => s.add);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.orderNo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const dbStatus = orderStatusFromTr(newStatus);
    const result = await updateOrderStatus(id, dbStatus);
    if (result.success) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
      addToast(`Sipariş durumu güncellendi: ${newStatus}`, 'success');
    } else {
      addToast(result.error ?? 'Güncelleme başarısız.', 'error');
    }
  };

  return (
    <>
      <h2 className="text-lg font-semibold text-aq-text mb-5">Sipariş Yönetimi</h2>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aq-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sipariş no veya müşteri ara..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-aq-border/60 rounded-xl text-aq-text placeholder-aq-muted focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-white border border-aq-border/60 rounded-xl text-aq-text focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/30 appearance-none cursor-pointer min-w-[140px]"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'Tüm Durumlar' : s}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-aq-border/60 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-sm text-aq-muted">Siparişler yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-aq-ice">
                  {['Sipariş No', 'Müşteri', 'Ürün', 'Tutar', 'Durum', 'Tarih', 'İşlem'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-aq-muted uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-b border-aq-border/60 last:border-0 hover:bg-aq-ice/50">
                    <td className="px-4 py-3 text-sm font-medium text-aq-blue">{o.orderNo}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-aq-sky rounded-full flex items-center justify-center text-xs font-medium text-aq-blue">
                          {o.customer[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-aq-text">{o.customer}</p>
                          <p className="text-[11px] text-aq-muted">{o.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-aq-muted max-w-[140px] truncate">{o.product}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-aq-text">{o.amount.toLocaleString('tr-TR')}₺</td>
                    <td className="px-4 py-3">
                      <div className="relative group">
                        <StatusBadge status={o.status} />
                        <ChevronDown className="w-3 h-3 inline ml-1 text-aq-muted" />
                        <div className="absolute z-20 hidden group-hover:block top-full left-0 mt-1 bg-white border border-aq-border/60 rounded-lg shadow-sm overflow-hidden min-w-[140px]">
                          {ADMIN_ORDER_STATUS_OPTIONS.map((s) => (
                            <button
                              key={s}
                              onClick={() => void handleUpdateStatus(o.id, s)}
                              className="block w-full text-left px-3 py-2 text-xs text-aq-muted hover:bg-aq-ice hover:text-aq-text"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-aq-muted whitespace-nowrap">{o.date}</td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/siparisler/${o.id}`}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-aq-ice text-aq-muted hover:text-aq-blue transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-8 text-sm text-aq-muted">Sipariş bulunamadı</div>
        )}
      </div>
    </>
  );
}
