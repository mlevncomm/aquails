import { Wrench, Clock, MapPin, User } from 'lucide-react';

const appointments = [
  { id: '1', customer: 'Ahmet Yılmaz', type: 'Kurulum', date: '12 Haziran', time: '10:00', address: 'Pendik, İstanbul', technician: 'Mehmet K.', status: 'scheduled' },
  { id: '2', customer: 'Zeynep Koç', type: 'Filtre Değişimi', date: '12 Haziran', time: '14:00', address: 'Kadıköy, İstanbul', technician: 'Ali R.', status: 'scheduled' },
  { id: '3', customer: 'Burak Demir', type: 'Arıza', date: '13 Haziran', time: '09:00', address: 'Üsküdar, İstanbul', technician: 'Mehmet K.', status: 'pending' },
  { id: '4', customer: 'Fatma Şahin', type: 'Bakım', date: '13 Haziran', time: '11:00', address: 'Maltepe, İstanbul', technician: 'Ali R.', status: 'scheduled' },
  { id: '5', customer: 'Can Özkan', type: 'Kurulum', date: '14 Haziran', time: '10:00', address: 'Ataşehir, İstanbul', technician: 'Mehmet K.', status: 'scheduled' },
];

const statusColors: Record<string, string> = { scheduled: 'bg-emerald-50 text-emerald-600', pending: 'bg-amber-50 text-amber-600', completed: 'bg-gray-100 text-gray-500' };
const statusLabels: Record<string, string> = { scheduled: 'Planlandı', pending: 'Bekliyor', completed: 'Tamamlandı' };

export default function AdminServiceCalendarPage() {
  return (
      <>      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Servis Takvimi</h2>

      {/* Week View */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((d, i) => (
          <div key={d} className={`text-center p-3 rounded-xl ${i === 2 ? 'bg-[#1A73E8] text-white' : 'bg-white border border-[#E8F0FE]'}`}>
            <p className="text-xs text-[#8B9DAF]">{d}</p>
            <p className="text-lg font-bold">{10 + i}</p>
          </div>
        ))}
      </div>

      {/* Appointments */}
      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#F8FBFF]">{['Müşteri', 'Tür', 'Tarih', 'Saat', 'Adres', 'Teknisyen', 'Durum'].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><User className="w-4 h-4 text-[#8B9DAF]" /><span className="text-sm font-medium text-[#0D2137]">{a.customer}</span></div></td>
                  <td className="px-4 py-3"><span className="flex items-center gap-1 text-sm text-[#5A6B7B]"><Wrench className="w-3.5 h-3.5" />{a.type}</span></td>
                  <td className="px-4 py-3 text-sm text-[#0D2137]">{a.date}</td>
                  <td className="px-4 py-3"><span className="flex items-center gap-1 text-sm text-[#5A6B7B]"><Clock className="w-3.5 h-3.5" />{a.time}</span></td>
                  <td className="px-4 py-3"><span className="flex items-center gap-1 text-sm text-[#5A6B7B]"><MapPin className="w-3.5 h-3.5" />{a.address}</span></td>
                  <td className="px-4 py-3 text-sm text-[#0D2137]">{a.technician}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[a.status]}`}>{statusLabels[a.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
  );
}
