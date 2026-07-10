import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Tag, Loader2 } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { getCoupons, createCoupon, toggleCouponActive, deleteCoupon, type AdminCoupon } from '@/services/couponService';
import { AdminPageHeader, AdminCard, AdminInput, AdminButton, AdminTableWrap } from '@/components/admin/admin-ui';

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
    <>
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
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm">
              <option value="percent">Yüzde</option>
              <option value="fixed">Sabit</option>
            </select>
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

      <AdminTableWrap>
        {loading ? (
          <div className="py-12 text-center text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Kodu', 'İndirim', 'Başlangıç', 'Bitiş', 'Kullanım', 'Durum', 'İşlem'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-sky-600" />
                      <span className="text-sm font-bold text-sky-700">{c.code}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-800">
                    {c.type === 'percent' ? `%${c.value}` : `${c.value}₺`}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{c.start}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{c.end}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{c.used}/{c.usageLimit || '∞'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => void toggle(c.id, c.active)} className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {c.active ? 'Aktif' : 'Pasif'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => void remove(c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
