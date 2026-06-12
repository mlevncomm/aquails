import { useState } from 'react';
import { Filter, Bell, BellOff, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router';

interface FilterTrack {
  id: string; deviceName: string; filterName: string; lastChange: string; nextChange: string; daysLeft: number; reminder: boolean;
}

export default function CustomerFilterTrackingPage() {
  const [filters, setFilters] = useState<FilterTrack[]>([
    { id: '1', deviceName: 'Aquails PurePro (Mutfak)', filterName: 'Sediment Filtre', lastChange: '15 Nisan 2025', nextChange: '15 Ekim 2025', daysLeft: 127, reminder: true },
    { id: '2', deviceName: 'Aquails PurePro (Mutfak)', filterName: 'Karbon Filtre', lastChange: '15 Nisan 2025', nextChange: '15 Ekim 2025', daysLeft: 127, reminder: true },
    { id: '3', deviceName: 'Aquails PurePro (Mutfak)', filterName: 'RO Membran', lastChange: '10 Ocak 2024', nextChange: '10 Ocak 2027', daysLeft: 579, reminder: true },
    { id: '4', deviceName: 'Aquails Compact (Ofis)', filterName: 'Sediment Filtre', lastChange: '20 Aralık 2024', nextChange: '20 Haziran 2025', daysLeft: 10, reminder: true },
    { id: '5', deviceName: 'Aquails Compact (Ofis)', filterName: 'Karbon Filtre', lastChange: '20 Aralık 2024', nextChange: '20 Haziran 2025', daysLeft: 10, reminder: false },
  ]);

  const toggleReminder = (id: string) => setFilters(prev => prev.map(f => f.id === id ? { ...f, reminder: !f.reminder } : f));

  return (
      <>      <h2 className="text-lg font-bold text-[#0D2137] mb-5">Filtre Değişim Hatırlatıcıları</h2>

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-[#E8F4FD] to-[#D4E9FA] rounded-2xl p-5 mb-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1A73E8]/10 rounded-xl flex items-center justify-center"><Filter className="w-5 h-5 text-[#1A73E8]" /></div>
          <div><p className="text-sm font-semibold text-[#0D2137]">Filtrenizin değişim zamanı yaklaşıyor mu?</p><p className="text-xs text-[#5A6B7B]">Hemen yeni filtre seti sipariş edin.</p></div>
        </div>
        <Link to="/urunler" className="flex items-center gap-1.5 bg-[#1A73E8] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#1557B0] transition-all whitespace-nowrap">
          <ShoppingCart className="w-3.5 h-3.5" /> Filtre Satın Al
        </Link>
      </div>

      <div className="space-y-3">
        {filters.map(f => (
          <div key={f.id} className={`bg-white border rounded-2xl p-5 ${f.daysLeft <= 14 ? 'border-amber-200 bg-amber-50/30' : 'border-[#E8F0FE]'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-[#0D2137]">{f.filterName}</p>
                  {f.daysLeft <= 14 && <span className="bg-amber-100 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">Yakında</span>}
                </div>
                <p className="text-xs text-[#8B9DAF]">{f.deviceName}</p>
                <div className="flex gap-4 mt-2 text-xs text-[#5A6B7B]">
                  <span>Son Değişim: <span className="font-medium text-[#0D2137]">{f.lastChange}</span></span>
                  <span>Sonraki: <span className="font-medium text-[#0D2137]">{f.nextChange}</span></span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className={`text-2xl font-bold ${f.daysLeft <= 14 ? 'text-amber-600' : 'text-[#1A73E8]'}`}>{f.daysLeft}</p>
                  <p className="text-[10px] text-[#8B9DAF]">gün kaldı</p>
                </div>
                <button onClick={() => toggleReminder(f.id)} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${f.reminder ? 'bg-[#EBF3FF] text-[#1A73E8]' : 'bg-gray-100 text-gray-400'}`}>
                  {f.reminder ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-1.5 bg-[#E8F0FE] rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${f.daysLeft <= 14 ? 'bg-amber-400' : f.daysLeft <= 60 ? 'bg-[#F5A623]' : 'bg-emerald-400'}`} style={{ width: `${Math.min(100, Math.max(5, (f.daysLeft / 180) * 100))}%` }} />
            </div>
          </div>
        ))}
      </div>
      </>
  );
}
