import { useState } from 'react';
import { Link } from 'react-router';
import { Eye } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';

const mockOrders = [
  { id: '1', orderNo: 'AQ-2025-1847', date: '10 Haziran 2025', status: 'shipped', total: 12900, items: 1, product: 'Aquails PurePro 7 Aşamalı' },
  { id: '2', orderNo: 'AQ-2025-1840', date: '7 Haziran 2025', status: 'pending', total: 10240, items: 2, product: 'Compact + Filtre Seti' },
  { id: '3', orderNo: 'AQ-2025-1838', date: '6 Haziran 2025', status: 'delivered', total: 13400, items: 1, product: 'PurePro + Kurulum' },
  { id: '4', orderNo: 'AQ-2025-1829', date: '1 Haziran 2025', status: 'delivered', total: 1490, items: 1, product: 'Mineral Plus Filtre Seti' },
  { id: '5', orderNo: 'AQ-2025-1815', date: '25 Mayıs 2025', status: 'delivered', total: 39900, items: 1, product: 'Business Pro Endüstriyel' },
  { id: '6', orderNo: 'AQ-2025-1802', date: '18 Mayıs 2025', status: 'cancelled', total: 8750, items: 1, product: 'Compact Tezgah Altı' },
  { id: '7', orderNo: 'AQ-2025-1789', date: '10 Mayıs 2025', status: 'delivered', total: 1490, items: 2, product: 'Mineral Plus Filtre Seti x2' },
];

export default function CustomerOrdersPage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? mockOrders : mockOrders.filter(o => o.status === filter);

  return (
      <>      <div className="space-y-5">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'Tümü' },
            { key: 'pending', label: 'Hazırlanıyor' },
            { key: 'shipped', label: 'Kargoda' },
            { key: 'delivered', label: 'Teslim Edildi' },
            { key: 'cancelled', label: 'İptal' },
          ].map(f => (
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

        {/* Orders */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-[#E8F0FE] rounded-2xl">
            <EmptyState title="Henüz siparişiniz yok" description="İlk siparişinizi vermek için ürünlerimizi inceleyin." />
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => (
              <div key={order.id} className="bg-white border border-[#E8F0FE] rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-semibold text-[#1A73E8]">{order.orderNo}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-[#8B9DAF] mt-1.5">{order.date}</p>
                    <p className="text-sm text-[#5A6B7B] mt-2 truncate">{order.product}</p>
                  </div>
                  <div className="flex items-center gap-4 sm:text-right">
                    <div>
                      <p className="text-base font-bold text-[#0D2137]">{order.total.toLocaleString('tr-TR')}₺</p>
                      <p className="text-xs text-[#8B9DAF]">{order.items} ürün</p>
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
