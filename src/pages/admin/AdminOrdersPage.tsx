import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { Eye, Search, ChevronDown, Package } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { getAllOrders, updateOrderStatus, type AdminOrderListItem } from '@/services/orderService';
import { orderStatusFromTr, ADMIN_ORDER_STATUS_OPTIONS } from '@/lib/orderStatus';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminFilterBar,
  AdminInput,
  AdminSelect,
  AdminLoading,
  AdminEmpty,
  AdminTableWrap,
  AdminDesktopOnly,
  AdminMobileCardList,
  AdminOrderStatusBadge,
  AdminCard,
  AdminButton,
} from '@/components/admin/admin-ui';

const statuses = ['all', ...ADMIN_ORDER_STATUS_OPTIONS];

function StatusMenu({
  status,
  orderId,
  onUpdate,
}: {
  status: string;
  orderId: string;
  onUpdate: (id: string, status: string) => void;
}) {
  return (
    <div className="relative group inline-flex items-center gap-1">
      <AdminOrderStatusBadge status={status} />
      <ChevronDown className="w-3 h-3 text-aq-muted" />
      <div className="absolute z-20 hidden group-hover:block group-focus-within:block top-full left-0 mt-1 bg-white border border-aq-border/60 rounded-lg shadow-sm overflow-hidden min-w-[140px]">
        {ADMIN_ORDER_STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onUpdate(orderId, s)}
            className="block w-full text-left px-3 py-2 text-xs text-aq-muted hover:bg-aq-ice hover:text-aq-text"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

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
    <AdminPageShell>
      <AdminPageHeader
        title="Sipariş Yönetimi"
        description="Tüm siparişleri görüntüleyin ve durumlarını güncelleyin."
      />

      <AdminFilterBar>
        <div className="relative flex-1 min-w-0 sm:min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aq-muted pointer-events-none" />
          <AdminInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sipariş no veya müşteri ara..."
            className="pl-9"
          />
        </div>
        <AdminSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="sm:w-[160px]"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'Tüm Durumlar' : s}
            </option>
          ))}
        </AdminSelect>
      </AdminFilterBar>

      {loading ? (
        <AdminLoading label="Siparişler yükleniyor..." />
      ) : filtered.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty
            icon={Package}
            title="Sipariş bulunamadı"
            message="Arama veya filtre kriterlerinize uygun sipariş yok."
          />
        </AdminCard>
      ) : (
        <>
          <AdminMobileCardList>
            {filtered.map((o) => (
              <AdminCard key={o.id} className="!p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-aq-blue">{o.orderNo}</p>
                    <p className="text-sm text-aq-text mt-0.5 truncate">{o.customer}</p>
                    <p className="text-[11px] text-aq-muted truncate">{o.email}</p>
                  </div>
                  <StatusMenu status={o.status} orderId={o.id} onUpdate={(id, s) => void handleUpdateStatus(id, s)} />
                </div>
                <p className="text-xs text-aq-muted mt-3 line-clamp-2">{o.product}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-aq-border/50">
                  <div>
                    <p className="text-sm font-semibold text-aq-text">{o.amount.toLocaleString('tr-TR')}₺</p>
                    <p className="text-[11px] text-aq-muted">{o.date}</p>
                  </div>
                  <Link to={`/admin/siparisler/${o.id}`}>
                    <AdminButton variant="secondary" className="!px-3 !py-2">
                      <Eye className="w-4 h-4" /> Detay
                    </AdminButton>
                  </Link>
                </div>
              </AdminCard>
            ))}
          </AdminMobileCardList>

          <AdminDesktopOnly>
            <AdminTableWrap stickyFirst>
              <table className="w-full">
                <thead>
                  <tr className="bg-aq-ice">
                    {['Sipariş No', 'Müşteri', 'Ürün', 'Tutar', 'Durum', 'Tarih', 'İşlem'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-[11px] font-semibold text-aq-muted uppercase whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => (
                    <tr key={o.id} className="border-b border-aq-border/60 last:border-0 hover:bg-aq-ice/50">
                      <td className="px-4 py-3 text-sm font-medium text-aq-blue whitespace-nowrap">{o.orderNo}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 bg-aq-sky rounded-full flex items-center justify-center text-xs font-medium text-aq-blue flex-shrink-0">
                            {o.customer[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-aq-text truncate">{o.customer}</p>
                            <p className="text-[11px] text-aq-muted truncate">{o.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-aq-muted max-w-[160px] truncate">{o.product}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-aq-text whitespace-nowrap">
                        {o.amount.toLocaleString('tr-TR')}₺
                      </td>
                      <td className="px-4 py-3">
                        <StatusMenu status={o.status} orderId={o.id} onUpdate={(id, s) => void handleUpdateStatus(id, s)} />
                      </td>
                      <td className="px-4 py-3 text-[13px] text-aq-muted whitespace-nowrap">{o.date}</td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/siparisler/${o.id}`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-aq-ice text-aq-muted hover:text-aq-blue transition-all"
                          aria-label="Sipariş detayı"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AdminTableWrap>
          </AdminDesktopOnly>
        </>
      )}
    </AdminPageShell>
  );
}
