import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { CalendarDays, MapPin, User, Minus, Plus, Lock, Unlock, ArrowRight } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { getServiceRequests, type AdminServiceRequest } from '@/services/serviceRequestService';
import { getAdminSlots, updateServiceSlot, type AdminServiceSlot } from '@/services/serviceCalendarService';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminCard,
  AdminEmpty,
  AdminLoading,
  AdminBadge,
  type AdminTone,
} from '@/components/admin/admin-ui';
import { cn } from '@/lib/utils';

const STATUS: Record<string, { label: string; tone: AdminTone }> = {
  pending: { label: 'Bekliyor', tone: 'warning' },
  scheduled: { label: 'Planlandı', tone: 'info' },
  in_progress: { label: 'Yolda / Sürüyor', tone: 'purple' },
  completed: { label: 'Tamamlandı', tone: 'success' },
  cancelled: { label: 'İptal', tone: 'neutral' },
};

function localDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function AdminServiceCalendarPage() {
  const addToast = useToastStore((s) => s.add);
  const [slots, setSlots] = useState<AdminServiceSlot[]>([]);
  const [requests, setRequests] = useState<AdminServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [day, setDay] = useState(localDay(new Date()));

  const load = useCallback(async () => {
    setLoading(true);
    const [s, r] = await Promise.all([getAdminSlots(14), getServiceRequests()]);
    setSlots(s);
    setRequests(r);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  }), []);

  const requestsByDay = useMemo(() => {
    const map = new Map<string, AdminServiceRequest[]>();
    for (const r of requests) {
      if (!r.dateISO || r.status === 'cancelled') continue;
      const key = localDay(new Date(r.dateISO));
      map.set(key, [...(map.get(key) ?? []), r]);
    }
    return map;
  }, [requests]);

  const daySlots = slots.filter((s) => s.date === day);
  const dayRequests = requestsByDay.get(day) ?? [];
  const unscheduled = requests.filter((r) => !r.dateISO && r.status === 'pending');

  const patchSlot = async (slot: AdminServiceSlot, patch: { capacity?: number; isAvailable?: boolean }) => {
    if (patch.capacity !== undefined && patch.capacity < slot.booked) {
      addToast(`Bu slotta ${slot.booked} rezervasyon var; kapasite bunun altına düşemez.`, 'error');
      return;
    }
    const res = await updateServiceSlot(slot.id, patch);
    if (!res.success) {
      addToast(res.error ?? 'Güncellenemedi.', 'error');
      return;
    }
    setSlots((prev) => prev.map((s) => (s.id === slot.id ? { ...s, ...patch } : s)));
  };

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Servis Takvimi"
        description="Önümüzdeki 14 günün randevu slotları ve planlanan servisler. Kapasiteyi değiştirebilir veya bir slotu rezervasyona kapatabilirsiniz."
        action={
          <Link to="/admin/servis-talepleri" className="inline-flex items-center gap-2 rounded-full bg-aq-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-aq-ink-soft">
            Servis Talepleri <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      {loading ? (
        <AdminLoading />
      ) : (
        <>
          <div className="responsive-scroll-x mb-6">
            <div className="flex min-w-max gap-2 pb-1">
              {days.map((d) => {
                const key = localDay(d);
                const count = (requestsByDay.get(key) ?? []).length;
                const free = slots.filter((s) => s.date === key && s.isAvailable).reduce((n, s) => n + Math.max(0, s.capacity - s.booked), 0);
                const active = key === day;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setDay(key)}
                    className={cn(
                      'w-[84px] rounded-xl px-2 py-3 text-center transition-colors',
                      active ? 'bg-aq-ink text-white' : 'bg-white text-aq-ink ring-1 ring-aq-border/60 hover:ring-aq-ink/30',
                    )}
                  >
                    <p className={cn('text-[11px] font-semibold uppercase', active ? 'text-white/70' : 'text-aq-muted')}>
                      {d.toLocaleDateString('tr-TR', { weekday: 'short' })}
                    </p>
                    <p className="mt-0.5 text-xl font-bold">{d.getDate()}</p>
                    <p className={cn('mt-1 text-[10px]', active ? 'text-white/70' : 'text-aq-muted')}>
                      {count > 0 ? `${count} servis` : `${free} boş`}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <AdminCard>
              <h2 className="text-[15px] font-semibold text-aq-ink">
                Slotlar · {new Date(`${day}T12:00:00`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
              </h2>
              {daySlots.length === 0 ? (
                <p className="mt-4 text-sm text-aq-muted">Bu gün için tanımlı slot yok.</p>
              ) : (
                <ul className="mt-4 space-y-2.5">
                  {daySlots.map((s) => (
                    <li key={s.id} className={cn('flex items-center justify-between gap-3 rounded-xl px-4 py-3 ring-1', s.isAvailable ? 'ring-aq-border/70' : 'bg-aq-cloud ring-transparent')}>
                      <div>
                        <p className="text-sm font-semibold text-aq-ink">{s.time}</p>
                        <p className="text-xs text-aq-muted">
                          {s.booked}/{s.capacity} dolu{!s.isAvailable && ' · rezervasyona kapalı'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => void patchSlot(s, { capacity: s.capacity - 1 })} className="rounded-full p-1.5 text-aq-ink ring-1 ring-aq-border hover:ring-aq-ink/30" aria-label="Kapasiteyi azalt">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold tabular-nums">{s.capacity}</span>
                        <button type="button" onClick={() => void patchSlot(s, { capacity: s.capacity + 1 })} className="rounded-full p-1.5 text-aq-ink ring-1 ring-aq-border hover:ring-aq-ink/30" aria-label="Kapasiteyi artır">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void patchSlot(s, { isAvailable: !s.isAvailable })}
                          className="ml-2 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-aq-ink ring-1 ring-aq-border hover:ring-aq-ink/30"
                        >
                          {s.isAvailable ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                          {s.isAvailable ? 'Kapat' : 'Aç'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </AdminCard>

            <AdminCard padding={false}>
              <h2 className="px-5 pb-2 pt-5 text-[15px] font-semibold text-aq-ink">Planlanan servisler</h2>
              {dayRequests.length === 0 ? (
                <AdminEmpty icon={CalendarDays} title="Servis yok" message="Bu gün için tarih verilmiş servis talebi bulunmuyor." />
              ) : (
                <ul className="divide-y divide-aq-border/60">
                  {dayRequests.map((r) => (
                    <li key={r.id} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-aq-ink">{r.customer} · {r.type}</p>
                          <p className="mt-1 flex items-start gap-1.5 text-xs text-aq-muted"><MapPin className="mt-0.5 h-3 w-3 flex-shrink-0" />{r.address}</p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-aq-muted">
                            <User className="h-3 w-3" /> {r.tech || 'Teknisyen atanmadı'} · {new Date(r.dateISO!).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <AdminBadge tone={STATUS[r.status]?.tone ?? 'neutral'}>{STATUS[r.status]?.label ?? r.status}</AdminBadge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {unscheduled.length > 0 && (
                <div className="border-t border-aq-border/60 px-5 py-4">
                  <p className="text-sm text-aq-ink">
                    <strong>{unscheduled.length}</strong> bekleyen talepte henüz tarih yok.{' '}
                    <Link to="/admin/servis-talepleri" className="font-semibold underline-offset-4 hover:underline">Tarih ve teknisyen ata →</Link>
                  </p>
                </div>
              )}
            </AdminCard>
          </div>
        </>
      )}
    </AdminPageShell>
  );
}
