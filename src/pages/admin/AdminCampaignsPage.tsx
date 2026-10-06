import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Megaphone, ExternalLink, Upload, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { useToastStore } from '@/components/Toast';
import {
  getAdminCampaigns,
  createCampaign,
  updateCampaign,
  setCampaignActive,
  deleteCampaign,
  slugifyCampaign,
  type Campaign,
  type CampaignInput,
} from '@/services/campaignService';
import { getCoupons, type AdminCoupon } from '@/services/couponService';
import { uploadProductImage } from '@/services/storageService';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminLabel,
  AdminButton,
  AdminTableWrap,
  AdminLoading,
  AdminEmpty,
  AdminBadge,
  AdminDrawer,
} from '@/components/admin/admin-ui';

const EMPTY: CampaignInput = {
  title: '',
  slug: '',
  description: '',
  imageUrl: '',
  discountLabel: '',
  couponCode: '',
  startDate: '',
  endDate: '',
  isActive: true,
  sortOrder: 0,
};

function toInput(c: Campaign): CampaignInput {
  return {
    title: c.title,
    slug: c.slug,
    description: c.description,
    imageUrl: c.imageUrl ?? '',
    discountLabel: c.discountLabel,
    couponCode: c.couponCode ?? '',
    startDate: c.startDate ? c.startDate.slice(0, 10) : '',
    endDate: c.endDate ? c.endDate.slice(0, 10) : '',
    isActive: c.isActive,
    sortOrder: c.sortOrder,
  };
}

function liveState(c: Campaign): { label: string; tone: 'success' | 'warning' | 'neutral' } {
  if (!c.isActive) return { label: 'Pasif', tone: 'neutral' };
  const now = Date.now();
  if (c.startDate && Date.parse(c.startDate) > now) return { label: 'Planlandı', tone: 'warning' };
  if (c.endDate && Date.parse(c.endDate) < now) return { label: 'Süresi doldu', tone: 'neutral' };
  return { label: 'Yayında', tone: 'success' };
}

export default function AdminCampaignsPage() {
  const addToast = useToastStore((s) => s.add);
  const [items, setItems] = useState<Campaign[]>([]);
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState<CampaignInput>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [campaigns, couponList] = await Promise.all([getAdminCampaigns(), getCoupons()]);
    setItems(campaigns);
    setCoupons(couponList);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setSlugTouched(false);
    setDrawerOpen(true);
  };

  const openEdit = (c: Campaign) => {
    setEditing(c);
    setForm(toInput(c));
    setSlugTouched(true);
    setDrawerOpen(true);
  };

  const set = <K extends keyof CampaignInput>(key: K, value: CampaignInput[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'title' && !slugTouched) next.slug = slugifyCampaign(String(value));
      return next;
    });
  };

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    const res = await uploadProductImage(file, 'campaigns');
    setUploading(false);
    if (!res.success) {
      addToast(res.error, 'error');
      return;
    }
    set('imageUrl', res.data!.url);
    addToast('Görsel yüklendi.', 'success');
  };

  const save = async () => {
    setSaving(true);
    const res = editing ? await updateCampaign(editing.id, form) : await createCampaign(form);
    setSaving(false);
    if (!res.success) {
      addToast(res.error ?? 'Kaydedilemedi.', 'error');
      return;
    }
    addToast(editing ? 'Kampanya güncellendi.' : 'Kampanya oluşturuldu.', 'success');
    setDrawerOpen(false);
    void load();
  };

  const toggle = async (c: Campaign) => {
    const res = await setCampaignActive(c.id, !c.isActive);
    if (!res.success) addToast(res.error ?? 'Güncellenemedi.', 'error');
    else setItems((prev) => prev.map((x) => (x.id === c.id ? { ...x, isActive: !c.isActive } : x)));
  };

  const remove = async (c: Campaign) => {
    if (!window.confirm(`"${c.title}" kampanyasını silmek istediğinize emin misiniz?`)) return;
    const res = await deleteCampaign(c.id);
    if (!res.success) addToast(res.error ?? 'Silinemedi.', 'error');
    else {
      addToast('Kampanya silindi.', 'success');
      setItems((prev) => prev.filter((x) => x.id !== c.id));
    }
  };

  const couponMissing = form.couponCode.trim() !== '' && !coupons.some((c) => c.code === form.couponCode.trim().toUpperCase());

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Kampanyalar"
        description="Sitedeki Kampanyalar sayfasında yayınlanan içerikler. İndirimin kendisi Kuponlar'dan yönetilir; kampanyaya bir kupon kodu bağlayabilirsiniz."
        action={
          <AdminButton onClick={openCreate}>
            <Plus className="h-4 w-4" /> Yeni Kampanya
          </AdminButton>
        }
      />

      {loading ? (
        <AdminLoading label="Kampanyalar yükleniyor..." />
      ) : items.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty
            icon={Megaphone}
            title="Henüz kampanya yok"
            message="İlk kampanyanızı oluşturun; sitedeki Kampanyalar sayfasında otomatik olarak görünür."
            action={<AdminButton onClick={openCreate}><Plus className="h-4 w-4" /> Kampanya Oluştur</AdminButton>}
          />
        </AdminCard>
      ) : (
        <AdminTableWrap>
          <table className="w-full min-w-[760px]">
            <thead>
              <tr>
                {['Kampanya', 'İndirim', 'Kupon', 'Bitiş', 'Durum', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((c) => {
                const state = liveState(c);
                return (
                  <tr key={c.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-aq-cloud">
                          {c.imageUrl && <img src={c.imageUrl} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-aq-ink">{c.title}</p>
                          <p className="truncate text-xs text-aq-muted">/kampanya/{c.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-aq-ink">{c.discountLabel || '—'}</td>
                    <td className="px-4 py-3 text-sm font-mono text-aq-ink/80">{c.couponCode || '—'}</td>
                    <td className="px-4 py-3 text-sm text-aq-muted">{c.endLabel}</td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => void toggle(c)} title="Aktif/pasif yap">
                        <AdminBadge tone={state.tone}>{state.label}</AdminBadge>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/kampanya/${c.slug}`} target="_blank" className="rounded-full p-2 text-aq-muted hover:bg-aq-cloud hover:text-aq-ink" aria-label="Sitede görüntüle">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button type="button" onClick={() => openEdit(c)} className="rounded-full p-2 text-aq-muted hover:bg-aq-cloud hover:text-aq-ink" aria-label="Düzenle">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => void remove(c)} className="rounded-full p-2 text-aq-muted hover:bg-red-50 hover:text-red-600" aria-label="Sil">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </AdminTableWrap>
      )}

      <AdminDrawer
        open={drawerOpen}
        title={editing ? 'Kampanyayı Düzenle' : 'Yeni Kampanya'}
        onClose={() => setDrawerOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <AdminButton variant="ghost" onClick={() => setDrawerOpen(false)}>Vazgeç</AdminButton>
            <AdminButton onClick={() => void save()} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Kaydet
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <AdminLabel>Başlık *</AdminLabel>
            <AdminInput value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Örn. Filtre Setlerinde %15 İndirim" />
          </div>
          <div>
            <AdminLabel>Bağlantı (slug) *</AdminLabel>
            <AdminInput
              value={form.slug}
              onChange={(e) => { setSlugTouched(true); set('slug', e.target.value); }}
              onBlur={() => set('slug', slugifyCampaign(form.slug))}
              placeholder="filtre-setleri-indirimi"
            />
            <p className="mt-1 text-xs text-aq-muted">Sayfa adresi: /kampanya/{slugifyCampaign(form.slug) || '…'}</p>
          </div>
          <div>
            <AdminLabel>Açıklama</AdminLabel>
            <AdminTextarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Kampanya koşulları ve kapsamı" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <AdminLabel>İndirim etiketi</AdminLabel>
              <AdminInput value={form.discountLabel} onChange={(e) => set('discountLabel', e.target.value)} placeholder="%15 · Ücretsiz Kurulum" />
            </div>
            <div>
              <AdminLabel>Bağlı kupon kodu</AdminLabel>
              <AdminSelect value={form.couponCode} onChange={(e) => set('couponCode', e.target.value)}>
                <option value="">Kupon yok</option>
                {coupons.map((c) => (
                  <option key={c.id} value={c.code}>{c.code}{c.active ? '' : ' (pasif)'}</option>
                ))}
                {couponMissing && <option value={form.couponCode}>{form.couponCode} (bulunamadı)</option>}
              </AdminSelect>
              {couponMissing && <p className="mt-1 text-xs text-amber-700">Bu kupon artık mevcut değil; müşteriler kodu kullanamaz.</p>}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <AdminLabel>Başlangıç</AdminLabel>
              <AdminInput type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
            </div>
            <div>
              <AdminLabel>Bitiş (boş = süresiz)</AdminLabel>
              <AdminInput type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} />
            </div>
          </div>
          <div>
            <AdminLabel>Görsel</AdminLabel>
            <div className="flex items-center gap-3">
              <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-aq-cloud">
                {form.imageUrl && <img src={form.imageUrl} alt="" className="h-full w-full object-cover" />}
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-aq-ink ring-1 ring-aq-border hover:ring-aq-ink/30">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Görsel Yükle
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => void handleUpload(e.target.files?.[0])} />
              </label>
              {form.imageUrl && (
                <button type="button" className="text-xs font-medium text-red-600 hover:underline" onClick={() => set('imageUrl', '')}>Kaldır</button>
              )}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <AdminLabel>Sıra</AdminLabel>
              <AdminInput type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', Number(e.target.value))} />
            </div>
            <label className="flex items-center gap-2.5 pt-7 text-sm font-medium text-aq-ink">
              <input type="checkbox" className="h-4 w-4 accent-aq-ink" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} />
              Yayında
            </label>
          </div>
        </div>
      </AdminDrawer>
    </AdminPageShell>
  );
}
