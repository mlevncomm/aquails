import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Droplet, Zap, Coffee, Building2, Filter, Settings, Wrench } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { getAdminCategories, createCategory, updateCategory } from '@/services/categoryService';
import type { AdminCategory } from '@/services/categoryService';
import {
  AdminPageHeader, AdminCard, AdminInput, AdminLabel, AdminButton, AdminTableWrap, AdminEmpty,
} from '@/components/admin/admin-ui';

const icons: Record<string, React.ElementType> = {
  Droplet, Zap, Coffee, Building2, Filter, Settings, Wrench,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', icon: 'Droplet' });
  const addToast = useToastStore((s) => s.add);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setCategories(await getAdminCategories());
    } catch {
      addToast('Kategoriler yüklenemedi.', 'error');
    }
    setLoading(false);
  }, [addToast]);

  useEffect(() => { void load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateCategory(editId, { name: form.name, icon: form.icon });
        addToast('Kategori güncellendi.', 'success');
      } else {
        await createCategory({ slug: form.slug, name: form.name, icon: form.icon });
        addToast('Kategori eklendi.', 'success');
      }
      setShowForm(false);
      setEditId(null);
      setForm({ name: '', slug: '', icon: 'Droplet' });
      void load();
    } catch {
      addToast('Kayıt başarısız.', 'error');
    }
  };

  const startEdit = (cat: AdminCategory) => {
    setEditId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon ?? 'Droplet' });
    setShowForm(true);
  };

  return (
    <>
      <AdminPageHeader
        title="Kategoriler"
        description="Ürün kategorilerini yönetin"
        action={
          <AdminButton onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', slug: '', icon: 'Droplet' }); }}>
            <Plus className="w-4 h-4" /> Kategori Ekle
          </AdminButton>
        }
      />

      {showForm && (
        <AdminCard className="mb-6">
          <form onSubmit={(e) => void handleSubmit(e)} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <AdminLabel>Kategori Adı</AdminLabel>
              <AdminInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <AdminLabel>Slug</AdminLabel>
              <AdminInput required disabled={!!editId} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div>
              <AdminLabel>İkon</AdminLabel>
              <select
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
              >
                {Object.keys(icons).map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <AdminButton type="submit">Kaydet</AdminButton>
              <AdminButton type="button" variant="ghost" onClick={() => { setShowForm(false); setEditId(null); }}>İptal</AdminButton>
            </div>
          </form>
        </AdminCard>
      )}

      <AdminTableWrap>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Kategori', 'Slug', 'Ürün Sayısı', 'Durum', 'İşlemler'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">Yükleniyor...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={5}><AdminEmpty message="Henüz kategori yok" /></td></tr>
            ) : categories.filter((c) => c.isActive).map((cat) => {
              const Icon = icons[cat.icon ?? ''] ?? Droplet;
              return (
                <tr key={cat.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-sky-600" />
                      <span className="text-sm font-medium text-slate-800">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{cat.slug}</td>
                  <td className="px-4 py-3 text-sm text-slate-800">{cat.productCount ?? 0}</td>
                  <td className="px-4 py-3 text-sm text-emerald-600">{cat.isActive ? 'Aktif' : 'Pasif'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => startEdit(cat)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sky-50 text-slate-400 hover:text-sky-600">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </AdminTableWrap>
    </>
  );
}
