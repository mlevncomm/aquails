import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router';
import { Wrench, Clock, MapPin, Search, Loader2, Settings } from 'lucide-react';
import { getServiceRequests, updateServiceRequest, type AdminServiceRequest } from '@/services/serviceRequestService';
import { getTechnicians } from '@/services/settingsService';
import { useToastStore } from '@/components/Toast';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminCard,
  AdminSelect,
  AdminInput,
  AdminTextarea,
  AdminLabel,
  AdminButton,
  AdminTableWrap,
  AdminLoading,
  AdminEmpty,
  AdminBadge,
  AdminTabs,
  AdminDrawer,
  type AdminTone,
} from '@/components/admin/admin-ui';

type Status = AdminServiceRequest['status'];
const STATUS: Record<Status, { label: string; tone: AdminTone }> = {
  pending: { label: 'Bekliyor', tone: 'warning' },
  scheduled: { label: 'Planlandı', tone: 'info' },
  in_progress: { label: 'Devam Ediyor', tone: 'purple' },
  completed: { label: 'Tamamlandı', tone: 'success' },
  cancelled: { label: 'İptal', tone: 'neutral' },
};
const STATUS_ORDER: Status[] = ['pending', 'scheduled', 'in_progress', 'completed', 'cancelled'];

/** ISO → value for <input type="datetime-local"> in local time. */
function toLocalInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminServiceRequestsPage() {
  const addToast = useToastStore((s) => s.add);
  const [list, setList] = useState<AdminServiceRequest[]>([]);
  const [techs, setTechs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'open' | Status | 'all'>('open');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<AdminServiceRequest | null>(null);
  const [form, setForm] = useState({ status: 'pending' as Status, tech: '', when: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [requests, technicians] = await Promise.all([getServiceRequests(), getTechnicians()]);
    setList(requests);
    setTechs(technicians);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const counts = useMemo(() => {
    const c = { open: 0, all: list.length } as Record<string, number>;
    for (const s of STATUS_ORDER) c[s] = 0;
    for (const r of list) {
      c[r.status] += 1;
      if (r.status === 'pending' || r.status === 'scheduled' || r.status === 'in_progress') c.open += 1;
    }
    return c;
  }, [list]);

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr-TR');
    return list
      .filter((r) => (tab === 'all' ? true : tab === 'open' ? ['pending', 'scheduled', 'in_progress'].includes(r.status) : r.status === tab))
      .filter((r) => !q || [r.customer, r.address, r.device, r.type, r.tech].some((v) => v.toLocaleLowerCase('tr-TR').includes(q)));
  }, [list, tab, query]);

  const openEdit = (r: AdminServiceRequest) => {
    setEditing(r);
    setForm({ status: r.status, tech: r.tech, when: toLocalInput(r.dateISO), notes: r.notes });
  };

  const save = async () => {
    if (!editing) return;
    let status = form.status;
    // Assigning a technician and a date to a pending request schedules it.
    if (status === 'pending' && form.tech && form.when) status = 'scheduled';
    setSaving(true);
    const res = await updateServiceRequest(editing.id, {
      status,
      assigned_to: form.tech.trim(),
      preferred_date: form.when ? new Date(form.when).toISOString() : null,
      notes: form.notes.trim(),
    });
    setSaving(false);
    if (!res.success) return addToast(res.error ?? 'Güncellenemedi.', 'error');
    addToast('Servis talebi güncellendi.', 'success');
    setEditing(null);
    void load();
  };

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Servis Talepleri"
        description="Kurulum, filtre değişimi ve bakım taleplerine teknisyen ve tarih atayın, durumlarını takip edin."
        action={
          <Link to="/admin/ayarlar#teknisyenler" className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-aq-ink ring-1 ring-aq-border hover:ring-aq-ink/30">
            <Settings className="h-4 w-4" /> Teknisyenler
          </Link>
        }
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <AdminTabs
          value={tab}
          onChange={setTab}
          options={[
            { value: 'open', label: 'Açık', count: counts.open },
            { value: 'pending', label: 'Bekliyor', count: counts.pending },
            { value: 'scheduled', label: 'Planlandı', count: counts.scheduled },
            { value: 'completed', label: 'Tamamlandı', count: counts.completed },
            { value: 'all', label: 'Tümü', count: counts.all },
          ]}
        />
        <div className="relative lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-aq-muted" />
          <AdminInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Müşteri, adres, teknisyen…" className="pl-9" />
        </div>
      </div>

      {techs.length === 0 && !loading && (
        <AdminCard className="mb-5 bg-amber-50 ring-amber-200">
          <p className="text-sm text-amber-800">
            Henüz teknisyen tanımlanmamış. Talepleri atayabilmek için <Link to="/admin/ayarlar#teknisyenler" className="font-semibold underline">Ayarlar &gt; Teknisyenler</Link> bölümünden ekleyin.
          </p>
        </AdminCard>
      )}

      {loading ? (
        <AdminLoading label="Talepler yükleniyor..." />
      ) : visible.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty icon={Wrench} message="Bu filtrede servis talebi bulunmuyor." />
        </AdminCard>
      ) : (
        <AdminTableWrap stickyFirst>
          <table className="w-full min-w-[900px]">
            <thead>
              <tr>
                {['Müşteri', 'Tip / Cihaz', 'Adres', 'Randevu', 'Teknisyen', 'Durum', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 text-sm font-semibold text-aq-ink">{r.customer}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-aq-ink">{r.type}</p>
                    <p className="text-xs text-aq-muted">{r.device}</p>
                  </td>
                  <td className="max-w-[220px] px-4 py-3">
                    <p className="flex items-start gap-1 text-[13px] text-aq-muted"><MapPin className="mt-0.5 h-3 w-3 flex-shrink-0" /><span className="line-clamp-2">{r.address}</span></p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[13px] text-aq-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {r.dateISO ? new Date(r.dateISO).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Tarih yok'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-aq-ink">{r.tech || <span className="text-aq-muted">Atanmadı</span>}</td>
                  <td className="px-4 py-3"><AdminBadge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</AdminBadge></td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => openEdit(r)} className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-aq-ink ring-1 ring-aq-border hover:ring-aq-ink/30">
                      Yönet
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminTableWrap>
      )}

      <AdminDrawer
        open={!!editing}
        title="Servis Talebini Yönet"
        onClose={() => setEditing(null)}
        footer={
          <div className="flex justify-end gap-2">
            <AdminButton variant="ghost" onClick={() => setEditing(null)}>Vazgeç</AdminButton>
            <AdminButton onClick={() => void save()} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Kaydet
            </AdminButton>
          </div>
        }
      >
        {editing && (
          <div className="space-y-4">
            <div className="rounded-xl bg-aq-cloud p-4 text-sm">
              <p className="font-semibold text-aq-ink">{editing.customer} · {editing.type}</p>
              <p className="mt-1 text-aq-muted">{editing.device}</p>
              <p className="mt-1 text-aq-muted">{editing.address}</p>
            </div>
            <div>
              <AdminLabel>Teknisyen</AdminLabel>
              <AdminSelect value={form.tech} onChange={(e) => setForm({ ...form, tech: e.target.value })}>
                <option value="">Atanmadı</option>
                {techs.map((t) => <option key={t} value={t}>{t}</option>)}
                {form.tech && !techs.includes(form.tech) && <option value={form.tech}>{form.tech} (listede yok)</option>}
              </AdminSelect>
            </div>
            <div>
              <AdminLabel>Randevu tarihi ve saati</AdminLabel>
              <AdminInput type="datetime-local" value={form.when} onChange={(e) => setForm({ ...form, when: e.target.value })} />
            </div>
            <div>
              <AdminLabel>Durum</AdminLabel>
              <AdminSelect value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}>
                {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
              </AdminSelect>
              {form.status === 'pending' && form.tech && form.when && (
                <p className="mt-1 text-xs text-aq-muted">Teknisyen ve tarih atandığı için kaydedince "Planlandı" olur.</p>
              )}
            </div>
            <div>
              <AdminLabel>İç not</AdminLabel>
              <AdminTextarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Ekip için not (müşteri panelinde gösterilmez)" />
            </div>
          </div>
        )}
      </AdminDrawer>
    </AdminPageShell>
  );
}
