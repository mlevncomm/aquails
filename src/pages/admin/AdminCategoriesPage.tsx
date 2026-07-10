import { useState } from 'react';
import { Plus, Pencil, Droplet } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { useCatalog } from '@/hooks/useCatalog';

const icons: Record<string, React.ElementType> = { Droplet };

export default function AdminCategoriesPage() {
  const { categories, loading } = useCatalog();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', icon: 'Droplet', active: true });
  const addToast = useToastStore((s) => s.add);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Kategori kaydı yakında Supabase üzerinden yönetilebilecek.', 'info');
    setShowForm(false);
    setForm({ name: '', slug: '', icon: 'Droplet', active: true });
  };

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
          <button type="submit" className="bg-[#1A73E8] text-white rounded-lg text-sm font-medium hover:bg-[#1557B0]">Kaydet</button>
        </form>
      )}

      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F8FBFF]">
              {['Kategori', 'Slug', 'Ürün Sayısı', 'Durum', 'İşlemler'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[#8B9DAF]">Yükleniyor...</td></tr>
            ) : categories.map((cat) => {
              const Icon = icons[cat.icon] ?? Droplet;
              return (
                <tr key={cat.id} className="border-b border-[#F0F6FF] last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[#1A73E8]" />
                      <span className="text-sm font-medium text-[#0D2137]">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#5A6B7B]">{cat.id}</td>
                  <td className="px-4 py-3 text-sm text-[#0D2137]">{cat.productCount}</td>
                  <td className="px-4 py-3 text-sm text-emerald-600">Aktif</td>
                  <td className="px-4 py-3">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F6FF] text-[#8B9DAF]">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
