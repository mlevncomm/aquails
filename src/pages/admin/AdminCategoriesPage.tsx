import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Home, PanelBottom, Factory, Layers, Cog, Wrench } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  type CategoryDto,
} from '@/services/productService';

const icons: Record<string, React.ElementType> = { Home, PanelBottom, Factory, Layers, Cog, Wrench };

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', icon: 'Home', active: true });
  const addToast = useToastStore((s) => s.add);

  const loadCategories = () => {
    setLoading(true);
    setError(null);
    adminGetCategories()
      .then(setCats)
      .catch((err) => setError(err instanceof Error ? err.message : 'Kategoriler yüklenemedi.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminCreateCategory({
        name: form.name,
        slug: form.slug,
        icon: form.icon,
        isActive: form.active,
      });
      addToast('Kategori eklendi.', 'success');
      setShowForm(false);
      setForm({ name: '', slug: '', icon: 'Home', active: true });
      loadCategories();
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Ekleme başarısız.', 'error');
    }
  };

  const remove = async (id: string) => {
    try {
      await adminDeleteCategory(id);
      setCats((prev) => prev.filter((c) => c.id !== id));
      addToast('Kategori silindi.', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Silme başarısız.', 'error');
    }
  };

  const toggleActive = async (cat: CategoryDto) => {
    try {
      const updated = await adminUpdateCategory(cat.id, { isActive: !cat.isActive });
      setCats((prev) => prev.map((c) => (c.id === cat.id ? { ...c, isActive: updated.isActive } : c)));
      addToast('Durum güncellendi.', 'info');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Güncelleme başarısız.', 'error');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-[#8B9DAF]">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-[#0D2137]">Kategoriler</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-[#1A73E8] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1557B0]">
          <Plus className="w-4 h-4" /> Kategori Ekle
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#0A1929] border border-[#1A3A5C] rounded-xl p-4 mb-5 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Kategori adı" className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white placeholder-[#8B9DAF]" />
          <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug" className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white placeholder-[#8B9DAF]" />
          <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white">
            {Object.keys(icons).map((i) => (<option key={i} value={i}>{i}</option>))}
          </select>
          <div className="flex gap-2">
            <button type="submit" className="bg-[#1A73E8] text-white px-4 py-2 rounded-lg text-sm">Ekle</button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-[#1A3A5C] text-[#8B9DAF] px-4 py-2 rounded-lg text-sm">İptal</button>
          </div>
        </form>
      )}

      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FBFF]">
                {['Kategori', 'Slug', 'Ürün', 'Durum', 'İşlem'].map((h) => (<th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase">{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {cats.map((c) => {
                const Icon = icons[c.icon] || Home;
                const active = c.isActive !== false;
                return (
                  <tr key={c.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#F0F6FF] rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-[#1A73E8]" />
                        </div>
                        <span className="text-sm font-medium text-[#0D2137]">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5A6B7B]">{c.slug}</td>
                    <td className="px-4 py-3 text-sm text-[#0D2137]">{c.productCount}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(c)} className={`text-xs font-medium px-2 py-0.5 rounded-full ${active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                        {active ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F6FF] text-[#8B9DAF] hover:text-[#1A73E8]">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => remove(c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#8B9DAF] hover:text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {cats.length === 0 && <div className="text-center py-8 text-sm text-[#8B9DAF]">Kategori bulunamadı</div>}
      </div>
    </>
  );
}
