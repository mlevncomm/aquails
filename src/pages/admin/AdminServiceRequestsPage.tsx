import { useState } from 'react';
import { Wrench, Clock, MapPin, ChevronDown } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';

const reqs = [
  { id: '1', customer: 'Ahmet Yılmaz', device: 'PurePro 7 Aşamalı', type: 'Kurulum', address: 'Pendik/İstanbul', date: '10 Haz 2025', status: 'pending', tech: '' },
  { id: '2', customer: 'Selin Koç', device: 'Compact', type: 'Filtre Değişimi', address: 'Kadıköy/İstanbul', date: '10 Haz 2025', status: 'scheduled', tech: 'Mehmet Tekniker' },
  { id: '3', customer: 'Mehmet Demir', device: 'Business Pro', type: 'Bakım', address: 'Ümraniye/İstanbul', date: '11 Haz 2025', status: 'pending', tech: '' },
  { id: '4', customer: 'Ayşe Kaya', device: 'PurePro', type: 'Kurulum', address: 'Maltepe/İstanbul', date: '12 Haz 2025', status: 'scheduled', tech: 'Ali Tekniker' },
  { id: '5', customer: 'Can Özkan', device: 'Compact', type: 'Arıza', address: 'Ataşehir/İstanbul', date: '8 Haz 2025', status: 'completed', tech: 'Mehmet Tekniker' },
];

const techs = ['Mehmet Tekniker', 'Ali Tekniker', 'Serkan Tekniker'];
const statuses = ['pending', 'scheduled', 'completed', 'cancelled'];

export default function AdminServiceRequestsPage() {
  const [list, setList] = useState(reqs);

  const assignTech = (id: string, tech: string) => setList(prev => prev.map(r => r.id === id ? { ...r, tech, status: 'scheduled' as const } : r));
  const updateStatus = (id: string, s: string) => setList(prev => prev.map(r => r.id === id ? { ...r, status: s as typeof r.status } : r));

  return (
      <>      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Servis Talepleri</h2>
      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#F8FBFF]">{['Müşteri', 'Cihaz', 'Tip', 'Adres', 'Tarih', 'Durum', 'Teknisyen', 'İşlem'].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {list.map(r => (
                <tr key={r.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 bg-[#EBF3FF] rounded-full flex items-center justify-center text-xs font-bold text-[#1A73E8]">{r.customer[0]}</div><span className="text-sm font-medium text-[#0D2137]">{r.customer}</span></div></td>
                  <td className="px-4 py-3 text-sm text-[#5A6B7B]">{r.device}</td>
                  <td className="px-4 py-3 text-sm text-[#0D2137] flex items-center gap-1"><Wrench className="w-3.5 h-3.5 text-[#8B9DAF]" />{r.type}</td>
                  <td className="px-4 py-3 text-sm text-[#5A6B7B] max-w-[140px] truncate flex items-center gap-1"><MapPin className="w-3 h-3 flex-shrink-0" />{r.address}</td>
                  <td className="px-4 py-3 text-[13px] text-[#8B9DAF] whitespace-nowrap flex items-center gap-1"><Clock className="w-3 h-3" />{r.date}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3">
                    {r.tech ? <span className="text-xs text-[#5A6B7B] bg-[#F0F6FF] px-2 py-1 rounded-md">{r.tech}</span> : (
                      <div className="relative">
                        <select onChange={e => assignTech(r.id, e.target.value)} className="text-xs bg-white border border-[#D6E3F0] rounded-lg px-2 py-1 focus:outline-none focus:border-[#1A73E8] pr-6">
                          <option>Ata</option>{techs.map(t => <option key={t}>{t}</option>)}
                        </select>
                        <ChevronDown className="w-3 h-3 text-[#8B9DAF] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <select onChange={e => updateStatus(r.id, e.target.value)} value={r.status} className="text-xs bg-white border border-[#D6E3F0] rounded-lg px-2 py-1 focus:outline-none pr-6">
                        {statuses.map(s => <option key={s} value={s}>{s === 'pending' ? 'Bekliyor' : s === 'scheduled' ? 'Planlandı' : s === 'completed' ? 'Tamamlandı' : 'İptal'}</option>)}
                      </select>
                      <ChevronDown className="w-3 h-3 text-[#8B9DAF] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
  );
}
