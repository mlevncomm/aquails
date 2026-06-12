import { useState } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { useToastStore } from '@/components/Toast';

const initial = [
  { id: '1', title: 'Yaz İndirimi %20', code: 'YAZ20', discount: '%20', type: 'percent', start: '2026-06-01', end: '2026-06-30', active: true },
  { id: '2', title: 'Filtre Seti %15', code: 'FILTRE15', discount: '%15', type: 'percent', start: '2026-06-01', end: '2026-07-15', active: true },
  { id: '3', title: 'Hoş Geldin 500₺', code: 'YENI500', discount: '500₺', type: 'fixed', start: '2026-05-01', end: '2026-06-30', active: false },
];

export default function AdminCampaignsPage() {
  const [items, setItems] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', code: '', type: 'percent' as 'percent' | 'fixed', value: '', start: '', end: '' });
  const addToast = useToastStore(s => s.add);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setItems(prev => [...prev, { id: Date.now().toString(), ...form, discount: form.type === 'percent' ? `%${form.value}` : `${form.value}₺`, active: true }]);
    addToast('Kampanya oluşturuldu.', 'success');
    setShowForm(false); setForm({ title: '', code: '', type: 'percent', value: '', start: '', end: '' });
  };
  const remove = (id: string) => { setItems(prev => prev.filter(i => i.id !== id)); addToast('Kampanya silindi.', 'success'); };
  const toggle = (id: string) => { setItems(prev => prev.map(i => i.id === id ? { ...i, active: !i.active } : i)); addToast('Durum güncellendi.', 'info'); };

  return (
      <>      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-[#0D2137]">Kampanya Yönetimi</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#1A73E8] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1557B0]"><Plus className="w-4 h-4" /> Yeni Kampanya</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#0A1929] border border-[#1A3A5C] rounded-xl p-4 mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Kampanya Adı" className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white placeholder-[#8B9DAF]" />
          <input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="Kodu" className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white placeholder-[#8B9DAF]" />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })} className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white"><option value="percent">Yüzde</option><option value="fixed">Sabit</option></select>
          <input required type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="Değer" className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white placeholder-[#8B9DAF]" />
          <input required type="date" value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white" />
          <input required type="date" value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white" />
          <div className="flex gap-2"><button type="submit" className="bg-[#1A73E8] text-white px-4 py-2 rounded-lg text-sm">Kaydet</button><button type="button" onClick={() => setShowForm(false)} className="border border-[#1A3A5C] text-[#8B9DAF] px-4 py-2 rounded-lg text-sm">İptal</button></div>
        </form>
      )}

      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#F8FBFF]">{['Kampanya', 'Kodu', 'İndirim', 'Başlangıç', 'Bitiş', 'Durum', 'İşlem'].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-[#F0F6FF] rounded-lg flex items-center justify-center"><Tag className="w-4 h-4 text-[#1A73E8]" /></div><span className="text-sm font-medium text-[#0D2137]">{c.title}</span></div></td>
                  <td className="px-4 py-3"><span className="text-xs font-bold text-[#1A73E8] bg-[#EBF3FF] px-2 py-1 rounded">{c.code}</span></td>
                  <td className="px-4 py-3 text-sm text-[#0D2137]">{c.discount}</td>
                  <td className="px-4 py-3 text-sm text-[#8B9DAF]">{c.start}</td>
                  <td className="px-4 py-3 text-sm text-[#8B9DAF]">{c.end}</td>
                  <td className="px-4 py-3"><button onClick={() => toggle(c.id)} className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>{c.active ? 'Aktif' : 'Pasif'}</button></td>
                  <td className="px-4 py-3"><div className="flex gap-1"><button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F6FF] text-[#8B9DAF] hover:text-[#1A73E8]"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => remove(c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#8B9DAF] hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
  );
}
