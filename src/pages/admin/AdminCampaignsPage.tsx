import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { getCoupons, createCoupon, toggleCouponActive, deleteCoupon, type AdminCoupon } from '@/services/couponService';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminCard,
  AdminInput,
  AdminSelect,
  AdminButton,
  AdminTableWrap,
  AdminLoading,
  AdminEmpty,
  AdminBadge,
} from '@/components/admin/admin-ui';

export default function AdminCampaignsPage() {
  const [items, setItems] = useState<AdminCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', code: '', type: 'percent' as 'percent' | 'fixed', value: '', start: '', end: '' });
  const addToast = useToastStore((s) => s.add);

  const load = useCallback(async () => {
    setLoading(true);
    setItems(await getCoupons());
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createCoupon({
      code: form.code,
      type: form.type,
      value: Number(form.value),
      minOrder: 0,
      usageLimit: 100,
      start: form.start,
      end: form.end,
      active: true,
    });
    if (result.success) {
      addToast('Kampanya/kupon oluşturuldu.', 'success');
      setShowForm(false);
      setForm({ title: '', code: '', type: 'percent', value: '', start: '', end: '' });
      void load();
    } else {
      addToast(result.error ?? 'Oluşturulamadı.', 'error');
    }
  };

  const remove = async (id: string) => {
    const result = await deleteCoupon(id);
    if (result.success) {
      addToast('Silindi.', 'success');
      void load();
    }
  };

  const toggle = async (id: string, active: boolean) => {
    const result = await toggleCouponActive(id, !active);
    if (result.success) void load();
  };

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Kampanya Yönetimi"
        description="İndirim kuponları ve kampanyalar (Supabase kuponları)"
        action={
          <AdminButton onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Yeni Kampanya
          </AdminButton>
        }
      />

      {showForm && (
        <AdminCard className="mb-6">
          <form onSubmit={(e) => void handleSubmit(e)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminInput required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Kampanya adı (not)" />
            <AdminInput required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="Kupon kodu" />
            <AdminSelect value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })}>
              <option value="percent">Yüzde</option>
              <option value="fixed">Sabit</option>
            </AdminSelect>
            <AdminInput required type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="Değer" />
            <AdminInput required type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
            <AdminInput required type="date" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
            <div className="flex gap-2">
              <AdminButton type="submit">Kaydet</AdminButton>
              <AdminButton type="button" variant="ghost" onClick={() => setShowForm(false)}>İptal</AdminButton>
            </div>
          </form>
        </AdminCard>
      )}

      {loading ? (
        <AdminLoading label="Kampanyalar yükleniyor..." />
      ) : items.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty message="Henüz kampanya veya kupon yok." />
        </AdminCard>
      ) : (
        <AdminTableWrap stickyFirst>
          <table className="w-full">
            <thead>
              <tr className="bg-aq-ice border-b border-aq-border/60">
                {['Kodu', 'İndirim', 'Başlangıç', 'Bitiş', 'Kullanım', 'Durum', 'İşlem'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-aq-muted uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b border-aq-border/60 last:border-0 hover:bg-aq-ice/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-aq-blue" />
                      <span className="text-sm font-semibold text-aq-blue">{c.code}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-aq-text">
                    {c.type === 'percent' ? `%${c.value}` : `${c.value}₺`}
                  </td>
                  <td className="px-4 py-3 text-sm text-aq-muted">{c.start}</td>
                  <td className="px-4 py-3 text-sm text-aq-muted">{c.end}</td>
                  <td className="px-4 py-3 text-sm text-aq-muted">{c.used}/{c.usageLimit || '∞'}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => void toggle(c.id, c.active)}>
                      <AdminBadge tone={c.active ? 'success' : 'neutral'}>{c.active ? 'Aktif' : 'Pasif'}</AdminBadge>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => void remove(c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-aq-muted hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
