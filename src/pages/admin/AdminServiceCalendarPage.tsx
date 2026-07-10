import { useState, useEffect } from 'react';
import { Wrench, MapPin, User, Loader2 } from 'lucide-react';
import { getServiceRequests } from '@/services/serviceRequestService';
import type { AdminServiceRequest } from '@/services/serviceRequestService';
import { AdminPageHeader, AdminTableWrap, AdminEmpty } from '@/components/admin/admin-ui';

const statusColors: Record<string, string> = {
  scheduled: 'bg-emerald-50 text-emerald-600',
  pending: 'bg-amber-50 text-amber-600',
  completed: 'bg-slate-100 text-slate-500',
  cancelled: 'bg-red-50 text-red-500',
};

const statusLabels: Record<string, string> = {
  scheduled: 'Planlandı',
  pending: 'Bekliyor',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
};

export default function AdminServiceCalendarPage() {
  const [appointments, setAppointments] = useState<AdminServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getServiceRequests().then((data) => {
      setAppointments(data.filter((r) => r.status === 'scheduled' || r.status === 'pending'));
      setLoading(false);
    });
  }, []);

  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + 1 + i);
    return d;
  });

  return (
    <>
      <AdminPageHeader title="Servis Takvimi" description="Planlanmış servis randevuları" />

      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekDays.map((d, i) => {
          const isToday = d.toDateString() === today.toDateString();
          return (
            <div
              key={i}
              className={`text-center p-3 rounded-xl ${isToday ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200'}`}
            >
              <p className={`text-xs ${isToday ? 'text-sky-100' : 'text-slate-400'}`}>
                {d.toLocaleDateString('tr-TR', { weekday: 'short' })}
              </p>
              <p className="text-lg font-bold">{d.getDate()}</p>
            </div>
          );
        })}
      </div>

      <AdminTableWrap>
        {loading ? (
          <div className="py-12 text-center text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Müşteri', 'Tür', 'Tarih', 'Adres', 'Teknisyen', 'Durum'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr><td colSpan={6}><AdminEmpty message="Planlanmış randevu yok" /></td></tr>
              ) : appointments.map((a) => (
                <tr key={a.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-800">{a.customer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-sm text-slate-600">
                      <Wrench className="w-3.5 h-3.5" />{a.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-800">{a.date}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-sm text-slate-500 max-w-[180px] truncate">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />{a.address}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{a.tech || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[a.status] ?? 'bg-slate-100 text-slate-500'}`}>
                      {statusLabels[a.status] ?? a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminTableWrap>
    </>
  );
}
