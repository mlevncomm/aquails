import { useState, useEffect } from 'react';
import { Wrench, MapPin, User } from 'lucide-react';
import { getServiceRequests } from '@/services/serviceRequestService';
import type { AdminServiceRequest } from '@/services/serviceRequestService';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminTableWrap,
  AdminEmpty,
  AdminLoading,
  AdminBadge,
  AdminCard,
} from '@/components/admin/admin-ui';

const statusTones: Record<string, 'success' | 'warning' | 'neutral' | 'danger'> = {
  scheduled: 'success',
  pending: 'warning',
  completed: 'neutral',
  cancelled: 'danger',
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
    <AdminPageShell>
      <AdminPageHeader title="Servis Takvimi" description="Planlanmış servis randevuları" />

      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekDays.map((d, i) => {
          const isToday = d.toDateString() === today.toDateString();
          return (
            <div
              key={i}
              className={`text-center p-3 rounded-xl ${isToday ? 'bg-aq-deep text-white' : 'bg-white border border-aq-border/60'}`}
            >
              <p className={`text-xs ${isToday ? 'text-aq-sky' : 'text-aq-muted'}`}>
                {d.toLocaleDateString('tr-TR', { weekday: 'short' })}
              </p>
              <p className="text-lg font-semibold">{d.getDate()}</p>
            </div>
          );
        })}
      </div>

      {loading ? (
        <AdminLoading label="Randevular yükleniyor..." />
      ) : appointments.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty icon={Wrench} message="Planlanmış randevu yok" />
        </AdminCard>
      ) : (
        <AdminTableWrap stickyFirst>
          <table className="w-full">
            <thead>
              <tr className="bg-aq-ice border-b border-aq-border/60">
                {['Müşteri', 'Tür', 'Tarih', 'Adres', 'Teknisyen', 'Durum'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-aq-muted uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b border-aq-border/60 last:border-0 hover:bg-aq-ice/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-aq-muted" />
                      <span className="text-sm font-medium text-aq-text">{a.customer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-sm text-aq-muted">
                      <Wrench className="w-3.5 h-3.5" />{a.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-aq-text">{a.date}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-sm text-aq-muted max-w-[180px] truncate">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />{a.address}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-aq-muted">{a.tech || '—'}</td>
                  <td className="px-4 py-3">
                    <AdminBadge tone={statusTones[a.status] ?? 'neutral'}>
                      {statusLabels[a.status] ?? a.status}
                    </AdminBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminTableWrap>
      )}
    </AdminPageShell>
  );
}
