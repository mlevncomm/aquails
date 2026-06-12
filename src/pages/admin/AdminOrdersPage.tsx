import { useState } from 'react';
import { Link } from 'react-router';
import { Eye, Search, ChevronDown } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useToastStore } from '@/components/Toast';

const statuses = ['all', 'Yeni', 'Hazırlanıyor', 'Kargoda', 'Tamamlandı', 'İptal Edildi'];
const allOrders = [
  { id: '1', orderNo: 'AQ-2025-1847', customer: 'Ahmet Yılmaz', email: 'ahmet@email.com', product: 'PurePro 7 Aşamalı', amount: 12900, status: 'Tamamlandı', date: '10 Haz 2025' },
  { id: '2', orderNo: 'AQ-2025-1846', customer: 'Selin Koç', email: 'selin@email.com', product: 'Compact Tezgah Altı', amount: 8750, status: 'Kargoda', date: '10 Haz 2025' },
  { id: '3', orderNo: 'AQ-2025-1845', customer: 'Mehmet Demir', email: 'mehmet@email.com', product: 'Mineral Plus Filtre Seti', amount: 1490, status: 'Tamamlandı', date: '9 Haz 2025' },
  { id: '4', orderNo: 'AQ-2025-1844', customer: 'Ayşe Kaya', email: 'ayse@email.com', product: 'Aile Paketi', amount: 14900, status: 'Hazırlanıyor', date: '9 Haz 2025' },
  { id: '5', orderNo: 'AQ-2025-1843', customer: 'Can Özkan', email: 'can@email.com', product: 'Business Pro', amount: 39900, status: 'Kargoda', date: '8 Haz 2025' },
  { id: '6', orderNo: 'AQ-2025-1842', customer: 'Zeynep Şahin', email: 'zeynep@email.com', product: 'PurePro 7 Aşamalı', amount: 12900, status: 'Tamamlandı', date: '8 Haz 2025' },
  { id: '7', orderNo: 'AQ-2025-1841', customer: 'Burak Aydın', email: 'burak@email.com', product: 'Filtre Seti x2', amount: 2980, status: 'Tamamlandı', date: '7 Haz 2025' },
  { id: '8', orderNo: 'AQ-2025-1840', customer: 'Elif Yıldız', email: 'elif@email.com', product: 'Compact + Filtre', amount: 10240, status: 'Hazırlanıyor', date: '7 Haz 2025' },
  { id: '9', orderNo: 'AQ-2025-1839', customer: 'Kemal Arslan', email: 'kemal@email.com', product: 'Başlangıç Paketi', amount: 9900, status: 'İptal Edildi', date: '6 Haz 2025' },
  { id: '10', orderNo: 'AQ-2025-1838', customer: 'Deniz Çelik', email: 'deniz@email.com', product: 'PurePro + Kurulum', amount: 13400, status: 'Tamamlandı', date: '6 Haz 2025' },
  { id: '11', orderNo: 'AQ-2025-1837', customer: 'Fatma Kılıç', email: 'fatma@email.com', product: 'Smart IoT Cihazı', amount: 15900, status: 'Yeni', date: '6 Haz 2025' },
  { id: '12', orderNo: 'AQ-2025-1836', customer: 'Murat Şen', email: 'murat@email.com', product: 'Business Max', amount: 67500, status: 'Kargoda', date: '5 Haz 2025' },
];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState(allOrders);
  const addToast = useToastStore((s) => s.add);

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.customer.toLowerCase().includes(search.toLowerCase()) || o.orderNo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusMap: Record<string, string> = { 'Yeni': 'pending', 'Hazırlanıyor': 'processing', 'Kargoda': 'shipped', 'Tamamlandı': 'delivered', 'İptal Edildi': 'cancelled' };

  const updateStatus = (id: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    addToast(`Sipariş durumu güncellendi: ${newStatus}`, 'success');
  };

  return (
      <>      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Sipariş Yönetimi</h2>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9DAF]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Sipariş no veya müşteri ara..." className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#D6E3F0] rounded-xl text-[#0D2137] placeholder-[#8B9DAF] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/10" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm bg-white border border-[#D6E3F0] rounded-xl text-[#0D2137] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/10 appearance-none cursor-pointer min-w-[140px]">
          {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'Tüm Durumlar' : s}</option>)}
        </select>
      </div>

      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#F8FBFF]">{['Sipariş No', 'Müşteri', 'Ürün', 'Tutar', 'Durum', 'Tarih', 'İşlem'].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                  <td className="px-4 py-3 text-sm font-medium text-[#1A73E8]">{o.orderNo}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 bg-[#EBF3FF] rounded-full flex items-center justify-center text-xs font-bold text-[#1A73E8]">{o.customer[0]}</div><div><p className="text-sm font-medium text-[#0D2137]">{o.customer}</p><p className="text-[11px] text-[#8B9DAF]">{o.email}</p></div></div></td>
                  <td className="px-4 py-3 text-sm text-[#5A6B7B] max-w-[140px] truncate">{o.product}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#0D2137]">{o.amount.toLocaleString('tr-TR')}₺</td>
                  <td className="px-4 py-3"><div className="relative group"><StatusBadge status={statusMap[o.status] || o.status} /><ChevronDown className="w-3 h-3 inline ml-1 text-[#8B9DAF]" />
                    <div className="absolute z-20 hidden group-hover:block top-full left-0 mt-1 bg-white border border-[#E8F0FE] rounded-lg shadow-lg overflow-hidden min-w-[140px]">
                      {statuses.filter(s => s !== 'all').map(s => <button key={s} onClick={() => updateStatus(o.id, s)} className="block w-full text-left px-3 py-2 text-xs text-[#5A6B7B] hover:bg-[#F0F6FF] hover:text-[#0D2137]">{s}</button>)}
                    </div>
                  </div></td>
                  <td className="px-4 py-3 text-[13px] text-[#8B9DAF] whitespace-nowrap">{o.date}</td>
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
