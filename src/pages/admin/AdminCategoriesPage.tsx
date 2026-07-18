import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Droplet, Zap, Coffee, Building2, Filter, Settings, Wrench, FolderTree } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { getAdminCategories, createCategory, updateCategory } from '@/services/categoryService';
import type { AdminCategory } from '@/services/categoryService';
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

  const activeCategories = categories.filter((c) => c.isActive);

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Kategoriler"
        description="Ürün kategorilerini yönetin"
        action={
          <AdminButton
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setForm({ name: '', slug: '', icon: 'Droplet' });
            }}
          >
            <Plus className="w-4 h-4" /> Kategori Ekle
          </AdminButton>
        }
      />

      {showForm && (
        <AdminCard className="mb-6">
          <form onSubmit={(e) => void handleSubmit(e)} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <AdminLabel>Kategori Adı</AdminLabel>
              <AdminInput
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <AdminLabel>Slug</AdminLabel>
              <AdminInput
                required
                disabled={!!editId}
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
            <div>
              <AdminLabel>İkon</AdminLabel>
              <AdminSelect
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              >
                {Object.keys(icons).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </AdminSelect>
            </div>
            <div className="flex items-end gap-2">
              <AdminButton type="submit">Kaydet</AdminButton>
              <AdminButton
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                }}
              >
                İptal
              </AdminButton>
            </div>
          </form>
        </AdminCard>
      )}

      {loading ? (
        <AdminLoading label="Kategoriler yükleniyor..." />
      ) : activeCategories.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty icon={FolderTree} message="Henüz kategori yok" />
        </AdminCard>
      ) : (
        <AdminTableWrap stickyFirst>
          <table className="w-full">
            <thead>
              <tr className="bg-aq-ice border-b border-aq-border/60">
                {['Kategori', 'Slug', 'Ürün Sayısı', 'Durum', 'İşlemler'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-[11px] font-semibold text-aq-muted uppercase whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeCategories.map((cat) => {
                const Icon = icons[cat.icon ?? ''] ?? Droplet;
                return (
                  <tr
                    key={cat.id}
                    className="border-b border-aq-border/60 last:border-0 hover:bg-aq-ice/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-aq-blue" />
                        <span className="text-sm font-medium text-aq-text">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-aq-muted">{cat.slug}</td>
                    <td className="px-4 py-3 text-sm text-aq-text">{cat.productCount ?? 0}</td>
                    <td className="px-4 py-3 text-sm text-emerald-600">
                      {cat.isActive ? 'Aktif' : 'Pasif'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => startEdit(cat)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-aq-sky text-aq-muted hover:text-aq-blue"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </AdminTableWrap>
      )}
    </AdminPageShell>
  );
}
