import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Eye, Search, ChevronDown } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useToastStore } from '@/components/Toast';
import { adminGetOrders, adminUpdateOrderStatus, type ApiOrder } from '@/services/orderService';

const statuses = [
  { label: 'all', display: 'Tüm Durumlar' },
  { label: 'pending', display: 'Yeni' },
  { label: 'processing', display: 'Hazırlanıyor' },
  { label: 'shipped', display: 'Kargoda' },
  { label: 'delivered', display: 'Tamamlandı' },
  { label: 'cancelled', display: 'İptal Edildi' },
];

const statusDisplay: Record<string, string> = {
  pending: 'Yeni',
  processing: 'Hazırlanıyor',
  shipped: 'Kargoda',
  delivered: 'Tamamlandı',
  cancelled: 'İptal Edildi',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addToast = useToastStore((s) => s.add);

  const loadOrders = () => {
    setLoading(true);
    setError(null);
    adminGetOrders({
      limit: 100,
      status: statusFilter !== 'all' ? statusFilter.toUpperCase() : undefined,
    })
      .then((result) => setOrders(result.items))
      .catch((err) => setError(err instanceof Error ? err.message : 'Siparişler yüklenemedi.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const filtered = orders.filter(o => {
    const matchSearch = !search
      || o.customer.name.toLowerCase().includes(search.toLowerCase())
      || o.orderNumber.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const updated = await adminUpdateOrderStatus(id, newStatus);
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
      addToast(`Sipariş durumu güncellendi: ${statusDisplay[newStatus] ?? newStatus}`, 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Güncelleme başarısız.', 'error');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-[#8B9DAF]">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
      <>      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Sipariş Yönetimi</h2>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9DAF]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Sipariş no veya müşteri ara..." className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#D6E3F0] rounded-xl text-[#0D2137] placeholder-[#8B9DAF] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/10" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm bg-white border border-[#D6E3F0] rounded-xl text-[#0D2137] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/10 appearance-none cursor-pointer min-w-[140px]">
          {statuses.map(s => <option key={s.label} value={s.label}>{s.display}</option>)}
        </select>
      </div>

      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#F8FBFF]">{['Sipariş No', 'Müşteri', 'Ürün', 'Tutar', 'Durum', 'Tarih', 'İşlem'].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                  <td className="px-4 py-3 text-sm font-medium text-[#1A73E8]">{o.orderNumber}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 bg-[#EBF3FF] rounded-full flex items-center justify-center text-xs font-bold text-[#1A73E8]">{o.customer.name[0]}</div><div><p className="text-sm font-medium text-[#0D2137]">{o.customer.name}</p><p className="text-[11px] text-[#8B9DAF]">{o.customer.email}</p></div></div></td>
                  <td className="px-4 py-3 text-sm text-[#5A6B7B] max-w-[140px] truncate">{o.items.map(i => i.productName).join(', ')}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#0D2137]">{o.total.toLocaleString('tr-TR')}₺</td>
                  <td className="px-4 py-3"><div className="relative group"><StatusBadge status={o.status} /><ChevronDown className="w-3 h-3 inline ml-1 text-[#8B9DAF]" />
                    <div className="absolute z-20 hidden group-hover:block top-full left-0 mt-1 bg-white border border-[#E8F0FE] rounded-lg shadow-lg overflow-hidden min-w-[140px]">
                      {statuses.filter(s => s.label !== 'all').map(s => <button key={s.label} onClick={() => updateStatus(o.id, s.label)} className="block w-full text-left px-3 py-2 text-xs text-[#5A6B7B] hover:bg-[#F0F6FF] hover:text-[#0D2137]">{s.display}</button>)}
                    </div>
                  </div></td>
                  <td className="px-4 py-3 text-[13px] text-[#8B9DAF] whitespace-nowrap">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3"><Link to={`/admin/siparisler/${o.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F6FF] text-[#8B9DAF] hover:text-[#1A73E8] transition-all"><Eye className="w-4 h-4" /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-8 text-sm text-[#8B9DAF]">Sipariş bulunamadı</div>}
      </div>
      </>
  );
}
