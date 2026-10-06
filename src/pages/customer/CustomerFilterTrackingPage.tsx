import { useState, useEffect, useCallback } from 'react';
import { Filter, Bell, BellOff, ShoppingCart, Plus, Trash2, RefreshCw, Loader2, X } from 'lucide-react';
import { Link } from 'react-router';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/components/Toast';
import {
  getFilterDevices,
  addFilterDevice,
  toggleFilterReminder,
  markFilterChanged,
  deleteFilterDevice,
  type FilterDevice,
} from '@/services/filterTrackingService';
import {
  CustomerPageShell,
  CustomerPageHeader,
  CustomerCard,
  CustomerEmpty,
  CustomerLoading,
  CustomerBadge,
  CustomerButton,
  CustomerInput,
  CustomerSelect,
  CustomerLabel,
} from '@/components/customer/customer-ui';
import { cn } from '@/lib/utils';

/** Typical replacement intervals for common RO system cartridges. */
const FILTER_PRESETS = [
  { name: 'Sediment Filtre', days: 180 },
  { name: 'Karbon Blok Filtre', days: 180 },
  { name: 'Granül Aktif Karbon', days: 180 },
  { name: 'RO Membran', days: 730 },
  { name: 'Post Karbon Filtre', days: 365 },
  { name: 'Mineral / Alkali Filtre', days: 365 },
  { name: 'Bina Girişi Sediment', days: 180 },
];

function nextChangeLabel(f: FilterDevice): string {
  const next = new Date();
  next.setDate(next.getDate() + f.daysRemaining);
  return next.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function CustomerFilterTrackingPage() {
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.add);
  const [filters, setFilters] = useState<FilterDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ deviceName: '', filterName: FILTER_PRESETS[0].name, interval: FILTER_PRESETS[0].days });
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setFilters(await getFilterDevices(user.id));
    setLoading(false);
  }, [user]);

  useEffect(() => { void load(); }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.deviceName.trim()) return addToast('Cihaz adını girin (örn. Mutfak arıtma cihazı).', 'error');
    setSaving(true);
    const res = await addFilterDevice(user.id, {
      deviceName: form.deviceName.trim(),
      filterName: form.filterName,
      changeIntervalDays: form.interval,
    });
    setSaving(false);
    if (!res.success) return addToast(res.error ?? 'Eklenemedi.', 'error');
    addToast('Filtre takibe alındı. Değişim zamanı yaklaşınca hatırlatacağız.', 'success');
    setShowForm(false);
    setForm({ deviceName: '', filterName: FILTER_PRESETS[0].name, interval: FILTER_PRESETS[0].days });
    void load();
  };

  const run = async (id: string, action: () => Promise<{ success: boolean; error?: string }>, ok: string) => {
    setBusyId(id);
    const res = await action();
    setBusyId(null);
    if (!res.success) return addToast(res.error ?? 'İşlem başarısız.', 'error');
    addToast(ok, 'success');
    void load();
  };

  if (loading) {
    return (
      <CustomerPageShell>
        <CustomerLoading rows={3} />
      </CustomerPageShell>
    );
  }

  return (
    <CustomerPageShell>
      <CustomerPageHeader
        title="Filtre Takibi"
        description="Cihazlarınızdaki filtrelerin değişim zamanını takip edin; yaklaşınca size hatırlatalım."
        action={
          !showForm && (
            <CustomerButton onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" /> Filtre Ekle
            </CustomerButton>
          )
        }
      />

      {showForm && (
        <CustomerCard className="mb-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-aq-ink">Yeni filtre takibi</h2>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full p-1.5 text-aq-muted hover:bg-aq-cloud" aria-label="Kapat">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={(e) => void add(e)} className="grid gap-4 sm:grid-cols-3">
            <div>
              <CustomerLabel>Cihaz adı</CustomerLabel>
              <CustomerInput value={form.deviceName} onChange={(e) => setForm({ ...form, deviceName: e.target.value })} placeholder="Örn. Mutfak arıtma" />
            </div>
            <div>
              <CustomerLabel>Filtre türü</CustomerLabel>
              <CustomerSelect
                value={form.filterName}
                onChange={(e) => {
                  const preset = FILTER_PRESETS.find((p) => p.name === e.target.value);
                  setForm({ ...form, filterName: e.target.value, interval: preset?.days ?? form.interval });
                }}
              >
                {FILTER_PRESETS.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
              </CustomerSelect>
            </div>
            <div>
              <CustomerLabel>Değişim aralığı (gün)</CustomerLabel>
              <CustomerInput type="number" min={30} max={1095} value={form.interval} onChange={(e) => setForm({ ...form, interval: Number(e.target.value) })} />
            </div>
            <div className="sm:col-span-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-aq-muted">Bugün takılmış kabul edilir. Daha önce değiştirdiyseniz kayıttan sonra "Değiştirdim" diyebilirsiniz.</p>
              <CustomerButton type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Takibe Al
              </CustomerButton>
            </div>
          </form>
        </CustomerCard>
      )}

      {filters.length === 0 ? (
        <CustomerCard padding={false}>
          <CustomerEmpty
            icon={Filter}
            title="Henüz takip edilen filtre yok"
            message="Cihazınızdaki filtreleri ekleyin; değişim zamanı yaklaştığında bildirim gönderelim."
            action={!showForm && <CustomerButton onClick={() => setShowForm(true)}><Plus className="h-4 w-4" /> Filtre Ekle</CustomerButton>}
          />
        </CustomerCard>
      ) : (
        <div className="space-y-3">
          {filters.map((f) => {
            const overdue = f.daysRemaining < 0;
            const soon = !overdue && f.daysRemaining <= 14;
            const used = Math.min(100, Math.max(0, 100 - (f.daysRemaining / f.changeIntervalDays) * 100));
            return (
              <CustomerCard key={f.id} className={cn('!p-5', overdue && 'ring-1 ring-red-200', soon && 'ring-1 ring-amber-200')}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-aq-ink">{f.filterName}</p>
                      {overdue && <CustomerBadge tone="danger">Değişim zamanı geçti</CustomerBadge>}
                      {soon && <CustomerBadge tone="warning">Yaklaşıyor</CustomerBadge>}
                    </div>
                    <p className="text-xs text-aq-muted">{f.deviceName}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-aq-muted">
                      <span>Son değişim: <span className="font-medium text-aq-ink">{f.lastChangedAt ?? f.installedAt}</span></span>
                      <span>Sonraki: <span className="font-medium text-aq-ink">{nextChangeLabel(f)}</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className={cn('text-2xl font-bold tabular-nums', overdue ? 'text-red-600' : soon ? 'text-amber-600' : 'text-aq-ink')}>
                        {Math.abs(f.daysRemaining)}
                      </p>
                      <p className="text-[10px] text-aq-muted">{overdue ? 'gün gecikti' : 'gün kaldı'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-aq-cloud">
                  <div className={cn('h-full rounded-full', overdue ? 'bg-red-500' : soon ? 'bg-amber-400' : 'bg-aq-ink')} style={{ width: `${used}%` }} />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <CustomerButton
                    variant="secondary"
                    disabled={busyId === f.id}
                    onClick={() => void run(f.id, () => markFilterChanged(f.id), 'Değişim kaydedildi; sayaç sıfırlandı.')}
                    className="!px-4 !py-2 !text-xs !min-h-[34px]"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Değiştirdim
                  </CustomerButton>
                  <CustomerButton
                    variant="secondary"
                    disabled={busyId === f.id}
                    onClick={() => void run(f.id, () => toggleFilterReminder(f.id, !f.reminderEnabled), f.reminderEnabled ? 'Hatırlatıcı kapatıldı.' : 'Hatırlatıcı açıldı.')}
                    className="!px-4 !py-2 !text-xs !min-h-[34px]"
                  >
                    {f.reminderEnabled ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
                    {f.reminderEnabled ? 'Hatırlatıcı açık' : 'Hatırlatıcı kapalı'}
                  </CustomerButton>
                  <Link to="/kategori/filtreler-membranlar" className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-aq-ink hover:bg-aq-cloud">
                    <ShoppingCart className="h-3.5 w-3.5" /> Yedek filtre al
                  </Link>
                  <button
                    type="button"
                    disabled={busyId === f.id}
                    onClick={() => {
                      if (window.confirm(`"${f.filterName}" takibini silmek istiyor musunuz?`)) {
                        void run(f.id, () => deleteFilterDevice(f.id), 'Filtre takibi silindi.');
                      }
                    }}
                    className="ml-auto rounded-full p-2 text-aq-muted hover:bg-red-50 hover:text-red-600"
                    aria-label="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CustomerCard>
            );
          })}
        </div>
      )}
    </CustomerPageShell>
  );
}
