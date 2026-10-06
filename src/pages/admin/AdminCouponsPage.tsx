import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Pencil, Trash2, Tag, Loader2, Copy } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  toggleCouponActive,
  deleteCoupon,
  type AdminCoupon,
} from '@/services/couponService';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminCard,
  AdminInput,
  AdminSelect,
  AdminLabel,
  AdminButton,
  AdminTableWrap,
  AdminLoading,
  AdminEmpty,
  AdminBadge,
  AdminTabs,
  AdminDrawer,
} from '@/components/admin/admin-ui';

type CouponType = AdminCoupon['type'];

interface FormState {
  code: string;
  type: CouponType;
  value: string;
  minOrder: string;
  usageLimit: string;
  start: string;
  end: string;
  active: boolean;
}

const EMPTY: FormState = { code: '', type: 'percent', value: '', minOrder: '', usageLimit: '', start: '', end: '', active: true };

function discountText(c: AdminCoupon): string {
  if (c.type === 'percent') return `%${c.value}`;
  if (c.type === 'shipping') return 'Ücretsiz kargo';
  return `${c.value.toLocaleString('tr-TR')} ₺`;
}

function randomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return `AQ${Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')}`;
}

export default function AdminCouponsPage() {
  const addToast = useToastStore((s) => s.add);
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'passive' | 'loyalty'>('active');
  const [editing, setEditing] = useState<AdminCoupon | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setCoupons(await getCoupons());
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  // PUAN… codes are one-off coupons customers create by redeeming loyalty points.
  const isLoyalty = (c: AdminCoupon) => /^PUAN/i.test(c.code);
  const visible = useMemo(() => coupons.filter((c) => {
    if (filter === 'loyalty') return isLoyalty(c);
    if (isLoyalty(c)) return filter === 'all';
    if (filter === 'active') return c.active;
    if (filter === 'passive') return !c.active;
    return true;
  }), [coupons, filter]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY, code: randomCode() });
    setOpen(true);
  };

  const openEdit = (c: AdminCoupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      type: c.type,
      value: String(c.value),
      minOrder: c.minOrder ? String(c.minOrder) : '',
      usageLimit: c.usageLimit ? String(c.usageLimit) : '',
      start: c.startInput,
      end: c.endInput,
      active: c.active,
    });
    setOpen(true);
  };

  const save = async () => {
    const code = form.code.trim().toUpperCase();
    if (!/^[A-Z0-9_-]{3,32}$/.test(code)) return addToast('Kod 3-32 karakter; yalnızca harf, rakam, - ve _ içerebilir.', 'error');
    const value = form.type === 'shipping' ? 0 : Number(form.value);
    if (form.type !== 'shipping' && (!value || value <= 0)) return addToast('Geçerli bir indirim değeri girin.', 'error');
    if (form.type === 'percent' && value > 100) return addToast('Yüzde indirim 100\'ü geçemez.', 'error');
    if (form.start && form.end && form.end < form.start) return addToast('Bitiş tarihi başlangıçtan önce olamaz.', 'error');

    const payload = {
      code,
      type: form.type,
      value,
      minOrder: Number(form.minOrder) || 0,
      usageLimit: Math.trunc(Number(form.usageLimit)) || 0,
      start: form.start,
      end: form.end,
    };
    setSaving(true);
    const res = editing
      ? await updateCoupon(editing.id, payload)
      : await createCoupon({ ...payload, active: form.active });
    if (res.success && editing && editing.active !== form.active) await toggleCouponActive(editing.id, form.active);
    setSaving(false);
    if (!res.success) {
      return addToast(/duplicate|unique/i.test(res.error ?? '') ? 'Bu kupon kodu zaten kullanılıyor.' : res.error ?? 'Kaydedilemedi.', 'error');
    }
    addToast(editing ? 'Kupon güncellendi.' : 'Kupon oluşturuldu.', 'success');
    setOpen(false);
    void load();
  };

  const remove = async (c: AdminCoupon) => {
    if (!window.confirm(`${c.code} kuponunu silmek istediğinize emin misiniz?${c.used ? ` Bu kupon ${c.used} kez kullanıldı.` : ''}`)) return;
    const result = await deleteCoupon(c.id);
    if (!result.success) return addToast(result.error ?? 'Silinemedi.', 'error');
    addToast('Kupon silindi.', 'success');
    setCoupons((prev) => prev.filter((x) => x.id !== c.id));
  };

  const toggleActive = async (c: AdminCoupon) => {
    const result = await toggleCouponActive(c.id, !c.active);
    if (!result.success) return addToast(result.error ?? 'Güncellenemedi.', 'error');
    setCoupons((prev) => prev.map((x) => (x.id === c.id ? { ...x, active: !c.active } : x)));
  };

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Kuponlar"
        description="Sepette kullanılan indirim kodları. Bir kuponu Kampanyalar sayfasına bağlayarak sitede tanıtabilirsiniz."
        action={<AdminButton onClick={openCreate}><Plus className="h-4 w-4" /> Yeni Kupon</AdminButton>}
      />

      <AdminTabs
        className="mb-5"
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'active', label: 'Aktif', count: coupons.filter((c) => c.active && !isLoyalty(c)).length },
          { value: 'passive', label: 'Pasif', count: coupons.filter((c) => !c.active && !isLoyalty(c)).length },
          { value: 'loyalty', label: 'Puan kuponları', count: coupons.filter(isLoyalty).length },
          { value: 'all', label: 'Tümü', count: coupons.length },
        ]}
      />

      {loading ? (
        <AdminLoading label="Kuponlar yükleniyor..." />
      ) : visible.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty icon={Tag} message="Bu filtrede kupon bulunmuyor." action={<AdminButton onClick={openCreate}><Plus className="h-4 w-4" /> Kupon Oluştur</AdminButton>} />
        </AdminCard>
      ) : (
        <AdminTableWrap stickyFirst>
          <table className="w-full min-w-[780px]">
            <thead>
              <tr>
                {['Kod', 'İndirim', 'Min. sepet', 'Geçerlilik', 'Kullanım', 'Durum', ''].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => { void navigator.clipboard?.writeText(c.code); addToast(`${c.code} kopyalandı.`, 'info'); }}
                      className="inline-flex items-center gap-1.5 font-mono text-sm font-bold text-aq-ink hover:underline"
                      title="Kopyala"
                    >
                      {c.code} <Copy className="h-3 w-3 text-aq-muted" />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-aq-ink">{discountText(c)}</td>
                  <td className="px-4 py-3 text-sm text-aq-muted">{c.minOrder ? `${c.minOrder.toLocaleString('tr-TR')} ₺` : '—'}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[13px] text-aq-muted">{c.start} – {c.end}</td>
                  <td className="px-4 py-3 text-sm text-aq-muted">{c.used}/{c.usageLimit || '∞'}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => void toggleActive(c)} title="Aktif/pasif yap">
                      <AdminBadge tone={c.active ? 'success' : 'neutral'}>{c.active ? 'Aktif' : 'Pasif'}</AdminBadge>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button type="button" onClick={() => openEdit(c)} className="rounded-full p-2 text-aq-muted hover:bg-aq-cloud hover:text-aq-ink" aria-label="Düzenle">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => void remove(c)} className="rounded-full p-2 text-aq-muted hover:bg-red-50 hover:text-red-600" aria-label="Sil">
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

      <AdminDrawer
        open={open}
        title={editing ? `${editing.code} kuponunu düzenle` : 'Yeni Kupon'}
        onClose={() => setOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <AdminButton variant="ghost" onClick={() => setOpen(false)}>Vazgeç</AdminButton>
            <AdminButton onClick={() => void save()} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Kaydet
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <AdminLabel>Kupon kodu *</AdminLabel>
            <div className="flex gap-2">
              <AdminInput value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="font-mono" />
              {!editing && <AdminButton variant="secondary" onClick={() => setForm({ ...form, code: randomCode() })}>Rastgele</AdminButton>}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <AdminLabel>İndirim tipi</AdminLabel>
              <AdminSelect value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CouponType })}>
                <option value="percent">Yüzde (%)</option>
                <option value="fixed">Sabit tutar (₺)</option>
                <option value="shipping">Ücretsiz kargo</option>
              </AdminSelect>
            </div>
            {form.type !== 'shipping' && (
              <div>
                <AdminLabel>{form.type === 'percent' ? 'İndirim oranı (%)' : 'İndirim tutarı (₺)'} *</AdminLabel>
                <AdminInput type="number" min={0} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
              </div>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <AdminLabel>Minimum sepet (₺)</AdminLabel>
              <AdminInput type="number" min={0} value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} placeholder="Boş = sınır yok" />
            </div>
            <div>
              <AdminLabel>Kullanım limiti</AdminLabel>
              <AdminInput type="number" min={0} value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} placeholder="Boş = sınırsız" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <AdminLabel>Başlangıç</AdminLabel>
              <AdminInput type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
            </div>
            <div>
              <AdminLabel>Bitiş</AdminLabel>
              <AdminInput type="date" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
            </div>
          </div>
          <label className="flex items-center gap-2.5 text-sm font-medium text-aq-ink">
            <input type="checkbox" className="h-4 w-4 accent-aq-ink" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Aktif
          </label>
          {editing && editing.used > 0 && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">Bu kupon {editing.used} kez kullanıldı; kodu değiştirmek mevcut siparişleri etkilemez.</p>
          )}
        </div>
      </AdminDrawer>
    </AdminPageShell>
  );
}
