import { useCallback, useEffect, useMemo, useState } from 'react';
import { Filter, Phone, Mail, RefreshCw, Bell, BellOff, Trash2, Search, Send, Loader2 } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import {
  getAllFilterDevices,
  markFilterChanged,
  toggleFilterReminder,
  deleteFilterDevice,
  adminRunFilterReminders,
  type AdminFilterDevice,
} from '@/services/filterTrackingService';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminCard,
  AdminTableWrap,
  AdminEmpty,
  AdminLoading,
  AdminBadge,
  AdminStatCard,
  AdminTabs,
  AdminInput,
  AdminButton,
} from '@/components/admin/admin-ui';

type View = 'overdue' | 'soon' | 'all';

function dueBadge(days: number) {
  if (days < 0) return <AdminBadge tone="danger">{Math.abs(days)} gün gecikti</AdminBadge>;
  if (days <= 14) return <AdminBadge tone="warning">{days} gün kaldı</AdminBadge>;
  return <AdminBadge tone="success">{days} gün kaldı</AdminBadge>;
}

export default function AdminFilterTrackingPage() {
  const addToast = useToastStore((s) => s.add);
  const [devices, setDevices] = useState<AdminFilterDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('overdue');
  const [query, setQuery] = useState('');
  const [sending, setSending] = useState(false);

  const sendNow = async () => {
    if (!window.confirm('Hatırlatıcısı açık ve değişim zamanı yaklaşan/geçen tüm müşterilere şimdi bildirim ve e-posta gönderilsin mi? Aynı değişim tarihi için daha önce hatırlatılan müşterilere tekrar gönderilmez.')) return;
    setSending(true);
    const res = await adminRunFilterReminders();
    setSending(false);
    if (!res.success) return addToast(res.error ?? 'Gönderilemedi.', 'error');
    const total = (res.upcoming ?? 0) + (res.overdue ?? 0);
    addToast(total ? `${total} hatırlatma kuyruğa alındı (${res.upcoming} yaklaşan, ${res.overdue} geciken).` : 'Gönderilecek yeni hatırlatma yok.', total ? 'success' : 'info');
  };

  const load = useCallback(async () => {
    setLoading(true);
    setDevices(await getAllFilterDevices());
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const stats = useMemo(() => ({
    overdue: devices.filter((d) => d.daysRemaining < 0).length,
    soon: devices.filter((d) => d.daysRemaining >= 0 && d.daysRemaining <= 14).length,
    reminders: devices.filter((d) => d.reminderEnabled).length,
  }), [devices]);

  // Default to the most useful tab once data is in.
  useEffect(() => {
    if (!loading && stats.overdue === 0) setView(stats.soon > 0 ? 'soon' : 'all');
  }, [loading, stats.overdue, stats.soon]);

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr-TR');
    return devices
      .filter((d) => (view === 'overdue' ? d.daysRemaining < 0 : view === 'soon' ? d.daysRemaining >= 0 && d.daysRemaining <= 14 : true))
      .filter((d) => !q || [d.customer, d.email, d.phone, d.deviceName, d.filterName].some((v) => v.toLocaleLowerCase('tr-TR').includes(q)));
  }, [devices, view, query]);

  const changed = async (d: AdminFilterDevice) => {
    const res = await markFilterChanged(d.id);
    if (!res.success) return addToast(res.error ?? 'Güncellenemedi.', 'error');
    addToast(`${d.customer} — filtre değişimi kaydedildi.`, 'success');
    void load();
  };

  const reminder = async (d: AdminFilterDevice) => {
    const res = await toggleFilterReminder(d.id, !d.reminderEnabled);
    if (!res.success) return addToast(res.error ?? 'Güncellenemedi.', 'error');
    setDevices((prev) => prev.map((x) => (x.id === d.id ? { ...x, reminderEnabled: !d.reminderEnabled } : x)));
  };

  const remove = async (d: AdminFilterDevice) => {
    if (!window.confirm(`${d.customer} müşterisinin "${d.deviceName || d.filterName}" kaydı silinsin mi?`)) return;
    const res = await deleteFilterDevice(d.id);
    if (!res.success) return addToast(res.error ?? 'Silinemedi.', 'error');
    setDevices((prev) => prev.filter((x) => x.id !== d.id));
    addToast('Kayıt silindi.', 'success');
  };

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Filtre Takibi"
        description="Müşterilerin kayıtlı cihazları ve filtre değişim zamanları. Hatırlatmalar her gün 09:00'da otomatik gönderilir (değişime 7 gün kala ve 3 gün geciktiğinde)."
        action={
          <AdminButton onClick={() => void sendNow()} disabled={sending}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Hatırlatmaları şimdi gönder
          </AdminButton>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <AdminStatCard label="Gecikmiş" value={stats.overdue} sub="Değişim tarihi geçti" icon={<Filter className="h-5 w-5" />} />
        <AdminStatCard label="14 gün içinde" value={stats.soon} sub="Yaklaşan değişimler" icon={<RefreshCw className="h-5 w-5" />} />
        <AdminStatCard label="Hatırlatıcı açık" value={stats.reminders} sub={`${devices.length} kayıtlı cihaz`} icon={<Bell className="h-5 w-5" />} />
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AdminTabs
          value={view}
          onChange={setView}
          options={[
            { value: 'overdue', label: 'Gecikmiş', count: stats.overdue },
            { value: 'soon', label: 'Yaklaşan', count: stats.soon },
            { value: 'all', label: 'Tümü', count: devices.length },
          ]}
        />
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-aq-muted" />
          <AdminInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Müşteri, cihaz, telefon…" className="pl-9" />
        </div>
      </div>

      {loading ? (
        <AdminLoading />
      ) : visible.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty icon={Filter} title="Kayıt yok" message="Bu filtreye uyan cihaz kaydı bulunmuyor. Müşteriler cihazlarını Hesabım > Filtre Takibi ekranından ekler." />
        </AdminCard>
      ) : (
        <AdminTableWrap stickyFirst>
          <table className="w-full min-w-[860px]">
            <thead>
              <tr>
                {['Müşteri', 'Cihaz / Filtre', 'Son değişim', 'Durum', 'Hatırlatıcı', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((d) => (
                <tr key={d.id}>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-aq-ink">{d.customer}</p>
                    <div className="mt-1 flex gap-3 text-xs text-aq-muted">
                      {d.phone && <a href={`tel:${d.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1 hover:text-aq-ink"><Phone className="h-3 w-3" />{d.phone}</a>}
                      {d.email && <a href={`mailto:${d.email}`} className="inline-flex items-center gap-1 hover:text-aq-ink"><Mail className="h-3 w-3" />{d.email}</a>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-aq-ink">{d.deviceName || '—'}</p>
                    <p className="text-xs text-aq-muted">{d.filterName} · {d.changeIntervalDays} günde bir</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-aq-muted">{d.lastChangedAt ?? `Kurulum: ${d.installedAt}`}</td>
                  <td className="px-4 py-3">{dueBadge(d.daysRemaining)}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => void reminder(d)} className="inline-flex items-center gap-1.5 text-xs font-medium text-aq-ink/70 hover:text-aq-ink">
                      {d.reminderEnabled ? <Bell className="h-4 w-4 text-emerald-600" /> : <BellOff className="h-4 w-4" />}
                      {d.reminderEnabled ? 'Açık' : 'Kapalı'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={() => void changed(d)} className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold text-aq-ink ring-1 ring-aq-border hover:ring-aq-ink/30">
                        Değiştirildi
                      </button>
                      <button type="button" onClick={() => void remove(d)} className="rounded-full p-2 text-aq-muted hover:bg-red-50 hover:text-red-600" aria-label="Sil">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
