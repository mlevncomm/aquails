import { useState, useEffect } from 'react';
import { Wrench, Clock, MapPin, User } from 'lucide-react';
import { adminGetSlots, type ServiceSlot } from '@/services/serviceCalendarService';

const statusColors: Record<string, string> = {
  available: 'bg-amber-50 text-amber-600',
  booked: 'bg-emerald-50 text-emerald-600',
  completed: 'bg-gray-100 text-gray-500',
};
const statusLabels: Record<string, string> = {
  available: 'Bekliyor',
  booked: 'Planlandı',
  completed: 'Tamamlandı',
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
}

export default function AdminServiceCalendarPage() {
  const [slots, setSlots] = useState<ServiceSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    adminGetSlots()
      .then((data) => { if (!cancelled) setSlots(data); })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Randevular yüklenemedi.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const today = new Date();
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + 1 + i);
    return d;
  });

  if (loading) {
    return <div className="text-center py-12 text-[#8B9DAF]">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
      <>      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Servis Takvimi</h2>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekDays.map((d, i) => {
          const date = weekDates[i];
          const isToday = date.toDateString() === today.toDateString();
          return (
            <div key={d} className={`text-center p-3 rounded-xl ${isToday ? 'bg-[#1A73E8] text-white' : 'bg-white border border-[#E8F0FE]'}`}>
              <p className={`text-xs ${isToday ? 'text-white/80' : 'text-[#8B9DAF]'}`}>{d}</p>
              <p className="text-lg font-bold">{date.getDate()}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#F8FBFF]">{['Müşteri', 'Tür', 'Tarih', 'Saat', 'Adres', 'Durum'].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {slots.map(a => (
                <tr key={a.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><User className="w-4 h-4 text-[#8B9DAF]" /><span className="text-sm font-medium text-[#0D2137]">{a.customerName ?? a.label}</span></div></td>
                  <td className="px-4 py-3"><span className="flex items-center gap-1 text-sm text-[#5A6B7B]"><Wrench className="w-3.5 h-3.5" />{a.serviceType ?? a.label}</span></td>
                  <td className="px-4 py-3 text-sm text-[#0D2137]">{formatDate(a.date)}</td>
                  <td className="px-4 py-3"><span className="flex items-center gap-1 text-sm text-[#5A6B7B]"><Clock className="w-3.5 h-3.5" />{a.time}</span></td>
                  <td className="px-4 py-3"><span className="flex items-center gap-1 text-sm text-[#5A6B7B]"><MapPin className="w-3.5 h-3.5" />{a.address ?? '—'}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[a.status] ?? 'bg-gray-100 text-gray-500'}`}>{statusLabels[a.status] ?? a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {slots.length === 0 && <div className="text-center py-8 text-sm text-[#8B9DAF]">Randevu bulunamadı</div>}
      </div>
      </>
  );
}
