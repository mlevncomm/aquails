import { useState } from 'react';
import { Plus, Pencil, Trash2, Home, PanelBottom, Factory, Layers, Cog, Wrench } from 'lucide-react';
import { useToastStore } from '@/components/Toast';

const icons: Record<string, React.ElementType> = { Home, PanelBottom, Factory, Layers, Cog, Wrench };
const initial = [
  { id: '1', name: 'Ev Tipi Su Arıtma', slug: 'ev-tipi', icon: 'Home', count: 24, order: 1, active: true },
  { id: '2', name: 'Tezgah Altı Sistemler', slug: 'tezgah-alti', icon: 'PanelBottom', count: 18, order: 2, active: true },
  { id: '3', name: 'Endüstriyel Arıtma', slug: 'endustriyel', icon: 'Factory', count: 12, order: 3, active: true },
  { id: '4', name: 'Filtre Setleri', slug: 'filtre-setleri', icon: 'Layers', count: 36, order: 4, active: true },
  { id: '5', name: 'Yedek Parçalar', slug: 'yedek-parca', icon: 'Cog', count: 42, order: 5, active: true },
  { id: '6', name: 'Servis ve Bakım', slug: 'servis-bakim', icon: 'Wrench', count: 8, order: 6, active: true },
];

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', icon: 'Home', active: true });
  const addToast = useToastStore((s) => s.add);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCats((prev) => [...prev, { id: Date.now().toString(), ...form, count: 0, order: prev.length + 1 }]);
    addToast('Kategori eklendi.', 'success');
    setShowForm(false);
    setForm({ name: '', slug: '', icon: 'Home', active: true });
  };
  const remove = (id: string) => {
    setCats((prev) => prev.filter((c) => c.id !== id));
    addToast('Kategori silindi.', 'success');
  };
  const toggleActive = (id: string) => {
    setCats((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
    addToast('Durum güncellendi.', 'info');
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
                    <td className="px-4 py-3 text-sm text-[#0D2137]">{c.count}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(c.id)} className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                        {c.active ? 'Aktif' : 'Pasif'}
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
      </div>
    </>
  );
}
