import { useState, useEffect } from 'react';
import { Search, Eye } from 'lucide-react';
import { getCustomers, type CustomerListItem } from '@/services/customerService';

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getCustomers().then((data) => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  const filtered = customers.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Müşteri Yönetimi</h2>
      <div className="relative max-w-md mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9DAF]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Müşteri ara..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-[#0A1929] border border-[#1A3A5C] rounded-lg text-white placeholder-[#8B9DAF] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/10"
        />
      </div>
      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-sm text-[#8B9DAF]">Müşteriler yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FBFF]">
                  {['Müşteri', 'E-posta', 'Telefon', 'Sipariş', 'Harcama', 'Puan', 'Kayıt', 'İşlem'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#EBF3FF] rounded-full flex items-center justify-center text-xs font-bold text-[#1A73E8]">
                          {c.name[0]}
                        </div>
                        <span className="text-sm font-medium text-[#0D2137]">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5A6B7B]">{c.email}</td>
                    <td className="px-4 py-3 text-sm text-[#5A6B7B] whitespace-nowrap">{c.phone}</td>
                    <td className="px-4 py-3 text-sm text-[#0D2137]">{c.orders}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#0D2137]">{c.spent.toLocaleString('tr-TR')}₺</td>
                    <td className="px-4 py-3 text-sm text-[#1A73E8]">{c.loyaltyPoints}</td>
                    <td className="px-4 py-3 text-[13px] text-[#8B9DAF] whitespace-nowrap">{c.date}</td>
                    <td className="px-4 py-3">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F6FF] text-[#8B9DAF] hover:text-[#1A73E8]">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-8 text-sm text-[#8B9DAF]">Müşteri bulunamadı</div>
        )}
      </div>
    </>
  );
}
