import { useState } from 'react';
import { Search, Eye } from 'lucide-react';

const customers = [
  { id: '1', name: 'Ahmet Yılmaz', email: 'ahmet@email.com', phone: '0532 123 45 67', orders: 12, spent: 78420, date: '15 Oca 2024' },
  { id: '2', name: 'Selin Koç', email: 'selin@email.com', phone: '0533 456 78 90', orders: 5, spent: 22150, date: '3 Mar 2024' },
  { id: '3', name: 'Mehmet Demir', email: 'mehmet@email.com', phone: '0542 987 65 43', orders: 8, spent: 35670, date: '20 Şub 2024' },
  { id: '4', name: 'Ayşe Kaya', email: 'ayse@email.com', phone: '0555 234 56 78', orders: 3, spent: 18700, date: '10 Nis 2025' },
  { id: '5', name: 'Can Özkan', email: 'can@email.com', phone: '0536 789 01 23', orders: 2, spent: 47800, date: '5 May 2025' },
  { id: '6', name: 'Zeynep Şahin', email: 'zeynep@email.com', phone: '0541 345 67 89', orders: 6, spent: 28900, date: '1 Oca 2024' },
  { id: '7', name: 'Burak Aydın', email: 'burak@email.com', phone: '0531 876 54 32', orders: 4, spent: 12480, date: '12 Mar 2025' },
  { id: '8', name: 'Elif Yıldız', email: 'elif@email.com', phone: '0554 567 89 01', orders: 7, spent: 41230, date: '8 Şub 2024' },
];

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const filtered = customers.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
      <>      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Müşteri Yönetimi</h2>
      <div className="relative max-w-md mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9DAF]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Müşteri ara..." className="w-full pl-9 pr-4 py-2 text-sm bg-[#0A1929] border border-[#1A3A5C] rounded-lg text-white placeholder-[#8B9DAF] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/10" />
      </div>
      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#F8FBFF]">{['Müşteri', 'E-posta', 'Telefon', 'Sipariş', 'Harcama', 'Kayıt', 'İşlem'].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-[#EBF3FF] rounded-full flex items-center justify-center text-xs font-bold text-[#1A73E8]">{c.name[0]}</div><span className="text-sm font-medium text-[#0D2137]">{c.name}</span></div></td>
                  <td className="px-4 py-3 text-sm text-[#5A6B7B]">{c.email}</td>
                  <td className="px-4 py-3 text-sm text-[#5A6B7B] whitespace-nowrap">{c.phone}</td>
                  <td className="px-4 py-3 text-sm text-[#0D2137]">{c.orders}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#0D2137]">{c.spent.toLocaleString('tr-TR')}₺</td>
                  <td className="px-4 py-3 text-[13px] text-[#8B9DAF] whitespace-nowrap">{c.date}</td>
                  <td className="px-4 py-3"><button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F6FF] text-[#8B9DAF] hover:text-[#1A73E8]"><Eye className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
  );
}
