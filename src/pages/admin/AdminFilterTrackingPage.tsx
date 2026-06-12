import { Bell, BellOff } from 'lucide-react';
import { filterStatuses } from '@/data/orders';

export default function AdminFilterTrackingPage() {
  return (
      <>      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Filtre Değişim Takipleri</h2>
      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#F8FBFF]">{['Cihaz', 'Filtre', 'Son Değişim', 'Sonraki', 'Kalan', 'Hatırlatma', 'İşlem'].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {filterStatuses.map((f, i) => (
                <tr key={i} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                  <td className="px-4 py-3 text-sm font-medium text-[#0D2137]">{f.deviceName}</td>
                  <td className="px-4 py-3 text-sm text-[#5A6B7B]">{f.filterName}</td>
                  <td className="px-4 py-3 text-sm text-[#5A6B7B]">15 Nis 2025</td>
                  <td className="px-4 py-3 text-sm text-[#5A6B7B]">15 Eki 2025</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#E8F0FE] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${f.percentRemaining > 80 ? 'bg-emerald-400' : f.percentRemaining > 30 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${f.percentRemaining}%` }} />
                      </div>
                      <span className={`text-xs font-semibold ${f.daysRemaining <= 30 ? 'text-red-500' : 'text-[#0D2137]'}`}>{f.daysRemaining} gün</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className={`w-8 h-8 flex items-center justify-center rounded-lg ${f.daysRemaining <= 30 ? 'bg-[#EBF3FF] text-[#1A73E8]' : 'bg-gray-100 text-gray-400'}`}>
                      {f.daysRemaining <= 30 ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs bg-[#1A73E8] text-white px-3 py-1.5 rounded-lg hover:bg-[#1557B0] transition-all">Hatırlatma Gönder</button>
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
